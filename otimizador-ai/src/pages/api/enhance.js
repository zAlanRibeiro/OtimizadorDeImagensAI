import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // --- PASSO 1: AUTENTICAR O UTILIZADOR COM O TOKEN ---
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autorização em falta ou mal formatado.' });
    }
    const token = authHeader.split(' ')[1];

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ message: 'Acesso não autorizado. O token pode ser inválido ou ter expirado.' });
    }

    // --- PASSO 2: CRIAR UM CLIENTE "ADMIN" SEGURO PARA OPERAÇÕES NA BD ---
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    // 3. Verifica os créditos do utilizador
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("Erro ao obter o perfil (ID:", user.id, "):", profileError);
      return res.status(500).json({ message: 'Não foi possível encontrar o perfil do utilizador.' });
    }

    if (profile.credits <= 0) {
      return res.status(402).json({ message: 'Créditos insuficientes. Por favor, adquira um novo plano.' });
    }

    const { image, enhancementType } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'A imagem é obrigatória.' });
    }

    // 4. Subtrai um crédito
    const newCreditCount = profile.credits - 1;
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ credits: newCreditCount })
      .eq('id', user.id);

    if (updateError) {
      return res.status(500).json({ message: 'Ocorreu um erro ao atualizar os seus créditos.' });
    }

    // --- PASSO 5: CONFIGURAÇÃO E CHAMADA À API DA OPENAI ---

    // ** É AQUI QUE VOCÊ CONFIGURA O PROMPT **
    // Estas são as instruções que o GPT-4o irá seguir para criar o prompt final para o DALL-E 3.
    // Altere este texto para mudar o estilo do resultado.
    const GPT4O_PROMPT_INSTRUCTIONS = `
      Analise esta imagem de um produto. Crie um prompt de texto detalhado para o DALL-E 3 
      gerar uma nova foto deste mesmo produto, mas com qualidade de estúdio profissional 
      para e-commerce. Descreva a iluminação, o ângulo, o fundo limpo (branco ou cinza claro), 
      a nitidez e as cores vibrantes. O objetivo é criar uma imagem hiper-realista e 
      apelativa para vendas.
    `;

    // 5.1. O GPT-4o "vê" a imagem e cria o prompt para o DALL-E 3
    const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: GPT4O_PROMPT_INSTRUCTIONS
                    },
                    {
                        type: "image_url",
                        image_url: { url: image },
                    },
                ],
            },
        ],
        max_tokens: 300,
    });

    const dallEPrompt = visionResponse.choices[0].message.content;
    console.log("Prompt gerado pelo GPT-4o:", dallEPrompt); // Para depuração

    // 5.2. O DALL-E 3 gera a imagem final com base no prompt recebido
    const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: dallEPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
    });

    const imageUrl = imageResponse.data[0].url;

    res.status(200).json({ enhancedImage: imageUrl, remainingCredits: newCreditCount });

  } catch (error) {
    console.error("Erro na API de melhoria:", error);
    res.status(500).json({ message: "Ocorreu um erro ao gerar a imagem." });
  }
}


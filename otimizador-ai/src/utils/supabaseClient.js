import { createClient } from '@supabase/supabase-js';

// A sua URL do Supabase
const supabaseUrl = 'https://vlglgxgkwrzirshhmolj.supabase.co';

// A sua chave pública (anon key) do Supabase, carregada de uma variável de ambiente
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("A variável NEXT_PUBLIC_SUPABASE_ANON_KEY é necessária. Crie um ficheiro .env.local e adicione a sua chave anónima do Supabase.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


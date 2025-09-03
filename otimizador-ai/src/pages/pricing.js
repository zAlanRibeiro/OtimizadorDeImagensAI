import Head from 'next/head';

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Planos e Preços - Otimizador de Imagens</title>
      </Head>
      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Escolha o plano perfeito para você</h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Comece de graça e evolua conforme sua necessidade. Cancele quando quiser.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            
            {/* Plano Profissional */}
            <div className="pricing-card">
                <h3 className="text-2xl font-semibold">Profissional</h3>
                <p className="text-4xl font-bold my-4">R$ 79 <span className="text-lg font-medium text-slate-400">/mês</span></p>
                <p className="text-slate-400 h-12">Perfeito para profissionais e lojas com alto volume de imagens.</p>
                <ul className="space-y-4 my-8 text-left">
                     <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        500 moedas (imagens) por mês
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Todos os recursos do plano Básico
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Remoção de Fundo com IA
                    </li>
                </ul>
                <a href="#" className="btn-secondary w-full mt-auto">Assinar Agora</a>
            </div>

            {/* Plano Básico (Destaque) */}
            <div className="pricing-card popular">
                <div className="popular-badge">MAIS POPULAR</div>
                <h3 className="text-2xl font-semibold">Básico</h3>
                <p className="text-4xl font-bold my-4">R$ 24,90 <span className="text-lg font-medium text-slate-400">/mês</span></p>
                <p className="text-slate-400 h-12">Ideal para quem está começando e precisa de imagens de alta qualidade.</p>
                <ul className="space-y-4 my-8 text-left">
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        100 moedas (imagens) por mês
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Otimização Automática
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Super Resolução 4x
                    </li>
                </ul>
                <a href="#" className="btn-primary w-full mt-auto">Assinar Agora</a>
            </div>

            {/* Plano Empresarial */}
            <div className="pricing-card">
                <h3 className="text-2xl font-semibold">Empresarial</h3>
                <p className="text-4xl font-bold my-4">Contato</p>
                <p className="text-slate-400 h-12">Para agências e empresas com necessidades personalizadas.</p>
                <ul className="space-y-4 my-8 text-left">
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Créditos e limites personalizados
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Acesso via API
                    </li>
                    <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Suporte prioritário
                    </li>
                </ul>
                <a href="#" className="btn-secondary w-full mt-auto">Entre em Contato</a>
            </div>

        </div>
      </main>
    </>
  );
}


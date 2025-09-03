import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-white font-bold text-lg">Otimizador.AI</h3>
                        <p className="text-slate-400 mt-2">Melhore a qualidade das suas imagens e venda mais.</p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Navegação</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/" className="footer-link">Ferramenta</Link></li>
                            <li><Link href="/pricing" className="footer-link">Preços</Link></li>
                            <li><a href="#" className="footer-link">Entrar</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="footer-link">Termos de Serviço</a></li>
                            <li><a href="#" className="footer-link">Política de Privacidade</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-500">
                    <p>&copy; 2025 Otimizador.AI. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'; // Importa o componente otimizado de imagem do Next.js

export default function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-700">
      <nav className="container mx-auto px-6 py-2 flex justify-between items-center">
        {/* LOGO ATUALIZADO: Imagem redonda à esquerda do texto */}
        <Link href="/" className="flex items-center space-x-3 group">
          <Image 
            src="/logoAI.png" 
            alt="Otimizador.AI Logo" 
            width={80}  // Define a largura da imagem
            height={80} // Define a altura da imagem
            className="rounded-full transition-transform duration-300 group-hover:scale-110" // Torna a imagem redonda e adiciona um efeito de zoom
          />
          <span className="text-xl font-bold text-white">Otimizador.AI</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="nav-link">
            Ferramenta
          </Link>
          <Link href="/pricing" className="nav-link">
            Preços
          </Link>
        </div>
        <div className="flex items-center space-x-4 h-9">
          {loading ? (
            <div className="w-36 h-9 bg-slate-700 rounded-lg animate-pulse"></div>
          ) : user ? (
            <>
              <Link href="/profile" className="nav-link">
                Perfil
              </Link>
              <button onClick={signOut} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-link">
                Entrar
              </Link>
              <Link href="/register" className="btn-primary">
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}


import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importa o hook de autenticação

export default function Header() {
  // Obtém o estado do utilizador e a função de logout do contexto
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-700">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Otimizador.AI
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="nav-link">
            Ferramenta
          </Link>
          <Link href="/pricing" className="nav-link">
            Preços
          </Link>
        </div>
        <div className="flex items-center space-x-4 h-9"> {/* Altura fixa para evitar saltos de layout */}
          {loading ? (
            // Mostra um esqueleto de carregamento enquanto a sessão é verificada
            <div className="w-36 h-9 bg-slate-700 rounded-lg animate-pulse"></div>
          ) : user ? (
            // Se o utilizador estiver autenticado, mostra Perfil e Logout
            <>
              <Link href="/profile" className="nav-link">
                Perfil
              </Link>
              <button onClick={signOut} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            // Se não, mostra Entrar e Criar Conta
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


import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Se o utilizador não estiver autenticado e o carregamento estiver concluído, redireciona para o login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const crumbs = [{ label: 'Perfil' }];

  // Mostra uma mensagem de carregamento enquanto a sessão é verificada
  if (loading || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-white">A carregar...</p>
        </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meu Perfil - Otimizador.AI</title>
      </Head>
      <main className="container mx-auto px-6 py-16 flex flex-col items-center text-center">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-4xl md:text-5xl font-bold">Meu Perfil</h1>
        <div className="mt-8 w-full max-w-md bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-left">
            <p className="text-slate-300">Bem-vindo de volta!</p>
            <p className="text-white text-lg mt-2 break-words">
                <strong>Email:</strong> {user.email}
            </p>
            <p className="text-slate-400 text-sm mt-4">
                <strong>ID do Utilizador:</strong> <span className="text-xs">{user.id}</span>
            </p>
             <p className="text-slate-400 text-sm mt-2">
                <strong>Último Login:</strong> {new Date(user.last_sign_in_at).toLocaleString('pt-PT')}
            </p>
        </div>
      </main>
    </>
  );
}

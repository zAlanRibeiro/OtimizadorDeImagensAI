import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { supabase } from '@/utils/supabaseClient';

// Ícones (mantidos como antes)
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> );
const EyeOffIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.673.124 2.468.352M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.75 4.75l14.5 14.5" /></svg> );
const GoogleIcon = () => ( <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg> );

export default function RegisterPage() {
  const crumbs = [{ label: 'Criar Conta' }];
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      setMessage({ type: 'error', content: 'Os emails não coincidem.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', content: 'As palavras-passe não coincidem.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', content: '' });

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      setMessage({ type: 'success', content: 'Registro bem-sucedido! Verifique o seu email para confirmar a conta.' });
      setEmail('');
      setConfirmEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <>
      <Head>
        <title>Criar Conta - Otimizador.AI</title>
      </Head>
      <main className="container mx-auto px-6 py-16 flex flex-col items-center text-center">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-4xl md:text-5xl font-bold">Crie a sua conta</h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
          Comece a otimizar as suas imagens em segundos.
        </p>
        <div className="mt-8 w-full max-w-md">
          <form onSubmit={handleRegister} className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-left space-y-4">
            {message.content && (
              <p className={`text-center text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                {message.content}
              </p>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-slate-900/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="voce@exemplo.com" />
            </div>
            <div>
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-slate-300">Confirmar Email</label>
              <input type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required className="mt-1 block w-full bg-slate-900/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Repita o seu email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Palavra-passe</label>
              <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full bg-slate-900/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" placeholder="Pelo menos 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white" aria-label="Mostrar ou esconder a palavra-passe">
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirmar Palavra-passe</label>
              <div className="relative mt-1">
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full bg-slate-900/50 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" placeholder="Repita a sua palavra-passe" />
              </div>
            </div>
            <button type="submit" className="w-full btn-primary py-3 !mt-6" disabled={loading}>{loading ? 'A registrar...' : 'Criar Conta'}</button>
            <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-slate-600"></div><span className="flex-shrink mx-4 text-slate-400 text-sm">OU</span><div className="flex-grow border-t border-slate-600"></div></div>
            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center bg-white text-slate-800 font-medium py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-300"><GoogleIcon />Continuar com o Google</button>
          </form>
           <p className="mt-6 text-slate-400">Já tem uma conta?{' '}<Link href="/login" className="font-medium text-blue-400 hover:underline">Faça login</Link></p>
        </div>
      </main>
    </>
  );
}


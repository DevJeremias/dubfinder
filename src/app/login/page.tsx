'use client';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      toast.error('Erro ao fazer login: ' + error.message);
    } else {
      toast.success('Redirecionando...');
      setTimeout(() => router.push('/profile'), 1500);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        onClick={handleLogin}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Entrar com Google
      </button>
    </div>
  );
}

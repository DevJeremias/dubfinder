'use client';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github', // ou 'google'
    });
    if (error) console.error(error);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <button
        onClick={handleLogin}
        className="bg-gray-800 text-white p-2 rounded mt-4"
      >
        Entrar com GitHub
      </button>
    </div>
  );
}
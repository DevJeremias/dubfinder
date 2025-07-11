'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      setUserData(user);

      const { data: favs } = await supabase
        .from('fav_voice_actors')
        .select('*')
        .eq('user_id', user.id);

      setFavorites(favs || []);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="p-4">
      {userData && (
        <div className="flex items-center mb-4">
          <img
            src={userData.user_metadata?.avatar_url}
            alt="Avatar"
            className="w-12 h-12 rounded-full mr-2"
          />
          <h1 className="text-xl font-bold">{userData.user_metadata?.name || 'Usuário'}</h1>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mb-4"
      >
        Sair
      </button>

      <h2 className="text-2xl font-bold mb-2">Meus Dubladores Favoritos</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500">Nenhum dublador favoritado ainda.</p>
      ) : (
        favorites.map((fav) => (
          <div key={fav.va_id} className="border p-4 mb-2 rounded">
            <h3 className="text-xl">{fav.va_name}</h3>
          </div>
        ))
      )}
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('fav_voice_actors')
        .select('*')
        .eq('user_id', user.id);

      setFavorites(data || []);
    };
    fetchFavorites();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Meus Dubladores Favoritos</h1>
      {favorites.map((fav) => (
        <div key={fav.va_id} className="border p-4 mb-2 rounded">
          <h2 className="text-xl">{fav.va_name}</h2>
        </div>
      ))}
    </div>
  );
}
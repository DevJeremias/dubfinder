'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  // Busca dubladores
  const searchVoiceActor = async () => {
    const res = await fetch(`https://api.jikan.moe/v4/people?q=${query}`);
    const data = await res.json();
    setResults(data.data || []);
  };

  // Salva dublador favorito
  const saveFavorite = async (vaId: number, vaName: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('Faça login para favoritar!');
      return;
    }

    const { error } = await supabase
      .from('fav_voice_actors')
      .upsert({ user_id: user.id, va_id: vaId, va_name: vaName });

    if (error) {
      alert('Erro ao favoritar dublador.');
    } else {
      alert('Dublador favoritado!');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">DubFinder</h1>
        <a href="/login" className="text-blue-500">Login</a>
      </div>

      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome do dublador..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={searchVoiceActor}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Buscar
        </button>
      </div>

      <div className="mt-4">
        {results.map((va) => (
          <div key={va.mal_id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl font-bold">{va.name}</h2>
            <img
              src={va.images.jpg.image_url}
              alt={va.name}
              className="w-20 h-20 rounded-full mt-2"
            />
            <button
              onClick={() => saveFavorite(va.mal_id, va.name)}
              className="bg-pink-500 text-white p-2 rounded mt-2"
            >
              Favoritar ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

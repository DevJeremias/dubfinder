'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'voice_actor' | 'character'>('voice_actor');
  const [isLoading, setIsLoading] = useState(false);

  // Função de busca com loading
  const searchData = async () => {
    setIsLoading(true);
    const endpoint =
      searchType === 'voice_actor'
        ? `https://api.jikan.moe/v4/people?q=${query}`
        : `https://api.jikan.moe/v4/characters?q=${query}`;

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setResults(data.data || []);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
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

      <div className="flex mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="voice_actor">Dubladores</option>
          <option value="character">Personagens</option>
        </select>
      </div>

      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            searchType === 'voice_actor'
              ? 'Digite o nome do dublador...'
              : 'Digite o nome do personagem...'
          }
          className="border p-2 rounded w-full"
        />
        <button
          onClick={searchData}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Buscar
        </button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded" />
            ))}
          </div>
        ) : (
          results.map((item) => (
            <div key={item.mal_id} className="border p-4 mb-2 rounded">
              <h2 className="text-xl font-bold">
                {item.name}
              </h2>
              <img
                src={
                  searchType === 'voice_actor'
                    ? item.images?.jpg?.image_url
                    : item.images?.jpg?.image_url
                }
                alt={item.name}
                className="w-20 h-20 rounded-full mt-2"
              />

              {searchType === 'voice_actor' && (
                <button
                  onClick={() => saveFavorite(item.mal_id, item.name)}
                  className="bg-pink-500 text-white p-2 rounded mt-2"
                >
                  Favoritar ★
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { UnoCard } from './UnoCard';
import { Sparkles, ArrowRight, PlusCircle, LogIn, Dices } from 'lucide-react';
import { getAvatarUrl, getRandomAvatar } from '../utils/avatar';

export const Lobby = ({
  initialName,
  initialRoomCode,
  onCreateRoom,
  onJoinRoom
}) => {
  const [name, setName] = useState(initialName || '');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('poker_avatar_seed') || getRandomAvatar();
  });
  const [isSpectator, setIsSpectator] = useState(false);
  const [error, setError] = useState('');

  const handleRandomizeAvatar = () => {
    const newSeed = getRandomAvatar();
    setAvatarSeed(newSeed);
    localStorage.setItem('poker_avatar_seed', newSeed);
  };

  // Función para extraer el código limpio si el usuario pega una URL completa
  const cleanRoomCode = (input) => {
    if (!input) return '';
    const trimmed = input.trim();
    // Si contiene ?room= o /?room=
    const match = trimmed.match(/[?&]room=([a-zA-Z0-9]+)/i);
    if (match) return match[1].toUpperCase();
    // Si es una URL o path con el código al final
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      const last = parts[parts.length - 1];
      if (last && !last.includes('?')) return last.toUpperCase();
    }
    return trimmed.toUpperCase();
  };

  const handleRoomCodeChange = (e) => {
    setRoomCode(cleanRoomCode(e.target.value));
  };

  // Sincronizar código de sala si se provee o cambia en la URL
  React.useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(cleanRoomCode(initialRoomCode));
    }
  }, [initialRoomCode]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    setError('');
    onCreateRoom(name.trim(), isSpectator, avatarSeed);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    const parsedCode = cleanRoomCode(roomCode);
    if (!parsedCode) {
      setError('Por favor ingresa el código de la sala');
      return;
    }
    setError('');
    onJoinRoom(parsedCode, name.trim(), isSpectator, avatarSeed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Fondo decorativo con luces sutiles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 right-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Logo */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="transform -rotate-12 hover:rotate-0 transition-transform">
            <UnoCard value="7" color="red" size="sm" />
          </div>
          <div className="transform rotate-12 hover:rotate-0 transition-transform -ml-8">
            <UnoCard isBack size="sm" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span className="text-red-500">U</span>
          <span className="text-blue-500">N</span>
          <span className="text-emerald-500">O</span>
          <span className="text-slate-400 font-light">-</span>
          <span className="text-amber-400 font-extrabold italic">PLANNING</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-md mx-auto">
          Estimaciones ágiles, elegantes y minimalistas inspiradas en la magia y dinamismo de las cartas UNO.
        </p>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Campo de Avatar y Nombre (Recordado en localStorage) */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-red-500 to-blue-500 p-0.5 shadow-lg">
              <img
                src={getAvatarUrl(avatarSeed)}
                alt="Avatar"
                className="w-full h-full rounded-[14px] bg-slate-900 object-cover"
                loading="lazy"
              />
            </div>
            <button
              type="button"
              onClick={handleRandomizeAvatar}
              title="Generar nuevo estilo aleatorio (aventurero, robot, avatar)"
              className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 p-2 rounded-full shadow-xl border-2 border-slate-900 transition-all transform active:rotate-[360deg] duration-300 cursor-pointer hover:scale-115 group-hover:ring-2 group-hover:ring-amber-400/50"
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tu Nombre
              </label>
              <button
                type="button"
                onClick={handleRandomizeAvatar}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-full"
              >
                <Dices className="w-3 h-3" />
                <span>Cambiar estilo</span>
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. José Arrieta"
              maxLength={30}
              className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Toggle Espectador */}
        <div className="mb-6 flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl">
          <div>
            <div className="text-sm font-semibold text-slate-200">Modo Espectador</div>
            <div className="text-xs text-slate-400">Observa sin votar ni afectar promedios</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSpectator}
              onChange={(e) => setIsSpectator(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Acciones: Crear o Unirse */}
        <div className="space-y-4">
          <button
            onClick={handleCreate}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Crear Nueva Sala</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs uppercase tracking-widest text-slate-500 absolute">
              o unirse
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={roomCode}
              onChange={handleRoomCodeChange}
              placeholder="CÓDIGO (Ej. X7K2P)"
              className="flex-1 px-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 font-mono tracking-wider text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            <button
              onClick={handleJoin}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Unirse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer minimalista */}
      <div className="mt-8 text-center text-xs text-slate-500">
        Estado 100% efímero en memoria • Cero bases de datos • Inspirado en UNO
      </div>
    </div>
  );
};

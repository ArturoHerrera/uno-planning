import React, { useState } from 'react';
import { UnoCard } from './UnoCard';
import { ArrowRight, PlusCircle, Dices, X, Sun, Moon } from 'lucide-react';
import { getAvatarUrl, getRandomAvatar } from '../utils/avatar';

export const Lobby = ({
  initialName,
  initialRoomCode,
  onCreateRoom,
  onJoinRoom,
  theme = 'dark',
  onToggleTheme
}) => {
  const [name, setName] = useState(initialName || '');
  const [roomCode, setRoomCode] = useState(initialRoomCode || '');
  const [avatarSeed, setAvatarSeed] = useState(() => {
    return localStorage.getItem('poker_avatar_seed') || getRandomAvatar();
  });
  const [isSpectator, setIsSpectator] = useState(false);
  const [enableHostTutorial, setEnableHostTutorial] = useState(() => {
    const completed = localStorage.getItem('poker_host_tutorial_completed');
    const pref = localStorage.getItem('poker_host_tutorial_enabled');
    if (pref !== null) return pref === 'true';
    return completed !== 'true';
  });
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const handleToggleTutorial = (checked) => {
    setEnableHostTutorial(checked);
    localStorage.setItem('poker_host_tutorial_enabled', checked ? 'true' : 'false');
    if (checked) {
      localStorage.removeItem('poker_host_tutorial_completed');
    }
  };

  const handleRandomizeAvatar = () => {
    const newSeed = getRandomAvatar();
    setAvatarSeed(newSeed);
    localStorage.setItem('poker_avatar_seed', newSeed);
  };

  // Función para extraer el código limpio si el usuario pega una URL completa
  const cleanRoomCode = (input) => {
    if (!input) return '';
    const trimmed = input.trim();
    const match = trimmed.match(/[?&]room=([a-zA-Z0-9]+)/i);
    if (match) return match[1].toUpperCase();
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Botón flotante de cambio de tema en esquina superior derecha */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all cursor-pointer shadow-md ${
            isDark
              ? 'bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700/60'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      )}

      {/* Fondo decorativo con luces sutiles */}
      <div className={`absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-red-600/10' : 'bg-red-400/20'
      }`} />
      <div className={`absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-400/20'
      }`} />
      <div className={`absolute -top-20 right-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDark ? 'bg-emerald-600/10' : 'bg-emerald-400/20'
      }`} />

      {/* Header / Logo */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="transform -rotate-12 hover:rotate-0 transition-transform duration-200 cursor-pointer">
            <UnoCard value="7" color="red" size="sm" />
          </div>
          <div className="transform rotate-12 hover:rotate-0 transition-transform duration-200 cursor-pointer -ml-8">
            <UnoCard isBack size="sm" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-2">
          <span className="text-red-500">U</span>
          <span className="text-blue-500">N</span>
          <span className="text-emerald-500">O</span>
          <span className={isDark ? 'text-slate-400 font-light' : 'text-slate-400 font-light'}>-</span>
          <span className="text-amber-400 font-extrabold italic">PLANNING</span>
        </h1>
        <p className={`text-sm sm:text-base mt-3 max-w-md mx-auto transition-colors ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Estimaciones ágiles, elegantes y minimalistas inspiradas en la magia y dinamismo de las cartas UNO.
        </p>
      </div>

      {/* Card principal */}
      <div className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 transition-colors border ${
        isDark
          ? 'bg-slate-900/90 border-slate-800'
          : 'bg-white/95 border-slate-200 shadow-slate-200/50'
      }`}>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* 1. Campo de Avatar y Nombre (Recordado en localStorage) */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-red-500 to-blue-500 p-0.5 shadow-lg">
              <img
                src={getAvatarUrl(avatarSeed)}
                alt="Avatar"
                className={`w-full h-full rounded-[14px] object-cover ${
                  isDark ? 'bg-slate-900' : 'bg-slate-100'
                }`}
                loading="lazy"
              />
            </div>
            <button
              type="button"
              onClick={handleRandomizeAvatar}
              title="Generar nuevo avatar aleatorio"
              aria-label="Generar nuevo avatar aleatorio"
              className={`absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 p-2 rounded-full shadow-xl transition-all transform active:rotate-[360deg] duration-300 cursor-pointer hover:scale-110 ${
                isDark ? 'border-2 border-slate-900' : 'border-2 border-white'
              }`}
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Tu Nombre
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) {
                    localStorage.setItem('poker_username', e.target.value);
                  }
                }}
                placeholder="Ej. José Arrieta"
                maxLength={30}
                className={`w-full pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all font-medium text-sm border ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-700/80 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              {name && (
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    localStorage.removeItem('poker_username');
                  }}
                  title="Borrar nombre guardado"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                    isDark
                      ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700/50'
                      : 'text-slate-400 hover:text-red-500 hover:bg-slate-200/50'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {name && (
              <div className={`text-[10px] mt-1 flex items-center justify-between px-1 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <span>Recordado en este navegador</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Toggle Espectador */}
        <div className={`mb-6 flex items-center justify-between p-3.5 border rounded-2xl transition-colors ${
          isDark
            ? 'bg-slate-800/40 border-slate-800'
            : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div>
            <div className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Modo Espectador
            </div>
            <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Observa sin votar ni afectar promedios
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSpectator}
              onChange={(e) => setIsSpectator(e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 ${
              isDark ? 'bg-slate-700' : 'bg-slate-300'
            }`}></div>
          </label>
        </div>

        {/* 3. Sección Crear Nueva Sala con Tutorial Anclado (Opción A) */}
        <div className="space-y-2 mb-6">
          <button
            onClick={handleCreate}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 hover:opacity-95 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Crear Nueva Sala</span>
          </button>

          {/* Toggle Tutorial de Anfitrión contextualizado */}
          <div className={`flex items-center justify-between px-3 py-2 border rounded-xl transition-colors ${
            isDark
              ? 'bg-slate-800/20 border-slate-800/60'
              : 'bg-slate-50/50 border-slate-200/80'
          }`}>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Tutorial Scrum Master
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                Guía
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableHostTutorial}
                onChange={(e) => handleToggleTutorial(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-8 h-4.5 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 ${
                isDark ? 'bg-slate-700 after:border-slate-400' : 'bg-slate-300 after:border-slate-300'
              }`}></div>
            </label>
          </div>
        </div>

        {/* Separador "o unirse" */}
        <div className="relative flex items-center justify-center my-5">
          <div className={`border-t w-full ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />
          <span className={`px-3 text-xs uppercase tracking-widest absolute transition-colors ${
            isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'
          }`}>
            o unirse
          </span>
        </div>

        {/* 4. Sección Unirse con código */}
        <div className="flex gap-2">
          <input
            type="text"
            value={roomCode}
            onChange={handleRoomCodeChange}
            placeholder="CÓDIGO (Ej. X7K2P)"
            className={`flex-1 px-4 py-3 rounded-xl font-mono tracking-wider text-center uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm border ${
              isDark
                ? 'bg-slate-800/90 border-slate-700/80 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
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

      {/* Footer minimalista */}
      <div className={`mt-8 text-center text-xs transition-colors ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}>
        Estado 100% efímero en memoria • Cero bases de datos • Inspirado en UNO
      </div>
    </div>
  );
};

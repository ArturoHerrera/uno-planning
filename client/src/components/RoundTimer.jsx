import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock } from 'lucide-react';
import { playSoftTick, playZenChime, isSoundMuted, setSoundMuted } from '../utils/sound';

export const RoundTimer = ({
  timer,
  isHost,
  theme,
  onStartTimer,
  onPauseTimer,
  onResetTimer
}) => {
  const isDark = theme === 'dark';
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedDuration, setSelectedDuration] = useState(timer?.duration || 60);
  const chimePlayedRef = useRef(false);
  const lastTickSecondRef = useRef(null);

  // Sincronizar duración seleccionada si el timer cambia en el servidor
  useEffect(() => {
    if (timer?.duration) {
      setSelectedDuration(timer.duration);
    }
  }, [timer?.duration]);

  // Cálculo del tiempo restante y disparo de efectos sonoros
  useEffect(() => {
    if (!timer) return;

    if (!timer.isRunning) {
      const remaining = timer.remainingSeconds !== undefined ? timer.remainingSeconds : (timer.duration || 60);
      setTimeLeft(remaining);
      chimePlayedRef.current = remaining === 0;
      return;
    }

    const interval = setInterval(() => {
      if (!timer.endsAt) return;
      const now = Date.now();
      const diffMs = timer.endsAt - now;
      const remaining = Math.max(0, Math.ceil(diffMs / 1000));

      setTimeLeft(remaining);

      // Sonido de tic continuo cada segundo con rampa de volumen en el último 25%
      if (remaining > 0 && remaining !== lastTickSecondRef.current) {
        lastTickSecondRef.current = remaining;

        const total = timer.duration || selectedDuration || 60;
        const ratio = remaining / total;

        // Si está en el 25% final, escalar intensidad de 0.25 a 1.0; en el 75% inicial se mantiene en 0.25 sutil
        let intensity = 0.25;
        if (ratio <= 0.25) {
          // ratio va de 0.25 -> 0, por lo que progressInFinal va de 0.0 -> 1.0
          const progressInFinal = 1 - (ratio / 0.25);
          intensity = 0.25 + (0.75 * progressInFinal);
        }

        playSoftTick(intensity);
      }

      // Chime relajante zen al llegar a cero
      if (remaining === 0 && !chimePlayedRef.current) {
        chimePlayedRef.current = true;
        playZenChime();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [timer, selectedDuration]);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  const handleDurationSelect = (dur) => {
    setSelectedDuration(dur);
    onResetTimer(dur);
  };

  // Porcentaje restante para la barra de progreso
  const totalDuration = timer?.duration || selectedDuration || 60;
  const progressPercent = Math.min(100, Math.max(0, (timeLeft / totalDuration) * 100));

  // Formato mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Color de la barra y badges según el tiempo restante
  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isFinished = timeLeft === 0;

  return (
    <div className={`flex flex-col sm:flex-row items-center gap-2.5 px-3 py-1.5 rounded-2xl backdrop-blur-md transition-all shadow-sm ${
      isDark ? 'bg-slate-900/80 border border-slate-800' : 'bg-white/90 border border-slate-200'
    }`}>
      {/* 1. Indicador de Tiempo y Barra */}
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isFinished ? 'text-red-500 animate-pulse' : isUrgent ? 'text-amber-400' : 'text-slate-400'}`} />
        
        <span className={`font-mono font-bold text-sm tracking-wider ${
          isFinished ? 'text-red-500 font-extrabold' : isUrgent ? 'text-amber-400' : isDark ? 'text-slate-200' : 'text-slate-800'
        }`}>
          {formatTime(timeLeft)}
        </span>

        {/* Mini barra de progreso estilo UNO */}
        <div className={`w-16 sm:w-20 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'} relative`}>
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isFinished
                ? 'bg-red-500'
                : isUrgent
                ? 'bg-amber-400'
                : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Controles exclusivos del Anfitrión */}
      {isHost && (
        <div className="flex items-center gap-1.5 pl-1 sm:border-l sm:border-slate-700/40">
          {/* Selector de duraciones: 20s, 40s, 60s, 80s */}
          <div className="flex items-center gap-1">
            {[20, 40, 60, 80].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => handleDurationSelect(dur)}
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {dur}s
              </button>
            ))}
          </div>

          {/* Botón Play / Pausa */}
          {timer?.isRunning ? (
            <button
              type="button"
              onClick={onPauseTimer}
              title="Pausar temporizador"
              className="p-1 rounded-lg bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onStartTimer(selectedDuration)}
              title="Iniciar temporizador"
              className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Botón Reset */}
          <button
            type="button"
            onClick={() => onResetTimer(selectedDuration)}
            title="Reiniciar temporizador"
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Botón de Mute de audio (Para cualquier participante) */}
      <button
        type="button"
        onClick={handleToggleMute}
        title={muted ? 'Activar sonido del timer' : 'Silenciar sonido del timer'}
        className={`p-1 rounded-lg transition-colors cursor-pointer ml-auto sm:ml-0 ${
          muted ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

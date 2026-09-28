import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Users, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { FIBONACCI_VALUES } from '../utils/deck';
import { getAvatarUrl } from '../utils/avatar';

export const ResultsModal = ({
  isOpen,
  roomState,
  isHost,
  onSaveScore,
  onResetRound
}) => {
  if (!isOpen || !roomState?.revealed) return null;

  const metrics = roomState?.metrics;
  const currentTask = roomState?.tasks?.[roomState?.currentTaskIndex];
  const taskTitle = typeof currentTask === 'object' ? currentTask.title : currentTask;

  // Por defecto sugerir la moda o el promedio redondeado con fallback seguro
  const getSuggestion = () => {
    if (metrics && metrics.mode != null) return metrics.mode;
    if (metrics && metrics.average != null) return Math.round(metrics.average);
    return 5;
  };

  const [selectedScore, setSelectedScore] = useState(getSuggestion);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedScore(getSuggestion());
    }
  }, [isOpen, metrics]);

  const handleSaveAndAdvance = () => {
    onSaveScore(selectedScore, true);
  };

  const handleSaveOnly = () => {
    onSaveScore(selectedScore, false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Título y Tarea */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold mb-3">
            <span>Resultados de la Votación</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white truncate px-2">
            {taskTitle || 'Tarea en Revisión'}
          </h3>
        </div>

        {/* Banner informativo si no hubo votos numéricos */}
        {(!metrics || metrics.voteCount === 0) && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs text-center font-medium flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>No se registraron votos numéricos en esta ronda. Puedes reiniciar la votación o fijar una estimación manual.</span>
          </div>
        )}

        {/* Panel de Estadísticas / Consenso */}
        <div className="grid grid-cols-3 gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-6 text-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Promedio
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {metrics?.average ?? '-'}
            </div>
          </div>

          <div className="border-x border-white/[0.08]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1">
              <span>Mayoría</span>
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics?.mode ?? '-'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Acuerdo
            </div>
            {metrics?.isConsensus ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold animate-pulse">
                <Award className="w-3 h-3" />
                <span>¡Consenso!</span>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-400 pt-1">
                {metrics?.voteCount || 0} votos
              </div>
            )}
          </div>
        </div>

        {/* Desglose de votos de participantes */}
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Votos emitidos:
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
            {roomState?.participants?.filter(p => !p.isSpectator).map(p => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.05] rounded-xl text-xs font-medium"
              >
                <div className="w-4 h-4 rounded-full overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                  <img
                    src={getAvatarUrl(p.avatarSeed, p.name)}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-slate-300">{p.name}:</span>
                <span className="font-bold text-amber-400 font-mono">{p.vote ?? 'Sin voto'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones para el Anfitrión vs Participante */}
        {isHost ? (
          <div className="border-t border-white/[0.08] pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Puntuación final acordada:
              </span>
              <span className="text-xs text-slate-400">Selecciona el valor acordado</span>
            </div>

            {/* Selector de Cartas Fibonacci */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap mb-5">
              {FIBONACCI_VALUES.map(val => (
                <button
                  key={val}
                  onClick={() => setSelectedScore(val)}
                  className={`w-10 h-10 rounded-xl font-bold font-mono text-sm transition-all cursor-pointer ${
                    selectedScore === val
                      ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg ring-2 ring-white'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onResetRound}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Votar de nuevo esta tarea</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveAndAdvance}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar y Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-white/[0.08] pt-4 text-center text-xs text-slate-400 italic">
            Esperando a que el anfitrión guarde el puntaje o inicie la siguiente ronda...
          </div>
        )}
      </div>
    </div>
  );
};

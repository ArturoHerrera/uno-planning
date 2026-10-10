import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Users, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { FIBONACCI_VALUES } from '../utils/deck';
import { getAvatarUrl } from '../utils/avatar';
import { playUnoSuccessFanfare } from '../utils/sound';

export const ResultsModal = ({
  isOpen,
  roomState,
  isHost,
  onSaveScore,
  onResetRound
}) => {
  const metrics = roomState?.metrics;
  const currentTask = roomState?.tasks?.[roomState?.currentTaskIndex];
  const taskTitle = typeof currentTask === 'object' ? currentTask.title : currentTask;

  // Por defecto sugerir la moda o el promedio redondeado con fallback seguro
  const getSuggestion = React.useCallback(() => {
    if (metrics && metrics.mode != null) return metrics.mode;
    if (metrics && metrics.average != null) return Math.round(metrics.average);
    return 5;
  }, [metrics]);

  const [selectedScore, setSelectedScore] = useState(getSuggestion);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedScore(getSuggestion());
      if (metrics?.isConsensus && metrics?.voteCount > 0) {
        playUnoSuccessFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [isOpen, getSuggestion, metrics?.isConsensus, metrics?.voteCount]);

  if (!isOpen || !roomState?.revealed) return null;

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
            <span>Mesa indecisa: Nadie arriesgó una carta. Puedes reiniciar la votación o fijar una estimación manual.</span>
          </div>
        )}

        {/* Celebración de Consenso ¡UNO! */}
        {metrics?.isConsensus && metrics?.voteCount > 0 && (
          <div className="mb-5 p-3.5 bg-gradient-to-r from-red-600/20 via-amber-500/20 to-emerald-600/20 border border-amber-500/50 rounded-2xl text-center flex items-center justify-center gap-2 shadow-lg animate-pulse">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-black text-amber-300 uppercase tracking-wider">
              ¡UNO! Consenso Total ({metrics.mode} pts)
            </span>
            <span className="text-xl">🏆</span>
          </div>
        )}

        {/* Panel de Estadísticas / Consenso */}
        <div className="grid grid-cols-3 gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 mb-5 text-center">
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
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold">
                <Award className="w-3 h-3" />
                <span>¡UNO!</span>
              </div>
            ) : (
              <div className="text-xs font-semibold text-slate-400 pt-1">
                {metrics?.voteCount || 0} votos
              </div>
            )}
          </div>
        </div>

        {/* Sección de Discrepancias / Outliers para debate ágil */}
        {!metrics?.isConsensus && metrics?.minScore && metrics?.maxScore && metrics.minScore.value !== metrics.maxScore.value && (
          <div className="mb-5 p-3.5 bg-white/[0.03] border border-amber-500/30 rounded-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between">
              <span>Debate Scrum • Discrepancias</span>
              <span className="text-[10px] text-slate-400 font-normal">Contraste de estimación</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Más bajo */}
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Puntaje más bajo</span>
                  <span className="font-mono font-black text-sm">{metrics.minScore.value} pts</span>
                </div>
                <div className="text-slate-300 truncate text-[11px]">
                  {metrics.minScore.voters.join(', ')}
                </div>
              </div>

              {/* Más alto */}
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Puntaje más alto</span>
                  <span className="font-mono font-black text-sm">{metrics.maxScore.value} pts</span>
                </div>
                <div className="text-slate-300 truncate text-[11px]">
                  {metrics.maxScore.voters.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

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
                <span>Barajar de nuevo esta historia</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveAndAdvance}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar y Siguiente Mano</span>
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

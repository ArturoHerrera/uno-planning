import React from 'react';
import { HelpCircle, Play, RotateCcw } from 'lucide-react';

/**
 * Modal prioritario no cancelable que se activa cuando un participante juega la carta '?'
 * Permite pausar y dialogar para resolver dudas sobre la historia técnica.
 */
export const QuestionModal = ({
  activeQuestion,
  isHost,
  onResolveQuestion
}) => {
  if (!activeQuestion) return null;

  const { userName, pausedRemaining } = activeQuestion;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900/95 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-slate-100 relative">
        {/* Icono de Alerta de Duda */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Badge de Tiempo Fuera */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider text-amber-400 mb-2">
          <span>Tiempo Fuera • Pausa de Estimación</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mt-2 mb-2">
          ¡Duda sobre la historia!
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          <strong className="text-amber-400 font-bold">{userName || 'Un participante'}</strong> ha jugado la carta <span className="font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-amber-300">?</span> porque tiene preguntas para aclarar el requerimiento.
        </p>

        <div className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-slate-400 mb-6 flex items-center justify-center gap-2">
          <span>El temporizador se encuentra pausado en {pausedRemaining ?? '--'}s</span>
        </div>

        {/* Acciones: Exclusivas del host o colaborativas */}
        {isHost ? (
          <div className="space-y-3">
            <button
              onClick={() => onResolveQuestion && onResolveQuestion('continue')}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Duda resuelta (Continuar tiempo)</span>
            </button>

            <button
              onClick={() => onResolveQuestion && onResolveQuestion('reset')}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reiniciar tiempo</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            Aclarando dudas con el equipo. Esperando a que el anfitrión reanude o reinicie la ronda...
          </div>
        )}
      </div>
    </div>
  );
};

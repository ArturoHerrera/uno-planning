import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Flame, Users } from 'lucide-react';

export const ResultsSummary = ({ metrics }) => {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (metrics?.isConsensus && !confettiFired.current) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ED1C24', '#0054A6', '#54B948', '#FFDE00']
      });
      confettiFired.current = true;
    }
  }, [metrics]);

  if (!metrics || metrics.voteCount === 0) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-wrap items-center justify-around gap-4 max-w-xl mx-auto my-3 animate-fade-in">
      {/* Promedio */}
      <div className="text-center px-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Promedio
        </div>
        <div className="text-3xl font-black text-amber-400 font-mono">
          {metrics.average}
        </div>
      </div>

      <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

      {/* Mayoría / Moda */}
      <div className="text-center px-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Moda (Mayoría)
        </div>
        <div className="text-3xl font-black text-white font-mono flex items-center justify-center gap-1.5">
          <span>{metrics.mode}</span>
          <Flame className="w-5 h-5 text-red-500 fill-red-500" />
        </div>
      </div>

      <div className="h-10 w-[1px] bg-slate-800 hidden sm:block" />

      {/* Estado de Consenso */}
      <div className="text-center px-4">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
          Acuerdo
        </div>
        {metrics.isConsensus ? (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-bold animate-pulse">
            <Award className="w-3.5 h-3.5" />
            <span>¡Consenso Total!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{metrics.voteCount} votos</span>
          </div>
        )}
      </div>
    </div>
  );
};

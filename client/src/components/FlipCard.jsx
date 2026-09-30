import React from 'react';
import { UnoCard } from './UnoCard';
import { getAvatarUrl } from '../utils/avatar';

/**
 * Tarjeta de la mesa con efecto 3D flip al revelar, avatar y reacciones flotantes
 * @param {boolean} isRevealed - Si la mesa está revelada
 * @param {string|number} value - Valor del voto
 * @param {string} color - Color UNO asignado
 * @param {string} participantName - Nombre del participante
 * @param {string} avatarSeed - Semilla para generar avatar DiceBear
 * @param {boolean} isHost - Si es el anfitrión
 * @param {boolean} isSpectator - Si es espectador
 * @param {boolean} hasVoted - Si ya emitió su voto
 * @param {boolean} canReact - Si el usuario actual puede arrojarle emojis
 * @param {function} onThrowReaction - Callback al seleccionar un emoji
 * @param {object} activeReaction - Reacción activa temporal { emoji, id }
 */
export const FlipCard = ({
  participantId,
  isRevealed,
  value,
  color = 'blue',
  participantName,
  avatarSeed,
  isHost,
  isSpectator,
  hasVoted,
  canReact = false,
  onThrowReaction,
  activeReaction = null
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const allowedEmojis = ['☕', '🍅', '🔥', '🔪', '🧱', '💩', '💀', '👾', '⏰'];

  return (
    <div
      className={`relative group flex flex-col items-center gap-2 select-none transition-all ${
        isHovered ? 'z-50' : 'z-10'
      }`}
      onMouseEnter={() => canReact && setIsHovered(true)}
      onMouseLeave={() => canReact && setIsHovered(false)}
    >
      {/* Barra emergente de reacciones (en hover o clic, para otros participantes) */}
      {canReact && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-200 z-50 pointer-events-auto ${
            isHovered
              ? 'opacity-100 -top-12'
              : 'opacity-0 -top-11 pointer-events-none'
          } group-hover:opacity-100 group-hover:-top-12 group-hover:pointer-events-auto`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-0.5 bg-slate-900/95 backdrop-blur-xl px-2 py-1.5 rounded-full border border-slate-700/80 shadow-2xl">
            {allowedEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onThrowReaction && onThrowReaction(emoji);
                }}
                className="w-7 h-7 flex items-center justify-center hover:scale-130 active:scale-75 transition-transform text-sm cursor-pointer rounded-full hover:bg-white/10"
                title={`Aventar ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {/* Pequeña flecha decorativa */}
          <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/80" />
          {/* Puente invisible para evitar perder el hover al mover el cursor */}
          <div className="absolute -bottom-3 left-0 right-0 h-4" />
        </div>
      )}

      {/* Indicador de avatar, nombre y rol */}
      <div
        onClick={() => canReact && setIsHovered((prev) => !prev)}
        className={`flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-slate-800/85 backdrop-blur-md rounded-full border border-slate-700/70 shadow text-xs font-semibold text-slate-200 z-10 max-w-[140px] ${
          canReact ? 'cursor-pointer hover:border-amber-400/60 transition-colors' : ''
        }`}
        title={canReact ? 'Haz clic o pasa el mouse para aventar emojis' : undefined}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
          <img
            src={getAvatarUrl(avatarSeed, participantName)}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <span className="truncate">{participantName}</span>
        {isHost && (
          <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 shadow-sm shrink-0">
            <span>👑</span>
          </span>
        )}
      </div>

      {/* Contenedor de la carta con perspectiva 3D y efecto wobble al recibir reacción */}
      <div
        id={participantId ? `participant-card-${participantId}` : undefined}
        className={`relative perspective-1000 w-[84px] h-[126px] ${activeReaction ? 'wobble-card' : ''}`}
      >
        {/* Capa de impacto del emoji */}
        {activeReaction && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <span className="text-5xl animate-reaction-splat drop-shadow-2xl">
              {activeReaction.emoji}
            </span>
          </div>
        )}

        {isSpectator ? (
          // Vista espectador
          <div className="w-[84px] h-[126px] rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center text-slate-400 p-2 text-center shadow-inner">
            <span className="text-xl mb-1">👀</span>
            <span className="text-[11px] font-medium leading-tight">Espectador</span>
          </div>
        ) : (
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isRevealed && hasVoted ? 'rotate-y-180' : ''
            }`}
          >
            {/* Dorso (Boca abajo mientras no se revela o mientras votan) */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center">
              {hasVoted ? (
                <div className="relative">
                  <UnoCard isBack size="sm" />
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-slate-900">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-[84px] h-[126px] rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-900/60 flex flex-col items-center justify-center text-slate-500 gap-1.5 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60 animate-ping" />
                  <span className="text-[11px] font-medium text-slate-400">Pensando...</span>
                </div>
              )}
            </div>

            {/* Anverso (Revelado) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center">
              {hasVoted ? (
                <UnoCard value={value} color={color} size="sm" />
              ) : (
                <div className="w-[84px] h-[126px] rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                  Sin voto
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

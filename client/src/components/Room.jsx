import React, { useState, useEffect } from 'react';
import { UnoCard } from './UnoCard';
import { FlipCard } from './FlipCard';
import { TaskModal } from './TaskModal';
import { ResultsModal } from './ResultsModal';
import { ProjectilesOverlay } from './ProjectilesOverlay';
import { RoundTimer } from './RoundTimer';
import { generateRandomDeck } from '../utils/deck';
import { getAvatarUrl } from '../utils/avatar';
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  LogOut,
  Users,
  CheckCircle2,
  ListOrdered,
  Sun,
  Moon
} from 'lucide-react';

export const Room = ({
  roomState,
  currentUserId,
  theme,
  activeReactions = {},
  onThrowReaction,
  onToggleTheme,
  onVote,
  onToggleSpectator,
  onReveal,
  onResetRound,
  onSetTasks,
  onSaveScore,
  onSelectTask,
  onNextTask,
  onPrevTask,
  onLeaveRoom,
  onStartTimer,
  onPauseTimer,
  onResetTimer
}) => {
  const [deck, setDeck] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setDeck(generateRandomDeck());
  }, []);

  const me = roomState?.participants?.find(p => p.id === currentUserId);
  const isHost = me?.isHost || false;
  const isSpectator = me?.isSpectator || false;

  useEffect(() => {
    if (!roomState?.revealed && !me?.hasVoted) {
      setSelectedCard(null);
    }
  }, [roomState?.revealed, me?.hasVoted]);

  const handleSelectCard = (val) => {
    if (roomState?.revealed || isSpectator) return;
    const nextVal = selectedCard === val ? null : val;
    setSelectedCard(nextVal);
    onVote(nextVal);
  };

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentTaskObj = roomState?.tasks?.[roomState?.currentTaskIndex];
  const currentTaskTitle = typeof currentTaskObj === 'object' ? currentTaskObj?.title : currentTaskObj;
  const currentTaskScore = typeof currentTaskObj === 'object' ? currentTaskObj?.score : null;
  const totalTasks = roomState?.tasks?.length || 0;
  const isUrl = (url) => url?.startsWith('http://') || url?.startsWith('https://');

  const activeVoters = roomState?.participants?.filter(p => !p.isSpectator) || [];
  const votedCount = activeVoters.filter(p => p.hasVoted).length;
  const hasAnyVote = votedCount > 0;

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-between select-none pb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      {/* 1. Header Superior */}
      <header className="px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            title="Ir al inicio / Crear nueva sala"
            className="flex items-center font-black text-2xl tracking-tighter hover:opacity-85 active:scale-95 transition-all cursor-pointer group"
          >
            <span className="text-red-500 group-hover:scale-105 transition-transform">U</span>
            <span className="text-blue-500 group-hover:scale-105 transition-transform">N</span>
            <span className="text-emerald-500 group-hover:scale-105 transition-transform">O</span>
            <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-light mx-0.5`}>-</span>
            <span className="text-amber-400 italic">PLANNING</span>
          </button>

          {/* Código de Sala */}
          <div className={`flex items-center gap-2 ${isDark ? 'bg-white/[0.05] hover:bg-white/[0.08]' : 'bg-slate-200/80 hover:bg-slate-200'} transition-colors px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-sm`}>
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>SALA:</span>
            <span className="font-mono font-bold text-amber-500 tracking-wider">{roomState?.id}</span>
            <button
              onClick={copyRoomLink}
              title="Copiar enlace de invitación"
              className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 2. Temporizador Central Sincronizado */}
        <div className="flex-1 max-w-fit mx-2 hidden md:block">
          <RoundTimer
            timer={roomState?.timer}
            isHost={isHost}
            theme={theme}
            isRevealed={roomState?.revealed}
            onStartTimer={onStartTimer}
            onPauseTimer={onPauseTimer}
            onResetTimer={onResetTimer}
          />
        </div>

        {/* Perfil, Tema & Salir */}
        <div className="flex items-center gap-3">
          {/* Switch de Tema */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-amber-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Badge de Usuario con Avatar */}
          <div className={`flex items-center gap-2 text-xs pl-1.5 pr-3.5 py-1 rounded-full backdrop-blur-md ${
            isDark ? 'bg-white/[0.05]' : 'bg-slate-200/90'
          }`}>
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0">
              <img
                src={getAvatarUrl(me?.avatarSeed, me?.name)}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="font-semibold">{me?.name}</span>
            {isHost && (
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                <span>👑</span>
                <span>Host</span>
              </span>
            )}
          </div>

          <button
            onClick={onLeaveRoom}
            title="Salir de la sala"
            className={`p-2 text-slate-400 hover:text-red-400 rounded-full transition-all cursor-pointer ${
              isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-200'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Cuerpo Principal: 2 Columnas (5/7 vs 2/7) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-6 px-4 sm:px-6 my-2">
        {/* COLUMNA PRINCIPAL (5/7) */}
        {/* COLUMNA PRINCIPAL (5/7): Mesa de Póker Redonda con Tarea Central */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="poker-table-outer p-5 sm:p-7 flex flex-col justify-between min-h-[460px] flex-1">
            {/* Cabecera superior de la mesa */}
            <div className="flex items-center justify-between mb-3 px-2 z-10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Participantes ({roomState?.participants?.length || 0})
                </span>
              </div>

              {/* Temporizador para pantallas pequeñas */}
              <div className="block md:hidden">
                <RoundTimer
                  timer={roomState?.timer}
                  isHost={isHost}
                  theme={theme}
                  isRevealed={roomState?.revealed}
                  onStartTimer={onStartTimer}
                  onPauseTimer={onPauseTimer}
                  onResetTimer={onResetTimer}
                />
              </div>

              {/* Indicador de votos emitidos en vivo */}
              {!roomState?.revealed && activeVoters.length > 0 && (
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-2 bg-black/30 dark:bg-white/[0.05] px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${hasAnyVote ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
                  <span>
                    {votedCount === activeVoters.length
                      ? '¡Todos han votado!'
                      : `${votedCount} de ${activeVoters.length} han votado`}
                  </span>
                </div>
              )}
            </div>

            {/* Arena de la mesa: Jugadores alrededor y Centro del Paño */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 my-auto py-2">
              
              {/* Centro de la Mesa (The Pot / Tarea Activa + Acción) */}
              <div className="poker-table-center-felt w-full max-w-xl p-4 sm:p-5 text-center flex flex-col items-center gap-3 relative z-10">
                {/* Meta de la Tarea / Puntos */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] uppercase font-black tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {totalTasks > 0 ? `Tarea activa (${roomState.currentTaskIndex + 1} de ${totalTasks})` : 'Tarea en Estimación'}
                  </span>
                  {currentTaskScore !== null && currentTaskScore !== undefined && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{currentTaskScore} pts</span>
                    </span>
                  )}
                </div>

                {/* Título o Enlace Clickeable */}
                <div className="w-full flex items-center justify-center px-2">
                  {currentTaskTitle ? (
                    isUrl(currentTaskTitle) ? (
                      <a
                        href={currentTaskTitle}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/30 max-w-full truncate shadow-sm"
                        title="Abrir enlace de la tarea en nueva pestaña"
                      >
                        <span className="truncate">{currentTaskTitle}</span>
                        <ExternalLink className="w-4 h-4 shrink-0 text-blue-400" />
                      </a>
                    ) : (
                      <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-full">
                        {currentTaskTitle}
                      </h2>
                    )
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-400 italic">
                      {isHost ? 'No hay tareas cargadas. Agrega enlaces o historias en el panel lateral.' : 'El anfitrión aún no ha seleccionado una tarea.'}
                    </p>
                  )}
                </div>

                {/* Controles de Navegación del Anfitrión (Anterior / Siguiente) */}
                {isHost && totalTasks > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPrevTask}
                      disabled={roomState.currentTaskIndex === 0}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        roomState.currentTaskIndex === 0
                          ? 'opacity-30 cursor-not-allowed bg-slate-500/10'
                          : isDark
                          ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>

                    <div className="text-[11px] font-mono font-bold text-slate-400 px-1">
                      {roomState.currentTaskIndex + 1}/{totalTasks}
                    </div>

                    <button
                      onClick={onNextTask}
                      disabled={roomState.currentTaskIndex === totalTasks - 1}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        roomState.currentTaskIndex === totalTasks - 1
                          ? 'opacity-30 cursor-not-allowed bg-slate-500/10'
                          : isDark
                          ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      }`}
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Botón Lúdico de Revelación / Acción Central */}
                {isHost && (
                  <div className="pt-1">
                    {!roomState?.revealed ? (
                      <button
                        onClick={onReveal}
                        disabled={!hasAnyVote}
                        className="btn-uno-reveal px-7 py-3 rounded-full font-black text-sm tracking-wider uppercase flex items-center gap-2 cursor-pointer"
                        title={!hasAnyVote ? 'Se requiere al menos 1 voto para revelar' : 'Revelar votos de la sala'}
                      >
                        <Sparkles className="w-4 h-4 fill-amber-300" />
                        <span>¡REVELAR VOTOS!</span>
                      </button>
                    ) : (
                      <button
                        onClick={onResetRound}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                          isDark ? 'bg-white/[0.08] hover:bg-white/[0.12] text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                        <span>Nueva Estimación</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Resumen tras revelación en la mesa */}
                {roomState?.revealed && (
                  <div className="text-center pt-1">
                    <span className="text-xs font-medium text-slate-400">
                      Promedio: <strong className="text-amber-500 font-mono text-sm">{roomState.metrics?.average ?? '-'}</strong> • 
                      Moda: <strong className="text-white font-mono text-sm">{roomState.metrics?.mode ?? '-'}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Cartas de los Jugadores sentados en torno a la mesa */}
              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 w-full relative z-20 mt-2 sm:mt-4">
                {roomState?.participants?.map((p, idx) => {
                  const colors = ['red', 'blue', 'green', 'yellow'];
                  const assignedColor = colors[idx % colors.length];

                  return (
                    <FlipCard
                      key={p.id}
                      participantId={p.id}
                      isRevealed={roomState.revealed}
                      value={p.vote}
                      color={assignedColor}
                      participantName={p.name}
                      avatarSeed={p.avatarSeed}
                      isHost={p.isHost}
                      isSpectator={p.isSpectator}
                      hasVoted={p.hasVoted}
                      canReact={p.id !== currentUserId}
                      onThrowReaction={(emoji) => onThrowReaction && onThrowReaction(p.id, emoji)}
                      activeReaction={activeReactions?.[p.id]}
                    />
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* COLUMNA LATERAL (2/7): Backlog de Tareas */}
        <aside className={`lg:col-span-2 ${isDark ? 'bg-white/[0.03]' : 'bg-white/80'} backdrop-blur-xl rounded-3xl p-5 shadow-2xl flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cola de Tareas ({totalTasks})
                </h3>
              </div>

              {isHost && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="p-1.5 hover:bg-blue-500/10 rounded-xl text-blue-500 transition-colors cursor-pointer"
                  title="Cargar o editar lista"
                >
                  <ListPlus className="w-4 h-4" />
                </button>
              )}
            </div>

            {totalTasks === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400 text-xs">
                <p>No hay tareas en cola.</p>
                {isHost && (
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="mt-3 px-3.5 py-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 rounded-xl font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>Pegar lista de tareas o enlaces</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {roomState.tasks.map((taskItem, index) => {
                  const title = typeof taskItem === 'object' ? taskItem.title : taskItem;
                  const score = typeof taskItem === 'object' ? taskItem.score : null;
                  const isActive = index === roomState.currentTaskIndex;
                  const isDone = score !== null && score !== undefined;

                  return (
                    <div
                      key={index}
                      onClick={() => isHost && onSelectTask(index)}
                      className={`p-3 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-blue-600/15 shadow-md ring-1 ring-blue-500/40'
                          : isDone
                          ? isDark ? 'bg-white/[0.02] opacity-75' : 'bg-slate-100 opacity-80'
                          : isDark ? 'bg-white/[0.02] hover:bg-white/[0.05]' : 'bg-slate-100 hover:bg-slate-200/70'
                      } ${isHost ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isActive
                                ? 'bg-blue-500 text-white'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-400/20 text-slate-400'
                            }`}
                          >
                            {index + 1}
                          </span>

                          <span className="text-xs font-semibold truncate">
                            {title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Badge de puntuación */}
                          {score !== null && score !== undefined && (
                            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black font-mono text-[10px] rounded-full shadow-sm">
                              {score} pts
                            </span>
                          )}

                          {isUrl(title) && (
                            <a
                              href={title}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-blue-500 p-1 transition-colors"
                              title="Abrir enlace"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {isHost && totalTasks > 0 && (
            <div className="pt-3 border-t border-black/[0.05] dark:border-white/[0.05] text-[11px] text-slate-400 text-center">
              Haz clic en cualquier tarea para seleccionarla
            </div>
          )}
        </aside>
      </div>

      {/* 3. Barra Inferior: Mano de Cartas Centrada y Visible */}
      <footer className="w-full max-w-6xl mx-auto px-4 mt-2 z-20">
        <div className="flex items-center justify-between mb-1.5 px-2">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
            <span>Tu Mano Fibonacci</span>
            {selectedCard !== null && (
              <span className="text-amber-500 font-semibold">
                (Carta: <strong className="font-black text-amber-500 text-sm">{selectedCard}</strong>)
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleSpectator(!isSpectator)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
              isSpectator
                ? 'bg-amber-400/20 text-amber-500'
                : isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
            }`}
          >
            {isSpectator ? '👀 Eres Espectador (No votas)' : 'Actuar como Espectador'}
          </button>
        </div>

        {isSpectator ? (
          <div className={`py-4 px-4 rounded-2xl text-center text-xs ${isDark ? 'bg-white/[0.02] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            Modo espectador activo. Disfruta de la sesión sin votar.
          </div>
        ) : (
          <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 py-2 px-1 flex-wrap">
            {deck.map((item) => (
              <UnoCard
                key={item.value}
                value={item.value}
                color={item.color}
                isSelected={selectedCard === item.value}
                onClick={() => handleSelectCard(item.value)}
                size="hand"
              />
            ))}
          </div>
        )}
      </footer>

      {/* Modal para pegar lista de tareas */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        tasks={roomState?.tasks?.map(t => typeof t === 'object' ? t.title : t) || []}
        onSaveTasks={onSetTasks}
      />

      {/* Modal interactivo de resultados y cierre de ronda */}
      <ResultsModal
        isOpen={roomState?.revealed}
        roomState={roomState}
        isHost={isHost}
        onSaveScore={onSaveScore}
        onResetRound={onResetRound}
      />

      {/* Capa global de lluvia balística de proyectiles */}
      <ProjectilesOverlay />
    </div>
  );
};

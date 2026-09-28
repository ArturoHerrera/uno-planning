import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { Lobby } from './components/Lobby';
import { Room } from './components/Room';

export function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('poker_username') || '');
  const [roomState, setRoomState] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('uno_theme') || 'dark');

  // Aplicar tema en body y persistir
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('uno_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Escuchar URL para unirse por enlace directo (?room=XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setCurrentRoomId(roomParam.toUpperCase());
    }
  }, []);

  const [activeReactions, setActiveReactions] = useState({});

  // Configurar listeners de Socket.io
  useEffect(() => {
    socket.connect();

    socket.on('room:updated', (newState) => {
      setRoomState(newState);
      setConnecting(false);
    });

    socket.on('reaction:received', (reaction) => {
      setActiveReactions((prev) => ({
        ...prev,
        [reaction.targetUserId]: reaction
      }));

      // Desvanecer después de 2 segundos
      setTimeout(() => {
        setActiveReactions((prev) => {
          if (prev[reaction.targetUserId]?.id === reaction.id) {
            const next = { ...prev };
            delete next[reaction.targetUserId];
            return next;
          }
          return prev;
        });
      }, 2000);
    });

    socket.on('disconnect', () => {
      // Reconexión automática manejada por socket.io
    });

    return () => {
      socket.off('room:updated');
      socket.off('reaction:received');
    };
  }, []);

  // 1. Crear Sala
  const handleCreateRoom = (name, isSpectator, avatarSeed) => {
    setUserName(name);
    localStorage.setItem('poker_username', name);
    if (avatarSeed) localStorage.setItem('poker_avatar_seed', avatarSeed);
    setConnecting(true);

    socket.emit('room:create', { userName: name, isSpectator, avatarSeed }, (res) => {
      if (res?.success) {
        setRoomState(res.state);
        setCurrentRoomId(res.roomId);
        // Actualizar URL sin recargar
        window.history.pushState({}, '', `?room=${res.roomId}`);
      }
      setConnecting(false);
    });
  };

  // 2. Unirse a Sala
  const handleJoinRoom = (roomId, name, isSpectator, avatarSeed) => {
    setUserName(name);
    localStorage.setItem('poker_username', name);
    if (avatarSeed) localStorage.setItem('poker_avatar_seed', avatarSeed);
    setConnecting(true);

    socket.emit('room:join', { roomId, userName: name, isSpectator, avatarSeed }, (res) => {
      if (res?.success) {
        setRoomState(res.state);
        setCurrentRoomId(res.roomId);
        window.history.pushState({}, '', `?room=${res.roomId}`);
      } else {
        alert(res?.message || 'Error al unirse a la sala.');
      }
      setConnecting(false);
    });
  };

  // 3. Emitir Voto
  const handleVote = (value) => {
    socket.emit('vote:cast', { value });
  };

  // 4. Cambiar rol espectador
  const handleToggleSpectator = (isSpectator) => {
    socket.emit('vote:toggle-spectator', { isSpectator });
  };

  // 5. Revelar ronda
  const handleReveal = () => {
    socket.emit('round:reveal');
  };

  // 6. Reiniciar ronda
  const handleResetRound = () => {
    socket.emit('round:reset');
  };

  // 7. Tareas Jira
  const handleSetTasks = (tasks) => {
    socket.emit('task:set-list', { tasks });
  };

  const handleSelectTask = (index) => {
    socket.emit('task:select', { index });
  };

  const handleNextTask = () => {
    socket.emit('task:next');
  };

  const handlePrevTask = () => {
    socket.emit('task:prev');
  };

  // Guardar puntuación acordada de la tarea activa
  const handleSaveScore = (score, autoAdvance = true) => {
    socket.emit('task:save-score', { score, autoAdvance });
  };

  // 8. Reacciones interactivas (aventar emojis)
  const handleThrowReaction = (targetUserId, emoji) => {
    socket.emit('reaction:throw', { targetUserId, emoji });
  };

  // 9. Salir de la sala
  const handleLeaveRoom = () => {
    setRoomState(null);
    setCurrentRoomId(null);
    window.history.pushState({}, '', window.location.pathname);
    window.location.reload();
  };

  // 10. Temporizador de ronda
  const handleStartTimer = (duration) => {
    socket.emit('timer:start', { duration });
  };

  const handlePauseTimer = () => {
    socket.emit('timer:pause');
  };

  const handleResetTimer = (duration) => {
    socket.emit('timer:reset', { duration });
  };

  if (!roomState) {
    return (
      <Lobby
        initialName={userName}
        initialRoomCode={currentRoomId}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    );
  }

  return (
    <Room
      roomState={roomState}
      currentUserId={socket.id}
      theme={theme}
      activeReactions={activeReactions}
      onThrowReaction={handleThrowReaction}
      onToggleTheme={handleToggleTheme}
      onVote={handleVote}
      onToggleSpectator={handleToggleSpectator}
      onReveal={handleReveal}
      onResetRound={handleResetRound}
      onSetTasks={handleSetTasks}
      onSaveScore={handleSaveScore}
      onSelectTask={handleSelectTask}
      onNextTask={handleNextTask}
      onPrevTask={handlePrevTask}
      onLeaveRoom={handleLeaveRoom}
      onStartTimer={handleStartTimer}
      onPauseTimer={handlePauseTimer}
      onResetTimer={handleResetTimer}
    />
  );
}
export default App;

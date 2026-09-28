import React, { useState, useEffect, useRef } from 'react';
import { socket } from './socket';
import { Lobby } from './components/Lobby';
import { Room } from './components/Room';

export function App() {
  const [userName, setUserName] = useState(() => localStorage.getItem('poker_username') || '');
  const [roomState, setRoomState] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('uno_theme') || 'dark');
  const [activeReactions, setActiveReactions] = useState({});

  // Referencias para que los listeners de Socket.IO tengan siempre los valores frescos sin reconectar
  const currentRoomIdRef = useRef(currentRoomId);
  const userNameRef = useRef(userName);

  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  // Aplicar tema en body y persistir
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('uno_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper para obtener token de anfitrión
  const getHostToken = (roomId) => {
    const targetRoom = roomId || currentRoomId;
    return targetRoom ? sessionStorage.getItem(`poker_host_token_${targetRoom}`) : null;
  };

  // Escuchar URL para unirse por enlace directo (?room=XXXX)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      const formattedRoom = roomParam.toUpperCase();
      setCurrentRoomId(formattedRoom);

      // Si el usuario ya estaba en esta sala en esta pestaña y refrescó la página (F5)
      const activeSessionRoom = sessionStorage.getItem('poker_active_room');
      const storedName = localStorage.getItem('poker_username');
      if (activeSessionRoom === formattedRoom && storedName) {
        const storedSeed = localStorage.getItem('poker_avatar_seed');
        const token = sessionStorage.getItem(`poker_host_token_${formattedRoom}`);
        
        socket.connect();
        socket.emit('room:join', {
          roomId: formattedRoom,
          userName: storedName,
          avatarSeed: storedSeed,
          hostToken: token
        }, (res) => {
          if (res?.success) {
            if (res.hostToken) {
              sessionStorage.setItem(`poker_host_token_${formattedRoom}`, res.hostToken);
            }
            setRoomState(res.state);
          }
        });
      }
    }
  }, []);

  // Configurar listeners de Socket.io
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      // Auto-rejoin transparente ante reconexión tras pérdida de enlace o suspensión de equipo
      const activeRoom = currentRoomIdRef.current || sessionStorage.getItem('poker_active_room');
      const name = userNameRef.current || localStorage.getItem('poker_username');
      if (activeRoom && name) {
        const seed = localStorage.getItem('poker_avatar_seed');
        const token = sessionStorage.getItem(`poker_host_token_${activeRoom}`);

        socket.emit('room:join', {
          roomId: activeRoom,
          userName: name,
          avatarSeed: seed,
          hostToken: token
        }, (res) => {
          if (res?.success) {
            if (res.hostToken) {
              sessionStorage.setItem(`poker_host_token_${activeRoom}`, res.hostToken);
            }
            setRoomState(res.state);
          }
        });
      }
    });

    socket.on('room:updated', (newState) => {
      setRoomState(newState);
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

    return () => {
      socket.off('connect');
      socket.off('room:updated');
      socket.off('reaction:received');
    };
  }, []);

  // 1. Crear Sala
  const handleCreateRoom = (name, isSpectator, avatarSeed) => {
    setUserName(name);
    localStorage.setItem('poker_username', name);
    if (avatarSeed) localStorage.setItem('poker_avatar_seed', avatarSeed);

    socket.emit('room:create', { userName: name, isSpectator, avatarSeed }, (res) => {
      if (res?.success) {
        if (res.hostToken) {
          sessionStorage.setItem(`poker_host_token_${res.roomId}`, res.hostToken);
        }
        sessionStorage.setItem('poker_active_room', res.roomId);
        setRoomState(res.state);
        setCurrentRoomId(res.roomId);
        window.history.pushState({}, '', `?room=${res.roomId}`);
      }
    });
  };

  // 2. Unirse a Sala
  const handleJoinRoom = (roomId, name, isSpectator, avatarSeed) => {
    setUserName(name);
    localStorage.setItem('poker_username', name);
    if (avatarSeed) localStorage.setItem('poker_avatar_seed', avatarSeed);

    const token = sessionStorage.getItem(`poker_host_token_${roomId}`);

    socket.emit('room:join', { roomId, userName: name, isSpectator, avatarSeed, hostToken: token }, (res) => {
      if (res?.success) {
        if (res.hostToken) {
          sessionStorage.setItem(`poker_host_token_${res.roomId}`, res.hostToken);
        }
        sessionStorage.setItem('poker_active_room', res.roomId);
        setRoomState(res.state);
        setCurrentRoomId(res.roomId);
        window.history.pushState({}, '', `?room=${res.roomId}`);
      } else {
        alert(res?.message || 'Error al unirse a la sala.');
      }
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
    socket.emit('round:reveal', { hostToken: getHostToken() });
  };

  // 6. Reiniciar ronda
  const handleResetRound = () => {
    socket.emit('round:reset', { hostToken: getHostToken() });
  };

  // 7. Tareas Jira
  const handleSetTasks = (tasks) => {
    socket.emit('task:set-list', { tasks, hostToken: getHostToken() });
  };

  const handleSelectTask = (index) => {
    socket.emit('task:select', { index, hostToken: getHostToken() });
  };

  const handleNextTask = () => {
    socket.emit('task:next', { hostToken: getHostToken() });
  };

  const handlePrevTask = () => {
    socket.emit('task:prev', { hostToken: getHostToken() });
  };

  // Guardar puntuación acordada de la tarea activa
  const handleSaveScore = (score, autoAdvance = true) => {
    socket.emit('task:save-score', { score, autoAdvance, hostToken: getHostToken() });
  };

  // 8. Reacciones interactivas (aventar emojis)
  const handleThrowReaction = (targetUserId, emoji) => {
    socket.emit('reaction:throw', { targetUserId, emoji });
  };

  // 9. Salir de la sala
  const handleLeaveRoom = () => {
    const roomId = currentRoomId || sessionStorage.getItem('poker_active_room');
    if (roomId) {
      sessionStorage.removeItem(`poker_host_token_${roomId}`);
      sessionStorage.removeItem('poker_active_room');
    }
    setRoomState(null);
    setCurrentRoomId(null);
    window.history.pushState({}, '', window.location.pathname);
    window.location.reload();
  };

  // 10. Temporizador de ronda
  const handleStartTimer = (duration) => {
    socket.emit('timer:start', { duration, hostToken: getHostToken() });
  };

  const handlePauseTimer = () => {
    socket.emit('timer:pause', { hostToken: getHostToken() });
  };

  const handleResetTimer = (duration) => {
    socket.emit('timer:reset', { duration, hostToken: getHostToken() });
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

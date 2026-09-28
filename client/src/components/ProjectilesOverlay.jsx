import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

/**
 * Capa de pantalla completa que renderiza la lluvia de proyectiles de reacciones
 * desde bordes aleatorios de la pantalla hacia la tarjeta objetivo de forma 100% anónima.
 */
export const ProjectilesOverlay = () => {
  const [projectiles, setProjectiles] = useState([]);

  useEffect(() => {
    const handleReaction = (reaction) => {
      if (!reaction || !reaction.targetUserId) return;

      const { id, targetUserId, emoji } = reaction;

      // Obtener coordenadas de la tarjeta objetivo en el viewport
      const cardEl = document.getElementById(`participant-card-${targetUserId}`);
      let endX = window.innerWidth / 2;
      let endY = window.innerHeight / 2;

      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      }

      // Elegir un borde perimetral aleatorio (0: top, 1: right, 2: bottom, 3: left)
      const edge = Math.floor(Math.random() * 4);
      let startX = 0;
      let startY = 0;
      const margin = 80;

      if (edge === 0) {
        // Arriba
        startX = Math.random() * window.innerWidth;
        startY = -margin;
      } else if (edge === 1) {
        // Derecha
        startX = window.innerWidth + margin;
        startY = Math.random() * window.innerHeight;
      } else if (edge === 2) {
        // Abajo
        startX = Math.random() * window.innerWidth;
        startY = window.innerHeight + margin;
      } else {
        // Izquierda
        startX = -margin;
        startY = Math.random() * window.innerHeight;
      }

      const duration = 480 + Math.floor(Math.random() * 120); // 480ms a 600ms
      const rotMid = `${Math.floor((Math.random() - 0.5) * 540)}deg`;
      const rotEnd = `${Math.floor((Math.random() - 0.5) * 900)}deg`;

      const newProjectile = {
        id: id || Math.random().toString(36).substring(2, 9),
        emoji,
        startX,
        startY,
        endX,
        endY,
        rotMid,
        rotEnd,
        duration
      };

      setProjectiles((prev) => [...prev, newProjectile]);

      // Sacudida visual de impacto en la tarjeta cuando llega el proyectil
      setTimeout(() => {
        if (cardEl) {
          cardEl.classList.remove('wobble-card');
          void cardEl.offsetWidth; // Forzar reflow para reiniciar animación
          cardEl.classList.add('wobble-card');
          setTimeout(() => {
            cardEl.classList.remove('wobble-card');
          }, 450);
        }
      }, duration * 0.82);

      // Eliminar de RAM inmediatamente tras concluir la animación
      setTimeout(() => {
        setProjectiles((prev) => prev.filter((p) => p.id !== newProjectile.id));
      }, duration + 60);
    };

    socket.on('reaction:received', handleReaction);

    return () => {
      socket.off('reaction:received', handleReaction);
    };
  }, []);

  if (projectiles.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {projectiles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 left-0 text-4xl sm:text-5xl select-none animate-projectile will-change-transform"
          style={{
            '--start-x': `${p.startX}px`,
            '--start-y': `${p.startY}px`,
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`,
            '--rot-mid': p.rotMid,
            '--rot-end': p.rotEnd,
            animationDuration: `${p.duration}ms`
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

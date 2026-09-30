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
      const margin = 70;

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

      // Jitter sutil en el impacto para ráfagas orgánicas sobre la tarjeta
      const jitterX = (Math.random() - 0.5) * 24;
      const jitterY = (Math.random() - 0.5) * 24;
      const targetX = endX + jitterX;
      const targetY = endY + jitterY;

      // Cálculo de física balística: arco parabólico con elevación en el punto medio
      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy);

      const midX = (startX + targetX) / 2;
      const baseArc = Math.min(260, Math.max(130, dist * 0.28));
      const jitterArc = (Math.random() - 0.5) * 40;
      const arcHeight = baseArc + jitterArc;
      const midY = Math.max(15, Math.min(startY, targetY) - arcHeight);

      // Sentido de rotación según la dirección horizontal de vuelo
      const dir = dx >= 0 ? 1 : -1;
      const rotStart = `${Math.floor((Math.random() - 0.5) * 40)}deg`;
      const rotMid = `${dir * (140 + Math.floor(Math.random() * 160))}deg`;
      const rotEnd = `${dir * (360 + Math.floor(Math.random() * 360))}deg`;

      const duration = 720 + Math.floor(Math.random() * 160); // 720ms a 880ms para trayectoria balística fluida

      const newProjectile = {
        id: id || Math.random().toString(36).substring(2, 9),
        emoji,
        startX,
        startY,
        midX,
        midY,
        endX: targetX,
        endY: targetY,
        rotStart,
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
            '--mid-x': `${p.midX}px`,
            '--mid-y': `${p.midY}px`,
            '--end-x': `${p.endX}px`,
            '--end-y': `${p.endY}px`,
            '--rot-start': p.rotStart,
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

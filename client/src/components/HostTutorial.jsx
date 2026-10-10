import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

/**
 * Onboarding guiado para el Anfitrión (Scrum Master) con sombras, contraste elevado (Spotlight)
 * e instrucciones concisas de 1-2 líneas por paso.
 */
export const HostTutorial = ({
  isActive,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const steps = [
    {
      targetId: 'tutorial-timer',
      title: 'Cronómetro Sincronizado',
      description: 'Controla el tiempo de debate por historia. Puedes iniciar, pausar o cambiar los segundos.',
      placement: 'bottom'
    },
    {
      targetId: 'tutorial-task-queue',
      title: 'Mazo de Historias',
      description: 'Carga tu lista o enlaces de tareas de Jira/GitHub para organizar las rondas a estimar.',
      placement: 'left'
    },
    {
      targetId: 'tutorial-reveal-btn',
      title: '¡Bajar Cartas!',
      description: 'Revela los votos cuando el equipo esté listo para ver el consenso o debatir discrepancias.',
      placement: 'top'
    }
  ];

  const updateTargetRect = () => {
    const step = steps[currentStep];
    if (!step) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    } else {
      setTargetRect(null);
    }
  };

  useEffect(() => {
    if (!isActive) return;
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isActive, currentStep]);

  if (!isActive) return null;

  const currentStepData = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete && onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none transition-opacity duration-300">
      {/* Overlay oscuro con recorte transparente SVG (Spotlight real) */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="spotlight-mask">
            {/* Base blanca = opaco / oscuro */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Recorte negro = transparente / visible */}
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                ry="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Capa oscura que usa la máscara */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#020617"
          fillOpacity="0.82"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Anillo de resplandor y borde luminoso alrededor del elemento enfocado */}
      {targetRect && (
        <div
          className="absolute rounded-2xl pointer-events-none ring-4 ring-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-pulse transition-all duration-300"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16
          }}
        />
      )}

      {/* Cuadro de diálogo del tutorial flotante */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm bg-slate-900 border border-amber-400/50 rounded-3xl p-6 shadow-2xl text-slate-100 animate-fade-in relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Tutorial de Anfitrión ({currentStep + 1} de {steps.length})</span>
            </span>

            <button
              onClick={onComplete}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Omitir
            </button>
          </div>

          <h4 className="text-lg font-black text-white mb-2">
            {currentStepData.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            {currentStepData.description}
          </p>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStep ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isLast ? '¡Entendido!' : 'Siguiente'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

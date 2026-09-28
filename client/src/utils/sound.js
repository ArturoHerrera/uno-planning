/**
 * Utilidad de audio sintetizado con Web Audio API para UNO-PLANNING.
 * Diseñado con sonidos tranquilos, zen y de baja frecuencia para evitar estrés.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Verifica si el usuario tiene el sonido silenciado
 */
export function isSoundMuted() {
  return localStorage.getItem('uno_timer_muted') === 'true';
}

/**
 * Guarda la preferencia de silencio
 */
export function setSoundMuted(muted) {
  localStorage.setItem('uno_timer_muted', muted ? 'true' : 'false');
}

/**
 * Tic-tac sutil estilo bloque de madera suave / gota de agua
 * @param {number} intensity - Nivel de intensidad (de 0.2 a 1.0)
 */
export function playSoftTick(intensity = 0.25) {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Rango de volumen muy sutil y amigable: de 0.012 en modo base hasta 0.045 al final
    const clampedIntensity = Math.min(1.0, Math.max(0.1, intensity));
    const targetVolume = 0.012 + (0.033 * clampedIntensity);

    // Frecuencia sutil de madera que sube ligeramente cuando hay más intensidad
    const baseFreq = 380 + (80 * clampedIntensity);
    const dropFreq = baseFreq / 2;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(dropFreq, now + 0.035);

    // Envolvente rápida y percusiva
    gain.gain.setValueAtTime(targetVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (err) {
    // Manejo silencioso si el navegador bloquea audio sin interacción previa
  }
}

/**
 * Chime armónico y sereno al finalizar el tiempo (acorde estilo cuenco tibetano/zen)
 */
export function playZenChime() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Frecuencias en armonía de quinta justa (Sol y Re relajantes)
    const freqs = [392, 587.33, 783.99];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Entrada suave y caída zen larga
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07 / (idx + 1), now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.9);
    });
  } catch (err) {
    // Silencioso si falla
  }
}

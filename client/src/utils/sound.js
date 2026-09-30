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
 * Tono ascendente suave que indica el inicio del temporizador
 */
export function playTimerStart() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Dos tonos ascendentes amables y breves (Do5 -> Sol5: 523.25Hz -> 783.99Hz)
    const notes = [
      { freq: 523.25, time: now, dur: 0.12 },
      { freq: 783.99, time: now + 0.10, dur: 0.22 }
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.035, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + dur + 0.02);
    });
  } catch (err) {
    // Manejo silencioso si el navegador bloquea audio sin interacción previa
  }
}

/**
 * Tono sutil recordatorio cuando transcurre el 50% del tiempo (campanita discreta)
 */
export function playTimerMidpoint() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Tono sereno tipo campana suave (Mi5: 659.25Hz con armónico sutil a 1318.5Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch (err) {
    // Silencioso si falla
  }
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

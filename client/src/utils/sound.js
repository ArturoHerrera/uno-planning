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

/**
 * Sonido seco, sutil y táctil de carta colocada sobre el paño de la mesa (Card Snap/Thud)
 */
export function playCardSnap() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    
    // 1. Golpe percusivo sordo de baja frecuencia (contacto con la mesa)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);

    // 2. Ruido sutil de fricción/deslizamiento de cartulina
    const bufferSize = ctx.sampleRate * 0.04;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.035, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
  } catch (err) {
    // Silencioso si falla
  }
}

/**
 * Acorde armónico ascendente de celebración ¡UNO! (Pentatónica mayor victoriosa)
 */
export function playUnoSuccessFanfare() {
  if (isSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Secuencia de notas triunfales (Do5, Mi5, Sol5, Do6)
    const arpeggio = [
      { freq: 523.25, timeOffset: 0.00, dur: 0.15 },
      { freq: 659.25, timeOffset: 0.08, dur: 0.15 },
      { freq: 783.99, timeOffset: 0.16, dur: 0.18 },
      { freq: 1046.50, timeOffset: 0.24, dur: 0.70 }
    ];

    arpeggio.forEach(({ freq, timeOffset, dur }, idx) => {
      const noteTime = now + timeOffset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const maxGain = idx === arpeggio.length - 1 ? 0.08 : 0.04;
      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(maxGain, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + dur + 0.05);
    });
  } catch (err) {
    // Silencioso si falla
  }
}

/**
 * FRIENDSHIP OS - Ooku Sound Effect Service
 * Plays high-impact recorded/synthesized comedy sound effects (Vine Boom, Punch Hit, Airhorn, Boing)
 * whenever an Ooku roast is detected by the AI referee.
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
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Vine Boom / Deep Bass Impact Sound Effect
 */
function playVineBoom(ctx) {
  const now = ctx.currentTime;

  // Sub bass drop
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

  gain.gain.setValueAtTime(0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.6);

  // Noise punch
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.6, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  noiseNode.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + 0.1);
}

/**
 * Heavy Punch Hit Sound Effect
 */
function playPunchHit(ctx) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

  gain.gain.setValueAtTime(0.9, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/**
 * Cartoon Comedy Boing Sound Effect
 */
function playComedyBoing(ctx) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(450, now + 0.35);

  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

/**
 * Critical Airhorn / Alarm Blast Sound Effect
 */
function playCriticalAirhorn(ctx) {
  const now = ctx.currentTime;
  const freqs = [466.16, 587.33, 698.46]; // Bb chord airhorn

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  });
}

/**
 * Play appropriate sound effect based on Ooku event intensity & type
 */
export function playOokuSoundEffect(intensity = 5, type = 'OOKU') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const intVal = Number(intensity) || 5;

    if (type === 'CRITICAL_OOKU' || intVal >= 8) {
      playCriticalAirhorn(ctx);
    } else if (type === 'COUNTER_OOKU' || intVal >= 6) {
      playPunchHit(ctx);
    } else if (intVal <= 3) {
      playComedyBoing(ctx);
    } else {
      playVineBoom(ctx);
    }
  } catch (err) {
    console.warn('[SoundEffectService] Audio effect error:', err);
  }
}

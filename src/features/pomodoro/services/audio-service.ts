/**
 * Service for managing audio playback (timer sounds, white noise)
 */

let audioContext: AudioContext | null = null;
const activeSounds = new Map<string, AudioBufferSourceNode>();

/**
 * Initialize audio context
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
  }
  return audioContext;
}

/**
 * Play timer completion sound
 */
export function playCompletionSound(): void {
  try {
    // TODO: Load and play completion sound
    // For now, use a simple beep
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);
  } catch (error) {
    console.error("Failed to play completion sound:", error);
  }
}

/**
 * Play white noise
 */
export function playWhiteNoise(_id: string, _volume: number): void {
  // TODO: Load and play white noise audio files
  // This is a placeholder implementation
  // console.log(`Playing white noise: ${id} at volume ${volume}`);
}

/**
 * Stop white noise
 */
export function stopWhiteNoise(id: string): void {
  try {
    const sound = activeSounds.get(id);
    if (sound) {
      sound.stop();
      activeSounds.delete(id);
    }
  } catch (error) {
    console.error("Failed to stop white noise:", error);
  }
}

/**
 * Stop all sounds
 */
export function stopAllSounds(): void {
  activeSounds.forEach((sound) => {
    try {
      sound.stop();
    } catch {
      // Ignore errors when stopping
    }
  });
  activeSounds.clear();
}

/**
 * Set volume for a specific sound
 */
export function setVolume(_id: string, _volume: number): void {
  // TODO: Implement volume control
  // console.log(`Setting volume for ${id}: ${volume}`);
}

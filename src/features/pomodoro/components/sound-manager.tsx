"use client";

import { Howl } from "howler";
import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";
import { useTimerStore } from "@/stores/use-timer-store";

export function SoundManager() {
  const { soundscapes, masterVolume } = useAudioStore();
  const { status, mode } = useTimerStore();
  const howlsRef = useRef<Record<string, Howl>>({});
  const tickingRef = useRef<Howl | null>(null);

  // Initialize soundscapes
  useEffect(() => {
    soundscapes.forEach((sound) => {
      if (!howlsRef.current[sound.id] && sound.audioUrl) {
        howlsRef.current[sound.id] = new Howl({
          src: [sound.audioUrl],
          loop: true,
          volume: 0,
          preload: true,
        });
      }
    });

    // Initialize ticking sound (optional - only if file exists)
    // Ticking sound is disabled until a proper audio file is provided
    // To enable: add a ticking.mp3 file to public/sounds/ and uncomment below
    /*
    if (!tickingRef.current) {
      try {
        tickingRef.current = new Howl({
          src: ["/sounds/ticking.mp3"],
          loop: true,
          volume: 0.5,
          onloaderror: () => {
            console.warn("Ticking sound not available");
            tickingRef.current = null;
          },
        });
      } catch (e) {
        console.warn("Could not initialize ticking sound:", e);
      }
    }
    */
  }, [soundscapes]);

  // Update volumes and play/pause based on state
  useEffect(() => {
    soundscapes.forEach((sound) => {
      const howl = howlsRef.current[sound.id];
      if (howl) {
        const targetVolume = (sound.volume / 100) * (masterVolume / 100);

        if (sound.isActive) {
          if (!howl.playing()) {
            howl.play();
            howl.fade(0, targetVolume, 1000);
          } else {
            howl.volume(targetVolume);
          }
        } else {
          if (howl.playing()) {
            howl.fade(howl.volume(), 0, 1000);
            setTimeout(() => {
              if (!sound.isActive) howl.stop(); // Check again in case it was reactivated
            }, 1000);
          }
        }
      }
    });
  }, [soundscapes, masterVolume]);

  // Handle Ticking Sound
  useEffect(() => {
    if (status === "running" && mode === "focus") {
      if (!tickingRef.current?.playing()) {
        tickingRef.current?.play();
      }
    } else {
      tickingRef.current?.stop();
    }
  }, [status, mode]);

  return null; // This component is headless
}

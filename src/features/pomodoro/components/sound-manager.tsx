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

    // Initialize ticking sound
    if (!tickingRef.current) {
      tickingRef.current = new Howl({
        src: ["/sounds/ticking.mp3"], // Make sure this file exists or update path
        loop: true,
        volume: 0.5,
      });
    }
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

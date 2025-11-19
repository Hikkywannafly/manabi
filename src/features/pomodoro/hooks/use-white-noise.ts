import { useCallback, useState } from "react";
import { WHITE_NOISE_PRESETS } from "../constants";
import type { WhiteNoisePreset } from "../types";

export function useWhiteNoise() {
  const [isMasterOn, setIsMasterOn] = useState(false);
  const [sounds, setSounds] = useState<WhiteNoisePreset[]>(WHITE_NOISE_PRESETS);

  const handleVolumeChange = useCallback((id: string, volume: number) => {
    setSounds((prev) =>
      prev.map((sound) =>
        sound.id === id ? { ...sound, volume, isActive: volume > 0 } : sound,
      ),
    );
  }, []);

  const toggleMaster = useCallback((enabled: boolean) => {
    setIsMasterOn(enabled);
    if (!enabled) {
      // Mute all sounds when master is off
      setSounds((prev) => prev.map((sound) => ({ ...sound, isActive: false })));
    }
  }, []);

  const activeSoundsCount = sounds.filter((s) => s.isActive).length;

  return {
    isMasterOn,
    sounds,
    activeSoundsCount,
    handleVolumeChange,
    toggleMaster,
    setIsMasterOn,
  };
}

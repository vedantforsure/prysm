import { defineSound, ensureReady, sine } from "@web-kits/audio";
import type { PlayOptions, VoiceHandle } from "@web-kits/audio";

const _buttonPrimary = sine({ start: 800, end: 300 }, 0.06, 0.18);
const _buttonSecondary = sine({ start: 650, end: 260 }, 0.05, 0.12);
const _cardHover = sine({ start: 1200, end: 1000 }, 0.025, 0.04);
const _cardPress = defineSound({
  source: { type: "noise", color: "white" },
  filter: { type: "bandpass", frequency: 2500, resonance: 2 },
  envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 },
  gain: 0.1,
});

function play(sound: (opts?: PlayOptions) => VoiceHandle) {
  ensureReady().then(() => sound()).catch(() => {});
}

export const sounds = {
  buttonPrimary: () => play(_buttonPrimary),
  buttonSecondary: () => play(_buttonSecondary),
  cardHover: () => play(_cardHover),
  cardPress: () => play(_cardPress),
};

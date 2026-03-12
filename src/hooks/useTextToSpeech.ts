import { useState, useRef, useCallback } from "react";

const LANG_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  ta: "ta-IN",
};

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback((text: string, language: string = "en") => {
    if (!isSupported) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[language] || language;
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1;

    // Try to find a voice for the language
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = utterance.lang.split("-")[0];
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, options.rate, options.pitch]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { isSpeaking, speak, stop, isSupported };
};

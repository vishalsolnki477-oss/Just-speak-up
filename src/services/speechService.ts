// Web Speech API wrapper for Text-to-Speech and Speech-to-Text with accent support and lip-sync events

export type VoiceAccent = 'us' | 'uk' | 'in';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isRecognitionAvailable: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private speakingState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.isRecognitionAvailable = true;
      }
    }
  }

  public getRecognitionSupport(): boolean {
    return this.isRecognitionAvailable;
  }

  public isSpeaking(): boolean {
    return this.speakingState || (this.synth?.speaking ?? false);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  // Find best natural female voice matching preferred accent
  public getBestFemaleVoice(accent: VoiceAccent = 'us'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return null;

    let targetLangPrefix = 'en-US';
    if (accent === 'uk') targetLangPrefix = 'en-GB';
    if (accent === 'in') targetLangPrefix = 'en-IN';

    // 1. First priority: Female names in the target language
    const femaleNames = [
      'samantha',
      'victoria',
      'karen',
      'moira',
      'fiona',
      'zira',
      'veena',
      'tessa',
      'serena',
      'ava',
      'allison',
      'susan',
      'catherine',
      'female',
      'natural',
      'google',
    ];

    const targetLangVoices = voices.filter(
      (v) => v.lang.toLowerCase().replace('_', '-').startsWith(targetLangPrefix.toLowerCase())
    );

    for (const name of femaleNames) {
      const match = targetLangVoices.find((v) => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    if (targetLangVoices.length > 0) {
      return targetLangVoices[0];
    }

    // Fallback: any English female voice
    const anyEnglish = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    for (const name of femaleNames) {
      const match = anyEnglish.find((v) => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    return anyEnglish[0] || voices[0] || null;
  }

  // Text to Speech
  public speak(
    text: string,
    options: {
      rate?: number; // 0.8 for slow, 1.0 for normal, 1.2 for fast
      pitch?: number;
      accent?: VoiceAccent;
      voiceGender?: 'female' | 'male';
      onStart?: () => void;
      onBoundary?: (charIndex: number, word: string) => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (!this.synth) {
      options.onEnd?.();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.05; // Slightly warmer feminine pitch

    const matchedVoice = this.getBestFemaleVoice(options.accent || 'us');
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = options.accent === 'uk' ? 'en-GB' : options.accent === 'in' ? 'en-IN' : 'en-US';
    }

    utterance.onstart = () => {
      this.speakingState = true;
      options.onStart?.();
    };

    utterance.onboundary = (event: SpeechSynthesisEvent) => {
      if (options.onBoundary && event.charIndex !== undefined) {
        const remaining = text.substring(event.charIndex);
        const match = remaining.match(/^([a-zA-Z0-9']+)/);
        const word = match ? match[1] : '';
        options.onBoundary(event.charIndex, word);
      }
    };

    utterance.onend = () => {
      this.speakingState = false;
      this.activeUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.speakingState = false;
      this.activeUtterance = null;
      options.onError?.(e);
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      this.speakingState = false;
      options.onError?.(err);
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.speakingState = false;
    this.activeUtterance = null;
  }

  // Start Speech Recognition
  public startListening(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onEnd: () => void;
    onStart?: () => void;
    accent?: VoiceAccent;
  }): { stop: () => void } {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      callbacks.onError('Speech recognition is not supported in this browser. Please type your message.');
      return { stop: () => {} };
    }

    try {
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {
          // ignore
        }
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      
      const langMap: Record<VoiceAccent, string> = {
        us: 'en-US',
        uk: 'en-GB',
        in: 'en-IN',
      };
      this.recognition.lang = langMap[callbacks.accent || 'us'] || 'en-US';

      this.recognition.onstart = () => {
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const fullText = (finalTranscript || interimTranscript).trim();
        callbacks.onResult(fullText, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        let message = 'Speech recognition error';
        if (event.error === 'not-allowed') {
          message = 'Microphone access was denied. Please allow microphone permissions or type your response.';
        } else if (event.error === 'no-speech') {
          message = 'No speech detected. Please speak clearly into your microphone.';
        }
        callbacks.onError(message);
      };

      this.recognition.onend = () => {
        callbacks.onEnd();
      };

      this.recognition.start();

      return {
        stop: () => {
          if (this.recognition) {
            try {
              this.recognition.stop();
            } catch (e) {
              // Ignore if already stopped
            }
          }
        },
      };
    } catch (err: any) {
      callbacks.onError(err.message || 'Failed to initialize speech recognition');
      return { stop: () => {} };
    }
  }
}

export const speechService = new SpeechService();

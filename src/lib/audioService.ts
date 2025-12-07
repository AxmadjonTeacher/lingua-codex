// Audio service for playing PCM audio data from Gemini TTS
let audioContext: AudioContext | null = null;

export async function playPCM(base64Data: string): Promise<void> {
  if (!base64Data) {
    console.warn("No audio data provided");
    return;
  }

  try {
    // Create or resume AudioContext (browsers require user interaction)
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass({ sampleRate: 24000 });
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    // Decode base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Convert 16-bit PCM to float32
    const dataInt16 = new Int16Array(bytes.buffer);
    const numSamples = dataInt16.length;

    // Create audio buffer
    const buffer = audioContext.createBuffer(1, numSamples, 24000);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }

    // Play the buffer
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}

export function playBrowserTTS(text: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Browser does not support text-to-speech");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US"; // Default to English due to app context
  utterance.rate = 0.9; // Slightly slower for better clarity

  window.speechSynthesis.speak(utterance);
}

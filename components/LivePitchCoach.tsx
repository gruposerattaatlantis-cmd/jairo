
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface LivePitchCoachProps {
    onComplete: () => void;
}

// Fix: Extract helper functions for audio encoding/decoding as recommended in Gemini guidelines.
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LivePitchCoach: React.FC<LivePitchCoachProps> = ({ onComplete }) => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState("Listo para practicar");
    const [volume, setVolume] = useState(0);
    
    // Audio Context Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<Promise<any> | null>(null); // To hold the active session promise
    const nextStartTimeRef = useRef<number>(0);
    const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

    useEffect(() => {
        return () => {
            stopSession();
        };
    }, []);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    };

    const startSession = async () => {
        try {
            initAudio();
            setStatus("Conectando con tu Mentor...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Connect to Live API
            const sessionPromise = ai.live.connect({
                // Fix: Use the recommended Gemini Live model name.
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setStatus("Escuchando... Di 'Hola' para empezar.");
                        setIsActive(true);
                        
                        // Setup Audio Input
                        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        const source = ctx.createMediaStreamSource(stream);
                        const processor = ctx.createScriptProcessor(4096, 1, 1);
                        
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            
                            // Visualizer volume
                            let sum = 0;
                            for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                            setVolume(Math.sqrt(sum / inputData.length) * 100);

                            const pcmBlob = createBlob(inputData);
                            // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
                            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                        };

                        source.connect(processor);
                        processor.connect(ctx.destination);
                        
                        sourceRef.current = source;
                        processorRef.current = processor;
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        // Handle audio output from the model
                        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData) {
                            playAudio(audioData);
                        }
                        
                        // Handle interruptions
                        if (msg.serverContent?.interrupted) {
                            audioQueueRef.current.forEach(source => {
                                try { source.stop(); } catch(e) {}
                            });
                            audioQueueRef.current = [];
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onclose: () => {
                        setStatus("Sesión finalizada.");
                        setIsActive(false);
                    },
                    onerror: (e) => {
                        console.error("Live API Error", e);
                        setStatus("Error de conexión. Intenta de nuevo.");
                        setIsActive(false);
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: `Eres un experto Coach de Pitch para un ecosistema emprendedor llamado 'The Garden Method' (El Método del Jardín).
                    Tu objetivo es ayudar al usuario a pulir su "elevator pitch" de 30 segundos.
                    Metáfora: Eres un Jardinero experimentado ayudando a una semilla a crecer.
                    Estilo: Alentador, conciso, haz 1 pregunta a la vez.
                    Idioma: Español Latino.
                    Empieza pidiendo al usuario que presente brevemente su idea.`,
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    }
                }
            });

            sessionRef.current = sessionPromise;

        } catch (err) {
            console.error(err);
            setStatus("Error accediendo al micrófono.");
        }
    };

    const stopSession = () => {
        if (sessionRef.current) {
            // Close the connection explicitly when stopping
            sessionRef.current.then(session => session.close());
            sessionRef.current = null;
        }
        
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        
        setIsActive(false);
        setStatus("Sesión pausada.");
        onComplete();
    };

    const playAudio = async (base64Data: string) => {
        if (!audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        // Fix: Use standard decodeAudioData helper for gapless playback from raw PCM.
        const audioBuffer = await decodeAudioData(decode(base64Data), ctx, 24000, 1);

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        
        const currentTime = ctx.currentTime;
        // Fix: Track nextStartTime for gapless playback queue as per guidelines.
        const startTime = Math.max(currentTime, nextStartTimeRef.current);
        source.connect(ctx.destination);
        source.start(startTime);
        nextStartTimeRef.current = startTime + audioBuffer.duration;
        
        audioQueueRef.current.push(source);
        source.onended = () => {
            audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
        };
    };

    function createBlob(data: Float32Array): Blob {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        // Fix: Use standard encode helper for audio PCM data.
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000'
        };
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-garden-50 to-garden-100 rounded-3xl shadow-inner border border-garden-200">
            <div className={`relative flex items-center justify-center w-32 h-32 rounded-full mb-6 transition-all duration-500 ${isActive ? 'bg-petal-300 shadow-[0_0_30px_rgba(236,72,153,0.4)]' : 'bg-gray-200'}`}>
                {/* Visualizer Rings */}
                {isActive && (
                    <>
                        <div className="absolute w-full h-full rounded-full border-2 border-petal-500 opacity-50 animate-ping" style={{ animationDuration: '2s' }}></div>
                        <div className="absolute w-full h-full rounded-full bg-petal-400 opacity-20" style={{ transform: `scale(${1 + volume * 0.05})` }}></div>
                    </>
                )}
                <span className="material-icons text-4xl text-garden-800">
                    {isActive ? 'graphic_eq' : 'mic_off'}
                </span>
            </div>
            
            <p className="text-earth-800 font-medium mb-4 text-center">{status}</p>

            <button
                onClick={isActive ? stopSession : startSession}
                className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-garden-600 hover:bg-garden-700'
                }`}
            >
                {isActive ? 'Terminar Práctica' : 'Hablar con el Mentor'}
            </button>
            <p className="text-xs text-earth-600 mt-4 max-w-xs text-center">
                Usa Gemini Live para practicar tu pitch en tiempo real.
            </p>
        </div>
    );
};

export default LivePitchCoach;

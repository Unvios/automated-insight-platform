import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MicrophoneTestProps {
  className?: string;
}

export const MicrophoneTest: React.FC<MicrophoneTestProps> = ({ className = '' }) => {
  const { toast } = useToast();
  
  // Состояние для тестирования микрофона
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  
  // Refs для управления аудио
  const micAnalyzerRef = useRef<AnalyserNode | null>(null);
  const micAnimationRef = useRef<number | null>(null);
  const isTestingMicRef = useRef<boolean>(false);
  const lastUpdateTime = useRef<number>(0);

  // Функция для анализа уровня микрофона
  const analyzeMicLevel = (forceRun = false) => {
    if (!micAnalyzerRef.current) {
      return;
    }
    
    if (!isTestingMicRef.current && !forceRun) {
      return;
    }

    const currentTime = performance.now();
    
    // Получаем аудио данные
    const bufferLength = micAnalyzerRef.current.frequencyBinCount;
    const floatArray = new Float32Array(bufferLength);
    micAnalyzerRef.current.getFloatTimeDomainData(floatArray);
    
    // Вычисляем RMS (Root Mean Square)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const sample = floatArray[i];
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / bufferLength);
    
    // Получаем частотные данные
    const freqArray = new Uint8Array(bufferLength);
    micAnalyzerRef.current.getByteFrequencyData(freqArray);
    const freqAverage = freqArray.reduce((acc, val) => acc + val, 0) / freqArray.length;
    
    // Калибровка: вычитаем базовый шум
    const noiseFloor = 0.005;
    const calibratedRMS = Math.max(0, rms - noiseFloor);
    
    // Обработка RMS и частотных данных
    let rmsLevel = calibratedRMS * 20;
    const freqLevel = Math.max(0, freqAverage - 1) / 16;
    
    // Нелинейное усиление
    rmsLevel = Math.pow(rmsLevel, 0.6);
    
    // Комбинируем данные
    let combinedLevel = Math.max(rmsLevel * 0.95, freqLevel * 0.05);
    combinedLevel = Math.min(combinedLevel, 1.0);
    
    // Сглаживание
    const smoothedLevel = micLevel * 0.1 + combinedLevel * 0.9;
    
    // Обновляем UI только каждые 100мс
    if (currentTime - lastUpdateTime.current > 100 || forceRun) {
      setMicLevel(smoothedLevel);
      lastUpdateTime.current = currentTime;
    }
    
    if (isTestingMicRef.current || forceRun) {
      micAnimationRef.current = requestAnimationFrame(() => analyzeMicLevel());
    }
  };

  // Запуск теста микрофона
  const startMicTest = async () => {
    try {
      setMicLevel(0);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC не поддерживается в этом браузере');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const tracks = stream.getAudioTracks();
      if (!tracks[0]?.enabled || tracks[0]?.readyState !== 'live') {
        throw new Error('Микрофон недоступен');
      }
      
      setMicStream(stream);
      setMicPermission('granted');
      
      // Создаем AudioContext
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      
      analyzer.fftSize = 512;
      analyzer.smoothingTimeConstant = 0.1;
      analyzer.minDecibels = -100;
      analyzer.maxDecibels = -10;
      
      source.connect(analyzer);
      
      // Дополнительное подключение для обеспечения работы
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      micAnalyzerRef.current = analyzer;
      setIsTestingMic(true);
      isTestingMicRef.current = true;
      
      // Запуск анализа с небольшой задержкой
      setTimeout(() => {
        analyzeMicLevel(true);
      }, 100);
      
      toast({
        title: "Микрофон запущен",
        description: "Говорите в микрофон, чтобы увидеть уровень звука",
      });
      
    } catch (error) {
      setMicPermission('denied');
      setIsTestingMic(false);
      
      toast({
        title: "Ошибка доступа к микрофону",
        description: `Ошибка: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  // Остановка теста микрофона
  const stopMicTest = () => {
    setIsTestingMic(false);
    isTestingMicRef.current = false;
    setMicLevel(0);
    
    if (micAnimationRef.current) {
      cancelAnimationFrame(micAnimationRef.current);
      micAnimationRef.current = null;
    }
    
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    
    micAnalyzerRef.current = null;
    
    toast({
      title: "Тест микрофона остановлен",
      description: "Микрофон отключен",
    });
  };

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      if (micAnimationRef.current) {
        cancelAnimationFrame(micAnimationRef.current);
      }
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream]);

  return (
    <div className={`border border-slate-200 rounded-lg p-3 bg-slate-50 ${className}`}>
      <div className="flex items-stretch gap-3">
        <div className="flex-shrink-0">
          <Button 
            size="sm"
            variant={isTestingMic ? "destructive" : "outline"}
            onClick={isTestingMic ? stopMicTest : startMicTest}
          >
            {isTestingMic ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
            <div 
              className={`h-full transition-all duration-75 ${
                micLevel > 0.02 ? (
                  micLevel > 0.7 ? 'bg-green-500' : 
                  micLevel > 0.3 ? 'bg-yellow-500' : 
                  'bg-blue-500'
                ) : 'bg-gray-300'
              }`}
              style={{ width: `${Math.min(Math.max(micLevel * 100, 2), 100)}%` }}
            />
          </div>
          
          <div className="text-xs text-slate-500">
            {isTestingMic ? 
              (micLevel > 0.05 ? 
                `✅ Микрофон работает! Уровень: ${Math.round(micLevel * 100 / 5) * 5}%` : 
                '🔇 Говорите громче или проверьте микрофон'
              ) : 
              micPermission === 'denied' ? 
                '❌ Доступ к микрофону запрещен' :
                'Нажмите кнопку для проверки микрофона'
            }
          </div>
        </div>
      </div>
    </div>
  );
}; 
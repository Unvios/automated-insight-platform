import { useState, useCallback, useRef, useEffect } from 'react';
import { Room, RoomEvent, Track, LocalTrack, RemoteTrack, TrackPublication, RemoteParticipant, setLogLevel } from 'livekit-client';
import { getApiUrlWithDemo, getLivekitUrl, logApiConfig } from '@/config/api';

setLogLevel('debug');

interface AgentConfig {
  id?: string;
  name: string;
  role: string;
  model: string;
  voice: string;
  systemPrompt: string;
}

interface UseAgentTesterReturn {
  isConnected: boolean;
  isRecording: boolean;
  connectionStatus: string;
  messages: Array<{ text: string; sender: 'user' | 'bot' }>;
  connectToAgent: (config: AgentConfig) => Promise<Room>;
  disconnectFromAgent: () => Promise<void>;
  addMessage: (text: string, sender: 'user' | 'bot') => void;
}

export const useAgentTester = (): UseAgentTesterReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Отключено');
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([]);
  
  const roomRef = useRef<Room | null>(null);
  const micTrackRef = useRef<MediaStreamTrack | null>(null);
  const roomNameRef = useRef<string>('');

  // Генерируем уникальное имя комнаты
  const generateRoomName = useCallback(() => {
    return 'job-chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }, []);

  // Добавляем сообщение в чат
  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, sender }]);
  }, []);

  // Подключение к агенту
  const connectToAgent = useCallback(async (config: AgentConfig) => {
    try {
      // Логируем конфигурацию для отладки
      logApiConfig();
      
      if (roomRef.current) {
        await disconnectFromAgent();
      }

      setConnectionStatus('Подключение...');
      roomNameRef.current = generateRoomName();

      // Создаем токен для подключения
      const participantName = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

      const response = await fetch(getApiUrlWithDemo('token/generate-one'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: roomNameRef.current,
          participantName: participantName,
          metadata: JSON.stringify({
            agentId: config.id,
            agentName: config.name,
            agentRole: config.role,
            agentModel: config.model,
            agentVoice: config.voice,
            agentSystemPrompt: config.systemPrompt,
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка получения токена');
      }

      const token = await response.text();

      // Подключаемся к LiveKit
      const room = new Room();
      roomRef.current = room;

      // Слушаем события подключения участников
      room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log(`Участник подключился: ${participant.identity}`);
        addMessage(`Участник ${participant.identity} присоединился`, 'bot');
      });

      // Слушаем события отключения участников
      room.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log(`Участник вышел: ${participant.identity}`);
        addMessage(`Участник ${participant.identity} покинул разговор`, 'bot');
      });

      // Обрабатываем аудио треки от агента (как в строках 75-87 app.js)
      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: TrackPublication, participant: RemoteParticipant) => {
        if (track.kind === 'audio') {
          const audioTrack = track;
          const audioElement = audioTrack.attach(); // создаёт <audio> элемент

          audioElement.autoplay = true;
          audioElement.play().catch(console.error);

          // Добавляем элемент в DOM (скрыто)
          audioElement.style.display = 'none';
          document.body.appendChild(audioElement);

          // Удаляем элемент когда трек завершается
          track.on('ended', () => {
            if (audioElement.parentNode) {
              audioElement.parentNode.removeChild(audioElement);
            }
          });
        }
      });

      // Получаем URL LiveKit сервера из конфигурации
      const livekitUrl = getLivekitUrl();

      console.log(`Подключаемся к LiveKit: ${livekitUrl}`);

      await room.connect(livekitUrl, token);
      setConnectionStatus(`Подключено к комнате: ${roomNameRef.current}`);

      setIsConnected(true);

      addMessage('Вы подключены к агенту. Микрофон автоматически включен для голосового общения!', 'bot');

      // Автоматически включаем микрофон после подключения
      await startRecording(room);

      // Добавляем обработчик текстовых сообщений
      room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant: unknown, _, topic: string) => {
        console.log(`Получены данные от ${(participant as { identity: string }).identity}, топик: ${topic}`);

        if (topic === 'text-message') {
          try {
            const textData = JSON.parse(new TextDecoder().decode(payload));
            console.log('Получено текстовое сообщение:', textData);

            // Добавляем сообщение в чат в зависимости от типа
            if (textData.role === 'user') {
              addMessage(textData.content, 'user');
            } else if (textData.role === 'assistant') {
              addMessage(textData.content, 'bot');
            } else {
              // По умолчанию считаем сообщением от бота
              addMessage(textData.content, 'bot');
            }
          } catch (error) {
            console.error('Ошибка обработки текстового сообщения:', error);
            addMessage('Ошибка обработки сообщения', 'bot');
          }
        } else if (topic === 'chat') {
          // Обработка обычных чат сообщений
          try {
            const message = new TextDecoder().decode(payload);
            console.log('Получено чат сообщение:', message);
            addMessage(message, 'bot');
          } catch (error) {
            console.error('Ошибка обработки чат сообщения:', error);
          }
        } else {
          // Логируем неизвестные топики для отладки
          console.log(`Неизвестный топик данных: ${topic}`);
        }
      });

      return room;

    } catch (error) {
      console.error('Ошибка подключения:', error);
      setConnectionStatus('Ошибка подключения');
      addMessage('Ошибка подключения: ' + (error as Error).message, 'bot');
      throw error;
    }
  }, [generateRoomName, addMessage]);

  // Включение записи микрофона
  const startRecording = useCallback(async (room: Room) => {
    try {
      // Получаем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const micTrack = stream.getAudioTracks()[0];
      micTrackRef.current = micTrack;

      // Публикуем аудио-трек в комнату
      await room.localParticipant.publishTrack(micTrack, {
        name: 'mic-audio',
      });

      setIsRecording(true);
      addMessage('Микрофон включён. Говорите!', 'bot');

    } catch (error) {
      console.error('Ошибка работы с микрофоном:', error);
      addMessage('Ошибка работы с микрофоном: ' + (error as Error).message, 'bot');
    }
  }, [addMessage]);

  // Отключение от агента
  const disconnectFromAgent = useCallback(async () => {
    if (roomRef.current) {
      // Останавливаем запись если активна
      if (micTrackRef.current) {
        micTrackRef.current.stop();
        micTrackRef.current = null;
      }

      await roomRef.current.disconnect();
      roomRef.current = null;
      roomNameRef.current = '';

      setIsConnected(false);
      setIsRecording(false);
      setConnectionStatus('Отключено');
      addMessage('Вы отключены от агента.', 'bot');

      // Удаляем все аудио элементы
      const audioElements = document.querySelectorAll('audio[data-livekit-track]');
      audioElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    }
  }, [addMessage]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        disconnectFromAgent();
      }
    };
  }, [disconnectFromAgent]);

  return {
    isConnected,
    isRecording,
    connectionStatus,
    messages,
    connectToAgent,
    disconnectFromAgent,
    addMessage,
  };
}; 
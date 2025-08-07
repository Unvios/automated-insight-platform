import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, Settings, Bot, MessageSquare, Mic, MicOff, Phone, PhoneOff, Volume2, Brain, Volume2 as Volume2Icon, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAgentTester } from '@/hooks/useAgentTester';
import { getApiUrl } from '@/config/api';

// API функция для получения агента
const fetchAgent = async (id: string) => {
  const response = await fetch(getApiUrl('agents/find-one-latest'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agentId: id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch agent');
  }
  
  return response.json();
};

// Интерфейс для обновления агента
interface UpdateAgentData {
  name: string;
  role: string;
  model: string;
  voice: string;
  systemPrompt: string;
  ssmlEnabled?: boolean;
  ssmlInstructions?: string;
  vadConfigEnabled?: boolean;
  vadConfig?: {
    vadMinSpeechDuration?: number;
    vadMinSilenceDuration?: number;
    vadPrefixPaddingDuration?: number;
    vadMaxBufferedSpeech?: number;
    vadActivationThreshold?: number;
    vadForceCPU?: boolean;
  };
}

// API функция для обновления агента
const updateAgent = async (id: string, agentData: UpdateAgentData): Promise<unknown> => {
  const response = await fetch(getApiUrl('agents/create-one'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agentId: id,
      ...agentData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const AgentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [agent, setAgent] = useState<{
    id: string;
    name: string;
    role: string;
    status: string;
    version: number;
    model?: string;
    systemPrompt?: string;
    voice?: string;
    ssmlEnabled?: boolean;
    ssmlInstructions?: string;
    vadConfigEnabled?: boolean;
    vadConfig?: {
      vadMinSpeechDuration?: number;
      vadMinSilenceDuration?: number;
      vadPrefixPaddingDuration?: number;
      vadMaxBufferedSpeech?: number;
      vadActivationThreshold?: number;
      vadForceCPU?: boolean;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для тестирования
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true); // По умолчанию включен
  const [functionsExpanded, setFunctionsExpanded] = useState(false); // По умолчанию свернут

  // Список доступных функций LLM
  const availableTools = [
    {
      name: 'findCustomer',
      icon: '🔍',
      description: 'Поиск клиента по номеру телефона. Возвращает информацию о клиенте если найден.',
      example: '[[findCustomer]]'
    },
    {
      name: 'getCustomerQuestions',
      icon: '❓',
      description: 'Получение списка вопросов для подбора подходящих вакансий клиенту.',
      example: '[[getCustomerQuestions]]'
    },
    {
      name: 'getCustomerVacancies',
      icon: '💼',
      description: 'Получение подходящих вакансий для клиента на основе его ответов на вопросы.',
      example: '[[getCustomerVacancies]]'
    }
  ];

  // Используем хук для тестирования агента
  const { 
    isConnected, 
    isRecording, 
    connectionStatus, 
    messages, 
    connectToAgent, 
    disconnectFromAgent 
  } = useAgentTester();

  // Ref для прокрутки чата в конец
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Компонент для отображения статистики сообщения
  const MessageStatistics = ({ performanceStats, toolCalls }: { 
    performanceStats?: { sttDurationMs?: number; llmDurationMs?: number; ttsDurationMs?: number }; 
    toolCalls?: string[] 
  }) => {
    if (!performanceStats && (!toolCalls || toolCalls.length === 0)) return null;

    return (
      <div className="mt-2 p-2 bg-emerald-200 rounded-md text-xs">
        <div className="grid grid-cols-2 gap-2">
          {performanceStats?.sttDurationMs && (
            <div className="flex items-center space-x-1">
              <Mic className="h-3 w-3 text-blue-600" />
              <span className="text-slate-600">STT:</span>
              <span className="text-slate-600">{performanceStats.sttDurationMs}ms</span>
            </div>
          )}
          {performanceStats?.llmDurationMs && (
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3 text-green-600" />
              <span className="text-slate-600">LLM:</span>
              <span className="text-slate-600">{performanceStats.llmDurationMs}ms</span>
            </div>
          )}
          {performanceStats?.ttsDurationMs && (
            <div className="flex items-center space-x-1">
              <Volume2Icon className="h-3 w-3 text-purple-600" />
              <span className="text-slate-600">TTS:</span>
              <span className="text-slate-600">{performanceStats.ttsDurationMs}ms</span>
            </div>
          )}
          {toolCalls && toolCalls.length > 0 && (
            <div className="flex items-center space-x-1 col-span-2">
              <Wrench className="h-3 w-3 text-orange-600" />
              <span className="text-slate-600">Tools:</span>
              <span className="text-slate-600">{toolCalls.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const voices = [
    { id: 'Nec_24000', name: 'Nec 24000' },
    { id: 'Nec_8000', name: 'Nec 8000' },
    { id: 'Bys_24000', name: 'Bys 24000' },
    { id: 'Bys_8000', name: 'Bys 8000' }
  ];

  const models = [
    { id: 'openai/gpt-4.1-mini', name: 'openai/gpt-4.1-mini', isFree: false },
    { id: 'openai/gpt-4o-mini', name: 'openai/gpt-4o-mini', isFree: false },
    { id: 'openai/gpt-4o-mini-2024-07-18', name: 'openai/gpt-4o-mini-2024-07-18', isFree: false },
    { id: 'openai/o4-mini', name: 'openai/o4-mini', isFree: false },
    { id: 'openai/o3-mini', name: 'openai/o3-mini', isFree: false },
    { id: 'anthropic/claude-3.5-sonnet', name: 'anthropic/claude-3.5-sonnet', isFree: false },
    { id: 'anthropic/claude-sonnet-4', name: 'anthropic/claude-sonnet-4', isFree: false },
    { id: 'anthropic/claude-opus-4', name: 'anthropic/claude-opus-4', isFree: false },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'FREE: deepseek/deepseek-chat-v3-0324:free', isFree: true },
    { id: 'deepseek/deepseek-chat-v3-0324', name: 'deepseek/deepseek-chat-v3-0324', isFree: false },
    { id: 'deepseek/deepseek-r1-0528', name: 'deepseek/deepseek-r1-0528', isFree: false },
    { id: 'google/gemini-2.5-pro-exp-03-25', name: 'FREE: google/gemini-2.5-pro-exp-03-25', isFree: true },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'FREE: google/gemini-2.0-flash-exp:free', isFree: true },
    { id: 'google/gemini-2.5-flash-lite-preview-06-17', name: 'google/gemini-2.5-flash-lite-preview-06-17', isFree: false },
    { id: 'google/gemini-flash-1.5', name: 'google/gemini-flash-1.5', isFree: false },
    { id: 'google/gemini-2.0-flash-lite-001', name: 'google/gemini-2.0-flash-lite-001', isFree: false },
    { id: 'google/gemini-2.5-flash-lite', name: 'google/gemini-2.5-flash-lite', isFree: false },
    { id: 'x-ai/grok-3-mini-beta', name: 'x-ai/grok-3-mini-beta', isFree: false },
    { id: 'x-ai/grok-3-mini', name: 'x-ai/grok-3-mini', isFree: false },
    { id: 'mistralai/ministral-8b', name: 'mistralai/ministral-8b', isFree: false },
    { id: 'microsoft/phi-3.5-mini-128k-instruct', name: 'microsoft/phi-3.5-mini-128k-instruct', isFree: false },
    { id: 'minimax/minimax-m1', name: 'minimax/minimax-m1', isFree: false },
    { id: 'qwen/qwen3-coder:free', name: 'FREE: qwen/qwen3-coder:free', isFree: true },
    { id: 'qwen/qwen3-4b:free', name: 'FREE: qwen/qwen3-4b:free', isFree: true },
    { id: 'qwen/qwen3-235b-a22b:free', name: 'FREE: qwen/qwen3-235b-a22b:free', isFree: true },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'FREE: mistralai/mistral-small-3.1-24b-instruct:free', isFree: true },
    { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'FREE: mistralai/mistral-small-3.2-24b-instruct:free', isFree: true },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'FREE: mistralai/mistral-7b-instruct:free', isFree: true },
    { id: 'mistralai/devstral-small-2505:free', name: 'FREE: mistralai/devstral-small-2505:free', isFree: true },
    { id: 'moonshotai/kimi-k2:free', name: 'FREE: moonshotai/kimi-k2:free', isFree: true },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'FREE: meta-llama/llama-3.3-70b-instruct:free', isFree: true },
  ];

  // Состояние для настроек
  const [settings, setSettings] = useState({
    name: '',
    model: 'openai/gpt-4.1-mini',
    systemPrompt: '',
    role: '',
    voice: 'Bys_24000',
    ssmlEnabled: false,
    ssmlInstructions: 'Используй SSML'
  });

  // VAD конфигурация как строки для формы
  const [vadConfig, setVadConfig] = useState({
    vadMinSpeechDuration: '200',
    vadMinSilenceDuration: '500',
    vadPrefixPaddingDuration: '50',
    vadMaxBufferedSpeech: '30000',
    vadActivationThreshold: '0.2',
    vadForceCPU: true,
  });
  
  const [vadConfigEnabled, setVadConfigEnabled] = useState(false);

  // Состояние фильтра для бесплатных моделей
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  // Функция фильтрации моделей
  const filteredModels = showOnlyFree ? models.filter(model => model.isFree) : models;

  // Эффект для автоматической смены модели при фильтрации
  useEffect(() => {
    if (showOnlyFree && !filteredModels.some(model => model.id === settings.model)) {
      // Если текущая модель не входит в отфильтрованный список, выбираем первую доступную
      if (filteredModels.length > 0) {
        setSettings(prev => ({...prev, model: filteredModels[0].id}));
      }
    }
  }, [showOnlyFree, settings.model]);

  useEffect(() => {
    const loadAgent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const agentData = await fetchAgent(id);
        setAgent(agentData);
        
        // Загружаем настройки агента
        setSettings({
          name: agentData.name || '',
          model: agentData.model || 'openai/gpt-4.1-mini',
          systemPrompt: agentData.systemPrompt || '',
          role: agentData.role || '',
          voice: agentData.voice || 'Bys_24000',
          ssmlEnabled: agentData.ssmlEnabled ?? true,
          ssmlInstructions: agentData.ssmlInstructions
        });
        
        // Загружаем VAD enabled состояние
        setVadConfigEnabled(agentData.vadConfigEnabled ?? false);
        
        // Загружаем VAD конфигурацию если она есть
        if (agentData.vadConfig) {
          setVadConfig({
            vadMinSpeechDuration: agentData.vadConfig.vadMinSpeechDuration?.toString() || vadConfig.vadMinSpeechDuration,
            vadMinSilenceDuration: agentData.vadConfig.vadMinSilenceDuration?.toString() || vadConfig.vadMinSilenceDuration,
            vadPrefixPaddingDuration: agentData.vadConfig.vadPrefixPaddingDuration?.toString() || vadConfig.vadPrefixPaddingDuration,
            vadMaxBufferedSpeech: agentData.vadConfig.vadMaxBufferedSpeech?.toString() || vadConfig.vadMaxBufferedSpeech,
            vadActivationThreshold: agentData.vadConfig.vadActivationThreshold?.toString() || vadConfig.vadActivationThreshold,
            vadForceCPU: agentData.vadConfig.vadForceCPU || vadConfig.vadForceCPU,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [id]);

  const handleSendMessage = async () => {
    if (!testMessage.trim()) return;

    const userMessage = testMessage;
    setTestMessage('');
    setIsLoadingResponse(true);

    try {
      // Здесь будет API вызов для отправки сообщения агенту
      // Пока что симулируем ответ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = `Это тестовый ответ от агента "${agent?.name}" на сообщение: "${userMessage}". Агент настроен на роль: ${settings.role}`;
      
      setTestResponse(mockResponse);
    } catch (err) {
      setTestResponse('Ошибка при получении ответа от агента');
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Автоматическая прокрутка чата в конец при новых сообщениях
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCall = async () => {
    if (isConnected) {
      // Если уже подключены, отключаемся
      try {
        await disconnectFromAgent();

        toast({
          title: "Отключено",
          description: "Соединение с агентом разорвано",
        });
      } catch (error) {
        toast({
          title: "Ошибка отключения",
          description: "Не удалось отключиться от агента",
          variant: "destructive"
        });
      }
    } else {
      try {
        await connectToAgent({
          id: agent.id,
          name: settings.name,
          role: settings.role,
          model: settings.model,
          voice: settings.voice,
          systemPrompt: settings.systemPrompt,
          ssmlEnabled: settings.ssmlEnabled,
          ssmlInstructions: settings.ssmlInstructions,
          ...(vadConfigEnabled && {
            vadMinSpeechDuration: vadConfig.vadMinSpeechDuration ? parseInt(vadConfig.vadMinSpeechDuration) : undefined,
            vadMinSilenceDuration: vadConfig.vadMinSilenceDuration ? parseInt(vadConfig.vadMinSilenceDuration) : undefined,
            vadPrefixPaddingDuration: vadConfig.vadPrefixPaddingDuration ? parseInt(vadConfig.vadPrefixPaddingDuration) : undefined,
            vadMaxBufferedSpeech: vadConfig.vadMaxBufferedSpeech ? parseInt(vadConfig.vadMaxBufferedSpeech) : undefined,
            vadActivationThreshold: vadConfig.vadActivationThreshold ? parseFloat(vadConfig.vadActivationThreshold) : undefined,
            vadForceCPU: vadConfig.vadForceCPU,
          }),
        });

        toast({
          title: "Подключение к агенту",
          description: "Соединение с агентом установлено. Микрофон включен автоматически.",
        });
      } catch (error) {
        toast({
          title: "Ошибка подключения",
          description: "Не удалось подключиться к агенту",
          variant: "destructive"
        });
      }
    }
  };

  const handleListenVoice = () => {
    if (settings.voice) {
      toast({
        title: "Voice Preview",
        description: `Предпросмотр голоса ${voices.find(v => v.id === settings.voice)?.name}`,
      });
    } else {
      toast({
        title: "No Voice Selected",
        description: "Пожалуйста, выберите голос для предпросмотра.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!id) return;
    
    setIsSaving(true);
    
    try {
      // Подготавливаем данные для API
      const agentData: UpdateAgentData = {
        name: settings.name,
        role: settings.role,
        model: settings.model,
        voice: settings.voice,
        systemPrompt: settings.systemPrompt,
        ssmlEnabled: settings.ssmlEnabled,
        ssmlInstructions: settings.ssmlInstructions,
        vadConfigEnabled: vadConfigEnabled,
      };

      // Добавляем VAD конфигурацию только если включен vadConfigEnabled и есть заполненные поля
      if (vadConfigEnabled) {
        const hasVadConfig = vadConfig.vadMinSpeechDuration !== undefined || 
                             vadConfig.vadMinSilenceDuration !== undefined || 
                             vadConfig.vadPrefixPaddingDuration !== undefined || 
                             vadConfig.vadMaxBufferedSpeech !== undefined || 
                             vadConfig.vadActivationThreshold !== undefined || 
                             vadConfig.vadForceCPU !== undefined;
        
        if (hasVadConfig) {
          agentData.vadConfig = {};
          
          if (vadConfig.vadMinSpeechDuration) {
            agentData.vadConfig.vadMinSpeechDuration = Number(vadConfig.vadMinSpeechDuration);
          }
          if (vadConfig.vadMinSilenceDuration) {
            agentData.vadConfig.vadMinSilenceDuration = Number(vadConfig.vadMinSilenceDuration);
          }
          if (vadConfig.vadPrefixPaddingDuration) {
            agentData.vadConfig.vadPrefixPaddingDuration = Number(vadConfig.vadPrefixPaddingDuration);
          }
          if (vadConfig.vadMaxBufferedSpeech) {
            agentData.vadConfig.vadMaxBufferedSpeech = Number(vadConfig.vadMaxBufferedSpeech);
          }
          if (vadConfig.vadActivationThreshold) {
            agentData.vadConfig.vadActivationThreshold = Number(vadConfig.vadActivationThreshold);
          }
          if (vadConfig.vadForceCPU !== undefined) {
            agentData.vadConfig.vadForceCPU = vadConfig.vadForceCPU;
          }
        }
      }

      await updateAgent(id, agentData);

      toast({
        title: "Настройки сохранены",
        description: "Настройки агента успешно обновлены",
      });
    } catch (error) {
      console.error('Ошибка сохранения агента:', error);
      toast({
        title: "Ошибка сохранения",
        description: error instanceof Error ? error.message : "Не удалось сохранить настройки агента",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Загрузка агента...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">Ошибка загрузки агента: {error}</p>
                <Button onClick={() => navigate('/agents')}>
                  Вернуться к списку агентов
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/agents/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к агенту
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Тестирование агента: {agent?.name}</h1>
              <p className="text-slate-600">Тестирование и настройка настроек агента</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Configuration */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <Label htmlFor="name">Имя агента</Label>
                  <Input 
                    id="name" 
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                    placeholder="Введите имя агента"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Роль/Специализация</Label>
                  <Textarea 
                    id="role" 
                    value={settings.role}
                    onChange={(e) => setSettings({...settings, role: e.target.value})}
                    placeholder="Опишите роль, обязанности и области знаний агента в деталях" 
                  />
                </div>

                <div>
                  <Label htmlFor="model">Модель AI</Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="freeOnly" 
                      checked={showOnlyFree}
                      onCheckedChange={(checked) => setShowOnlyFree(!!checked)}
                    />
                    <Label htmlFor="freeOnly" className="text-sm font-normal cursor-pointer">
                      Показать только бесплатные модели
                    </Label>
                  </div>
                  <Select value={settings.model} onValueChange={(value) => setSettings({...settings, model: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите модель AI" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="voice">Голос</Label>
                  <div className="flex space-x-2">
                    <Select value={settings.voice} onValueChange={(value) => setSettings({...settings, voice: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите голос" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={handleListenVoice}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>



                {/* Блок с доступными функциями LLM */}
                <div className="mb-6">
                  <div 
                    className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setFunctionsExpanded(!functionsExpanded)}
                  >
                    <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                      <span className="text-base">🛠️</span>
                      Доступные функции LLM
                    </h3>
                    <span className={`text-blue-600 transition-transform duration-200 ${functionsExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                  
                  {functionsExpanded && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>Как использовать:</strong> В системном промпте указывайте функции в двойных квадратных скобках [[tool]].
                      </p>
                      
                      <div className="p-3 bg-gray-100 rounded border-l-4 border-blue-500 mb-4">
                        <p className="text-xs text-gray-600">
                          <strong>Пример:</strong> "Задаем клиенту необходимые вопросы для подбора подходящих ему вакансий [[getCustomerQuestions]]."
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTools.map((tool, index) => (
                          <div key={index} className="bg-white p-3 rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-1">
                                <span>{tool.icon}</span>
                                {tool.name}
                              </h4>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(tool.example);
                                  toast({
                                    title: "Скопировано!",
                                    description: `${tool.example} скопирован в буфер обмена`,
                                    duration: 2000,
                                  });
                                }}
                                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                                title="Копировать в буфер обмена"
                              >
                                📋
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {tool.description}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                              Пример: {tool.example}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="instructions">Системные инструкции</Label>
                  <Textarea 
                    id="instructions" 
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                    placeholder="Укажите конкретные инструкции о том, как должен вести себя и отвечать агент"
                    className="min-h-[200px]"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="ssmlEnabled" 
                      checked={settings.ssmlEnabled}
                      onCheckedChange={(checked) => setSettings({...settings, ssmlEnabled: !!checked})}
                    />
                    <Label htmlFor="ssmlEnabled" className="text-sm font-normal cursor-pointer">
                      Использовать SSML (Speech Synthesis Markup Language)
                    </Label>
                  </div>
                  {settings.ssmlEnabled && (
                    <div>
                      <Label htmlFor="ssmlInstructions">Инструкции SSML</Label>
                      <Textarea 
                        id="ssmlInstructions" 
                        value={settings.ssmlInstructions}
                        onChange={(e) => setSettings({...settings, ssmlInstructions: e.target.value})}
                        placeholder="Укажите конкретные инструкции для синтеза речи"
                        className="min-h-[100px]"
                      />
                    </div>
                  )}
                </div>

                {/* VAD Configuration */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox 
                      id="vadConfigEnabled" 
                      checked={vadConfigEnabled}
                      onCheckedChange={(checked) => setVadConfigEnabled(!!checked)}
                    />
                    <Label htmlFor="vadConfigEnabled" className="text-sm font-normal cursor-pointer">
                      Использовать VAD Configuration (Voice Activity Detection)
                    </Label>
                  </div>
                  
                  {vadConfigEnabled && (
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-3">Настройки VAD</h3>
                      <p className="text-sm text-slate-600 mb-4">Настройки определения активности голоса (Voice Activity Detection)</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vadMinSpeechDuration">Минимальная длительность речи (мс)</Label>
                          <Input 
                            id="vadMinSpeechDuration" 
                            type="number"
                            value={vadConfig.vadMinSpeechDuration}
                            onChange={(e) => setVadConfig({...vadConfig, vadMinSpeechDuration: e.target.value})}
                            placeholder="200"
                          />
                          <p className="text-xs text-slate-500 mt-1">Минимальная длительность речи для того чтобы считать это началом нового сегмента, мс</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="vadMinSilenceDuration">Минимальная длительность тишины (мс)</Label>
                          <Input 
                            id="vadMinSilenceDuration" 
                            type="number"
                            value={vadConfig.vadMinSilenceDuration}
                            onChange={(e) => setVadConfig({...vadConfig, vadMinSilenceDuration: e.target.value})}
                            placeholder="500"
                          />
                          <p className="text-xs text-slate-500 mt-1">Время тишины, после которого сегмент речи будет считаться завершенным, мс</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="vadPrefixPaddingDuration">Длительность паузы (мс)</Label>
                          <Input 
                            id="vadPrefixPaddingDuration" 
                            type="number"
                            value={vadConfig.vadPrefixPaddingDuration}
                            onChange={(e) => setVadConfig({...vadConfig, vadPrefixPaddingDuration: e.target.value})}
                            placeholder="50"
                          />
                          <p className="text-xs text-slate-500 mt-1">Длительность паузы, добавляемого в начало каждого сегмента речи, мс</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="vadMaxBufferedSpeech">Максимальная длительность речи (мс)</Label>
                          <Input 
                            id="vadMaxBufferedSpeech" 
                            type="number"
                            value={vadConfig.vadMaxBufferedSpeech}
                            onChange={(e) => setVadConfig({...vadConfig, vadMaxBufferedSpeech: e.target.value})}
                            placeholder="30000"
                          />
                          <p className="text-xs text-slate-500 mt-1">Максимальная длительность речи которая будет храниться в буффере, мс</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="vadActivationThreshold">Порог активации</Label>
                          <Input 
                            id="vadActivationThreshold" 
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={vadConfig.vadActivationThreshold}
                            onChange={(e) => setVadConfig({...vadConfig, vadActivationThreshold: e.target.value})}
                            placeholder="0.2"
                          />
                          <p className="text-xs text-slate-500 mt-1">Порог обнаружения голоса, 0.0 - 1.0</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="grid grid-cols-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="vadForceCPU" 
                                checked={vadConfig.vadForceCPU ?? false}
                                onCheckedChange={(checked) => setVadConfig({...vadConfig, vadForceCPU: !!checked})}
                              />
                              <Label htmlFor="vadForceCPU" className="text-sm font-normal cursor-pointer">
                                Принудительное использование CPU
                              </Label>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Принудительное использование CPU для обработки</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate(`/agents/${id}`)}>
                    Отмена
                  </Button>
                  <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                    <Settings className="h-4 w-4 mr-2" />
                    {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Agent */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Тестирование агента</h3>
                    <p className="text-slate-600">Тестирование настроек агента с голосом или текстом</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-statistics-test"
                      checked={showStatistics}
                      onCheckedChange={(checked) => setShowStatistics(checked as boolean)}
                    />
                    <label htmlFor="show-statistics-test" className="text-sm text-slate-600 cursor-pointer">
                      Показать статистику
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  <Button 
                    onClick={handleCall} 
                    className={`w-full ${isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {isConnected ? <PhoneOff className="h-4 w-4 mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                    {isConnected ? 'Завершить тест' : 'Начать тест'}
                    {isRecording && <Mic className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
                
                {/* Статус подключения */}
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
                  isConnected 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  Статус: {connectionStatus}
                  {isRecording && (
                    <span className="ml-2 inline-flex items-center">
                      <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Запись
                    </span>
                  )}
                </div>

                <div ref={chatContainerRef} className="border border-slate-200 rounded-lg p-4 h-64 mb-4 overflow-y-auto bg-slate-50">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-lg max-w-xs ${
                            (message.sender === 'user')
                              ? 'bg-blue-600 text-white'
                              : (message.sender === 'error' ? 'bg-red-400 text-slate-700' : 'bg-slate-200 text-gray-900')
                          }`}>
                            {message.text}
                            {showStatistics && <MessageStatistics performanceStats={message.performanceStats} toolCalls={message.toolCalls} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : testResponse ? (
                    <div className="space-y-4">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs">
                          {testMessage}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 p-3 rounded-lg max-w-xs">
                          {testResponse}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      {isConnected 
                        ? 'Подключено к агенту. Говорите в микрофон для общения.' 
                        : 'Нажмите "Тестировать агента" для начала голосового общения или отправьте текстовое сообщение'
                      }
                    </div>
                  )}
                </div>

                {/* <div className="flex space-x-2">
                  <Input
                    placeholder="Type a test message..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isConnected}
                  />
                  <Button onClick={handleSendMessage} disabled={!testMessage.trim() || isConnected}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentEdit; 
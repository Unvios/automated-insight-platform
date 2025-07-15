import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Settings, Bot, MessageSquare, Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';
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

const TestAgent = () => {
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
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для тестирования
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const voices = [
    { id: 'Nec_24000', name: 'Nec 24000' },
    { id: 'Nec_8000', name: 'Nec 8000' },
    { id: 'Bys_24000', name: 'Bys 24000' },
    { id: 'Bys_8000', name: 'Bys 8000' }
  ];

  const models = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4 Mini' },
    { id: 'deepseek/deepseek-chat-v3-0324:free', name: 'FREE: DeepSeek Chat v3' }
  ];

  // Состояние для настроек
  const [settings, setSettings] = useState({
    name: '',
    model: 'gpt-4',
    systemPrompt: '',
    role: '',
    voice: 'Bys_24000',
  });

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
          model: agentData.model || 'gpt-4',
          systemPrompt: agentData.systemPrompt || '',
          role: agentData.role || '',
          voice: agentData.voice || 'Bys_24000',
        });
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
        description: `Playing preview of ${voices.find(v => v.id === settings.voice)?.name}`,
      });
    } else {
      toast({
        title: "No Voice Selected",
        description: "Please select a voice first to preview it.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!id) return;
    
    setIsSaving(true);
    
    try {
      // Подготавливаем данные для API
      const agentData = {
        name: settings.name,
        role: settings.role,
        model: settings.model,
        voice: settings.voice,
        systemPrompt: settings.systemPrompt,
      };

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
              Back to Agent
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Test Agent: {agent?.name}</h1>
              <p className="text-slate-600">Test and configure your agent settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Configuration */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <Label htmlFor="name">Agent Name</Label>
                  <Input 
                    id="name" 
                    value={agent?.name || ''}
                    disabled
                    className="bg-slate-50"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role/Specialization</Label>
                  <Textarea 
                    id="role" 
                    value={settings.role}
                    onChange={(e) => setSettings({...settings, role: e.target.value})}
                    placeholder="Describe the agent's role, responsibilities, and areas of expertise in detail" 
                  />
                </div>

                <div>
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={settings.model} onValueChange={(value) => setSettings({...settings, model: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="voice">Voice</Label>
                  <div className="flex space-x-2">
                    <Select value={settings.voice} onValueChange={(value) => setSettings({...settings, voice: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select voice" />
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



                <div>
                  <Label htmlFor="instructions">System Instructions</Label>
                  <Textarea 
                    id="instructions" 
                    value={settings.systemPrompt}
                    onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                    placeholder="Provide specific instructions for how the agent should behave and respond"
                    className="min-h-[200px]"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate(`/agents/${id}`)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                    <Settings className="h-4 w-4 mr-2" />
                    {isSaving ? 'Сохранение...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Agent */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Agent</h3>
                <p className="text-slate-600 mb-4">Test your agent configuration with voice or text</p>
                
                <div className="space-y-4 mb-4">
                  <Button 
                    onClick={handleCall} 
                    className={`w-full ${isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {isConnected ? <PhoneOff className="h-4 w-4 mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                    {isConnected ? 'Завершить тест' : 'Тестировать агента'}
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
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {message.text}
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

                <div className="flex space-x-2">
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestAgent; 
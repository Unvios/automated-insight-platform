import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Bot, Send, Volume2, Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAgentTester } from '@/hooks/useAgentTester';
import { getApiUrl } from '@/config/api';

// Интерфейс для создания агента
interface CreateAgentData {
  name: string;
  role: string;
  model: string;
  voice: string;
  systemPrompt: string;
}

// Функция для создания агента через API
const createAgent = async (agentData: CreateAgentData): Promise<unknown> => {
  const response = await fetch(getApiUrl('agents/create-one'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  // const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('');
  
  // Используем хук для тестирования агента
  const { 
    isConnected, 
    isRecording, 
    connectionStatus, 
    messages, 
    connectToAgent, 
    disconnectFromAgent 
  } = useAgentTester();

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

  const knowledgeBases = [
    { id: 'general', name: 'General Knowledge Base' },
    { id: 'sales', name: 'Sales Training Materials' },
    { id: 'support', name: 'Support Documentation' },
    { id: 'hr', name: 'HR Policies & Procedures' }
  ];

  // Системный промпт по умолчанию из app.js
  const defaultSystemPrompt = `Говори только по делу, не многословно. Но проговаривай промежуточные результаты, в том числе результаты работы tools. Чтобы не было больших пауз в разговоре.

Твоя задача найти клиента, в битриксе при обращении к тебе (getBitrixContact).
    Если клиент не найден, то ты должен добавить его и заявку для него в битрикс (addContactWithDeal).
        Перед тем как создать клиента в битриксе, клиент должен подтвердить, что ты правильно записал его имя, фамилию и телефон. Обязательно уточни это у клиента, после того как получил от него имя, фамилию и номер телефона.
Если клиент найден, то ты должен найти заявку клиента, оставленную в битриксе (getBitrixDeal).
    Если заявка не найдена, то ты должен добавить заявку для клиента в битрикс (addDeal).

Затем, ты должен задать кандидату необходимые вопросы для подбора вакансии (getCandidateProfileQuestions).
После того как ответы на вопросы получены, то должен подобрать подходящие вакансии (getCandidateVacancies).
После того как вакансии подобраны, ты должен предложить кандидату выбрать одну из них.
Если кандидат выбрал вакансию, то ты должен подтвердить его заявку на вакансию (applyCandidateVacancy).`;

  const [agentConfig, setAgentConfig] = useState({
    name: 'Оптимус Прайм',
    role: 'Ты HR-менеджер, который проводит собеседования. Мужчина.',
    model: 'openai/gpt-4.1-mini',
    voice: 'Bys_24000',
    systemPrompt: defaultSystemPrompt,
    maxTokens: 500
  });

  // Состояние фильтра для бесплатных моделей
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  // Функция фильтрации моделей
  const filteredModels = showOnlyFree ? models.filter(model => model.isFree) : models;

  // Эффект для автоматической смены модели при фильтрации
  useEffect(() => {
    if (showOnlyFree && !filteredModels.some(model => model.id === agentConfig.model)) {
      // Если текущая модель не входит в отфильтрованный список, выбираем первую доступную
      if (filteredModels.length > 0) {
        setAgentConfig(prev => ({...prev, model: filteredModels[0].id}));
      }
    }
  }, [showOnlyFree, agentConfig.model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Подготавливаем данные для API
      const agentData: CreateAgentData = {
        name: agentConfig.name,
        role: agentConfig.role,
        model: agentConfig.model,
        voice: agentConfig.voice,
        systemPrompt: agentConfig.systemPrompt,
      };

      await createAgent(agentData);

      toast({
        title: "Агент создан",
        description: `Агент "${agentConfig.name}" успешно создан!`,
      });
      
      // Перенаправляем на страницу агентов
      navigate('/agents');
    } catch (error) {
      console.error('Ошибка создания агента:', error);
      toast({
        title: "Ошибка создания агента",
        description: error instanceof Error ? error.message : "Не удалось создать агента",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTestAgent = () => {
    // if (testMessage.trim()) {
    //   setTestResponse(`This is a test response from your AI agent using ${
    //     agentConfig.voice ? voices.find(v => v.id === agentConfig.voice)?.name : 'default voice'
    //   }. Original message: "${testMessage}"`);
    // }
  };

  const handleListenVoice = () => {
    if (agentConfig.voice) {
      toast({
        title: "Voice Preview",
        description: `Playing preview of ${voices.find(v => v.id === agentConfig.voice)?.name}`,
      });
    } else {
      toast({
        title: "No Voice Selected",
        description: "Please select a voice first to preview it.",
        variant: "destructive"
      });
    }
  };

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
        await connectToAgent(agentConfig);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/agents')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create AI Agent</h1>
              <p className="text-slate-600">Configure your intelligent assistant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agent Configuration */}
            <div>
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <Label htmlFor="name">Agent Name</Label>
                  <Input 
                    id="name" 
                    value={agentConfig.name}
                    onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
                    placeholder="Enter agent name" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role/Specialization</Label>
                  <Textarea 
                    id="role" 
                    value={agentConfig.role}
                    onChange={(e) => setAgentConfig({...agentConfig, role: e.target.value})}
                    placeholder="Describe the agent's role, responsibilities, and areas of expertise in detail" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="model">AI Model</Label>
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
                  <Select value={agentConfig.model} onValueChange={(value) => setAgentConfig({...agentConfig, model: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
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
                  <Label htmlFor="voice">Voice</Label>
                  <div className="flex space-x-2">
                    <Select value={agentConfig.voice} onValueChange={(value) => setAgentConfig({...agentConfig, voice: value})}>
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
                    value={agentConfig.systemPrompt}
                    onChange={(e) => setAgentConfig({...agentConfig, systemPrompt: e.target.value})}
                    placeholder="Provide specific instructions for how the agent should behave and respond"
                    className="min-h-[200px]"
                  />
                </div>

                {/* <div>
                  <Label htmlFor="max-tokens">Max Response Length</Label>
                  <Input 
                    id="max-tokens" 
                    type="number" 
                    value={agentConfig.maxTokens}
                    onChange={(e) => setAgentConfig({...agentConfig, maxTokens: parseInt(e.target.value) || 500})}
                    placeholder="500" 
                  />
                </div> */}

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/agents')}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isCreating}>
                    <Bot className="h-4 w-4 mr-2" />
                    {isCreating ? 'Создание...' : 'Create Agent'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Test Agent */}
            <div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Test Agent</h3>
                <p className="text-slate-600 mb-4">Test your agent configuration before creating it</p>
                
                <div className="space-y-4 mb-4">
                  {/*<div>
                    <Label>Knowledge Base</Label>
                    <Select value={selectedKnowledgeBase} onValueChange={setSelectedKnowledgeBase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select knowledge base" />
                      </SelectTrigger>
                      <SelectContent>
                        {knowledgeBases.map((kb) => (
                          <SelectItem key={kb.id} value={kb.id}>
                            {kb.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>*/}
                  
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

                <div className="border border-slate-200 rounded-lg p-4 h-64 mb-4 overflow-y-auto bg-slate-50">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`p-3 rounded-lg max-w-xs ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-900'
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
                        <div className="bg-white border border-slate-200 p-3 rounded-lg max-w-xs">
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
                    disabled={true}
                    placeholder="Type a test message..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTestAgent()}
                  />
                  <Button onClick={handleTestAgent} disabled={!testMessage.trim()}>
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

export default CreateAgent;

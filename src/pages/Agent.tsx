
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Bot, MessageSquare, TrendingUp, Clock, Star, History, Trash2, Loader2 } from 'lucide-react';
import { getApiUrl } from '@/config/api';
import { conversationsApi } from '@/services/conversations';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// API функция для получения агента
const fetchAgent = async (id: string): Promise<{
  id: string
  version: number
  name: string
  status: string
  role: string
  model: string
  voice: string
  systemPrompt: string
  ssmlEnabled: boolean
  ssmlInstructions?: string | null
  vadConfig?: {
    vadMinSpeechDuration?: number
    vadMinSilenceDuration?: number
    vadPrefixPaddingDuration?: number
    vadMaxBufferedSpeech?: number
    vadActivationThreshold?: number
    vadForceCPU?: boolean
  } | null
  createdAt: number
  updatedAt: number
  deletedAt?: number
  totalConversations: number
  medianDurationMs: number
  successRate: number
} | null> => {
  const response = await fetch(getApiUrl('agents/find-one-latest'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agentId: id }),
  });
  
  if (!response.ok) {
    console.log(await response.json())
    throw new Error('Не удалось загрузить агента');
  }
  
  return response.json();
};

const Agent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [agent, setAgent] = useState<{
    id: string
    version: number
    name: string
    status: string
    role: string
    model: string
    voice: string
    systemPrompt: string
    ssmlEnabled: boolean
    ssmlInstructions?: string | null
    vadConfig?: {
      vadMinSpeechDuration?: number
      vadMinSilenceDuration?: number
      vadPrefixPaddingDuration?: number
      vadMaxBufferedSpeech?: number
      vadActivationThreshold?: number
      vadForceCPU?: boolean
    } | null
    createdAt: number
    updatedAt: number
    deletedAt?: number
    totalConversations: number
    medianDurationMs: number
    successRate: number
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [conversations, setConversations] = useState<{
    id: string
    customer: string
    status: string
    durationMs: number
    targetAchieved: boolean
  }[]>([]);

  useEffect(() => {
    const loadAgent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const agentData = await fetchAgent(id);
        setAgent(agentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить агента');
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [id]);

  useEffect(() => {
    const loadConversations = async () => {
      if (!id) return;
      
      try {
        const conversationsData = await conversationsApi.findMany({
          agentId: id,
          limit: 3,
        });

        setConversations(conversationsData.data.map(i => ({
          id: i.id,
          customer: i.customer,
          durationMs: i.durationMs,
          targetAchieved: i.targetAchieved,
          status: i.status,
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить разговоры');
      }
    };

    loadConversations();
  }, [id]);

  // Моковые данные для полей, которых нет в API
  const mockData = {
    conversations: 127,
    successRate: 91,
    avgResponse: '1.2s',
    rating: 4.8,
    uptime: '99.9%',
    totalConversations: 1847,
  };

  const handleVersionHistory = () => {
    // Navigate to version history page or show modal
    console.log('Show version history for agent', id);
  };

  const handleTestAgent = () => {
    // Переход на страницу тестирования агента
    navigate(`/agents/${id}/test`);
  };

  const handleEditAgent = () => {
    // Переход на страницу редактирования агента
    navigate(`/agents/${id}/test`);
  };

  const handleDeleteAgent = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(getApiUrl('agents/delete-one'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Агент удален",
        description: "Агент успешно удален из системы",
      });

      // Перенаправляем на страницу со списком агентов
      navigate('/agents');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить агента';
      toast({
        title: "Ошибка удаления",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
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

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-slate-600 mb-4">Агент не найден</p>
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
              onClick={() => navigate('/agents')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к агентам
            </Button>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  v{agent.version}
                </span>
              </div>
              <p className="text-slate-600">Панель управления</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleVersionHistory}>
                <History className="h-4 w-4 mr-2" />
                История версий
              </Button>
              <Button variant="outline" onClick={handleEditAgent}>
                <Settings className="h-4 w-4 mr-2" />
                Редактировать агента
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить агента
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Удалить агента "{agent?.name}"?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>Вы уверены, что хотите удалить этого агента? Это действие нельзя отменить.</p>
                      <p className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                        <strong>Важно:</strong> Кампании, которым назначен этот агент, продолжат его использовать даже после удаления, до тех пор пока им не будут назначены другие агенты.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAgent}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Удаление...
                        </>
                      ) : (
                        'Удалить агента'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Agent Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                {/* <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {agent.status}
                </span> */}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{agent.totalConversations}</p>
                <p className="text-sm text-slate-600">Активные разговоры</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">+5.2%</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{agent.successRate}%</p>
                <p className="text-sm text-slate-600">Процент успеха</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">-0.3s</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{Math.round(agent.medianDurationMs / 1000)}сек</p>
                <p className="text-sm text-slate-600">Среднее время ответа</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Conversations */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Последние разговоры</h3>
              <div className="space-y-4">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-900 mb-2">Разговоров пока нет</h4>
                    <p className="text-slate-600">
                      Разговоры появятся здесь после первых звонков с участием этого агента
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{conversation.customer}</p>
                          <p className="text-xs text-slate-500">Длительность: {Math.round(conversation.durationMs / 1000)}сек</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          conversation.targetAchieved 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {conversation.targetAchieved ? 'Успех' : 'Неудача'}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/conversations/${conversation.id}/call`)}>Посмотреть</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Agent Configuration */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Конфигурация агента</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Модель AI</p>
                  <p className="text-sm font-medium text-slate-900">{agent.model || 'GPT-4 Turbo'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Версия</p>
                  <p className="text-sm font-medium text-blue-600">v{agent.version}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Специализация</p>
                  <p className="text-sm font-medium text-slate-900">{agent.role}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <Button className="w-full mb-2 bg-blue-600 hover:bg-blue-700" onClick={handleTestAgent}>
                  <Bot className="h-4 w-4 mr-2" />
                  Тестировать агента
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Agent;

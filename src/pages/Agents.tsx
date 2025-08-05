
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Bot, Settings, Play, Pause, Activity, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getApiUrl } from '@/config/api';

// Интерфейс для агента
interface Agent {
  id: string;
  version: string;
  name: string;
  role: string;
  specialization: string;
  model: string;
  voice: string;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
}

// Интерфейс для ответа API
interface AgentsResponse {
  data: Agent[];
  total: number;
  page: number;
  limit: number;
}

// Интерфейс для параметров запроса
interface GetAgentsParams {
  page?: number;
  limit?: number;
  role?: string;
}

// Функция для получения агентов с сервера
const fetchAgents = async (params: GetAgentsParams = {}): Promise<AgentsResponse> => {
  const response = await fetch(getApiUrl('agents/find-many-latest'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

const Agents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    conversations: 0,
    avgSuccessRate: 0
  });

  // Загрузка агентов
  const loadAgents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAgents({
        page: 1,
        limit: 50, // Загружаем больше агентов для статистики
      });
      
      setAgents(response.data);
      
      // Вычисляем статистику
      setStats({
        total: response.total,
        conversations: response.data.length * 10, // Моковые данные для демонстрации
        avgSuccessRate: 91 // Моковые данные для демонстрации
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить агентов';
      setError(errorMessage);
      toast({
        title: "Ошибка загрузки",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем агентов при монтировании компонента
  useEffect(() => {
    loadAgents();
  }, []);

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'только что';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} ч назад`;
    } {
      return `${Math.floor(diffInMinutes / 60 / 24)} дн назад`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                AI Agents
              </h1>
              <p className="text-slate-600">
                Manage and configure your AI assistants
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/agents/create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {/* Agent Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Agents</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Conversations</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.conversations}</p>
                </div>
                <Play className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgSuccessRate}%</p>
                </div>
                <Settings className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-slate-600">Загрузка агентов...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 mb-4">{error}</p>
              <Button onClick={loadAgents} variant="outline">
                Попробовать снова
              </Button>
            </div>
          )}

          {/* Agents Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Нет агентов</h3>
                  <p className="text-slate-600 mb-4">Создайте первого агента для начала работы</p>
                  <Button onClick={() => navigate('/agents/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать агента
                  </Button>
                </div>
              ) : (
                agents.map((agent) => (
                  <div 
                    key={`${agent.id}-${agent.version}`} 
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/agents/${agent.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bot className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{agent.name}</h3>
                          <p className="text-sm text-slate-600">{agent.role}</p>
                          <p className="text-xs text-blue-600 font-medium">v{agent.version}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Специализация</span>
                        <span className="text-sm font-medium text-slate-900">{agent.specialization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Модель</span>
                        <span className="text-sm font-medium text-slate-900">{agent.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Голос</span>
                        <span className="text-sm font-medium text-slate-900">{agent.voice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Обновлен</span>
                        <span className="text-sm font-medium text-slate-900">{formatDate(agent.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-500">Создан {formatDate(agent.createdAt)}</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/agents/${agent.id}/test`);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Agents;

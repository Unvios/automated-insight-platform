
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { MessageSquare, User, Bot, Clock, Star, Search, Filter, Phone, Video, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { Conversation } from '@/services/conversations';
import { Button } from '@/components/ui/button';

const Conversations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const {
    conversations,
    loading,
    error,
    total,
    page,
    limit,
    fetchConversations,
    goToPage,
  } = useConversations();

  // Используем conversations напрямую, так как фильтрация происходит на сервере

  // Обновление фильтров
  useEffect(() => {
    fetchConversations({
      status: filterStatus === 'all' ? undefined : filterStatus,
      page: 1, // При смене фильтра сбрасываем на первую страницу
    });
  }, [filterStatus]);

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/conversations/${conversation.id}/${conversation.type}`);
  };

  // Обработка смены страницы
  const handlePageChange = (newPage: number) => {
    console.log('Переход на страницу:', newPage);
    goToPage(newPage, {
      status: filterStatus === 'all' ? undefined : filterStatus,
    });
  };

  // Обработка смены лимита
  const handleLimitChange = (newLimit: number) => {
    fetchConversations({ 
      page: 1, 
      limit: newLimit,
      status: filterStatus === 'all' ? undefined : filterStatus,
    });
  };

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Разговоры
            </h1>
            <p className="text-slate-600">
              Мониторинг и управление взаимодействиями с клиентами
            </p>
          </div>

          {/* Search and Filter */}
          {/* <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск разговоров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="resolved">Завершенные</option>
                <option value="waiting">Ожидание</option>
                <option value="escalated">Эскалированные</option>
              </select>
            </div>
          </div> */}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Conversation Stats */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Всего разговоров</p>
                  <p className="text-2xl font-bold text-blue-600">{total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Активные</p>
                  <p className="text-2xl font-bold text-green-600">
                    {conversations.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-500" />
              </div>
            </div> */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Завершенные</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {conversations.filter(c => c.status === 'resolved').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"> */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Средний рейтинг</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {conversations.filter(c => c.rating).length > 0 
                      ? (conversations.reduce((sum, c) => sum + (c.rating || 0), 0) / conversations.filter(c => c.rating).length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </div> */}
          </div>

          {/* Conversations List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {loading ? (
              <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Загрузка разговоров...</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className="p-4 hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900 mb-1">{conversation.customer}</h4>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Bot className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-slate-600">{conversation.agentName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {conversation.type === 'call' ? (
                                  <Phone className="h-3 w-3 text-green-500" />
                                ) : (
                                  <MessageSquare className="h-3 w-3 text-blue-500" />
                                )}
                                <span className="text-xs text-slate-500">{conversation.type}</span>
                              </div>
                            </div>
                          </div>
                                                </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-slate-500">
                          {new Date(conversation.startTime).toLocaleString()}
                        </span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          conversation.targetAchieved === true 
                            ? 'bg-green-100 text-green-800'
                            : conversation.targetAchieved === false
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conversation.targetAchieved ? 'Успех' : 'Неудача'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Пагинация */}
            {!loading && total > 0 && (
              <div className="bg-white px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-700">
                      Показано {((page - 1) * limit) + 1} до{' '}
                      {Math.min(page * limit, total)} из{' '}
                      {total} разговоров
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-700">Показать:</span>
                      <select
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="border border-slate-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Предыдущая
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (page <= 3) {
                          pageNumber = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Следующая
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Conversations;


import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, Phone, Video, User, Bot, Clock, Star, Play, Eye, CheckCircle, XCircle, AlertCircle, Loader2, Timer, Mic, Brain, Volume2, Wrench } from 'lucide-react';
import { useConversation } from '@/hooks/useConversations';
import { Message } from '@/services/conversations';

const Conversation = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const [showStatistics, setShowStatistics] = useState(false);

  const {
    conversation,
    messages,
    loading,
    error,
  } = useConversation(id);

  // Компонент для отображения статистики сообщения
  const MessageStatistics = ({ statistics }: { statistics: Message['statistics'] }) => {
    if (!statistics) return null;

    return (
      <div className="mt-2 p-2 bg-emerald-200 rounded-md text-xs">
        <div className="grid grid-cols-2 gap-2">
          {statistics.sttDurationMs && (
            <div className="flex items-center space-x-1">
              <Mic className="h-3 w-3 text-blue-600" />
              <span className="text-slate-600">STT:</span>
              <span className="text-slate-600">{statistics.sttDurationMs}ms</span>
            </div>
          )}
          {statistics.llmDurationMs && (
            <div className="flex items-center space-x-1">
              <Brain className="h-3 w-3 text-green-600" />
              <span className="text-slate-600">LLM:</span>
              <span className="text-slate-600">{statistics.llmDurationMs}ms</span>
            </div>
          )}
          {statistics.ttsDurationMs && (
            <div className="flex items-center space-x-1">
              <Volume2 className="h-3 w-3 text-purple-600" />
              <span className="text-slate-600">TTS:</span>
              <span className="text-slate-600">{statistics.ttsDurationMs}ms</span>
            </div>
          )}
          {statistics.toolCalls && statistics.toolCalls.length > 0 && (
            <div className="flex items-center space-x-1 col-span-2">
              <Wrench className="h-3 w-3 text-orange-600" />
              <span className="text-slate-600">Tools:</span>
              <span className="text-slate-600">{statistics.toolCalls.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    );
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
              onClick={() => navigate('/conversations')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к разговорам
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Детали {conversation?.type === 'call' ? 'Звонка' : 'Чата'} 
              </h1>
              <p className="text-slate-600">
                {conversation?.customer} → {conversation?.agentName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversation Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Информация о разговоре</h3>
              
              <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{conversation?.customer || 'Неизвестно'}</p>
                      <p className="text-xs text-slate-500">Клиент</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{conversation?.agentName || 'Неизвестный агент'}</p>
                      <p className="text-xs text-slate-500">AI агент</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {conversation?.startTime ? new Date(conversation.startTime).toLocaleString('ru-RU') : 'Неизвестно'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Длительность: {conversation?.durationMs ? `${Math.round(conversation.durationMs / 1000)}s` : 'Неизвестно'}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Рейтинг: {conversation?.rating ? `${conversation.rating}/5` : 'Неизвестно'}
                      </p>
                      <p className={`text-xs capitalize ${
                        conversation?.sentiment === 'positive' ? 'text-green-600' :
                        conversation?.sentiment === 'negative' ? 'text-red-600' :
                        'text-slate-500'
                      }`}>
                        {conversation?.sentiment || 'neutral'} сентимент
                      </p>
                    </div>
                  </div> */}
              </div>

              {/* Analysis Result */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Результат анализа</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {conversation?.targetAchieved ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <XCircle className="h-4 w-4 text-red-600" />
                    }
                    <span className={`text-sm font-medium ${conversation?.targetAchieved ? 'text-green-600' : 'text-red-600'}`}>
                      {conversation?.targetAchieved ? 'Цель достигнута' : 'Цель не достигнута'}
                    </span>
                  </div>
                  {/* <p className="text-xs text-slate-600">Цель: {conversation?.goal || 'Решить проблему клиента'}</p>
                  <p className="text-xs text-slate-600">
                    Рекомендация: {conversation?.recommendation || 'Следующий шаг в течение 24 часов для обеспечения удовлетворения клиента'}
                  </p> */}
                  {/* <Button variant="outline" size="sm" className="w-full mt-2">
                    <Eye className="h-4 w-4 mr-2" />
                    Полная аналитика
                  </Button> */}
                </div>
              </div>

              {conversation?.type === 'call' && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button className="w-full mb-2 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Слушать звонок
                  </Button>
                  {/* <Button className="w-full mb-2 bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Back
                  </Button> */}
                </div>
              )}
            </div>

            {/* Chat/Call Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Сводка
                </h3>
                <div 
                  className="text-slate-600 text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: conversation?.summary?.replace(/\n/g, '<br>') || '' 
                  }}
                />
              </div>

              {/* Next Actions */}
              {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Actions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Action</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">DateTime</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Logs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {nextActions.map((action) => (
                        <tr key={action.id}>
                          <td className="px-4 py-3 text-sm text-slate-900">{action.action}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {action.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {action.type === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                              {action.type === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                              <span className={`text-sm ${
                                action.type === 'success' ? 'text-green-600' :
                                action.type === 'pending' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {action.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{action.datetime}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Logs
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}

              {/* Messages/Transcript */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {conversation?.type === 'call' ? 'Транскрипция звонка' : 'Сообщения'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-statistics"
                        checked={showStatistics}
                        onCheckedChange={(checked) => setShowStatistics(checked as boolean)}
                      />
                      <label htmlFor="show-statistics" className="text-sm text-slate-600 cursor-pointer">
                        Показать статистику
                      </label>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Загрузка сообщений...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-100 text-slate-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {new Date(message.time).toLocaleString()}
                            </p>
                            {showStatistics && <MessageStatistics statistics={message.statistics} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Conversation;

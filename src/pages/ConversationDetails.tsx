
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Phone, Video, User, Bot, Clock, Star, Play, Eye, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useConversation } from '@/hooks/useConversations';
import { Message } from '@/services/conversations';

const ConversationDetails = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [newMessage, setNewMessage] = useState('');

  const {
    conversation,
    messages,
    loading,
    error,
  } = useConversation(id);

  // Моковые данные для демонстрации
  const nextActions = [
    { id: 1, action: 'Add lead to CRM', status: 'success', datetime: '17-05-2025 16:43', type: 'success' },
    { id: 2, action: 'Send follow-up email', status: 'pending', datetime: '17-05-2025 17:00', type: 'pending' },
    { id: 3, action: 'Update customer segment', status: 'failed', datetime: '17-05-2025 16:45', type: 'error' }
  ];

  const summary = conversation?.summary || (conversation?.type === 'call' 
    ? "Customer called regarding a billing issue with a duplicate charge on their invoice. The agent successfully identified the problem, processed a refund, and provided clear timeline expectations. The customer was satisfied with the resolution."
    : "Customer contacted support via chat about a billing discrepancy. Agent quickly identified and resolved the duplicate charge issue, processing a refund and explaining the timeline. Issue resolved successfully with high customer satisfaction.");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;
    // TODO: Implement message sending when API is ready
    console.log('Sending message as user:', newMessage);
    setNewMessage('');
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
              Back to Conversations
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {conversation?.type === 'call' ? 'Call' : 'Chat'} Details
              </h1>
              <p className="text-slate-600">
                {conversation?.customer} → {conversation?.agentName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversation Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversation Info</h3>
              
              <div className="space-y-4">
                                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{conversation?.customer || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">Customer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{conversation?.agentName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">AI Agent</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {conversation?.startTime ? new Date(conversation.startTime).toLocaleString() : 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Duration: {conversation?.durationMs ? `${Math.round(conversation.durationMs / 1000)}s` : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Rating: {conversation?.rating ? `${conversation.rating}/5` : 'No rating'}
                      </p>
                      <p className={`text-xs capitalize ${
                        conversation?.sentiment === 'positive' ? 'text-green-600' :
                        conversation?.sentiment === 'negative' ? 'text-red-600' :
                        'text-slate-500'
                      }`}>
                        {conversation?.sentiment || 'neutral'} sentiment
                      </p>
                    </div>
                  </div>
              </div>

              {/* Analysis Result */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Result Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {conversation?.targetAchieved ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <XCircle className="h-4 w-4 text-red-600" />
                    }
                    <span className={`text-sm font-medium ${conversation?.targetAchieved ? 'text-green-600' : 'text-red-600'}`}>
                      {conversation?.targetAchieved ? 'Target Achieved' : 'Target Not Achieved'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Goal: {conversation?.goal || 'Resolve customer issue'}</p>
                  <p className="text-xs text-slate-600">
                    Recommendation: {conversation?.recommendation || 'Follow up within 24 hours to ensure customer satisfaction'}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Analysis
                  </Button>
                </div>
              </div>

              {conversation?.type === 'call' && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button className="w-full mb-2 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Listen Call
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
                  {conversation?.type === 'call' ? 'Call' : 'Chat'} Summary
                </h3>
                <div 
                  className="text-slate-600 text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: summary?.replace(/\n/g, '<br>') || '' 
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
                  <h3 className="text-lg font-semibold text-slate-900">
                    {conversation?.type === 'call' ? 'Call Transcript' : 'Chat Messages'}
                  </h3>
                </div>

                {loading ? (
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Loading messages...</span>
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
                          </div>
                        </div>
                      ))}
                    </div>

                    {conversation?.type === 'chat' && conversation.status === 'active' && (
                      <div className="p-6 border-t border-slate-200">
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Type your message..." 
                            className="flex-1"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
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

export default ConversationDetails;

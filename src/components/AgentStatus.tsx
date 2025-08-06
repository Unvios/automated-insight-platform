
import React from 'react';
import { Bot, MessageSquare, Clock, TrendingUp } from 'lucide-react';
import { AgentWithStats } from '@/services/agents';
import { useNavigate } from 'react-router-dom';

const AgentStatus = ({ agents }: { agents: AgentWithStats[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">AI Агенты</h3>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="border border-slate-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="h-8 w-8 text-blue-600" />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(
                      agent.status
                    )} rounded-full border-2 border-white`}
                  ></div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{agent.name}</h4>
                  <p className="text-sm text-slate-500">{agent.role}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-start space-x-1">
                  <span className="text-sm font-medium text-slate-900">
                    {Math.round(agent.medianDurationMs / 1000)} сек
                  </span>
                  <Clock className="h-3 w-3 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500" style={{ textAlign: 'left' }}>Медианная длительность</p>
              </div>
              <div>
                <div className="flex items-center justify-start space-x-1">
                  <span className="text-sm font-medium text-slate-900">
                    {agent.successRate}%
                  </span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
                <p className="text-xs text-slate-500" style={{ textAlign: 'left' }}>Успешность</p>
              </div>
              <div>
                <div className="flex items-center justify-start space-x-1">
                  <span className="text-sm font-medium text-slate-900">
                    {agent.totalConversations}
                  </span>
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-xs text-slate-500" style={{ textAlign: 'left' }}>Кол-во разговоров</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        onClick={() => navigate('/agents')}
      >
        Все агенты →
      </button>
    </div>
  );
};

export default AgentStatus;

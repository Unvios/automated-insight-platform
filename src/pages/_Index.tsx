import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import KPICard from '@/components/KPICard';
import LiveActivity from '@/components/LiveActivity';
import AgentStatus from '@/components/AgentStatus';
import QuickActions from '@/components/QuickActions';
import { MessageSquare, DollarSign, Bot, Settings, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { conversationsApi } from '@/services/conversations';
import { agentsApi, AgentWithStats } from '@/services/agents';
import { customersApi } from '@/services/customers';

interface WidgetItem {
  id: string;
  name: string;
  enabled: boolean;
  type: 'kpi' | 'widget';
}

const Index = () => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    { id: 'conversations', name: 'Active Conversations', enabled: true, type: 'kpi' },
    { id: 'costs', name: 'Monthly Costs', enabled: true, type: 'kpi' },
    { id: 'efficiency', name: 'Agent Efficiency', enabled: true, type: 'kpi' },
    { id: 'quick-actions', name: 'Quick Actions', enabled: true, type: 'widget' },
    { id: 'live-activity', name: 'Live Activity', enabled: true, type: 'widget' },
    { id: 'agent-status', name: 'Agent Status', enabled: true, type: 'widget' },
  ]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = widgets.findIndex(w => w.id === draggedItem);
    const targetIndex = widgets.findIndex(w => w.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newWidgets = [...widgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);

    setWidgets(newWidgets);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const [conversationsCount, setConversationsCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [agentsWithStats, setAgentsWithStats] = useState<AgentWithStats[]>([]);

  useEffect(() => {
    const fetchConversationsCount = async () => {
      setConversationsCount(await conversationsApi.countAll());
    };

    fetchConversationsCount();
  }, []);


  useEffect(() => {
    const fetchCustomersCount = async () => {
      setCustomersCount(await customersApi.countAll());
    };

    fetchCustomersCount();
  }, []);


  useEffect(() => {
    const fetchAgentsCount = async () => {
      setAgentsCount(await agentsApi.countAll());
    };

    fetchAgentsCount();
  }, []);

  useEffect(() => {
    const fetchAgentsWithStats = async () => {
      const response = await agentsApi.findManyWithStats({
        limit: 3,
      });
      setAgentsWithStats(response.data);
    };

    fetchAgentsWithStats();
  }, []);

  const kpiWidgets = widgets.filter(w => w.type === 'kpi');
  const dashboardWidgets = widgets.filter(w => w.type === 'widget');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Добро пожаловать!
              </h1>
            </div>
            
            {/* <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Customize Dashboard
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customize Dashboard Widgets</DialogTitle>
                  <DialogDescription>
                    Select which widgets you want to display and drag to reorder them.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-medium text-sm mb-3">KPI Cards</h3>
                    <div className="space-y-2">
                      {kpiWidgets.map((widget) => (
                        <div
                          key={widget.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, widget.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, widget.id)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center space-x-3 p-2 rounded border bg-white cursor-move transition-colors ${
                            draggedItem === widget.id ? 'opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <input 
                            type="checkbox" 
                            checked={widget.enabled}
                            onChange={() => toggleWidget(widget.id)}
                            className="rounded" 
                          />
                          <span className="text-sm flex-1">{widget.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-3">Dashboard Widgets</h3>
                    <div className="space-y-2">
                      {dashboardWidgets.map((widget) => (
                        <div
                          key={widget.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, widget.id)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, widget.id)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center space-x-3 p-2 rounded border bg-white cursor-move transition-colors ${
                            draggedItem === widget.id ? 'opacity-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <input 
                            type="checkbox" 
                            checked={widget.enabled}
                            onChange={() => toggleWidget(widget.id)}
                            className="rounded" 
                          />
                          <span className="text-sm flex-1">{widget.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCustomizeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCustomizeOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog> */}
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Кол-во разговоров"
              value={conversationsCount.toString()}
              // change="+12%"
              // trend="up"
              icon={MessageSquare}
              iconColor="bg-blue-500"
            />
            <KPICard
              title="Кол-во клиентов"
              value={customersCount.toString()}
              // change="-5%"
              // trend="down"
              icon={DollarSign}
              iconColor="bg-purple-500"
            />
            <KPICard
              title="Кол-во агентов"
              value={agentsCount.toString()}
              // change="+3.2%"
              // trend="up"
              icon={Bot}
              iconColor="bg-orange-500"
            />
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              {/* <LiveActivity /> */}
            </div>
            
            <div className="space-y-6">
              <AgentStatus agents={agentsWithStats} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

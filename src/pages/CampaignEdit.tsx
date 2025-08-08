import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';
import { useAllKnowledgeBases } from '@/hooks/useAllKnowledgeBases';
import { campaignsApi, ICampaign } from '@/services/campaigns';

const CampaignEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { updateCampaign } = useCampaigns();
  const { agents, loading: loadingAgents } = useAgents();
  const { knowledgeBases, loading: loadingKnowledgeBases } = useAllKnowledgeBases();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>('');
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');

  // Загружаем данные кампании при монтировании компонента
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoadingCampaign(true);
        const campaignData = await campaignsApi.findOne(id);
        setCampaign(campaignData);
        setSelectedKnowledgeBaseId(campaignData.knowledgeBaseId || '');
        setSelectedTargetAudience(campaignData.targetAudience || '');
        setSelectedAgentId(campaignData.agentId || '');
      } catch (error) {
        console.error('Не удалось загрузить данные кампании:', error);
        toast({
          title: "Error",
          description: "Не удалось загрузить данные кампании",
          variant: "destructive",
        });
        navigate('/campaigns');
      } finally {
        setLoadingCampaign(false);
      }
    };

    fetchCampaign();
  }, [id, toast, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign || !id) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const targetAudience = selectedTargetAudience;
      const agentId = selectedAgentId;
      const knowledgeBaseId = selectedKnowledgeBaseId;
      
      const campaignData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        // budget: Number(formData.get('budget')),
        // durationMs: Number(formData.get('duration')) * 24 * 60 * 60 * 1000, // конвертируем дни в миллисекунды
        ...(targetAudience && { targetAudience }),
        ...(agentId && { agentId }),
        ...(knowledgeBaseId ? { knowledgeBaseId } : { knowledgeBaseId: null }),
      };

      await updateCampaign(id, campaignData);
      toast({
        title: "Success",
        description: "Данные кампании успешно обновлены",
      });
      navigate(`/campaigns/${id}`);
    } catch (error) {
      console.error('Не удалось обновить данные кампании:', error);
      toast({
        title: "Error",
        description: "Не удалось обновить данные кампании",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const segments = [
    'bitrix',
    'csv', 
    'Добавлены вручную',
  ];

  if (loadingCampaign) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-500">Кампания не найдена</p>
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
              onClick={() => navigate(`/campaigns/${id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к кампаниям
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Редактирование кампании</h1>
              <p className="text-slate-600">Обновите свою AI маркетинговую кампанию</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div>
                <Label htmlFor="name">Название кампании</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Введите название кампании" 
                  defaultValue={campaign.name}
                  required 
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Опишите цели и целевую аудиторию кампании" 
                  defaultValue={campaign.description}
                />
              </div>

              {/* <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Бюджет</Label>
                  <Input 
                    id="budget" 
                    name="budget" 
                    type="number" 
                    placeholder="5000" 
                    defaultValue={campaign.budget}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Длительность (дней)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    placeholder="30" 
                    defaultValue={Math.round(campaign.durationMs / (24 * 60 * 60 * 1000))}
                    required 
                  />
                </div>
              </div> */}

              <div>
                <Label htmlFor="target">Целевая аудитория (сегмент)</Label>
                <select 
                  id="target" 
                  name="target" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={selectedTargetAudience}
                  onChange={(e) => setSelectedTargetAudience(e.target.value)}
                  required
                >
                  <option value="">Выберите сегмент</option>
                  {segments.map((segment) => (
                    <option key={segment} value={segment}>{segment}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="agent">Выберите агента</Label>
                <select 
                  id="agent" 
                  name="agent" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  required 
                  disabled={loadingAgents}
                >
                  <option value="">Выберите агента</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="knowledge">База знаний (необязательно)</Label>
                <select 
                  id="knowledge" 
                  name="knowledge" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={selectedKnowledgeBaseId}
                  onChange={(e) => setSelectedKnowledgeBaseId(e.target.value)}
                  disabled={loadingKnowledgeBases}
                >
                  <option value="">Не использовать</option>
                  {knowledgeBases.map((kb) => (
                    <option key={kb.id} value={kb.id}>{kb.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate(`/campaigns/${id}`)}>
                  Отмена
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Обновление...' : 'Обновить кампанию'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignEdit; 
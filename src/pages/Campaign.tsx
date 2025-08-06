
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Settings, Users, MessageSquare, TrendingUp, DollarSign, Phone, Trash2 } from 'lucide-react';
import { campaignsApi, ICampaign } from '@/services/campaigns';
import { useToast } from '@/hooks/use-toast';

const Campaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const campaignData = await campaignsApi.findOne(id);
        setCampaign(campaignData);
      } catch (error) {
        console.error('Не удалось загрузить детали кампании:', error);
        toast({
          title: "Error",
          description: "Не удалось загрузить детали кампании",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast]);

  const handleStatusToggle = async () => {
    if (!campaign) return;
    
    try {
      setUpdatingStatus(true);
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      const updatedCampaign = await campaignsApi.update(campaign.id, { status: newStatus });
      setCampaign(updatedCampaign);
      toast({
        title: "Success",
        description: `Кампания ${newStatus === 'active' ? 'запущена' : 'приостановлена'} успешно`,
      });
    } catch (error) {
      console.error('Не удалось обновить статус кампании:', error);
      toast({
        title: "Error",
        description: "Не удалось обновить статус кампании",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaign) return;
    
    if (!window.confirm('Вы уверены, что хотите удалить эту кампанию? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      setDeletingCampaign(true);
      await campaignsApi.delete(campaign.id);
      toast({
        title: "Success",
        description: "Кампания успешно удалена",
      });
      navigate('/campaigns');
    } catch (error) {
      console.error('Не удалось удалить кампанию:', error);
      toast({
        title: "Error",
        description: "Не удалось удалить кампанию",
        variant: "destructive",
      });
    } finally {
      setDeletingCampaign(false);
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
              onClick={() => navigate('/campaigns')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к кампаниям
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
              <p className="text-slate-600">Детали кампании и ее эффективность</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>
                <Settings className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`${import.meta.env.VITE_BASE_PATH}/campaigns/${campaign.id}/agent`, '_blank')}
                disabled={campaign.status !== 'active'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Позвонить агенту
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={handleStatusToggle}
                disabled={updatingStatus}
              >
                {updatingStatus ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                ) : campaign.status === 'active' ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {updatingStatus ? 'Обновление...' : campaign.status === 'active' ? 'Приостановить' : 'Запустить'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleDeleteCampaign}
                disabled={deletingCampaign}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                {deletingCampaign ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600 mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {deletingCampaign ? 'Удаление...' : 'Удалить'}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{campaign.totalContacts.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Всего контактов</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                {/* <div className="text-green-600 text-sm font-medium">+12.5%</div> */}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{campaign.engagedContacts.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Вовлеченные контакты</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                {/* <div className="text-green-600 text-sm font-medium">+8.3%</div> */}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{campaign.conversations}</p>
                <p className="text-sm text-slate-600">Разговоры</p>
              </div>
            </div>

            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">{campaign.conversations}</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">${campaign.spent.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Потрачено / ${campaign.budget.toLocaleString()}</p>
              </div>
            </div> */}
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Эффективность во времени</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">График эффективности будет здесь</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Информация о кампании</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">AI Агент</p>
                  <p className="text-sm font-medium text-slate-900">{campaign.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Дата начала</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(campaign.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Дата окончания</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(new Date(campaign.createdAt).getTime() + Number(campaign.durationMs)).toLocaleDateString('ru-RU')}
                    {/* {new Date(campaign.createdAt).getTime() + Number()} */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Целевая аудитория</p>
                  <p className="text-sm font-medium text-slate-900">
                    {campaign.targetAudience}
                  </p>
                </div>
                {/* <div>
                  <p className="text-sm text-slate-600">Конверсия</p>
                  <p className="text-sm font-medium text-green-600">
                    {campaign.engagedContacts > 0 ? ((campaign.conversations / campaign.engagedContacts) * 100).toFixed(1) : '0'}%
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Campaign;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Settings, Users, MessageSquare, TrendingUp, DollarSign } from 'lucide-react';
import { campaignsApi, Campaign } from '@/services/campaigns';
import { useToast } from '@/hooks/use-toast';

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const campaignData = await campaignsApi.findOne(id);
        setCampaign(campaignData);
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
        toast({
          title: "Error",
          description: "Failed to load campaign details",
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
        description: `Campaign ${newStatus === 'active' ? 'started' : 'paused'} successfully`,
      });
    } catch (error) {
      console.error('Failed to update campaign status:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
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
              <p className="text-slate-500">Campaign not found</p>
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
              Back to Campaigns
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
              <p className="text-slate-600">Campaign Details & Performance</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>
                <Settings className="h-4 w-4 mr-2" />
                Edit
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
                {updatingStatus ? 'Updating...' : campaign.status === 'active' ? 'Pause' : 'Start'}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-slate-600">Total Contacts</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">+12.5%</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{campaign.engagedContacts.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Engaged Contacts</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">+8.3%</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{campaign.conversions}</p>
                <p className="text-sm text-slate-600">Conversions</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-green-600 text-sm font-medium">{campaign.conversions}</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">${campaign.spent.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Spent / ${campaign.budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">Performance chart would go here</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Campaign Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">AI Agent</p>
                  <p className="text-sm font-medium text-slate-900">{campaign.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Start Date</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">End Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(new Date(campaign.createdAt).getTime() + Number(campaign.durationMs)).toLocaleDateString()}
                    {/* {new Date(campaign.createdAt).getTime() + Number()} */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Conversion Rate</p>
                  <p className="text-sm font-medium text-green-600">
                    {campaign.engagedContacts > 0 ? ((campaign.conversions / campaign.engagedContacts) * 100).toFixed(1) : '0'}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignDetails;

import { useState, useEffect } from 'react';
import { campaignsApi, Campaign, CampaignsResponse } from '@/services/campaigns';
import { useToast } from '@/hooks/use-toast';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { toast } = useToast();

  const fetchCampaigns = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    try {
      setLoading(true);
      const response: CampaignsResponse = await campaignsApi.findMany({
        page: params.page || page,
        limit: params.limit || limit,
        status: params.status,
      });
      
      setCampaigns(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: {
    name: string;
    description: string;
    budget: number;
    durationMs: number;
    targetAudience: string;
    agentId: string;
    knowledgeBaseId: string;
  }) => {
    try {
      const newCampaign = await campaignsApi.create(campaignData);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      return newCampaign;
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    try {
      const updatedCampaign = await campaignsApi.update(campaignId, updates);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? updatedCampaign : c))
      );
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
      return updatedCampaign;
    } catch (error) {
      console.error('Failed to update campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await campaignsApi.delete(campaignId);
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      // Обновляем список кампаний
      await fetchCampaigns();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    total,
    page,
    limit,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}; 
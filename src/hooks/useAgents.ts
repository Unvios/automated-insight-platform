import { useState, useEffect } from 'react';
import { agentsApi, Agent, AgentsResponse } from '@/services/agents';
import { useToast } from '@/hooks/use-toast';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // Больше агентов для выбора
  const { toast } = useToast();

  const fetchAgents = async (params: {
    page?: number;
    limit?: number;
    status?: string;
    agentIds?: string[];
  } = {}) => {
    try {
      setLoading(true);
      const response: AgentsResponse = await agentsApi.findMany({
        page: params.page || page,
        limit: params.limit || limit,
        status: params.status,
        agentIds: params.agentIds,
      });
      
      setAgents(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    total,
    page,
    limit,
    fetchAgents,
  };
}; 
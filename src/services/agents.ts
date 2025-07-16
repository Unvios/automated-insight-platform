import { getApiUrl } from '@/config/api';

// Типы данных
export interface Agent {
    id: string
    name: string
    role: string
    model: string
    voice: string
    systemPrompt: string
    status: string
    createdAt: string
    updatedAt: string
}

export interface AgentsResponse {
  data: Agent[];
  total: number;
  page: number;
  limit: number;
}

// API методы
export const agentsApi = {
  // Получить список агентов
  async findMany(params: {
    page?: number;
    limit?: number;
    status?: string;
    agentIds?: string[];
  } = {}): Promise<AgentsResponse> {
    const response = await fetch(getApiUrl('agents/find-many-latest'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }

    return response.json();
  },

  // Получить агента по ID
  async findOne(agentId: string): Promise<Agent> {
    const response = await fetch(getApiUrl('agents/find-one-latest'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agent: ${response.statusText}`);
    }

    return response.json();
  },
}; 
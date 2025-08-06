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
    ssmlEnabled?: boolean
    ssmlInstructions?: string
    vadConfigEnabled?: boolean
    vadConfig?: {
        vadMinSpeechDuration?: number
        vadMinSilenceDuration?: number
        vadPrefixPaddingDuration?: number
        vadMaxBufferedSpeech?: number
        vadActivationThreshold?: number
        vadForceCPU?: boolean
    }
}

export interface AgentWithStats extends Agent {
  totalConversations: number
  medianDurationMs: number
  successRate: number
}

export interface AgentsResponse<T extends Agent = Agent> {
  data: T[];
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

  async findManyWithStats(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<AgentsResponse<AgentWithStats>> {
    const response = await fetch(getApiUrl('agents/find-many-latest-with-stats'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents with stats: ${response.statusText}`);
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

  async countAll(): Promise<number> {
    const response = await fetch(getApiUrl('agents/count-all'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }

    return response.json();
  },
}; 
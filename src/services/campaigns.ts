import { getApiUrl } from '@/config/api';

// Типы данных
export interface ICampaign {
    id: string
    name: string
    description: string
    budget: number
    spent: number
    durationMs: number
    targetAudience: string
    agentId: string
    agentName: string
    knowledgeBaseId: string
    status: string
    totalContacts: number
    engagedContacts: number
    conversions: number
    createdAt: string
    updatedAt: string
}

export interface CampaignsResponse {
  data: ICampaign[];
  total: number;
  page: number;
  limit: number;
}

// API методы
export const campaignsApi = {
  // Получить список кампаний
  async findMany(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<CampaignsResponse> {
    const response = await fetch(getApiUrl('campaigns/find-many'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
    }

    return response.json();
  },

  // Получить кампанию по ID
  async findOne(campaignId: string): Promise<ICampaign> {
    const response = await fetch(getApiUrl('campaigns/find-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campaign: ${response.statusText}`);
    }

    return response.json();
  },

  // Создать новую кампанию
  async create(campaign: {
    name: string;
    description: string;
    budget: number;
    durationMs: number;
    targetAudience: string;
    agentId: string;
    knowledgeBaseId: string;
  }): Promise<ICampaign> {
    const response = await fetch(getApiUrl('campaigns/create-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });

    if (!response.ok) {
      throw new Error(`Failed to create campaign: ${response.statusText}`);
    }

    return response.json();
  },

  // Обновить кампанию
  async update(campaignId: string, updates: Partial<ICampaign>): Promise<ICampaign> {
    const response = await fetch(getApiUrl('campaigns/update-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        campaignId,
        ...updates,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update campaign: ${response.statusText}`);
    }

    return response.json();
  },

  // Удалить кампанию
  async delete(campaignId: string): Promise<void> {
    const response = await fetch(getApiUrl('campaigns/delete-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaignId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete campaign: ${response.statusText}`);
    }
  },
}; 
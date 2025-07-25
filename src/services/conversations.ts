import { getApiUrl } from '@/config/api';

// Типы данных
export interface Conversation {
    id: string
    agentId: string
    customer: string
    agentName: string
    status: string
    type: string
    startTime: string
    durationMs: number
    sentiment: string
    rating: number
    targetAchieved: boolean
    goal: string
    summary: string
    recommendation: string
    createdAt: string
    updatedAt: string
}

export interface Message {
    id: string
    conversationId: string
    sender: 'user' | 'assistant'
    text: string
    time: string
    createdAt: string
    updatedAt: string
}

export interface ConversationsResponse {
  data: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface MessagesResponse {
  data: Message[];
}

// API методы
export const conversationsApi = {
  // Получить список conversations
  async findMany(params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    agentId?: string;
  } = {}): Promise<ConversationsResponse> {
    const response = await fetch(getApiUrl('conversations/find-many'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }

    return response.json();
  },

  // Получить conversation по ID
  async findOne(conversationId: string): Promise<Conversation> {
    const response = await fetch(getApiUrl('conversations/find-one'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`);
    }

    return response.json();
  },

  // Получить сообщения conversation
  async findMessages(conversationId: string): Promise<MessagesResponse> {
    const response = await fetch(getApiUrl('conversations/find-messages'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    return response.json();
  },
}; 
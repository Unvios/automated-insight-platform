import { useState, useEffect, useCallback } from 'react';
import { conversationsApi, Conversation, Message } from '@/services/conversations';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Загрузка списка conversations
  const fetchConversations = useCallback(async (params: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    agentId?: string;
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await conversationsApi.findMany({
        page: params.page || page,
        limit: params.limit || limit,
        status: params.status,
        type: params.type,
        agentId: params.agentId,
      });
      
      setConversations(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Загрузка при монтировании
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    total,
    page,
    limit,
    fetchConversations,
  };
};

export const useConversation = (conversationId: string | undefined) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка conversation
  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const conversationData = await conversationsApi.findOne(conversationId);
      setConversation(conversationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversation');
      console.error('Error fetching conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Загрузка сообщений
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await conversationsApi.findMessages(conversationId);
      setMessages(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Загрузка при изменении conversationId
  useEffect(() => {
    if (conversationId) {
      fetchConversation();
      fetchMessages();
    }
  }, [conversationId, fetchConversation, fetchMessages]);

  return {
    conversation,
    messages,
    loading,
    error,
    fetchConversation,
    fetchMessages,
  };
}; 
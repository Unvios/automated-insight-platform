import { useState, useEffect } from 'react';
import { knowledgeBaseApi, KnowledgeBase } from '@/services/knowledgeBase';

export const useKnowledgeBases = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchKnowledgeBases = async (params: { page?: number; limit?: number } = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await knowledgeBaseApi.findMany({
                page: params.page || page,
                limit: params.limit || limit,
            });
            
            setKnowledgeBases(response.data);
            setTotal(response.total);
            setPage(response.page);
            setLimit(response.limit);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке баз знаний');
        } finally {
            setLoading(false);
        }
    };

    const createKnowledgeBase = async (data: { name: string; description?: string }) => {
        setLoading(true);
        setError(null);
        
        try {
            await knowledgeBaseApi.create(data);
            await fetchKnowledgeBases();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при создании базы знаний');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateKnowledgeBase = async (id: string, data: { name?: string; description?: string }) => {
        setLoading(true);
        setError(null);
        
        try {
            await knowledgeBaseApi.update(id, data);
            await fetchKnowledgeBases();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении базы знаний');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteKnowledgeBase = async (id: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await knowledgeBaseApi.delete(id);
            await fetchKnowledgeBases();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при удалении базы знаний');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKnowledgeBases();
    }, []);

    return {
        knowledgeBases,
        loading,
        error,
        total,
        page,
        limit,
        fetchKnowledgeBases,
        createKnowledgeBase,
        updateKnowledgeBase,
        deleteKnowledgeBase,
    };
}; 
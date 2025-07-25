import { useState, useEffect } from 'react';
import { knowledgeBaseApi, KnowledgeBase } from '@/services/knowledgeBase';

export const useAllKnowledgeBases = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllKnowledgeBases = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await knowledgeBaseApi.findAll();
            setKnowledgeBases(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке баз знаний');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllKnowledgeBases();
    }, []);

    return {
        knowledgeBases,
        loading,
        error,
        refetch: fetchAllKnowledgeBases,
    };
}; 
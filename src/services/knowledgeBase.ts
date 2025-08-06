import { getApiUrl } from '@/config/api';

// Типы данных
export interface IKnowledgeBase {
    id: string;
    name: string;
    description?: string | null;
}

export interface KnowledgeBasesResponse {
    data: KnowledgeBase[];
    total: number;
    page: number;
    limit: number;
}

// API методы
export const knowledgeBaseApi = {
    // Получить список баз знаний
    async findMany(params: {
        page?: number;
        limit?: number;
    } = {}): Promise<KnowledgeBasesResponse> {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );
        
        const response = await fetch(getApiUrl('knowledge-base/find-many'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredParams),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch knowledge bases: ${response.statusText}`);
        }

        return response.json();
    },

    // Получить все базы знаний (без пагинации)
    async findAll(): Promise<KnowledgeBase[]> {
        const response = await fetch(getApiUrl('knowledge-base/find-all'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch all knowledge bases: ${response.statusText}`);
        }

        return response.json();
    },

    // Получить базу знаний по ID
    async findOne(knowledgeBaseId: string): Promise<KnowledgeBase> {
        const response = await fetch(getApiUrl('knowledge-base/find-one'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ knowledgeBaseId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch knowledge base: ${response.statusText}`);
        }

        return response.json();
    },

    // Создать базу знаний
    async create(data: {
        name: string;
        description?: string;
    }): Promise<KnowledgeBase> {
        const response = await fetch(getApiUrl('knowledge-base/create-one'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create knowledge base: ${response.statusText}`);
        }

        return response.json();
    },

    // Обновить базу знаний
    async update(knowledgeBaseId: string, data: {
        name?: string;
        description?: string;
    }): Promise<KnowledgeBase> {
        const response = await fetch(getApiUrl('knowledge-base/update-one'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                knowledgeBaseId,
                ...data,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update knowledge base: ${response.statusText}`);
        }

        return response.json();
    },

    // Удалить базу знаний
    async delete(knowledgeBaseId: string): Promise<void> {
        const response = await fetch(getApiUrl('knowledge-base/delete-one'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ knowledgeBaseId }),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete knowledge base: ${response.statusText}`);
        }
    },
}; 
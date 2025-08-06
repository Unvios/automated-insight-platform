import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Edit, FileText } from 'lucide-react';
import { knowledgeBaseApi, IKnowledgeBase } from '@/services/knowledgeBase';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [knowledgeBase, setKnowledgeBase] = useState<IKnowledgeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await knowledgeBaseApi.findOne(id);
        setKnowledgeBase(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке базы знаний');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, [id]);

  const handleEdit = () => {
    navigate(`/knowledge-base/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-slate-500">
              Загрузка базы знаний...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !knowledgeBase) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertDescription>
                {error || 'База знаний не найдена'}
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/knowledge-base')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к списку
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">{knowledgeBase.name}</h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-lg font-semibold text-slate-900">Информация о базе знаний</h2>
              </div>
              <Button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Описание</h3>
                <p className="text-slate-600">
                  {knowledgeBase.description || 'Описание отсутствует'}
                </p>
              </div>
            </div>
          </div>

          {/* Здесь можно добавить дополнительные секции, например:
              - Документы в базе знаний
              - Статистика использования
              - Настройки доступа
          */}
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase; 

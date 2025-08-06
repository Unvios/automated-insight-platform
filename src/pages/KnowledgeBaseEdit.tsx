import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { knowledgeBaseApi, KnowledgeBase } from '@/services/knowledgeBase';


const KnowledgeBaseEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { updateKnowledgeBase, loading, error } = useKnowledgeBases();
  
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      if (!id) return;
      
      setLoadingData(true);
      setErrorData(null);
      
      try {
        const data = await knowledgeBaseApi.findOne(id);
        setKnowledgeBase(data);
        setFormData({
          name: data.name,
          description: data.description || '',
        });
      } catch (err) {
        setErrorData(err instanceof Error ? err.message : 'Произошла ошибка при загрузке базы знаний');
      } finally {
        setLoadingData(false);
      }
    };

    fetchKnowledgeBase();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !formData.name.trim()) {
      alert('Пожалуйста, введите название базы знаний');
      return;
    }

    try {
      await updateKnowledgeBase(id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
      navigate(`/knowledge-base/${id}`);
    } catch (err) {
      console.error('Ошибка при обновлении базы знаний:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loadingData) {
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

  if (errorData || !knowledgeBase) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertDescription>
                {errorData || 'База знаний не найдена'}
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
                onClick={() => navigate(`/knowledge-base/${id}`)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold text-slate-900">Редактировать базу знаний</h1>
            </div>
            <p className="text-slate-600">Измените информацию о базе знаний</p>
          </div>

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Название базы знаний *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введите название базы знаний"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                    Описание
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Введите описание базы знаний (необязательно)"
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/knowledge-base/${id}`)}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBaseEdit; 
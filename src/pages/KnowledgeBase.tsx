
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { Alert, AlertDescription } from '@/components/ui/alert';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const { knowledgeBases, loading, error, deleteKnowledgeBase } = useKnowledgeBases();

  const handleView = (id: string) => {
    navigate(`/knowledge-base/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/knowledge-base/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту базу знаний?')) {
      try {
        await deleteKnowledgeBase(id);
      } catch (err) {
        console.error('Ошибка при удалении базы знаний:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Базы знаний</h1>
            <p className="text-slate-600">Управляйте базами знаний для ваших AI агентов</p>
          </div>

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Базы знаний */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Базы знаний</h3>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/knowledge-base/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать базу знаний
              </Button>
            </div>
            
            {loading ? (
              <div className="p-6 text-center text-slate-500">
                Загрузка баз знаний...
              </div>
            ) : knowledgeBases.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Базы знаний не найдены. Создайте первую базу знаний.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Название
                      </th>
                                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-1/3">
                          Действия
                        </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {knowledgeBases.map((kb) => (
                      <tr key={kb.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-slate-400 mr-3" />
                            <span className="text-sm font-medium text-slate-900">{kb.name}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-6 pl-0 whitespace-nowrap text-sm font-medium text-right">
                          <div className="flex space-x-2 justify-start">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleView(kb.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Посмотреть
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(kb.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Редактировать
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(kb.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default KnowledgeBase;

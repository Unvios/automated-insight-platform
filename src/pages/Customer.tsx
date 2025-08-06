import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Phone, User, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/services/customers';

const Customer = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCustomer, deleteCustomer } = useCustomers();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const customerData = await getCustomer(customerId!);
      setCustomer(customerData);
    } catch (error) {
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!customer) return;
    
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteCustomer(customer.id);
      navigate('/customers');
    } catch (error) {
      // Обработка ошибок выполняется в хуке
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'conversation':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500">Загрузка...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500">Клиент не найден</div>
            </div>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/customers')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад к клиентам
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {customer.firstName && customer.lastName 
                    ? `${customer.firstName} ${customer.lastName}`
                    : customer.firstName || customer.lastName || 'Клиент'
                  }
                </h1>
                <p className="text-slate-600">Детали клиента</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Личная информация
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Полное имя</label>
                  <p className="text-slate-900">
                    {customer.firstName && customer.lastName 
                      ? `${customer.firstName} ${customer.lastName}`
                      : customer.firstName || customer.lastName || 'Не указано'
                    }
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Номер телефона
                  </label>
                  <p className="text-slate-900">{customer.phoneNumber}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Сегмент</label>
                  <br />
                  <Badge variant="secondary" className="mt-1">
                    {customer.segment}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Статус</label>
                  <br />
                  <Badge className={`mt-1 ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  История
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Создан</label>
                  <p className="text-slate-900">{formatDate(customer.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Последнее обновление</label>
                  <p className="text-slate-900">{formatDate(customer.updatedAt)}</p>
                </div>

                {customer.lastContactAt && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">Последнее взаимодействие</label>
                    <p className="text-slate-900">{formatDate(customer.lastContactAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {customer.notes && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Примечания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-900 whitespace-pre-wrap">{customer.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customer; 
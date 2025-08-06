
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/useCustomers';
import { validatePhoneNumber, PHONE_VALIDATION_ERROR_MESSAGE } from '@/utils/phoneValidation';

const CustomerCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCustomer } = useCustomers();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    segment: 'Добавлены вручную',
    notes: '',
    status: 'new',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.segment) {
      toast({
        title: "Ошибка валидации",
        description: "Номер телефона и сегмент являются обязательными полями.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      toast({
        title: "Ошибка валидации",
        description: PHONE_VALIDATION_ERROR_MESSAGE,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await createCustomer({
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phoneNumber: formData.phoneNumber,
        segment: formData.segment,
        notes: formData.notes || undefined,
        status: formData.status,
      });
      
      navigate('/customers');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/customers')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к клиентам
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Добавить нового клиента</h1>
              <p className="text-slate-600">Создать новый профиль клиента</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Имя</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Введите имя" 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Введите фамилию" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Номер телефона *</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Введите номер телефона" 
                  required
                />
              </div>

              <div>
                <Label htmlFor="segment">Сегмент клиента *</Label>
                  <select 
                    id="segment" 
                    name="segment"
                    value={formData.segment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  >
                    <option value="">Выберите сегмент</option>
                    <option value="bitrix">bitrix</option>
                    <option value="csv">csv</option>
                    <option value="Добавлены вручную">Добавлены вручную</option>
                  </select>
              </div>

              <div>
                <Label htmlFor="notes">Примечания</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Добавьте любые дополнительные примечания о клиенте" 
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/customers')}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  <User className="h-4 w-4 mr-2" />
                  {loading ? 'Добавление...' : 'Добавить клиента'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerCreate;

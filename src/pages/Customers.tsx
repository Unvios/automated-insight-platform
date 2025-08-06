
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Settings, Users, Eye, Edit, Phone, Upload, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/services/customers';
import CsvImportModal from '@/components/CsvImportModal';

const Customers = () => {
  const navigate = useNavigate();
  const { customers, loading, pagination, filters, fetchCustomers, importCsv, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [importing, setImporting] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const handleFilterChange = (filterType: 'status' | 'segment', value: string) => {
    fetchCustomers({ [filterType]: value, page: 1 });
  };

  // const handleSearchChange = (value: string) => {
  //   setSearchTerm(value);
  //   // При поиске сбрасываем на первую страницу
  //   if (value !== searchTerm) {
  //     fetchCustomers({ page: 1 });
  //   }
  // };

  const handleCsvImport = async (file: File) => {
    try {
      setImporting(true);
      await importCsv(file, {
        segment: 'csv',
        status: 'new',
      });
    } catch (error) {
      console.error('Ошибка импорта:', error);
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) {
      return;
    }

    try {
      setDeletingCustomerId(customerId);
      await deleteCustomer(customerId);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      setDeletingCustomerId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCustomers({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    fetchCustomers({ page: 1, limit: newLimit });
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

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'bitrix':
        return 'bg-purple-100 text-purple-800';
      case 'csv':
        return 'bg-orange-100 text-orange-800';
      case 'Добавлены вручную':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Фильтрация по поиску (если нужно, можно перенести на сервер)
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    const phone = customer.phoneNumber.toLowerCase();
    
    return fullName.includes(searchLower) || phone.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Управление клиентами
              </h1>
              <p className="text-slate-600">
                Управление клиентами и их данными
              </p>
            </div>
            <div className="flex space-x-3">
              {/* <Button 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Интеграция CRM
              </Button> */}
              <CsvImportModal 
                onImport={handleCsvImport}
                importing={importing}
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/customers/add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить клиента
              </Button>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full">
              <div className="flex items-center justify-between h-full">
                <div>
                  <p className="text-sm text-slate-600">Всего клиентов</p>
                  <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full">
            <div className="flex flex-col sm:flex-row gap-4 h-full items-center">
              {/* <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Поиск клиентов по имени или телефону..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div> */}
              <div className="flex space-x-2">
                {/* <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтр
                </Button> */}
                  <select 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.segment}
                    onChange={(e) => handleFilterChange('segment', e.target.value)}
                  >
                    <option value="">Все сегменты</option>
                    <option value="bitrix">bitrix</option>
                    <option value="csv">csv</option>
                    <option value="Добавлены вручную">Добавлены вручную</option>
                  </select>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Все статусы</option>
                  <option value="new">new</option>
                  <option value="conversation">conversation</option>
                  <option value="success">success</option>
                  <option value="failed">failed</option>
                </select>
              </div>
            </div>
          </div>
          </div>

          {/* Search and Filters */}
          

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Все клиенты</h3>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-slate-500">Загрузка клиентов...</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Клиент
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Сегмент
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Последнее взаимодействие
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Создан
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredCustomers.map((customer: Customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {customer.firstName && customer.lastName 
                                ? `${customer.firstName} ${customer.lastName}`
                                : customer.firstName || customer.lastName || 'Неизвестно'
                              }
                            </div>
                            <div className="text-sm text-slate-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {customer.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getSegmentColor(customer.segment)}>
                            {customer.segment}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {customer.lastContactAt ? formatDate(customer.lastContactAt) : 'Неизвестно'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              disabled={deletingCustomerId === customer.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {!loading && filteredCustomers.length === 0 && (
                <div className="p-6 text-center text-slate-500">
                  {searchTerm ? 'Клиенты не найдены.' : 'Клиенты не найдены.'}
                </div>
              )}
            </div>

            {/* Пагинация */}
            {!loading && pagination.total > 0 && (
              <div className="bg-white px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-700">
                      Показано {((pagination.page - 1) * pagination.limit) + 1} до{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} из{' '}
                      {pagination.total} клиентов
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-700">Показать:</span>
                      <select
                        value={pagination.limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        className="border border-slate-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Предыдущая
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                        const page = i + 1;
                        const isCurrentPage = page === pagination.page;
                        
                        return (
                          <Button
                            key={page}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    >
                      Следующая
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;

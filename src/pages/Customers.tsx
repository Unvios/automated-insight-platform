
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Settings, Users, Eye, Edit, Phone } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/services/customers';

const Customers = () => {
  const navigate = useNavigate();
  const { customers, loading, pagination, filters, fetchCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filterType: 'status' | 'segment', value: string) => {
    fetchCustomers({ [filterType]: value || undefined });
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
      case 'Bitrix':
        return 'bg-purple-100 text-purple-800';
      case 'CSV':
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

  const filteredCustomers = customers.filter(customer => {
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
                Customer Management
              </h1>
              <p className="text-slate-600">
                Manage your customer relationships and data
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Integrate CRM
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/customers/add')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Customers</p>
                  <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search customers by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                                  <select 
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.segment}
                    onChange={(e) => handleFilterChange('segment', e.target.value)}
                  >
                    <option value="">All Segments</option>
                    <option value="Bitrix">Bitrix</option>
                    <option value="CSV">CSV</option>
                    <option value="Добавлены вручную">Добавлены вручную</option>
                  </select>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="conversation">Conversation</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">All Customers</h3>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-slate-500">Loading customers...</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Last Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
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
                                : customer.firstName || customer.lastName || 'Unnamed Customer'
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
                          {customer.lastContactAt ? formatDate(customer.lastContactAt) : 'Never'}
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
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
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
                  {searchTerm ? 'No customers found matching your search.' : 'No customers found.'}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;

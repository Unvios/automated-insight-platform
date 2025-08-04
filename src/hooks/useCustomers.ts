import { useState, useEffect } from 'react';
import { customersApi, Customer, CustomersResponse } from '@/services/customers';
import { useToast } from '@/hooks/use-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    segment: '',
  });
  const { toast } = useToast();

  const fetchCustomers = async (params: {
    page?: number;
    limit?: number;
    status?: string;
    segment?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentStatus = params.status !== undefined ? params.status : filters.status;
      const currentSegment = params.segment !== undefined ? params.segment : filters.segment;
      
      const response = await customersApi.findMany({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        status: currentStatus || undefined,
        segment: currentSegment || undefined,
      });

      setCustomers(response.data);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
      });

      if (params.status !== undefined) {
        setFilters(prev => ({ ...prev, status: params.status || '' }));
      }
      if (params.segment !== undefined) {
        setFilters(prev => ({ ...prev, segment: params.segment || '' }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (data: {
    customerId?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    segment: string;
    notes?: string;
    status: string;
    lastContactAt?: string;
  }) => {
    try {
      const newCustomer = await customersApi.create(data);
      setCustomers(prev => [newCustomer, ...prev]);
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      return newCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create customer';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCustomer = async (customerId: string, data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    segment?: string;
    notes?: string;
    status?: string;
    lastContactAt?: string;
  }) => {
    try {
      const updatedCustomer = await customersApi.update(customerId, data);
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? updatedCustomer : customer
        )
      );
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      return updatedCustomer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update customer';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await customersApi.delete(customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete customer';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const getCustomer = async (customerId: string) => {
    try {
      return await customersApi.findOne(customerId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const importCsv = async (
    file: File,
    options: {
      segment?: string;
      status?: string;
      notes?: string;
    } = {}
  ) => {
    try {
      const result = await customersApi.importCsv(file, options);
      
      toast({
        title: "Import Completed",
        description: `Imported ${result.importedCount} customers. ${result.skippedCount} skipped.`,
      });

      if (result.errors.length > 0) {
        console.warn('Import errors:', result.errors);
      }

      fetchCustomers(); // Обновляем список
      return result;
    } catch (error) {
      console.error('Failed to import CSV:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import CSV file",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    pagination,
    filters,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    importCsv,
  };
}; 
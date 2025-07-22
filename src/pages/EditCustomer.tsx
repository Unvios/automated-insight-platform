import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomers } from '@/hooks/useCustomers';
import { Customer } from '@/services/customers';

const EditCustomer = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCustomer, updateCustomer } = useCustomers();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    segment: '',
    notes: '',
    status: 'new',
  });

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const customer = await getCustomer(customerId!);
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        phoneNumber: customer.phoneNumber,
        segment: customer.segment,
        notes: customer.notes || '',
        status: customer.status,
      });
    } catch (error) {
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.segment || !formData.status) {
      toast({
        title: "Validation Error",
        description: "Phone number, segment and status are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await updateCustomer(customerId!, {
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phoneNumber: formData.phoneNumber,
        segment: formData.segment,
        notes: formData.notes || undefined,
        status: formData.status,
      });
      
      navigate(`/customers/${customerId}`);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-500">Loading...</div>
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
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/customers/${customerId}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customer
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Edit Customer</h1>
              <p className="text-slate-600">Update customer information</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name" 
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number" 
                  required
                />
              </div>

              <div>
                <Label htmlFor="segment">Customer Segment *</Label>
                <select 
                  id="segment" 
                  name="segment"
                  value={formData.segment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                >
                  <option value="">Select segment</option>
                  <option value="Bitrix">Bitrix</option>
                  <option value="CSV">CSV</option>
                  <option value="Добавлены вручную">Добавлены вручную</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes about the customer" 
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/customers/${customerId}`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCustomer; 
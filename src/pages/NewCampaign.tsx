
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useAgents } from '@/hooks/useAgents';

const NewCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createCampaign } = useCampaigns();
  const { agents, loading: loadingAgents } = useAgents();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const campaignData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        budget: Number(formData.get('budget')),
        durationMs: Number(formData.get('duration')) * 24 * 60 * 60 * 1000, // конвертируем дни в миллисекунды
        targetAudience: formData.get('target') as string,
        agentId: formData.get('agent') as string,
        knowledgeBaseId: formData.get('knowledge') as string,
      };

      await createCampaign(campaignData);
      navigate('/campaigns');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const segments = [
    'Mock Segment',
  ];

  const kbOptions = [
    'Mock Knowledge Base',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/campaigns')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create New Campaign</h1>
              <p className="text-slate-600">Set up your AI-powered marketing campaign</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input id="name" name="name" placeholder="Enter campaign name" required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe your campaign goals and target audience" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input id="budget" name="budget" type="number" placeholder="5000" required />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" name="duration" type="number" placeholder="30" required />
                </div>
              </div>

              <div>
                <Label htmlFor="target">Target Audience</Label>
                <select id="target" name="target" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select target audience</option>
                  {segments.map((segment) => (
                    <option key={segment} value={segment}>{segment}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="agent">Choose Agent</Label>
                <select id="agent" name="agent" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={loadingAgents}>
                  <option value="">Select agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="knowledge">Knowledge Base Usage</Label>
                <select id="knowledge" name="knowledge" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select knowledge base</option>
                  {kbOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/campaigns')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewCampaign;

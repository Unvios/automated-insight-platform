
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/_Index";
import Campaigns from "./pages/Campaigns";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignEdit from "./pages/CampaignEdit";
import Agents from "./pages/Agents";
import Agent from "./pages/Agent";
import AgentEdit from "./pages/AgentEdit";
import AgentCreate from "./pages/AgentCreate";
import Conversations from "./pages/Conversations";
import Conversation from "./pages/Conversation";
import Customers from "./pages/Customers";
import CustomerCreate from "./pages/CustomerCreate";
import Customer from "./pages/Customer";
import CustomerEdit from "./pages/CustomerEdit";
import KnowledgeBases from "./pages/KnowledgeBases";
import KnowledgeBaseCreate from "./pages/KnowledgeBaseCreate";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseEdit from "./pages/KnowledgeBaseEdit";
import NotFound from "./pages/_NotFound";
import Campaign from "./pages/Campaign";

const queryClient = new QueryClient();

const basename = import.meta.env.VITE_BASE_PATH || '/';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<CampaignCreate />} />
          <Route path="/campaigns/:id" element={<Campaign />} />
          <Route path="/campaigns/:id/edit" element={<CampaignEdit />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/create" element={<AgentCreate />} />
          <Route path="/agents/:id" element={<Agent />} />
          <Route path="/agents/:id/test" element={<AgentEdit />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:id/:type" element={<Conversation />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<CustomerCreate />} />
          <Route path="/customers/:customerId" element={<Customer />} />
          <Route path="/customers/:customerId/edit" element={<CustomerEdit />} />
          <Route path="/knowledge-base" element={<KnowledgeBases />} />
          <Route path="/knowledge-base/create" element={<KnowledgeBaseCreate />} />
          <Route path="/knowledge-base/:id" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/:id/edit" element={<KnowledgeBaseEdit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

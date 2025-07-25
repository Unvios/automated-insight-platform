
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import NewCampaign from "./pages/NewCampaign";
import EditCampaign from "./pages/EditCampaign";
import CampaignAgentCall from "./pages/CampaignAgentCall";
import AICampaignWizard from "./pages/AICampaignWizard";
import Agents from "./pages/Agents";
import AgentDetails from "./pages/AgentDetails";
import TestAgent from "./pages/TestAgent";
import CreateAgent from "./pages/CreateAgent";
import Conversations from "./pages/Conversations";
import ConversationDetails from "./pages/ConversationDetails";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import CustomerDetails from "./pages/CustomerDetails";
import EditCustomer from "./pages/EditCustomer";
import AgentPerformanceReview from "./pages/AgentPerformanceReview";
import KnowledgeBase from "./pages/KnowledgeBase";
import CreateKnowledgeBase from "./pages/CreateKnowledgeBase";
import KnowledgeBaseDetails from "./pages/KnowledgeBaseDetails";
import EditKnowledgeBase from "./pages/EditKnowledgeBase";
import NotFound from "./pages/NotFound";

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
          <Route path="/campaigns/new" element={<NewCampaign />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/campaigns/:id/edit" element={<EditCampaign />} />
          <Route path="/campaigns/:id/agent" element={<CampaignAgentCall />} />
          <Route path="/ai-campaign-wizard" element={<AICampaignWizard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/create" element={<CreateAgent />} />
          <Route path="/agents/:id" element={<AgentDetails />} />
          <Route path="/agents/:id/test" element={<TestAgent />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:id/:type" element={<ConversationDetails />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/:customerId" element={<CustomerDetails />} />
          <Route path="/customers/:customerId/edit" element={<EditCustomer />} />
          <Route path="/agent-performance-review" element={<AgentPerformanceReview />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/create" element={<CreateKnowledgeBase />} />
          <Route path="/knowledge-base/:id" element={<KnowledgeBaseDetails />} />
          <Route path="/knowledge-base/:id/edit" element={<EditKnowledgeBase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

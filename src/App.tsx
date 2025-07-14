
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import CampaignDetails from "./pages/CampaignDetails";
import NewCampaign from "./pages/NewCampaign";
import AICampaignWizard from "./pages/AICampaignWizard";
import Agents from "./pages/Agents";
import AgentDetails from "./pages/AgentDetails";
import TestAgent from "./pages/TestAgent";
import CreateAgent from "./pages/CreateAgent";
import Conversations from "./pages/Conversations";
import ConversationDetails from "./pages/ConversationDetails";
import AutoSending from "./pages/AutoSending";
import Channels from "./pages/Channels";
import Customers from "./pages/Customers";
import AddCustomer from "./pages/AddCustomer";
import KnowledgeBase from "./pages/KnowledgeBase";
import AddDocument from "./pages/AddDocument";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import AgentPerformanceReview from "./pages/AgentPerformanceReview";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import SendingRuleDetails from "./pages/SendingRuleDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<NewCampaign />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/ai-campaign-wizard" element={<AICampaignWizard />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/create" element={<CreateAgent />} />
          <Route path="/agents/:id" element={<AgentDetails />} />
          <Route path="/agents/:id/test" element={<TestAgent />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/conversations/:id/:type" element={<ConversationDetails />} />
          <Route path="/auto-sending" element={<AutoSending />} />
          <Route path="/auto-sending/:id" element={<SendingRuleDetails />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/knowledge-base/add-document" element={<AddDocument />} />
          <Route path="/team" element={<Team />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/agent-performance-review" element={<AgentPerformanceReview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings/integrations" element={<Integrations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

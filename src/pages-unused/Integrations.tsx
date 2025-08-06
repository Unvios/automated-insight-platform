
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Zap, Mail, MessageSquare, Database, CreditCard, Bot } from 'lucide-react';

// const Integrations = () => {
//   const navigate = useNavigate();

//   const integrations = [
//     {
//       name: 'Zapier',
//       description: 'Automate workflows with 5000+ apps',
//       icon: Zap,
//       status: 'available',
//       category: 'Automation'
//     },
//     {
//       name: 'Slack',
//       description: 'Get notifications in your Slack workspace',
//       icon: MessageSquare,
//       status: 'connected',
//       category: 'Communication'
//     },
//     {
//       name: 'Gmail',
//       description: 'Send emails directly from campaigns',
//       icon: Mail,
//       status: 'available',
//       category: 'Email'
//     },
//     {
//       name: 'Salesforce',
//       description: 'Sync customer data with Salesforce CRM',
//       icon: Database,
//       status: 'available',
//       category: 'CRM'
//     },
//     {
//       name: 'Stripe',
//       description: 'Process payments and track revenue',
//       icon: CreditCard,
//       status: 'available',
//       category: 'Payments'
//     },
//     {
//       name: 'OpenAI',
//       description: 'Advanced AI models for conversations',
//       icon: Bot,
//       status: 'connected',
//       category: 'AI'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="flex items-center mb-8">
//             <Button 
//               variant="ghost" 
//               onClick={() => navigate('/settings')}
//               className="mr-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Settings
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
//               <p className="text-slate-600">Connect your favorite tools and services</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {integrations.map((integration) => (
//               <div key={integration.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <integration.icon className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
//                       <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
//                         {integration.category}
//                       </span>
//                     </div>
//                   </div>
//                   <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     integration.status === 'connected' 
//                       ? 'bg-green-100 text-green-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {integration.status}
//                   </span>
//                 </div>

//                 <p className="text-sm text-slate-600 mb-4">{integration.description}</p>

//                 <Button 
//                   className={`w-full ${
//                     integration.status === 'connected' 
//                       ? 'bg-red-600 hover:bg-red-700' 
//                       : 'bg-blue-600 hover:bg-blue-700'
//                   }`}
//                 >
//                   {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Integrations;

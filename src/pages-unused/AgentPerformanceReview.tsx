
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Bot, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

// const AgentPerformanceReview = () => {
//   const navigate = useNavigate();

//   const agentReports = [
//     {
//       name: 'Sarah',
//       role: 'Sales Expert',
//       metrics: {
//         conversations: 1247,
//         successRate: 91.2,
//         avgResponseTime: '1.2s',
//         customerSatisfaction: 4.8
//       },
//       recommendations: [
//         'Add more product pricing information to prompt',
//         'Include objection handling techniques',
//         'Expand knowledge base for technical questions'
//       ],
//       status: 'excellent'
//     },
//     {
//       name: 'Mike',
//       role: 'Support Specialist',
//       metrics: {
//         conversations: 892,
//         successRate: 88.7,
//         avgResponseTime: '2.1s',
//         customerSatisfaction: 4.6
//       },
//       recommendations: [
//         'Improve response time optimization',
//         'Add more troubleshooting scenarios',
//         'Enhance empathy training in prompts'
//       ],
//       status: 'good'
//     },
//     {
//       name: 'Emma',
//       role: 'HR Assistant',
//       metrics: {
//         conversations: 734,
//         successRate: 95.1,
//         avgResponseTime: '0.9s',
//         customerSatisfaction: 4.9
//       },
//       recommendations: [
//         'Maintain current prompt configuration',
//         'Consider expanding to handle more complex HR queries'
//       ],
//       status: 'excellent'
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
//               onClick={() => navigate('/analytics')}
//               className="mr-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Analytics
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Agent Performance Review</h1>
//               <p className="text-slate-600">Detailed analysis and recommendations for AI agents</p>
//             </div>
//           </div>

//           {/* Agent Reports */}
//           <div className="space-y-6">
//             {agentReports.map((agent, index) => (
//               <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <div className="flex items-start justify-between mb-6">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                       <Bot className="h-6 w-6 text-blue-600" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">{agent.name}</h3>
//                       <p className="text-sm text-slate-600">{agent.role}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {agent.status === 'excellent' ? 
//                       <CheckCircle className="h-5 w-5 text-green-600" /> : 
//                       <AlertCircle className="h-5 w-5 text-yellow-600" />
//                     }
//                     <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//                       agent.status === 'excellent' 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {agent.status === 'excellent' ? 'Excellent' : 'Good'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm text-slate-600">Conversations</span>
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                     </div>
//                     <p className="text-xl font-bold text-slate-900">{agent.metrics.conversations.toLocaleString()}</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm text-slate-600">Success Rate</span>
//                       {agent.metrics.successRate > 90 ? 
//                         <TrendingUp className="h-4 w-4 text-green-600" /> :
//                         <TrendingDown className="h-4 w-4 text-yellow-600" />
//                       }
//                     </div>
//                     <p className="text-xl font-bold text-slate-900">{agent.metrics.successRate}%</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm text-slate-600">Response Time</span>
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                     </div>
//                     <p className="text-xl font-bold text-slate-900">{agent.metrics.avgResponseTime}</p>
//                   </div>

//                   <div className="bg-slate-50 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-sm text-slate-600">Satisfaction</span>
//                       <TrendingUp className="h-4 w-4 text-green-600" />
//                     </div>
//                     <p className="text-xl font-bold text-slate-900">{agent.metrics.customerSatisfaction}/5</p>
//                   </div>
//                 </div>

//                 <div className="border-t border-slate-200 pt-6">
//                   <h4 className="text-md font-semibold text-slate-900 mb-3">Recommendations</h4>
//                   <ul className="space-y-2">
//                     {agent.recommendations.map((recommendation, recIndex) => (
//                       <li key={recIndex} className="flex items-start space-x-2">
//                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-sm text-slate-600">{recommendation}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="flex justify-end mt-6">
//                   <Button variant="outline" className="mr-2">
//                     Export Report
//                   </Button>
//                   <Button className="bg-blue-600 hover:bg-blue-700">
//                     Apply Recommendations
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AgentPerformanceReview;

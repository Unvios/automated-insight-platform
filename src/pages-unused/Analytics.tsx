
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { TrendingUp, TrendingDown, Users, MessageSquare, Percent, Clock, BarChart3 } from 'lucide-react';

// const Analytics = () => {
//   const navigate = useNavigate();

//   const agents = [
//     { name: 'Sarah', version: 'v2.1', conversations: 1247, conversionRate: 31.2, trend: 'up' },
//     { name: 'Mike', version: 'v1.8', conversations: 892, conversionRate: 28.7, trend: 'down' },
//     { name: 'Emma', version: 'v2.0', conversations: 734, conversionRate: 35.1, trend: 'up' }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 mb-2">
//                 Analytics Dashboard
//               </h1>
//               <p className="text-slate-600">
//                 Track performance metrics and insights
//               </p>
//             </div>
//             <Button 
//               className="bg-blue-600 hover:bg-blue-700"
//               onClick={() => navigate('/agent-performance-review')}
//             >
//               <BarChart3 className="h-4 w-4 mr-2" />
//               Agent Performance Review
//             </Button>
//           </div>

//           {/* Key Metrics */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Users className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div className="flex items-center text-green-600">
//                   <TrendingUp className="h-4 w-4 mr-1" />
//                   <span className="text-sm font-medium">+5.2%</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-slate-900">2,847</p>
//                 <p className="text-sm text-slate-600">Total Customers</p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <MessageSquare className="h-6 w-6 text-green-600" />
//                 </div>
//                 <div className="flex items-center text-green-600">
//                   <TrendingUp className="h-4 w-4 mr-1" />
//                   <span className="text-sm font-medium">+12%</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-slate-900">15,247</p>
//                 <p className="text-sm text-slate-600">Total Conversations</p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Percent className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <div className="flex items-center text-green-600">
//                   <TrendingUp className="h-4 w-4 mr-1" />
//                   <span className="text-sm font-medium">+8.5%</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-slate-900">31.2%</p>
//                 <p className="text-sm text-slate-600">Conversion Rate</p>
//               </div>
//             </div>
//           </div>

//           {/* Performance Tables */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             {/* Agent Performance */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900 mb-4">Agent Performance</h3>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Agent</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Version</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Conversations</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Conv. Rate</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {agents.map((agent, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-3 text-sm font-medium text-slate-900">{agent.name}</td>
//                         <td className="px-4 py-3 text-sm text-slate-600">{agent.version}</td>
//                         <td className="px-4 py-3 text-sm text-slate-900">{agent.conversations.toLocaleString()}</td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-sm font-medium text-slate-900">{agent.conversionRate}%</span>
//                             {agent.trend === 'up' ? 
//                               <TrendingUp className="h-4 w-4 text-green-600" /> : 
//                               <TrendingDown className="h-4 w-4 text-red-600" />
//                             }
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Conversation Performance */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversation Performance</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-2">
//                     <Clock className="h-4 w-4 text-slate-500" />
//                     <span className="text-sm text-slate-600">Response Time</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-slate-900">1.4s</span>
//                     <TrendingDown className="h-4 w-4 text-green-600" />
//                   </div>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-2">
//                     <MessageSquare className="h-4 w-4 text-slate-500" />
//                     <span className="text-sm text-slate-600">Max Parallel Conversations</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-slate-900">45</span>
//                     <TrendingUp className="h-4 w-4 text-green-600" />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-2">
//                     <Users className="h-4 w-4 text-slate-500" />
//                     <span className="text-sm text-slate-600">Total Conversations</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-slate-900">15,247</span>
//                     <TrendingUp className="h-4 w-4 text-green-600" />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center space-x-2">
//                     <Percent className="h-4 w-4 text-slate-500" />
//                     <span className="text-sm text-slate-600">Conversion Rate</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-slate-900">31.2%</span>
//                     <TrendingUp className="h-4 w-4 text-green-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

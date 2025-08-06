
// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Edit, Trash2, Play, Pause, BarChart3 } from 'lucide-react';

// const SendingRuleDetails = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const rule = {
//     id: 1,
//     name: 'Welcome Message',
//     trigger: 'New Customer',
//     delay: '0 minutes',
//     agent: 'Customer Support Agent',
//     status: 'Active',
//     sent: 127,
//     opened: 89,
//     clicked: 23,
//     template: 'Hello {{customer_name}}, welcome to our platform! How can I assist you today?',
//     created: '2024-01-15',
//     lastRun: '2024-01-20 14:30'
//   };

//   const recentRuns = [
//     { id: 1, date: '2024-01-20 14:30', recipient: 'john@example.com', status: 'Delivered', opened: true },
//     { id: 2, date: '2024-01-20 12:15', recipient: 'sarah@example.com', status: 'Delivered', opened: true },
//     { id: 3, date: '2024-01-20 10:45', recipient: 'mike@example.com', status: 'Delivered', opened: false },
//     { id: 4, date: '2024-01-20 09:20', recipient: 'emma@example.com', status: 'Failed', opened: false },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center">
//               <Button 
//                 variant="ghost" 
//                 onClick={() => navigate('/auto-sending')}
//                 className="mr-4"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Rules
//               </Button>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900">{rule.name}</h1>
//                 <p className="text-slate-600">Sending rule details and performance</p>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <Button variant="outline">
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit Rule
//               </Button>
//               <Button variant="outline">
//                 {rule.status === 'Active' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
//                 {rule.status === 'Active' ? 'Pause' : 'Activate'}
//               </Button>
//               <Button variant="destructive">
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Delete
//               </Button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Rule Configuration */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Rule Configuration</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm font-medium text-slate-600">Trigger</label>
//                     <p className="text-slate-900">{rule.trigger}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-slate-600">Delay</label>
//                     <p className="text-slate-900">{rule.delay}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-slate-600">Agent</label>
//                     <p className="text-slate-900">{rule.agent}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-slate-600">Status</label>
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       rule.status === 'Active' 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {rule.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Message Template</h3>
//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <pre className="text-sm text-slate-700 whitespace-pre-wrap">{rule.template}</pre>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Runs</h3>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b border-slate-200">
//                         <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
//                         <th className="text-left py-3 px-4 font-medium text-slate-700">Recipient</th>
//                         <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
//                         <th className="text-left py-3 px-4 font-medium text-slate-700">Opened</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {recentRuns.map((run) => (
//                         <tr key={run.id} className="border-b border-slate-100">
//                           <td className="py-3 px-4 text-slate-600">{run.date}</td>
//                           <td className="py-3 px-4 text-slate-600">{run.recipient}</td>
//                           <td className="py-3 px-4">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                               run.status === 'Delivered' 
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-red-100 text-red-800'
//                             }`}>
//                               {run.status}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4">
//                             {run.opened ? (
//                               <span className="text-green-600">Yes</span>
//                             ) : (
//                               <span className="text-slate-400">No</span>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             {/* Performance Stats */}
//             <div className="space-y-6">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-sm text-slate-600">Messages Sent</span>
//                       <span className="text-lg font-semibold text-slate-900">{rule.sent}</span>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-sm text-slate-600">Open Rate</span>
//                       <span className="text-lg font-semibold text-green-600">
//                         {Math.round((rule.opened/rule.sent)*100)}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full" 
//                         style={{ width: `${(rule.opened/rule.sent)*100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-sm text-slate-600">Click Rate</span>
//                       <span className="text-lg font-semibold text-blue-600">
//                         {Math.round((rule.clicked/rule.sent)*100)}%
//                       </span>
//                     </div>
//                     <div className="w-full bg-slate-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-500 h-2 rounded-full" 
//                         style={{ width: `${(rule.clicked/rule.sent)*100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-4">Rule Info</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <span className="text-sm text-slate-600">Created</span>
//                     <p className="text-slate-900">{rule.created}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-slate-600">Last Run</span>
//                     <p className="text-slate-900">{rule.lastRun}</p>
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

// export default SendingRuleDetails;

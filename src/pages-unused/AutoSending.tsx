
// import React, { useState } from 'react';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Plus, Clock, Users, MessageSquare, Settings, Trash2, Edit } from 'lucide-react';

// const AutoSending = () => {
//   const [rules, setRules] = useState([
//     {
//       id: 1,
//       name: 'Welcome Message',
//       trigger: 'New Customer',
//       delay: '0 minutes',
//       agent: 'Customer Support Agent',
//       status: 'Active',
//       sent: 127,
//       opened: 89,
//       clicked: 23
//     },
//     {
//       id: 2,
//       name: 'Follow-up Sequence',
//       trigger: 'No Response (24h)',
//       delay: '24 hours',
//       agent: 'Sales Agent',
//       status: 'Active',
//       sent: 45,
//       opened: 32,
//       clicked: 8
//     },
//     {
//       id: 3,
//       name: 'Abandoned Cart',
//       trigger: 'Cart Abandoned',
//       delay: '2 hours',
//       agent: 'E-commerce Agent',
//       status: 'Paused',
//       sent: 67,
//       opened: 34,
//       clicked: 12
//     }
//   ]);

//   const triggers = [
//     'New Customer',
//     'No Response (24h)',
//     'Cart Abandoned',
//     'Order Completed',
//     'Trial Expired',
//     'Custom Event'
//   ];

//   const agents = [
//     'Customer Support Agent',
//     'Sales Agent',
//     'E-commerce Agent',
//     'Technical Support Agent'
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-900 mb-2">
//                   Auto Sending Rules
//                 </h1>
//                 <p className="text-slate-600">
//                   Set up automated message sequences based on customer behavior
//                 </p>
//               </div>
//               <Button className="bg-blue-600 hover:bg-blue-700">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create New Rule
//               </Button>
//             </div>
//           </div>

//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-600">Active Rules</p>
//                   <p className="text-2xl font-bold text-slate-900">2</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Settings className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-600">Messages Sent</p>
//                   <p className="text-2xl font-bold text-slate-900">239</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <MessageSquare className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-600">Open Rate</p>
//                   <p className="text-2xl font-bold text-slate-900">67%</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Users className="h-6 w-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-slate-600">Click Rate</p>
//                   <p className="text-2xl font-bold text-slate-900">18%</p>
//                 </div>
//                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <Clock className="h-6 w-6 text-orange-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Rules Table */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//             <div className="p-6 border-b border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900">Sending Rules</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-slate-200">
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Rule Name</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Trigger</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Delay</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Agent</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Performance</th>
//                     <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rules.map((rule) => (
//                     <tr key={rule.id} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="py-4 px-6">
//                         <a 
//                           href={`/auto-sending/${rule.id}`}
//                           className="font-medium text-blue-600 hover:text-blue-800"
//                         >
//                           {rule.name}
//                         </a>
//                       </td>
//                       <td className="py-4 px-6 text-slate-600">{rule.trigger}</td>
//                       <td className="py-4 px-6 text-slate-600">{rule.delay}</td>
//                       <td className="py-4 px-6 text-slate-600">{rule.agent}</td>
//                       <td className="py-4 px-6">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           rule.status === 'Active' 
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {rule.status}
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         <div className="text-sm">
//                           <div className="text-slate-900">{rule.sent} sent</div>
//                           <div className="text-slate-500">{Math.round((rule.opened/rule.sent)*100)}% opened</div>
//                         </div>
//                       </td>
//                       <td className="py-4 px-6">
//                         <div className="flex items-center space-x-2">
//                           <Button variant="ghost" size="sm">
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Create Rule Form */}
//           <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-slate-900 mb-6">Create New Rule</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Rule Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter rule name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Trigger Event
//                 </label>
//                 <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                   <option value="">Select trigger</option>
//                   {triggers.map((trigger) => (
//                     <option key={trigger} value={trigger}>{trigger}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Delay
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="0"
//                   />
//                   <select className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                     <option value="minutes">Minutes</option>
//                     <option value="hours">Hours</option>
//                     <option value="days">Days</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Agent
//                 </label>
//                 <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                   <option value="">Select agent</option>
//                   {agents.map((agent) => (
//                     <option key={agent} value={agent}>{agent}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Message Template
//                 </label>
//                 <textarea
//                   rows={4}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter your message template here..."
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <div className="flex items-center space-x-4">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" />
//                     <span className="text-sm text-slate-600">Enable rule immediately</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input type="checkbox" className="mr-2" />
//                     <span className="text-sm text-slate-600">Send test message</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6">
//               <Button className="bg-blue-600 hover:bg-blue-700">
//                 Create Rule
//               </Button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AutoSending;

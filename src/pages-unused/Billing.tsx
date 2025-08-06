
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, CreditCard, History, Plus, Check } from 'lucide-react';

// const Billing = () => {
//   const navigate = useNavigate();

//   const tariffs = [
//     {
//       name: 'Starter',
//       price: '$29',
//       period: '/month',
//       features: [
//         '1,000 conversations/month',
//         '2 AI agents',
//         'Basic analytics',
//         'Email support'
//       ],
//       current: false
//     },
//     {
//       name: 'Professional',
//       price: '$99',
//       period: '/month',
//       features: [
//         '10,000 conversations/month',
//         '10 AI agents',
//         'Advanced analytics',
//         'Priority support',
//         'Custom integrations'
//       ],
//       current: true
//     },
//     {
//       name: 'Enterprise',
//       price: '$299',
//       period: '/month',
//       features: [
//         'Unlimited conversations',
//         'Unlimited AI agents',
//         'Custom analytics',
//         '24/7 phone support',
//         'White-label solution',
//         'Dedicated account manager'
//       ],
//       current: false
//     }
//   ];

//   const paymentHistory = [
//     {
//       id: 1,
//       date: '2024-01-15',
//       amount: '$99.00',
//       plan: 'Professional',
//       status: 'Paid',
//       invoice: 'INV-2024-001'
//     },
//     {
//       id: 2,
//       date: '2023-12-15',
//       amount: '$99.00',
//       plan: 'Professional',
//       status: 'Paid',
//       invoice: 'INV-2023-012'
//     },
//     {
//       id: 3,
//       date: '2023-11-15',
//       amount: '$99.00',
//       plan: 'Professional',
//       status: 'Paid',
//       invoice: 'INV-2023-011'
//     },
//     {
//       id: 4,
//       date: '2023-10-15',
//       amount: '$29.00',
//       plan: 'Starter',
//       status: 'Paid',
//       invoice: 'INV-2023-010'
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
//               <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
//               <p className="text-slate-600">Manage your subscription and billing details</p>
//             </div>
//           </div>

//           {/* Current Plan */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
//             <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Plan</h3>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xl font-bold text-blue-600">Professional Plan</p>
//                 <p className="text-slate-600">Next billing date: February 15, 2024</p>
//                 <p className="text-slate-600">$99.00/month</p>
//               </div>
//               <div className="flex space-x-3">
//                 <Button variant="outline">
//                   <CreditCard className="h-4 w-4 mr-2" />
//                   Update Payment Method
//                 </Button>
//                 <Button variant="outline">Cancel Subscription</Button>
//               </div>
//             </div>
//           </div>

//           {/* Pay as you go - moved up */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="text-lg font-semibold text-slate-900 mb-2">Pay as you go</h4>
//                 <p className="text-slate-600 mb-2">$0.05 per conversation</p>
//                 <p className="text-sm text-slate-500">Perfect for testing or irregular usage</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="text-right">
//                   <p className="text-sm text-slate-600">Current Balance</p>
//                   <p className="text-xl font-bold text-green-600">$45.30</p>
//                 </div>
//                 <Button>
//                   <Plus className="h-4 w-4 mr-2" />
//                   Top Up
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Pricing Plans */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-slate-900 mb-6">Pricing Plans</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {tariffs.map((tariff) => (
//                 <div key={tariff.name} className={`bg-white rounded-xl p-6 shadow-sm border ${
//                   tariff.current ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
//                 }`}>
//                   {tariff.current && (
//                     <div className="text-center mb-4">
//                       <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                         Current Plan
//                       </span>
//                     </div>
//                   )}
//                   <div className="text-center mb-6">
//                     <h4 className="text-xl font-bold text-slate-900 mb-2">{tariff.name}</h4>
//                     <div className="mb-4">
//                       <span className="text-3xl font-bold text-slate-900">{tariff.price}</span>
//                       <span className="text-slate-600">{tariff.period}</span>
//                     </div>
//                   </div>
//                   <ul className="space-y-3 mb-6">
//                     {tariff.features.map((feature, index) => (
//                       <li key={index} className="flex items-center">
//                         <Check className="h-4 w-4 text-green-500 mr-3" />
//                         <span className="text-sm text-slate-600">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <Button className={`w-full ${
//                     tariff.current 
//                       ? 'bg-slate-400 hover:bg-slate-500' 
//                       : 'bg-blue-600 hover:bg-blue-700'
//                   }`} disabled={tariff.current}>
//                     {tariff.current ? 'Current Plan' : 'Choose Plan'}
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Payment History */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
//               <Button variant="outline">
//                 <History className="h-4 w-4 mr-2" />
//                 Download All
//               </Button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-200">
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Plan</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Invoice</th>
//                     <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paymentHistory.map((payment) => (
//                     <tr key={payment.id} className="border-b border-slate-100">
//                       <td className="py-3 px-4 text-slate-600">{payment.date}</td>
//                       <td className="py-3 px-4 font-semibold text-slate-900">{payment.amount}</td>
//                       <td className="py-3 px-4 text-slate-600">{payment.plan}</td>
//                       <td className="py-3 px-4">
//                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                           {payment.status}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4 text-slate-600">{payment.invoice}</td>
//                       <td className="py-3 px-4">
//                         <Button variant="ghost" size="sm">Download</Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Billing;

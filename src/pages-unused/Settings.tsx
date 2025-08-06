
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Database, Zap } from 'lucide-react';

// const Settings = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-900 mb-2">
//               Settings
//             </h1>
//             <p className="text-slate-600">
//               Manage your account and application preferences
//             </p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Settings Navigation */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900 mb-4">Settings Menu</h3>
//               <nav className="space-y-2">
//                 <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-700 font-medium">
//                   <User className="h-4 w-4 mr-3" />
//                   Account Settings
//                 </a>
//                 <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-50">
//                   <Bell className="h-4 w-4 mr-3" />
//                   Notifications
//                 </a>
//                 <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-50">
//                   <Shield className="h-4 w-4 mr-3" />
//                   Security
//                 </a>
//                 <button 
//                   onClick={() => navigate('/billing')}
//                   className="flex items-center px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-50 w-full text-left"
//                 >
//                   <CreditCard className="h-4 w-4 mr-3" />
//                   Billing
//                 </button>
//                 <a href="#" className="flex items-center px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-50">
//                   <Database className="h-4 w-4 mr-3" />
//                   Data & Privacy
//                 </a>
//                 <button 
//                   onClick={() => navigate('/settings/integrations')}
//                   className="flex items-center px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-50 w-full text-left"
//                 >
//                   <Zap className="h-4 w-4 mr-3" />
//                   Integrations
//                 </button>
//               </nav>
//             </div>

//             {/* Account Settings */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-6">Account Information</h3>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         First Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         defaultValue="John"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-slate-700 mb-2">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         defaultValue="Doe"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       defaultValue="john.doe@company.com"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Company
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       defaultValue="TechCorp Inc."
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end mt-6">
//                   <Button className="bg-blue-600 hover:bg-blue-700">
//                     Save Changes
//                   </Button>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-slate-900">Email Notifications</p>
//                       <p className="text-sm text-slate-600">Receive updates about campaigns and conversations</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked />
//                       <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-slate-900">Push Notifications</p>
//                       <p className="text-sm text-slate-600">Get notified about urgent conversations</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" defaultChecked />
//                       <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-slate-900">Weekly Reports</p>
//                       <p className="text-sm text-slate-600">Summary of your automation performance</p>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input type="checkbox" className="sr-only peer" />
//                       <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//                 <h3 className="text-lg font-semibold text-slate-900 mb-6">AI Model Preferences</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Default AI Model
//                     </label>
//                     <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                       <option>GPT-4 Turbo</option>
//                       <option>GPT-4</option>
//                       <option>GPT-3.5 Turbo</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Response Temperature
//                     </label>
//                     <input
//                       type="range"
//                       min="0"
//                       max="1"
//                       step="0.1"
//                       defaultValue="0.3"
//                       className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
//                     />
//                     <div className="flex justify-between text-xs text-slate-500 mt-1">
//                       <span>Focused (0)</span>
//                       <span>Creative (1)</span>
//                     </div>
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

// export default Settings;

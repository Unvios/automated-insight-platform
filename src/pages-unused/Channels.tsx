
// import React, { useState } from 'react';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Plus, Settings, Trash2, MessageSquare, Phone, Globe, Users, Key, Edit } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// const Channels = () => {
//   const [channels, setChannels] = useState([
//     {
//       id: 1,
//       name: 'Main Website Chat',
//       type: 'sitechat',
//       status: 'active',
//       messages: 234,
//       segment: 'General Support',
//       credentials: { widget_id: 'wc_123456' }
//     },
//     {
//       id: 2,
//       name: 'WhatsApp Business',
//       type: 'whatsapp',
//       status: 'active',
//       messages: 156,
//       segment: 'Sales Inquiries',
//       credentials: { phone_number: '+1234567890', api_token: '***' }
//     },
//     {
//       id: 3,
//       name: 'Facebook Page',
//       type: 'facebook',
//       status: 'inactive',
//       messages: 89,
//       segment: 'Marketing',
//       credentials: { page_id: 'fb_987654321' }
//     }
//   ]);

//   const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
//   const [selectedChannel, setSelectedChannel] = useState(null);
//   const [newChannel, setNewChannel] = useState({
//     name: '',
//     type: '',
//     segment: '',
//     credentials: {}
//   });

//   const channelTypes = [
//     { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'green' },
//     { value: 'telegram', label: 'Telegram', icon: MessageSquare, color: 'blue' },
//     { value: 'sitechat', label: 'Site Chat', icon: Globe, color: 'purple' },
//     { value: 'facebook', label: 'Facebook', icon: MessageSquare, color: 'blue' },
//     { value: 'instagram', label: 'Instagram', icon: MessageSquare, color: 'pink' },
//     { value: 'linkedin', label: 'LinkedIn', icon: MessageSquare, color: 'blue' },
//     { value: 'sms', label: 'SMS', icon: Phone, color: 'green' },
//     { value: 'email', label: 'Email', icon: MessageSquare, color: 'gray' }
//   ];

//   const getChannelIcon = (type) => {
//     const channelType = channelTypes.find(ct => ct.value === type);
//     return channelType ? channelType.icon : MessageSquare;
//   };

//   const getChannelColor = (type) => {
//     const channelType = channelTypes.find(ct => ct.value === type);
//     return channelType ? channelType.color : 'gray';
//   };

//   const handleAddChannel = () => {
//     const channel = {
//       id: Date.now(),
//       ...newChannel,
//       status: 'active',
//       messages: 0
//     };
//     setChannels([...channels, channel]);
//     setNewChannel({ name: '', type: '', segment: '', credentials: {} });
//     setIsAddChannelOpen(false);
//   };

//   const handleDeleteChannel = (id) => {
//     setChannels(channels.filter(c => c.id !== id));
//   };

//   const renderCredentialFields = (type) => {
//     switch (type) {
//       case 'whatsapp':
//         return (
//           <>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <Input id="phone" placeholder="+1234567890" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="api_token">API Token</Label>
//               <Input id="api_token" type="password" placeholder="Enter API token" />
//             </div>
//           </>
//         );
//       case 'telegram':
//         return (
//           <div className="space-y-2">
//             <Label htmlFor="bot_token">Bot Token</Label>
//             <Input id="bot_token" type="password" placeholder="Enter bot token" />
//           </div>
//         );
//       case 'facebook':
//         return (
//           <>
//             <div className="space-y-2">
//               <Label htmlFor="page_id">Page ID</Label>
//               <Input id="page_id" placeholder="Enter Facebook Page ID" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="access_token">Access Token</Label>
//               <Input id="access_token" type="password" placeholder="Enter access token" />
//             </div>
//           </>
//         );
//       case 'sitechat':
//         return (
//           <div className="space-y-2">
//             <Label htmlFor="widget_id">Widget ID</Label>
//             <Input id="widget_id" placeholder="Enter widget ID" />
//           </div>
//         );
//       default:
//         return (
//           <div className="space-y-2">
//             <Label htmlFor="api_key">API Key</Label>
//             <Input id="api_key" type="password" placeholder="Enter API key" />
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900 mb-2">
//                 Communication Channels
//               </h1>
//               <p className="text-slate-600">
//                 Manage your incoming communication channels and settings
//               </p>
//             </div>
//             <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
//               <DialogTrigger asChild>
//                 <Button className="bg-blue-600 hover:bg-blue-700">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Channel
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                   <DialogTitle>Add New Channel</DialogTitle>
//                 </DialogHeader>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Channel Name</Label>
//                     <Input 
//                       id="name" 
//                       value={newChannel.name}
//                       onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
//                       placeholder="Enter channel name" 
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="type">Channel Type</Label>
//                     <Select value={newChannel.type} onValueChange={(value) => setNewChannel({...newChannel, type: value})}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select channel type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {channelTypes.map((type) => (
//                           <SelectItem key={type.value} value={type.value}>
//                             {type.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="segment">User Segment</Label>
//                     <Input 
//                       id="segment" 
//                       value={newChannel.segment}
//                       onChange={(e) => setNewChannel({...newChannel, segment: e.target.value})}
//                       placeholder="e.g., Sales, Support, Marketing" 
//                     />
//                   </div>
//                   {newChannel.type && (
//                     <div className="space-y-4">
//                       <h4 className="font-medium text-slate-900">Credentials</h4>
//                       {renderCredentialFields(newChannel.type)}
//                     </div>
//                   )}
//                   <Button onClick={handleAddChannel} className="w-full">
//                     Add Channel
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Channel Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-600">Total Channels</p>
//                   <p className="text-2xl font-bold text-slate-900">{channels.length}</p>
//                 </div>
//                 <MessageSquare className="h-8 w-8 text-blue-500" />
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-600">Active Channels</p>
//                   <p className="text-2xl font-bold text-green-600">
//                     {channels.filter(c => c.status === 'active').length}
//                   </p>
//                 </div>
//                 <Settings className="h-8 w-8 text-green-500" />
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-600">Total Messages</p>
//                   <p className="text-2xl font-bold text-slate-900">
//                     {channels.reduce((sum, c) => sum + c.messages, 0)}
//                   </p>
//                 </div>
//                 <MessageSquare className="h-8 w-8 text-purple-500" />
//               </div>
//             </div>
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-600">Segments</p>
//                   <p className="text-2xl font-bold text-slate-900">
//                     {new Set(channels.map(c => c.segment)).size}
//                   </p>
//                 </div>
//                 <Users className="h-8 w-8 text-orange-500" />
//               </div>
//             </div>
//           </div>

//           {/* Channels List */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//             <div className="p-6 border-b border-slate-200">
//               <h2 className="text-lg font-semibold text-slate-900">Active Channels</h2>
//             </div>
//             <div className="divide-y divide-slate-200">
//               {channels.map((channel) => {
//                 const IconComponent = getChannelIcon(channel.type);
//                 const colorClass = getChannelColor(channel.type);
                
//                 return (
//                   <div key={channel.id} className="p-6 hover:bg-slate-50">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div className={`w-12 h-12 bg-${colorClass}-100 rounded-lg flex items-center justify-center`}>
//                           <IconComponent className={`h-6 w-6 text-${colorClass}-600`} />
//                         </div>
//                         <div>
//                           <h3 className="text-lg font-medium text-slate-900">{channel.name}</h3>
//                           <div className="flex items-center space-x-4 text-sm text-slate-600">
//                             <span className="capitalize">{channel.type}</span>
//                             <span>•</span>
//                             <span>{channel.messages} messages</span>
//                             <span>•</span>
//                             <span className="flex items-center">
//                               <Users className="h-4 w-4 mr-1" />
//                               {channel.segment}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           channel.status === 'active' 
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {channel.status}
//                         </span>
//                         <Button variant="ghost" size="sm">
//                           <Key className="h-4 w-4 mr-1" />
//                           Credentials
//                         </Button>
//                         <Button variant="ghost" size="sm">
//                           <Edit className="h-4 w-4 mr-1" />
//                           Settings
//                         </Button>
//                         <Button 
//                           variant="ghost" 
//                           size="sm"
//                           onClick={() => handleDeleteChannel(channel.id)}
//                         >
//                           <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Channels;

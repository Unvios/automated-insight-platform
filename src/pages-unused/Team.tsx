
// import React, { useState } from 'react';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Plus, Mail, Shield, Ban, User, Edit, Trash2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const Team = () => {
//   const { toast } = useToast();
//   const [inviteEmail, setInviteEmail] = useState('');

//   const teamMembers = [
//     {
//       id: 1,
//       name: 'John Smith',
//       email: 'john@company.com',
//       role: 'Admin',
//       status: 'active',
//       joinedDate: '2024-01-15'
//     },
//     {
//       id: 2,
//       name: 'Sarah Wilson',
//       email: 'sarah@company.com',
//       role: 'Editor',
//       status: 'active',
//       joinedDate: '2024-02-20'
//     },
//     {
//       id: 3,
//       name: 'Mike Johnson',
//       email: 'mike@company.com',
//       role: 'Viewer',
//       status: 'blocked',
//       joinedDate: '2024-03-10'
//     }
//   ];

//   const handleInvite = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Invitation Sent",
//       description: `Team invitation sent to ${inviteEmail}`,
//     });
//     setInviteEmail('');
//   };

//   const handleEdit = (memberId: number) => {
//     toast({
//       title: "Edit Member",
//       description: "Edit member functionality would open here",
//     });
//   };

//   const handleRemove = (memberId: number) => {
//     toast({
//       title: "Member Removed",
//       description: "Team member has been removed",
//     });
//   };

//   const handleToggleStatus = (memberId: number) => {
//     toast({
//       title: "Status Updated",
//       description: "Member status has been updated",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-900 mb-2">Team Management</h1>
//             <p className="text-slate-600">Invite and manage your team members</p>
//           </div>

//           {/* Invite Member */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
//             <h3 className="text-lg font-semibold text-slate-900 mb-4">Invite Team Member</h3>
//             <form onSubmit={handleInvite} className="flex space-x-4">
//               <div className="flex-1">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input 
//                   id="email" 
//                   type="email" 
//                   placeholder="Enter email address"
//                   value={inviteEmail}
//                   onChange={(e) => setInviteEmail(e.target.value)}
//                   required 
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="role">Role</Label>
//                 <select id="role" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="viewer">Viewer</option>
//                   <option value="editor">Editor</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="flex items-end">
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//                   <Mail className="h-4 w-4 mr-2" />
//                   Send Invitation
//                 </Button>
//               </div>
//             </form>
//           </div>

//           {/* Team Members */}
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200">
//             <div className="p-6 border-b border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Member</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {teamMembers.map((member) => (
//                     <tr key={member.id} className="hover:bg-slate-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                             <User className="h-5 w-5 text-blue-600" />
//                           </div>
//                           <div>
//                             <div className="text-sm font-medium text-slate-900">{member.name}</div>
//                             <div className="text-sm text-slate-500">{member.email}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {member.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           member.status === 'active' 
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {member.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
//                         {member.joinedDate}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             onClick={() => handleEdit(member.id)}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             onClick={() => handleToggleStatus(member.id)}
//                           >
//                             {member.status === 'active' ? <Ban className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
//                           </Button>
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="text-red-600 hover:text-red-700"
//                             onClick={() => handleRemove(member.id)}
//                           >
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
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Team;

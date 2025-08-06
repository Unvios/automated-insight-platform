
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { ArrowLeft, Upload } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const AddDocument = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Document Added",
//       description: "Your document has been added to the knowledge base.",
//     });
//     navigate('/knowledge-base');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="flex items-center mb-8">
//             <Button 
//               variant="ghost" 
//               onClick={() => navigate('/knowledge-base')}
//               className="mr-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Knowledge Base
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Add Document</h1>
//               <p className="text-slate-600">Upload or connect a new document to your knowledge base</p>
//             </div>
//           </div>

//           <div className="max-w-2xl">
//             <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-6">
//               <div>
//                 <Label htmlFor="name">Document Name</Label>
//                 <Input id="name" placeholder="Enter document name" required />
//               </div>

//               <div>
//                 <Label htmlFor="category">Category</Label>
//                 <select id="category" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
//                   <option value="">Select category</option>
//                   <option value="product-info">Product Info</option>
//                   <option value="support">Support</option>
//                   <option value="policies">Policies</option>
//                   <option value="training">Training</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea id="description" placeholder="Describe what this document contains" />
//               </div>

//               <div>
//                 <Label htmlFor="source">Source Type</Label>
//                 <select id="source" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="upload">Upload File</option>
//                   <option value="api">API Integration</option>
//                   <option value="google-drive">Google Drive</option>
//                   <option value="url">Web URL</option>
//                 </select>
//               </div>

//               <div>
//                 <Label htmlFor="file">Upload File</Label>
//                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
//                   <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
//                   <p className="text-sm text-slate-600 mb-2">Drop your file here or click to browse</p>
//                   <Input id="file" type="file" className="max-w-xs mx-auto" />
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <Button type="button" variant="outline" onClick={() => navigate('/knowledge-base')}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//                   <Upload className="h-4 w-4 mr-2" />
//                   Add Document
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AddDocument;

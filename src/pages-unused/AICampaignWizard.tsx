
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { ArrowLeft, ArrowRight, Zap, Target, Bot, MessageSquare } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const AICampaignWizard = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [currentStep, setCurrentStep] = useState(1);

//   const steps = [
//     { id: 1, title: 'Campaign Goal', icon: Target },
//     { id: 2, title: 'AI Configuration', icon: Bot },
//     { id: 3, title: 'Message Setup', icon: MessageSquare },
//     { id: 4, title: 'Review & Launch', icon: Zap },
//   ];

//   const handleNext = () => {
//     if (currentStep < 4) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       toast({
//         title: "Campaign Created",
//         description: "Your AI-powered campaign has been created successfully!",
//       });
//       navigate('/campaigns');
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
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
//               onClick={() => navigate('/')}
//               className="mr-4"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Dashboard
//             </Button>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">AI Campaign Wizard</h1>
//               <p className="text-slate-600">Let AI help you create the perfect campaign</p>
//             </div>
//           </div>

//           {/* Progress Steps */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
//             <div className="flex items-center justify-between">
//               {steps.map((step, index) => (
//                 <div key={step.id} className="flex items-center">
//                   <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
//                     currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
//                   }`}>
//                     <step.icon className="h-5 w-5" />
//                   </div>
//                   <span className={`ml-2 text-sm font-medium ${
//                     currentStep >= step.id ? 'text-blue-600' : 'text-slate-600'
//                   }`}>
//                     {step.title}
//                   </span>
//                   {index < steps.length - 1 && (
//                     <div className={`w-16 h-1 mx-4 ${
//                       currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
//                     }`} />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Step Content */}
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
//             {currentStep === 1 && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-slate-900">What's your campaign goal?</h3>
//                 <div>
//                   <Label htmlFor="goal">Campaign Objective</Label>
//                   <Textarea id="goal" placeholder="Describe what you want to achieve with this campaign..." />
//                 </div>
//                 <div>
//                   <Label htmlFor="target">Target Outcome</Label>
//                   <Input id="target" placeholder="e.g., Generate 100 qualified leads" />
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-slate-900">AI Configuration</h3>
//                 <div>
//                   <Label htmlFor="agent">Select AI Agent</Label>
//                   <select id="agent" className="w-full px-3 py-2 border border-slate-300 rounded-lg">
//                     <option value="sarah">Sarah - Sales Expert</option>
//                     <option value="mike">Mike - Support Specialist</option>
//                   </select>
//                 </div>
//                 <div>
//                   <Label htmlFor="tone">Conversation Style</Label>
//                   <select id="tone" className="w-full px-3 py-2 border border-slate-300 rounded-lg">
//                     <option value="professional">Professional</option>
//                     <option value="friendly">Friendly</option>
//                     <option value="casual">Casual</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-slate-900">Message Setup</h3>
//                 <div>
//                   <Label htmlFor="opening">Opening Message</Label>
//                   <Textarea id="opening" placeholder="AI will customize this for each contact..." />
//                 </div>
//                 <div>
//                   <Label htmlFor="followup">Follow-up Strategy</Label>
//                   <select id="followup" className="w-full px-3 py-2 border border-slate-300 rounded-lg">
//                     <option value="aggressive">Aggressive (3 follow-ups)</option>
//                     <option value="moderate">Moderate (2 follow-ups)</option>
//                     <option value="gentle">Gentle (1 follow-up)</option>
//                   </select>
//                 </div>
//               </div>
//             )}

//             {currentStep === 4 && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold text-slate-900">Review & Launch</h3>
//                 <div className="bg-slate-50 p-4 rounded-lg">
//                   <h4 className="font-medium text-slate-900 mb-2">Campaign Summary</h4>
//                   <p className="text-sm text-slate-600">AI will create a personalized campaign based on your inputs</p>
//                 </div>
//                 <div className="bg-blue-50 p-4 rounded-lg">
//                   <h4 className="font-medium text-blue-900 mb-2">✨ AI Enhancements</h4>
//                   <ul className="text-sm text-blue-700 space-y-1">
//                     <li>• Personalized messages for each contact</li>
//                     <li>• Optimal timing prediction</li>
//                     <li>• Real-time performance optimization</li>
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <div className="flex justify-between">
//             <Button 
//               variant="outline" 
//               onClick={handleBack}
//               disabled={currentStep === 1}
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Previous
//             </Button>
//             <Button 
//               onClick={handleNext}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {currentStep === 4 ? 'Launch Campaign' : 'Next'}
//               {currentStep < 4 && <ArrowRight className="h-4 w-4 ml-2" />}
//               {currentStep === 4 && <Zap className="h-4 w-4 ml-2" />}
//             </Button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AICampaignWizard;

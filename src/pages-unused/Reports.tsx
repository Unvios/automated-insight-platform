
// import React, { useState } from 'react';
// import Header from '@/components/Header';
// import Sidebar from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Plus, Download, FileText, Calendar, Filter } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// const Reports = () => {
//   const { toast } = useToast();
//   const [reportName, setReportName] = useState('');

//   const reportTypes = [
//     'Conversation Analytics',
//     'Agent Performance',
//     'Customer Engagement',
//     'Campaign Results',
//     'Revenue Analysis',
//     'Custom Report'
//   ];

//   const dateRanges = [
//     'Last 7 days',
//     'Last 30 days',
//     'Last 90 days',
//     'This month',
//     'Last month',
//     'Custom range'
//   ];

//   const savedReports = [
//     {
//       id: 1,
//       name: 'Monthly Agent Performance',
//       type: 'Agent Performance',
//       created: '2024-01-15',
//       lastRun: '2024-01-20',
//       status: 'Completed'
//     },
//     {
//       id: 2,
//       name: 'Campaign ROI Analysis',
//       type: 'Campaign Results',
//       created: '2024-01-10',
//       lastRun: '2024-01-18',
//       status: 'Completed'
//     },
//     {
//       id: 3,
//       name: 'Customer Satisfaction Report',
//       type: 'Customer Engagement',
//       created: '2024-01-05',
//       lastRun: '2024-01-19',
//       status: 'Running'
//     }
//   ];

//   const handleCreateReport = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Report Created",
//       description: `Report "${reportName}" has been created and is being generated.`,
//     });
//     setReportName('');
//   };

//   const handleExportReport = (reportId: number) => {
//     toast({
//       title: "Export Started",
//       description: "Your report export has started. You'll receive an email when it's ready.",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-6">
//           <div className="mb-8">
//             <h1 className="text-2xl font-bold text-slate-900 mb-2">Reports</h1>
//             <p className="text-slate-600">Create custom reports and export analytics data</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Create New Report */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Report</h3>
//               <form onSubmit={handleCreateReport} className="space-y-4">
//                 <div>
//                   <Label htmlFor="reportName">Report Name</Label>
//                   <Input 
//                     id="reportName" 
//                     placeholder="Enter report name"
//                     value={reportName}
//                     onChange={(e) => setReportName(e.target.value)}
//                     required 
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="reportType">Report Type</Label>
//                   <select id="reportType" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     <option value="">Select report type</option>
//                     {reportTypes.map((type) => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="dateRange">Date Range</Label>
//                   <select id="dateRange" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     <option value="">Select date range</option>
//                     {dateRanges.map((range) => (
//                       <option key={range} value={range}>{range}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="metrics">Metrics to Include</Label>
//                   <div className="grid grid-cols-2 gap-2 mt-2">
//                     {['Conversations', 'Response Time', 'Conversion Rate', 'Customer Satisfaction', 'Revenue', 'Agent Performance'].map((metric) => (
//                       <label key={metric} className="flex items-center">
//                         <input type="checkbox" className="mr-2" />
//                         <span className="text-sm text-slate-600">{metric}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="format">Export Format</Label>
//                   <select id="format" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                     <option value="pdf">PDF</option>
//                     <option value="csv">CSV</option>
//                     <option value="xlsx">Excel</option>
//                   </select>
//                 </div>

//                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create Report
//                 </Button>
//               </form>
//             </div>

//             {/* Saved Reports */}
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-slate-900">Saved Reports</h3>
//                 <Button variant="outline" size="sm">
//                   <Filter className="h-4 w-4 mr-2" />
//                   Filter
//                 </Button>
//               </div>
              
//               <div className="space-y-4">
//                 {savedReports.map((report) => (
//                   <div key={report.id} className="border border-slate-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <h4 className="font-medium text-slate-900">{report.name}</h4>
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         report.status === 'Completed' 
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {report.status}
//                       </span>
//                     </div>
//                     <p className="text-sm text-slate-600 mb-2">{report.type}</p>
//                     <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
//                       <span>Created: {report.created}</span>
//                       <span>Last run: {report.lastRun}</span>
//                     </div>
//                     <div className="flex space-x-2">
//                       <Button 
//                         variant="outline" 
//                         size="sm"
//                         onClick={() => handleExportReport(report.id)}
//                         disabled={report.status !== 'Completed'}
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         Export
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <FileText className="h-4 w-4 mr-1" />
//                         View
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick Reports */}
//           <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
//             <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Reports</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Button variant="outline" className="p-4 h-auto flex flex-col items-center">
//                 <Calendar className="h-8 w-8 mb-2 text-blue-600" />
//                 <span className="font-medium">Daily Summary</span>
//                 <span className="text-sm text-slate-500">Yesterday's performance</span>
//               </Button>
//               <Button variant="outline" className="p-4 h-auto flex flex-col items-center">
//                 <FileText className="h-8 w-8 mb-2 text-green-600" />
//                 <span className="font-medium">Weekly Report</span>
//                 <span className="text-sm text-slate-500">Last 7 days overview</span>
//               </Button>
//               <Button variant="outline" className="p-4 h-auto flex flex-col items-center">
//                 <Download className="h-8 w-8 mb-2 text-purple-600" />
//                 <span className="font-medium">Monthly Export</span>
//                 <span className="text-sm text-slate-500">Full month data</span>
//               </Button>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Reports;

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Phone, PhoneOff, Volume2, AlertCircle } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { useCampaignAgentCall } from '@/hooks/useCampaignAgentCall';
// import { getApiUrl } from '@/config/api';
// import { campaignsApi, Campaign } from '@/services/campaigns';

// // API функция для получения агента
// const fetchAgent = async (id: string) => {
//   const response = await fetch(getApiUrl('agents/find-one-latest'), {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ agentId: id }),
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to fetch agent');
//   }
  
//   return response.json();
// };

// const CampaignAgentCall = () => {
//   const { id } = useParams();
//   const { toast } = useToast();
//   const [campaign, setCampaign] = useState<Campaign | null>(null);
//   const [agent, setAgent] = useState<{
//     id: string;
//     name: string;
//     role: string;
//     status: string;
//     version: number;
//     model?: string;
//     systemPrompt?: string;
//     voice?: string;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Используем хук для звонка агенту кампании
//   const { 
//     isConnected, 
//     isRecording, 
//     connectionStatus, 
//     messages, 
//     connectToAgent, 
//     disconnectFromAgent 
//   } = useCampaignAgentCall();

//   // Ref для прокрутки чата в конец
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   // Загружаем данные кампании и агента
//   useEffect(() => {
//     const loadData = async () => {
//       if (!id) return;
      
//       try {
//         setLoading(true);
        
//         // Загружаем кампанию
//         const campaignData = await campaignsApi.findOne(id);
//         setCampaign(campaignData);
        
//         // Проверяем статус кампании
//         if (campaignData.status !== 'active') {
//           setError('Кампания не активна. Попробуйте позже.');
//           setLoading(false);
//           return;
//         }
        
//         // Загружаем агента
//         const agentData = await fetchAgent(campaignData.agentId);
//         setAgent(agentData);
        
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [id]);

//   // Автоматическая прокрутка чата в конец при новых сообщениях
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       // Небольшая задержка для гарантии, что DOM обновился
//       setTimeout(() => {
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }, 100);
//     }
//   }, [messages]);

//   const handleCall = async () => {
//     if (!agent || !campaign) return;

//     if (isConnected) {
//       // Если уже подключены, отключаемся
//       try {
//         await disconnectFromAgent();

//         toast({
//           title: "Отключено",
//           description: "Соединение с агентом разорвано",
//         });
//       } catch (error) {
//         toast({
//           title: "Ошибка отключения",
//           description: "Не удалось отключиться от агента",
//           variant: "destructive"
//         });
//       }
//     } else {
//       try {
//         await connectToAgent({
//           id: agent.id,
//           name: agent.name,
//           role: agent.role,
//           model: agent.model || 'gpt-4',
//           voice: agent.voice || 'Bys_24000',
//           systemPrompt: agent.systemPrompt || '',
//           campaignId: campaign.id,
//         });

//         toast({
//           title: "Подключение к агенту",
//           description: "Соединение с агентом установлено. Микрофон включен автоматически.",
//         });
//       } catch (error) {
//         toast({
//           title: "Ошибка подключения",
//           description: "Не удалось подключиться к агенту",
//           variant: "destructive"
//         });
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h1 className="text-xl font-semibold text-slate-900 mb-2">Ошибка</h1>
//           <p className="text-slate-600">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!campaign || !agent) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h1 className="text-xl font-semibold text-slate-900 mb-2">Данные не найдены</h1>
//           <p className="text-slate-600">Кампания или агент не найдены</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Заголовок */}
//       <div className="bg-white border-b border-slate-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-semibold text-slate-900">{campaign.name}</h1>
//             <p className="text-sm text-slate-600">Звонок агенту: {agent.name}</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
//             <span className="text-sm text-slate-600">{connectionStatus}</span>
//           </div>
//         </div>
//       </div>

//       {/* Основной контент */}
//       <div className="flex flex-col h-[calc(100vh-80px)]">
//         {/* Чат */}
//         <div 
//           ref={chatContainerRef}
//           className="flex-1 overflow-y-auto p-6"
//         >
//           <div className="space-y-4 max-w-2xl mx-auto">
//             {messages.length === 0 ? (
//               <div className="text-center py-8">
//                 <Volume2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//                 <p className="text-slate-500">Нажмите кнопку звонка, чтобы начать разговор с агентом</p>
//               </div>
//             ) : (
//               messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                       message.sender === 'user'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-slate-900 border border-slate-200'
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Кнопка звонка */}
//         <div className="bg-white border-t border-slate-200 p-6">
//           <div className="max-w-2xl mx-auto">
//             <Button
//               onClick={handleCall}
//               className={`w-full h-12 text-lg font-medium ${
//                 isConnected
//                   ? 'bg-red-600 hover:bg-red-700'
//                   : 'bg-green-600 hover:bg-green-700'
//               }`}
//               disabled={loading}
//             >
//               {isConnected ? (
//                 <>
//                   <PhoneOff className="h-5 w-5 mr-2" />
//                   Завершить звонок
//                 </>
//               ) : (
//                 <>
//                   <Phone className="h-5 w-5 mr-2" />
//                   Позвонить агенту
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignAgentCall; 
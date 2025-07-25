
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Bot, 
  Megaphone, 
  Users, 
  Settings, 
  MessageSquare,
  TrendingUp,
  Home,
  BookOpen,
  UserPlus,
  Clock,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 h-full">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mt-8 px-3">
        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Quick Stats
        </h3>
        <div className="mt-3 space-y-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Active Agents</span>
              <span className="text-sm font-semibold text-green-600">3</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Live Chats</span>
              <span className="text-sm font-semibold text-blue-600">12</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">This Month</span>
              <span className="text-sm font-semibold text-purple-600">$2.8K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

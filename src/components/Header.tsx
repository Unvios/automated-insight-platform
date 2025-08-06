
import React from 'react';
import { Bell, ChevronDown, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="h-15 bg-slate-900 text-white border-b border-slate-800 px-6 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold cursor-pointer" onClick={() => navigate('/')}>
            AI
          </div>
          <span className="text-xl font-semibold cursor-pointer" onClick={() => navigate('/')}>Automation Hub</span>
        </div>
        
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-slate-800">
              TechCorp Inc.
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>TechCorp Inc.</DropdownMenuItem>
            <DropdownMenuItem>StartupXYZ</DropdownMenuItem>
            <DropdownMenuItem>Enterprise Co.</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns, agents, customers..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div> */}

      {/* <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-800 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-slate-800">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-2">
                <User className="h-4 w-4" />
              </div>
              John Doe
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </header>
  );
};

export default Header;

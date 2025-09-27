import {
    LayoutDashboard,
    X,
    User,
    LogOut,
    FileBadge,
    Plus,
  } from 'lucide-react';
  import { cn } from '../lib/utils';
  
  interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setCurrentView: (view: string) => void;
  }
  
  export const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, setCurrentView }: SidebarProps) => (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0',
        {
          'translate-x-0': isSidebarOpen,
          '-translate-x-full': !isSidebarOpen,
        }
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          <a href="#" className="text-xl font-bold text-gray-900">
            VeriSure
          </a>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          <a
            href="#"
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </a>
          <a
            href="#"
            onClick={() => setCurrentView('claim')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <FileBadge className="h-4 w-4" />
            Report a Claim
          </a>
          <a
            href="#"
            onClick={() => setCurrentView('onboarding')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          >
            <Plus className="h-4 w-4" />
            New Policy
          </a>
        </nav>
        <div className="mt-auto p-4">
          <div className="border-t pt-4">
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900">
              <User className="h-4 w-4" />
              Profile
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900">
              <LogOut className="h-4 w-4" />
              Logout
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
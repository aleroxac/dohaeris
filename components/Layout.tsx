import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Target, 
  Landmark, 
  Menu,
  UserCircle
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const NavItem = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  view: ViewState; 
  current: ViewState; 
  icon: any; 
  label: string; 
  onClick: (v: ViewState) => void; 
}) => {
  const isActive = view === current;
  return (
    <button
      onClick={() => onClick(view)}
      className={`flex flex-col items-center justify-center w-full p-2 md:w-auto md:flex-row md:justify-start md:px-6 md:py-3 md:space-x-3 transition-colors duration-200
        ${isActive ? 'text-brand-400 md:bg-slate-800 md:border-r-4 md:border-brand-500' : 'text-slate-500 hover:text-slate-300'}
      `}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      <span className={`text-[10px] md:text-sm mt-1 md:mt-0 ${isActive ? 'font-semibold' : 'font-medium'}`}>
        {label}
      </span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-full">
        <div className="p-6 flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-xl">D</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dohaeris</h1>
        </div>
        
        <nav className="flex-1 py-4 space-y-1">
          <NavItem view="dashboard" current={activeView} icon={LayoutDashboard} label="Dashboard" onClick={onNavigate} />
          <NavItem view="earnings" current={activeView} icon={TrendingUp} label="Earnings" onClick={onNavigate} />
          <NavItem view="expenses" current={activeView} icon={TrendingDown} label="Expenses" onClick={onNavigate} />
          <NavItem view="groceries" current={activeView} icon={ShoppingCart} label="Shopping" onClick={onNavigate} />
          <NavItem view="goals" current={activeView} icon={Target} label="Goals" onClick={onNavigate} />
          <NavItem view="patrimony" current={activeView} icon={Landmark} label="Patrimony" onClick={onNavigate} />
        </nav>

        <div className="p-4 border-t border-slate-800">
             <NavItem view="profile" current={activeView} icon={UserCircle} label="Profile" onClick={onNavigate} />
        </div>
        <div className="p-2 text-center border-t border-slate-800">
             <div className="text-xs text-slate-500">v1.1.0 • Beta</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative no-scrollbar pb-20 md:pb-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
             <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white text-lg">D</span>
                </div>
                <h1 className="text-xl font-bold">Dohaeris</h1>
            </div>
            <button className="text-slate-400" onClick={() => onNavigate('profile')}>
                <UserCircle size={24} className={activeView === 'profile' ? 'text-brand-400' : ''} />
            </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center">
          <NavItem view="dashboard" current={activeView} icon={LayoutDashboard} label="Dash" onClick={onNavigate} />
          <NavItem view="earnings" current={activeView} icon={TrendingUp} label="Earn" onClick={onNavigate} />
          <NavItem view="expenses" current={activeView} icon={TrendingDown} label="Exp" onClick={onNavigate} />
          <NavItem view="groceries" current={activeView} icon={ShoppingCart} label="Shop" onClick={onNavigate} />
          <NavItem view="goals" current={activeView} icon={Target} label="Goals" onClick={onNavigate} />
        </div>
      </nav>

    </div>
  );
};
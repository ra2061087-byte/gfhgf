import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { 
  Sun, 
  Moon, 
  Languages, 
  PlusCircle, 
  Building2, 
  Search,
  Bell,
  Menu,
  X,
  FileText
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenQuickSale: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenQuickSale
}) => {
  const { language, toggleLanguage, theme, toggleTheme, settings, products } = useApp();

  const isUrdu = language === 'ur';
  const company = settings.company;

  // Count low stock items for notification indicator
  const lowStockCount = products.filter((p) => p.stockQty <= p.lowStockThreshold).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left / Brand Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo Badge */}
            <div 
              onClick={() => setActiveTab('dashboard')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-900 border-2 border-orange-500 flex flex-col items-center justify-center text-white shadow-md transition transform group-hover:scale-105">
                <span className="text-base font-black text-orange-400 leading-none">KT</span>
                <span className="text-[7px] font-bold text-blue-200 uppercase tracking-widest mt-0.5">STORE</span>
              </div>

              <div>
                <h1 className="text-lg font-bold text-blue-900 dark:text-blue-400 font-urdu leading-tight">
                  {company.nameUr}
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                  {company.nameEn}
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Sale / Billing Action Button */}
            <button
              onClick={onOpenQuickSale}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md hover:shadow-blue-900/20 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline font-urdu text-sm">
                {isUrdu ? 'نیا بل / کوٹیشن' : 'New Invoice'}
              </span>
            </button>

            {/* Low Stock Alert Bell */}
            <button
              onClick={() => setActiveTab('inventory')}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isUrdu ? 'کم سٹاک الرٹ' : 'Low Stock Alerts'}
            >
              <Bell className="w-5 h-5" />
              {lowStockCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {lowStockCount}
                </span>
              )}
            </button>

            {/* Language Switcher (EN / اردو) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 transition"
              title="Toggle English / Urdu"
            >
              <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isUrdu ? 'English' : 'اردو'}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { 
  LayoutDashboard, 
  Receipt, 
  History,
  Package, 
  Users, 
  Truck, 
  BarChart3, 
  Settings as SettingsIcon,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Wallet,
  UserCheck,
  Barcode,
  Lock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen
}) => {
  const { language, settings } = useApp();
  const isUrdu = language === 'ur';
  const company = settings.company;

  const navItems = [
    {
      id: 'dashboard',
      label: isUrdu ? 'ڈیش بورڈ' : 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'pos',
      label: isUrdu ? 'بلنگ اور کوٹیشن' : 'POS & Invoicing',
      icon: Receipt,
      badge: isUrdu ? 'A5 پیڈ' : 'A5 Pad'
    },
    {
      id: 'history',
      label: isUrdu ? 'انوائس ہسٹری' : 'Invoice History',
      icon: History,
      badge: isUrdu ? 'بلز' : 'Bills'
    },
    {
      id: 'inventory',
      label: isUrdu ? 'انوینٹری اور سٹاک' : 'Inventory & Stock',
      icon: Package,
      badge: null
    },
    {
      id: 'khata',
      label: isUrdu ? 'کسٹمر کھاتہ' : 'Customer Khata',
      icon: Users,
      badge: isUrdu ? 'ادھار' : 'Ledger'
    },
    {
      id: 'suppliers',
      label: isUrdu ? 'سپلائرز اور خرید' : 'Suppliers & Purchases',
      icon: Truck,
      badge: null
    },
    {
      id: 'accounts',
      label: isUrdu ? 'مالیاتی کھاتہ جات' : 'Accounts & Cash Book',
      icon: Wallet,
      badge: isUrdu ? 'اخراجات' : 'Expenses'
    },
    {
      id: 'employees',
      label: isUrdu ? 'ملازمین و پے رول' : 'Employees & Payroll',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'barcode',
      label: isUrdu ? 'بارکوڈ و کیو آر کوڈ' : 'Barcode & QR Center',
      icon: Barcode,
      badge: null
    },
    {
      id: 'reports',
      label: isUrdu ? 'مالیاتی رپورٹس' : 'Financial Reports',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'security',
      label: isUrdu ? 'سیکیورٹی و لاگز' : 'Security & Audit Logs',
      icon: ShieldCheck,
      badge: isUrdu ? 'لاگز' : 'Audit'
    },
    {
      id: 'settings',
      label: isUrdu ? 'سسٹم سیٹنگز' : 'System Settings',
      icon: SettingsIcon,
      badge: null
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isUrdu ? 'مین مینو' : 'Main Navigation'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-orange-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className={isUrdu ? 'font-urdu font-bold text-xs' : ''}>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Store Contact Card */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="bg-blue-900 text-white p-2.5 rounded-xl border border-blue-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-xs font-bold font-urdu leading-none">{company.nameUr}</span>
            </div>
            <p className="text-[10px] text-blue-200 font-mono">NTN: {company.ntn}</p>
            <div className="mt-1.5 pt-1.5 border-t border-blue-800/80 flex items-center gap-1.5 text-[10px] text-blue-200">
              <PhoneCall className="w-3 h-3 text-orange-400 shrink-0" />
              <span className="font-semibold">{company.phone}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};


import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POSBilling } from './components/POSBilling';
import { InvoiceHistory } from './components/InvoiceHistory';
import { InventoryManager } from './components/InventoryManager';
import { KhataManager } from './components/KhataManager';
import { SupplierManager } from './components/SupplierManager';
import { AccountsManager } from './components/AccountsManager';
import { EmployeeManager } from './components/EmployeeManager';
import { BarcodeManager } from './components/BarcodeManager';
import { ReportsManager } from './components/ReportsManager';
import { AuditLogManager } from './components/AuditLogManager';
import { SettingsModule } from './components/SettingsModule';
import { ToastContainer } from './components/ToastContainer';
import { Invoice } from './types';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleOpenQuickSale = () => {
    setEditingInvoice(null);
    setActiveTab('pos');
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setActiveTab('pos');
  };

  const handleDuplicateInvoice = (inv: Invoice) => {
    setEditingInvoice({
      ...inv,
      id: '',
      invoiceNo: '',
      date: new Date().toISOString().split('T')[0]
    });
    setActiveTab('pos');
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenQuickSale={handleOpenQuickSale}
      />

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 pt-6 pb-12">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />

        {/* Dynamic Tab Screen */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard setActiveTab={setActiveTab} onOpenQuickSale={handleOpenQuickSale} />
          )}

          {activeTab === 'pos' && (
            <POSBilling
              editingInvoice={editingInvoice}
              onFinishedEdit={() => setEditingInvoice(null)}
            />
          )}

          {activeTab === 'history' && (
            <InvoiceHistory
              onEditInvoice={handleEditInvoice}
              onDuplicateInvoice={handleDuplicateInvoice}
            />
          )}

          {activeTab === 'inventory' && <InventoryManager />}

          {activeTab === 'khata' && <KhataManager />}

          {activeTab === 'suppliers' && <SupplierManager />}

          {activeTab === 'accounts' && <AccountsManager />}

          {activeTab === 'employees' && <EmployeeManager />}

          {activeTab === 'barcode' && <BarcodeManager />}

          {activeTab === 'reports' && <ReportsManager />}

          {activeTab === 'security' && <AuditLogManager />}

          {activeTab === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* Artistic Flair Footer Bar */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="font-bold text-blue-900 dark:text-blue-400 font-urdu">کامل ٹریڈرز</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-medium">Steel, Machinery Parts & General Hardware Software</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="font-mono">NTN: 3491028-4</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>📞 0300-6560253</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-urdu text-orange-600 dark:text-orange-400 font-semibold">فیصل آباد، پاکستان</span>
          </div>
        </div>
      </footer>

      {/* Floating Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

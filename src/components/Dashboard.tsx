import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Invoice } from '../types';
import { A5InvoicePad } from './A5InvoicePad';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  PlusCircle, 
  Receipt, 
  Package, 
  Eye, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenQuickSale: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onOpenQuickSale }) => {
  const { language, invoices, customers, products } = useApp();
  const isUrdu = language === 'ur';

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  const todayInvoices = invoices.filter((i) => i.date === todayStr && i.type === 'INVOICE');
  const todaySalesTotal = todayInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  const monthInvoices = invoices.filter((i) => i.date.startsWith(currentMonthStr) && i.type === 'INVOICE');
  const monthSalesTotal = monthInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  const totalOutstandingKhata = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const lowStockItems = products.filter((p) => p.stockQty <= p.lowStockThreshold);

  // Chart dataset for last 7 days sales
  const salesChartData = Array.from({ length: 7 })
    .map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', { weekday: 'short' });

      const dayInvoices = invoices.filter((i) => i.date === dateKey && i.type === 'INVOICE');
      const salesSum = dayInvoices.reduce((acc, inv) => acc + inv.grandTotal, 0);

      return {
        date: dayLabel,
        sales: salesSum
      };
    });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-8 border border-blue-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold font-urdu">
                {isUrdu ? 'کامل ٹریڈرز - فیصل آباد' : 'Kamil Traders Faisalabad'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-urdu leading-snug">
              {isUrdu ? 'السلام علیکم! ہارڈویئر منیجمنٹ ڈیش بورڈ' : 'Hardware Management Dashboard'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              {isUrdu 
                ? 'تمام خریدو فروخت، کوٹیشنز، کسٹمر کھاتہ، اور سٹاک کی مکمل معلومات۔' 
                : 'Monitor daily sales, A5 quotation invoices, customer khata ledger, and inventory alerts.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenQuickSale}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-orange-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-5 h-5" />
              <span className={isUrdu ? 'font-urdu' : ''}>{getTranslation(language, 'newSale')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-urdu">
              {getTranslation(language, 'todaySales')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            Rs. {todaySalesTotal.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>{todayInvoices.length} {isUrdu ? 'انواسیز پاس ہوئیں' : 'invoices issued today'}</span>
          </div>
        </div>

        {/* This Month Sales */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-urdu">
              {getTranslation(language, 'monthSales')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            Rs. {monthSalesTotal.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{monthInvoices.length} {isUrdu ? 'کل سیل کی انوائسز' : 'total monthly sales'}</span>
          </div>
        </div>

        {/* Total Outstanding Khata Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-urdu">
              {getTranslation(language, 'totalOutstanding')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            Rs. {totalOutstandingKhata.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <span>{customers.filter((c) => c.outstandingBalance > 0).length} {isUrdu ? 'کسٹمرز کے ذمہ واجب الادا' : 'customers with pending balance'}</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => setActiveTab('inventory')}
          className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-urdu">
              {getTranslation(language, 'lowStockAlerts')}
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              lowStockItems.length > 0 ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <span>{lowStockItems.length}</span>
            <span className="text-xs font-normal text-slate-400">{isUrdu ? 'سامان' : 'items'}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 group-hover:underline">
            <span>{isUrdu ? 'سٹاک چیک کریں' : 'Click to restock'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-urdu">
                {getTranslation(language, 'revenueChart')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isUrdu ? 'گزشتہ 7 دنوں کی کل فروخت گراف' : '7-day daily sales breakdown'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`Rs. ${Number(value).toLocaleString()}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-urdu mb-4">
              {getTranslation(language, 'quickActions')}
            </h3>

            <div className="space-y-3">
              <button
                onClick={onOpenQuickSale}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold text-xs sm:text-sm transition text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="font-urdu">{isUrdu ? 'نیا بل یا کوٹیشن تیار کریں' : 'New Invoice / Quotation'}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold text-xs sm:text-sm transition text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="font-urdu">{isUrdu ? 'انوینٹری سٹاک اپڈیٹ کریں' : 'Add / Restock Hardware'}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>

              <button
                onClick={() => setActiveTab('khata')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 font-bold text-xs sm:text-sm transition text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-urdu">{isUrdu ? 'کسٹمر کھاتہ و وصولی درج کریں' : 'Customer Khata & Payments'}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-urdu">
            💡 {isUrdu ? 'A5 سائز پیڈ پرنٹ کرنے کے لیے کسی بھی بل پر کلک کریں۔' : 'Click on any invoice to view and print A5 pad.'}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-urdu">
            {getTranslation(language, 'recentTransactions')}
          </h3>
          <button
            onClick={() => setActiveTab('pos')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline font-urdu"
          >
            {getTranslation(language, 'viewAll')}
          </button>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-urdu text-sm">
            {getTranslation(language, 'noTransactions')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-urdu font-bold">
                  <th className="py-3 px-3 text-right">کوڈ / انوائس نمبر</th>
                  <th className="py-3 px-3 text-right">تاریخ</th>
                  <th className="py-3 px-3 text-right">کسٹمر</th>
                  <th className="py-3 px-3 text-right">قسم</th>
                  <th className="py-3 px-3 text-right">رقم</th>
                  <th className="py-3 px-3 text-right">طریقہ کار</th>
                  <th className="py-3 px-3 text-center">پرنٹ A5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-urdu">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-900 dark:text-blue-300 dir-ltr text-right">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-sans">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {inv.customerName || (isUrdu ? 'عام نقد خریدار' : 'Walk-in Customer')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.type === 'QUOTATION' 
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' 
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {inv.type === 'QUOTATION' ? (isUrdu ? 'کوٹیشن' : 'Quotation') : (isUrdu ? 'فروخت بل' : 'Sale')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold font-sans text-slate-900 dark:text-white">
                      Rs. {inv.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {inv.paymentMethod}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                        title="View A5 Pad"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* A5 Invoice Pad Modal View */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl my-8">
            <A5InvoicePad
              invoice={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

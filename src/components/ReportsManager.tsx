import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PackageCheck, 
  Users, 
  Download,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const ReportsManager: React.FC = () => {
  const { language, invoices, products, customers } = useApp();
  const isUrdu = language === 'ur';

  // Metrics
  const totalSalesRevenue = invoices
    .filter((inv) => inv.type === 'INVOICE')
    .reduce((sum, inv) => sum + inv.grandTotal, 0);

  const totalOutstandingReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const inventoryValuationAtCost = products.reduce((sum, p) => sum + p.costPrice * p.stockQty, 0);
  const inventoryValuationAtSale = products.reduce((sum, p) => sum + p.salePrice * p.stockQty, 0);
  const potentialProfitInStock = inventoryValuationAtSale - inventoryValuationAtCost;

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + p.salePrice * p.stockQty;
  });

  const categoryChartData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat]
  }));

  const COLORS = ['#1e3a8a', '#f97316', '#10b981', '#6366f1', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {getTranslation(language, 'reports')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'کاروبار کی فروخت، منافع، اور سٹاک کی مالیتی رپورٹ' : 'Financial breakdown of sales, profitability and inventory value.'}
          </p>
        </div>
      </div>

      {/* High-level KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 font-urdu">کل حاصل شدہ فنڈز / فروخت</span>
          <div className="text-2xl font-black text-blue-900 dark:text-blue-400 font-sans">
            Rs. {totalSalesRevenue.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 font-urdu">مجموعی فروخت کی رقم</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 font-urdu">کل سٹاک کی لاگتی مالیت (At Cost)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-sans">
            Rs. {inventoryValuationAtCost.toLocaleString()}
          </div>
          <p className="text-[10px] text-emerald-600 font-urdu">
            فروخت پر متوقع منافع: Rs. {potentialProfitInStock.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 font-urdu">کسٹمرز کے ذمہ واجب الادا (Receivables)</span>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 font-sans">
            Rs. {totalOutstandingReceivables.toLocaleString()}
          </div>
          <p className="text-[10px] text-orange-500 font-urdu">ادھار کھاتہ بقایا جات</p>
        </div>
      </div>

      {/* Category Wise Inventory Value Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-urdu mb-4">
          کیٹیگری کے لحاظ سے انوینٹری کی مالیت (Category Inventory Distribution)
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Valuation']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

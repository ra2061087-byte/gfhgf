import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountRecord, AccountType, AccountCategory } from '../types';
import { 
  Plus, Search, Filter, ArrowUpDown, FileSpreadsheet, Printer, 
  Trash2, Wallet, ArrowDownRight, ArrowUpRight, Building2, 
  DollarSign, RefreshCw, Undo, History, FileText
} from 'lucide-react';

export const AccountsManager: React.FC = () => {
  const { accounts, addAccountRecord, deleteAccountRecord, language, currentRole } = useApp();
  const isUrdu = language === 'ur';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [type, setType] = useState<AccountType>('EXPENSE');
  const [category, setCategory] = useState<AccountCategory>('RENT');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'CASH' | 'BANK' | 'EASYPAISA' | 'JAZZCASH'>('CASH');
  const [description, setDescription] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  // Calculations
  const totalIncome = accounts
    .filter((a) => a.type === 'INCOME')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalExpense = accounts
    .filter((a) => a.type === 'EXPENSE')
    .reduce((sum, a) => sum + a.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const cashInHand = accounts
    .filter((a) => a.paymentMode === 'CASH')
    .reduce((sum, a) => (a.type === 'INCOME' ? sum + a.amount : sum - a.amount), 0);

  const bankBalance = accounts
    .filter((a) => a.paymentMode !== 'CASH')
    .reduce((sum, a) => (a.type === 'INCOME' ? sum + a.amount : sum - a.amount), 0);

  // Filtered
  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = 
      acc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.referenceNo && acc.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'ALL' || acc.type === selectedType;
    const matchesMode = selectedMode === 'ALL' || acc.paymentMode === selectedMode;

    return matchesSearch && matchesType && matchesMode;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) return;

    addAccountRecord({
      date: new Date().toISOString().split('T')[0],
      type,
      category,
      amount,
      paymentMode,
      description,
      referenceNo,
      createdByName: currentRole
    });

    setShowAddModal(false);
    setAmount(0);
    setDescription('');
    setReferenceNo('');
  };

  const handleExportExcel = () => {
    const headers = 'ID,Date,Type,Category,Amount,PaymentMode,Description,Ref\n';
    const rows = filteredAccounts.map(a => 
      `"${a.id}","${a.date}","${a.type}","${a.category}","${a.amount}","${a.paymentMode}","${a.description.replace(/"/g, '""')}","${a.referenceNo || ''}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kamil_traders_accounts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            {isUrdu ? 'مالیاتی کھاتہ جات اور کیش بک (Accounts & Expenses)' : 'Accounts & Expense Ledger'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'روزنامچہ، کیش ان ہینڈ، بینک کھاتہ اور دوکان کے اخراجات کی تفصیل' : 'Manage daily income, shop rent, electricity, freight & cash book'}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isUrdu ? '➕ نئی اینٹری (New)' : '➕ Add Transaction'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-slate-700 dark:text-emerald-300 rounded-lg text-xs font-medium border border-emerald-200 dark:border-slate-600 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isUrdu ? '📊 اکسل (Excel)' : '📊 Export Excel'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isUrdu ? '🖨 پرنٹ (Print)' : '🖨 Print'}</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isUrdu ? 'کل درآمد (Total Income)' : 'Total Income'}
            </span>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              Rs. {totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isUrdu ? 'کل اخراجات (Total Expenses)' : 'Total Expenses'}
            </span>
            <div className="text-xl font-bold text-rose-600 mt-1">
              Rs. {totalExpense.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isUrdu ? 'کیش ان ہینڈ (Cash In Hand)' : 'Cash in Hand'}
            </span>
            <div className={`text-xl font-bold mt-1 ${cashInHand >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
              Rs. {cashInHand.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isUrdu ? 'بینک و آن لائن بیلنس (Bank Balance)' : 'Bank / Digital Balance'}
            </span>
            <div className="text-xl font-bold text-indigo-600 mt-1">
              Rs. {bankBalance.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={isUrdu ? '🔍 اینٹری، ریفرنس یا کرایہ تلاش کریں...' : 'Search expense, description or reference...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 text-xs border-none rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">{isUrdu ? '🎯 تمام اینٹریز (All)' : 'All Types'}</option>
              <option value="EXPENSE">{isUrdu ? 'اخراجات (Expenses)' : 'Expense'}</option>
              <option value="INCOME">{isUrdu ? 'درآمد (Income)' : 'Income'}</option>
            </select>
          </div>

          {/* Mode Filter */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-slate-100 dark:bg-slate-700 text-xs border-none rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="ALL">{isUrdu ? 'تمام ذرائع (All Modes)' : 'All Modes'}</option>
            <option value="CASH">کیش (Cash)</option>
            <option value="BANK">بینک (Bank)</option>
            <option value="EASYPAISA">ایزی پیسہ / جیز کیش</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'تاریخ' : 'Date'}</th>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'قسم' : 'Type'}</th>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'کیٹیگری' : 'Category'}</th>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'تفصیل' : 'Description'}</th>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'طریقہ کار' : 'Mode'}</th>
                <th className="px-4 py-3 font-semibold">{isUrdu ? 'رقم (Rs.)' : 'Amount'}</th>
                <th className="px-4 py-3 font-semibold text-center">{isUrdu ? 'کارروائی' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    {isUrdu ? 'کوئی اینٹری نہیں ملی۔' : 'No account entries found.'}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{acc.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        acc.type === 'INCOME'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                      }`}>
                        {acc.type === 'INCOME' ? (isUrdu ? 'درآمد' : 'Income') : (isUrdu ? 'خرچہ' : 'Expense')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">
                      {acc.category}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {acc.description}
                      {acc.referenceNo && (
                        <span className="block text-[10px] text-slate-400">Ref: {acc.referenceNo}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{acc.paymentMode}</td>
                    <td className={`px-4 py-3 whitespace-nowrap font-bold ${
                      acc.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {acc.type === 'INCOME' ? '+' : '-'} Rs. {acc.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {currentRole === 'ADMIN' && (
                        <button
                          onClick={() => deleteAccountRecord(acc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition rounded"
                          title={isUrdu ? 'ڈیلیٹ کریں (Delete)' : 'Delete Record'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              {isUrdu ? 'نئی اینٹری شامل کریں' : 'Add Financial Entry'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'قسم (Type)' : 'Type'}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AccountType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="EXPENSE">{isUrdu ? 'اخراجات (Expense)' : 'Expense'}</option>
                    <option value="INCOME">{isUrdu ? 'آمدن (Income)' : 'Income'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'کیٹیگری (Category)' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AccountCategory)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="RENT">کرایہ (Rent)</option>
                    <option value="ELECTRICITY">بجلی بل (Electricity)</option>
                    <option value="SALARIES">تنخواہیں (Salaries)</option>
                    <option value="FREIGHT">بلٹی / بلٹی کرایہ (Freight)</option>
                    <option value="TEA_FOOD">چائے / کھانے (Tea/Food)</option>
                    <option value="MAINTENANCE">مینٹیننس (Maintenance)</option>
                    <option value="SALES">فروخت (Sales)</option>
                    <option value="OTHER">دیگر (Other)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'رقم (Rs.)' : 'Amount (Rs.)'}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'ذریعہ ادائیگی (Payment Mode)' : 'Payment Mode'}
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                >
                  <option value="CASH">کیش (Cash)</option>
                  <option value="BANK">بینک ٹرانسفر (Bank)</option>
                  <option value="EASYPAISA">ایزی پیسہ (EasyPaisa)</option>
                  <option value="JAZZCASH">جیز کیش (JazzCash)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'تفصیل (Description)' : 'Description'}
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isUrdu ? 'مثال: فرسٹ فلور دکان کرایہ جولائی' : 'e.g., Shop rent July'}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'ریفرنس نمبر (حسب ضرورت)' : 'Reference No. (Optional)'}
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="Receipt # / Bill #"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  {isUrdu ? 'منسوخ (Cancel)' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition"
                >
                  {isUrdu ? '💾 اینٹری محفوظ کریں' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

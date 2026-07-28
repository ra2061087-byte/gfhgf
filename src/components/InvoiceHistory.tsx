import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, PaymentStatus, InvoiceType } from '../types';
import { A5InvoicePad } from './A5InvoicePad';
import { ThermalReceipt } from './ThermalReceipt';
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Edit3, 
  Printer, 
  FileDown, 
  Smartphone, 
  Mail, 
  Copy, 
  Trash2, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Receipt,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfExport';

interface InvoiceHistoryProps {
  onEditInvoice?: (invoice: Invoice) => void;
  onDuplicateInvoice?: (invoice: Invoice) => void;
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({
  onEditInvoice,
  onDuplicateInvoice
}) => {
  const { language, invoices, updateInvoice, deleteInvoice, settings, addInvoice } = useApp();
  const isUrdu = language === 'ur';
  const company = settings.company;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Preview Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewFormat, setViewFormat] = useState<'A5' | 'THERMAL'>('A5');

  // Date filtering logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const getWeekStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  };

  const getMonthStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  };

  const filteredInvoices = invoices.filter((inv) => {
    // Search query match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      inv.invoiceNo.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.customerPhone.includes(q) ||
      inv.items.some((i) => 
        i.itemDescription.toLowerCase().includes(q) || 
        (i.itemDescriptionUr && i.itemDescriptionUr.includes(q))
      );

    // Date match
    let matchesDate = true;
    if (dateFilter === 'TODAY') {
      matchesDate = inv.date === todayStr;
    } else if (dateFilter === 'WEEK') {
      matchesDate = inv.date >= getWeekStartDate();
    } else if (dateFilter === 'MONTH') {
      matchesDate = inv.date >= getMonthStartDate();
    }

    // Status match
    let matchesStatus = true;
    if (statusFilter !== 'ALL') {
      matchesStatus = inv.paymentStatus === statusFilter;
    }

    // Type match
    let matchesType = true;
    if (typeFilter !== 'ALL') {
      matchesType = inv.type === typeFilter;
    }

    return matchesSearch && matchesDate && matchesStatus && matchesType;
  });

  // Calculate summary stats for current filtered list
  const totalInvoicesCount = filteredInvoices.length;
  const totalSalesAmount = filteredInvoices
    .filter((i) => i.type !== 'QUOTATION' && i.paymentStatus !== 'CANCELLED')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const totalOutstanding = filteredInvoices
    .filter((i) => i.type !== 'QUOTATION' && i.paymentStatus !== 'CANCELLED')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  // Actions
  const handleCancelInvoice = (inv: Invoice) => {
    if (window.confirm(isUrdu ? 'کیا آپ واقعی اس انوائس کو منسوخ (Cancel) کرنا چاہتے ہیں؟' : 'Are you sure you want to cancel this invoice?')) {
      updateInvoice(inv.id, { paymentStatus: 'CANCELLED' });
    }
  };

  const handleEmailInvoice = (inv: Invoice) => {
    const subject = encodeURIComponent(`${company.nameEn} Invoice #${inv.invoiceNo}`);
    const body = encodeURIComponent(
      `Dear ${inv.customerName},\n\nPlease find attached the summary for Invoice #${inv.invoiceNo} dated ${inv.date}.\nGrand Total: Rs. ${inv.grandTotal.toLocaleString()}\nBalance Due: Rs. ${inv.balanceDue.toLocaleString()}\n\nThank you for shopping with ${company.nameEn}.\nCall: ${company.phone}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDuplicate = (inv: Invoice) => {
    if (onDuplicateInvoice) {
      onDuplicateInvoice(inv);
    } else {
      addInvoice({
        type: inv.type,
        date: todayStr,
        customerId: inv.customerId,
        customerName: inv.customerName,
        customerPhone: inv.customerPhone,
        customerAddress: inv.customerAddress,
        items: [...inv.items],
        subTotal: inv.subTotal,
        discount: inv.discount,
        grandTotal: inv.grandTotal,
        paymentMethod: inv.paymentMethod,
        paymentStatus: 'PAID',
        paidAmount: inv.grandTotal,
        balanceDue: 0,
        notes: `Duplicate of ${inv.invoiceNo}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            <span>{isUrdu ? 'بلوں کی مکمل ہسٹری و انوائس ریکارڈ' : 'Invoice History & Billing Records'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu 
              ? 'تمام محفوظ شدہ بلز، کوٹیشنز، ایڈٹ، پرنٹ، پی ڈی ایف اور واٹس ایپ شیئرنگ' 
              : 'View, edit, print, download PDF, duplicate, or share all past transactions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 font-bold text-xs font-mono">
            {totalInvoicesCount} {isUrdu ? 'بلز موجود' : 'Invoices'}
          </span>
        </div>
      </div>

      {/* KPI Overview Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-urdu">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">{isUrdu ? 'فلٹر شدہ کل سیل' : 'Filtered Sales'}</div>
            <div className="text-xl font-black font-sans text-blue-900 dark:text-blue-300">Rs. {totalSalesAmount.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">{isUrdu ? 'باقی واجب الادا کھاتہ' : 'Receivable Balance'}</div>
            <div className="text-xl font-black font-sans text-rose-600 dark:text-rose-400">Rs. {totalOutstanding.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold">{isUrdu ? 'کوٹیشنز / تخمینہ جات' : 'Quotations Count'}</div>
            <div className="text-xl font-black font-sans text-amber-600 dark:text-amber-400">
              {filteredInvoices.filter((i) => i.type === 'QUOTATION').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 font-urdu">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Field */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'انوائس نمبر، گاہک کا نام یا فون نمبر تلاش کریں...' : 'Search invoice #, customer name, phone...'}
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Date Filter Buttons */}
          <div className="md:col-span-4 flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
            {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`flex-1 py-1.5 rounded-xl transition ${
                  dateFilter === d
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {d === 'ALL' && (isUrdu ? 'تمام' : 'All')}
                {d === 'TODAY' && (isUrdu ? 'آج' : 'Today')}
                {d === 'WEEK' && (isUrdu ? 'اس ہفتے' : 'This Week')}
                {d === 'MONTH' && (isUrdu ? 'اس مہینے' : 'This Month')}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
            >
              <option value="ALL">{isUrdu ? '-- تمام قسم کی انوائسز --' : 'All Invoice Types'}</option>
              <option value="INVOICE">{isUrdu ? 'فروخت کا بل (Final Invoice)' : 'Final Invoice'}</option>
              <option value="QUOTATION">{isUrdu ? 'کوٹیشن (Quotation)' : 'Quotation'}</option>
              <option value="SALES_RETURN">{isUrdu ? 'سیل واپسی (Sales Return)' : 'Sales Return'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-urdu text-sm">
            {isUrdu ? 'کوئی انوائس یا بل نہیں ملا۔' : 'No invoices found matching your criteria.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 font-urdu font-bold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="py-3.5 px-3 text-right">انوائس کوڈ</th>
                  <th className="py-3.5 px-3 text-right">تاریخ و وقت</th>
                  <th className="py-3.5 px-3 text-right">کسٹمر (گاہک)</th>
                  <th className="py-3.5 px-3 text-right">قسم</th>
                  <th className="py-3.5 px-3 text-right">کل رقم</th>
                  <th className="py-3.5 px-3 text-right">طریقہ / سٹیٹس</th>
                  <th className="py-3.5 px-3 text-center">ایکشنز (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-urdu">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-900 dark:text-blue-300 dir-ltr text-right">
                      {inv.invoiceNo}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-sans text-[11px]">
                      <div>{inv.date}</div>
                      {inv.time && <div className="text-[9px] text-slate-400">{inv.time}</div>}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <div>{inv.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.customerPhone}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.type === 'QUOTATION' 
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' 
                          : inv.type === 'SALES_RETURN'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {inv.type === 'QUOTATION' ? (isUrdu ? 'کوٹیشن' : 'Quotation') : inv.type === 'SALES_RETURN' ? (isUrdu ? 'سیل واپسی' : 'Return') : (isUrdu ? 'فروخت بل' : 'Sale')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold font-sans text-slate-900 dark:text-white">
                      Rs. {inv.grandTotal.toLocaleString()}
                      {inv.balanceDue > 0 && (
                        <div className="text-[10px] text-rose-500 font-normal">
                          (باقی: Rs.{inv.balanceDue})
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{inv.paymentMethod}</div>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        inv.paymentStatus === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.paymentStatus === 'CANCELLED'
                          ? 'bg-slate-200 text-slate-600 line-through'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View A5 Pad */}
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setViewFormat('A5');
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                          title="View A5 Pad"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* View Thermal Receipt */}
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setViewFormat('THERMAL');
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                          title="View Thermal 80mm"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit Invoice */}
                        {onEditInvoice && (
                          <button
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 transition"
                            title="Edit Invoice"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* Duplicate Invoice */}
                        <button
                          onClick={() => handleDuplicate(inv)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                          title="Duplicate Invoice"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Email Invoice */}
                        <button
                          onClick={() => handleEmailInvoice(inv)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          title="Email Summary"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        {/* Cancel Invoice */}
                        {inv.paymentStatus !== 'CANCELLED' && (
                          <button
                            onClick={() => handleCancelInvoice(inv)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition"
                            title="Cancel Invoice"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl my-8">
            {viewFormat === 'A5' ? (
              <A5InvoicePad
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
              />
            ) : (
              <ThermalReceipt
                invoice={selectedInvoice}
                onClose={() => setSelectedInvoice(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

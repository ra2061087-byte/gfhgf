import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Customer } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  DollarSign, 
  Smartphone, 
  History, 
  CreditCard, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  FileText
} from 'lucide-react';

export const KhataManager: React.FC = () => {
  const { 
    language, 
    customers, 
    addCustomer, 
    recordCustomerPayment, 
    ledgerEntries, 
    settings 
  } = useApp();

  const isUrdu = language === 'ur';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Forms
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    nameUr: '',
    phone: '',
    address: '',
    ntnOrCnic: '',
    creditLimit: 50000,
    notes: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 1000,
    paymentMethod: 'CASH',
    notes: 'Khata Payment Collection'
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.nameUr && c.nameUr.includes(searchQuery))
  );

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustForm);
    setIsAddCustomerOpen(false);
    setNewCustForm({
      name: '',
      nameUr: '',
      phone: '',
      address: '',
      ntnOrCnic: '',
      creditLimit: 50000,
      notes: ''
    });
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    recordCustomerPayment(
      selectedCustomer.id,
      paymentForm.amount,
      paymentForm.paymentMethod,
      paymentForm.notes
    );
    setIsPaymentModalOpen(false);

    // Refresh selected customer
    const updated = customers.find((c) => c.id === selectedCustomer.id);
    if (updated) setSelectedCustomer(updated);
  };

  const handleWhatsAppReminder = (customer: Customer) => {
    const rawPhone = customer.phone.replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.startsWith('0') ? '92' + rawPhone.substring(1) : rawPhone;

    const msg = settings.whatsAppTemplateUr
      .replace('{CUSTOMER_NAME}', customer.name)
      .replace('{AMOUNT}', customer.outstandingBalance.toLocaleString());

    const url = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;

    window.open(url, '_blank');
  };

  // Ledger for currently viewed customer
  const customerLedger = selectedCustomer
    ? ledgerEntries.filter((l) => l.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {getTranslation(language, 'khataLedger')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'کسٹمرز کے ادھار، وصولی، اور لیجر تاریخچہ کا مکمل نظام' : 'Manage customer accounts, debit/credit ledger and payments.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-95 font-urdu"
        >
          <Plus className="w-5 h-5 text-orange-400" />
          <span>{getTranslation(language, 'addCustomer')}</span>
        </button>
      </div>

      {/* Main Layout: Customer Directory (7 cols) + Ledger Detail (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer Directory */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search Box */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation(language, 'searchCustomers')}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-3">
              {filteredCustomers.map((cust) => {
                const isOverLimit = cust.outstandingBalance > cust.creditLimit;
                const isSelected = selectedCustomer?.id === cust.id;

                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`cursor-pointer p-4 rounded-2xl border transition ${
                      isSelected
                        ? 'border-blue-900 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm font-urdu">
                          {cust.nameUr || cust.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">{cust.phone}</p>
                        <p className="text-[11px] text-slate-400 font-urdu mt-0.5 truncate max-w-xs">
                          📍 {cust.address}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-400 font-urdu">موجودہ بقایا</div>
                        <div
                          className={`text-base font-black font-sans ${
                            cust.outstandingBalance > 0
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          Rs. {cust.outstandingBalance.toLocaleString()}
                        </div>
                        {isOverLimit && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-500 font-urdu mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>حد سے زیادہ!</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Card Actions */}
                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-urdu">
                      <span className="text-slate-400 text-[10px]">
                        حد ادھار: Rs. {cust.creditLimit.toLocaleString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {cust.outstandingBalance > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhatsAppReminder(cust);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>یاد دہانی</span>
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(cust);
                            setIsPaymentModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold rounded-lg transition"
                        >
                          <DollarSign className="w-3 h-3 text-orange-400" />
                          <span>وصولی درج</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Customer Ledger Timeline View */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          {selectedCustomer ? (
            <div className="space-y-4">
              {/* Selected Customer Card Header */}
              <div className="bg-blue-900 text-white p-4 rounded-2xl border border-blue-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold font-urdu">{selectedCustomer.nameUr || selectedCustomer.name}</h3>
                    <p className="text-xs text-blue-200 font-sans">{selectedCustomer.phone}</p>
                    <p className="text-[10px] text-blue-300 font-urdu mt-1">{selectedCustomer.address}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-blue-300 font-urdu block">بقایا کھاتہ</span>
                    <span className="text-xl font-black font-sans text-orange-400">
                      Rs. {selectedCustomer.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition font-urdu text-xs"
                  >
                    + وصولی جمع کریں
                  </button>
                  <button
                    onClick={() => handleWhatsAppReminder(selectedCustomer)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition font-urdu text-xs"
                  >
                    واٹس ایپ بل یاد دہانی
                  </button>
                </div>
              </div>

              {/* Ledger Entries List */}
              <h4 className="text-xs font-bold text-slate-500 font-urdu flex items-center gap-1">
                <History className="w-4 h-4 text-blue-600" />
                <span>لیجر تاریخچہ (Transaction Timeline)</span>
              </h4>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {customerLedger.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 font-urdu text-xs">
                    کوئی لیجر اینٹری موجود نہیں ہے۔
                  </div>
                ) : (
                  customerLedger.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between font-urdu"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          {entry.type === 'SALE' ? (
                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className={entry.type === 'SALE' ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}>
                            {entry.description}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                          {entry.date} {entry.paymentMethod ? `(${entry.paymentMethod})` : ''}
                        </span>
                      </div>

                      <div className="text-right font-sans">
                        <div className={`font-bold text-xs ${entry.type === 'SALE' ? 'text-orange-600' : 'text-emerald-600'}`}>
                          {entry.type === 'SALE' ? '+' : '-'} Rs. {entry.amount.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          باقی: Rs. {entry.balanceAfter.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 font-urdu text-sm space-y-2">
              <Users className="w-12 h-12 mx-auto text-slate-300" />
              <p>بائیں طرف سے کسٹمر منتخب کریں تا کہ مکمل لیجر دیکھا جا سکے۔</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl font-urdu space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">
                نیا کسٹمر اکاؤنٹ بنائیں
              </h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کسٹمر نام (English / Urdu Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: چوہدری لیتھ ورکس"
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value, nameUr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  فون نمبر (Phone Number)
                </label>
                <input
                  type="text"
                  required
                  placeholder="0300-1234567"
                  value={newCustForm.phone}
                  onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ایڈریس (Address)
                </label>
                <input
                  type="text"
                  required
                  placeholder="فیصل آباد مارکیٹ"
                  value={newCustForm.address}
                  onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ادھار کی حد (Credit Limit)
                </label>
                <input
                  type="number"
                  value={newCustForm.creditLimit}
                  onChange={(e) => setNewCustForm({ ...newCustForm, creditLimit: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-blue-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800"
                >
                  اکاؤنٹ بنائیں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl font-urdu space-y-4">
            <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">
              وصولی رقم درج کریں ({selectedCustomer.nameUr || selectedCustomer.name})
            </h3>

            <div className="bg-orange-50 dark:bg-orange-950/40 p-3 rounded-2xl border border-orange-200/60 text-xs">
              موجودہ بقایا کھاتہ: <strong className="font-sans text-sm text-orange-600">Rs. {selectedCustomer.outstandingBalance.toLocaleString()}</strong>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصول شدہ رقم (Rs)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-base text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ادائیگی کا طریقہ
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="CASH">نقد (Cash Payment)</option>
                  <option value="EASYPAISA">ایزی پیسہ / جیز کیش</option>
                  <option value="BANK">بینک ٹرانسفر</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  تفصیل / نوٹ
                </label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  وصولی جمع کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Supplier } from '../types';
import { Truck, Search, Plus, PhoneCall, MapPin, Package, X } from 'lucide-react';

export const SupplierManager: React.FC = () => {
  const { language, suppliers, addSupplier, deleteSupplier } = useApp();
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    address: '',
    balancePayable: 0,
    categoryProvided: 'Steel & Heavy Hardware'
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(form);
    setIsAddOpen(false);
    setForm({
      companyName: '',
      contactPerson: '',
      phone: '',
      address: '',
      balancePayable: 0,
      categoryProvided: 'Steel & Heavy Hardware'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {getTranslation(language, 'suppliers')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'سٹیل ملز، ڈسٹری بیوٹرز اور ہارڈویئر سپلائرز کا انتظام' : 'Manage steel mills, distributors and hardware suppliers.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-95 font-urdu"
        >
          <Plus className="w-5 h-5 text-orange-400" />
          <span>{getTranslation(language, 'addSupplier')}</span>
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(language, 'searchSuppliers')}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 font-urdu"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {sup.companyName}
                </h4>
                <p className="text-xs text-slate-500 font-sans">{sup.contactPerson}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-sans font-semibold">{sup.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{sup.address}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>{sup.categoryProvided}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">واجب الادا رقم</span>
              <span className="font-bold font-sans text-rose-600">
                Rs. {sup.balancePayable.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl font-urdu space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">
                نیا سپلائر شامل کریں
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کمپنی نام (Company Name)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mughal Steel Re-Rolling Mills"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رابطہ کار (Contact Person)
                </label>
                <input
                  type="text"
                  required
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
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
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  پتہ (Address)
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

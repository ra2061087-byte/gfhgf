import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Product, InvoiceItem, InvoiceType, PaymentMethod, Customer, Invoice } from '../types';
import { A5InvoicePad } from './A5InvoicePad';
import { 
  Search, 
  Plus, 
  Trash2, 
  Printer, 
  Smartphone, 
  Save, 
  Users, 
  ShoppingBag, 
  Calculator,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const POSBilling: React.FC = () => {
  const { language, products, customers, addInvoice, invoices } = useApp();
  const isUrdu = language === 'ur';

  // State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('INVOICE');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);

  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const [createdInvoiceForPreview, setCreatedInvoiceForPreview] = useState<Invoice | null>(null);

  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameUr.includes(searchQuery) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Customer Selection
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    }
  };

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].qty + 1;
        updated[existingIdx].qty = newQty;
        updated[existingIdx].amount = newQty * updated[existingIdx].rate;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            itemDescription: product.nameEn,
            itemDescriptionUr: product.nameUr,
            qty: 1,
            unit: product.unit,
            rate: product.salePrice,
            amount: product.salePrice
          }
        ];
      }
    });
  };

  // Add custom unlisted line item (e.g. custom cutting, special steel size)
  const handleAddCustomLine = () => {
    setCartItems((prev) => [
      ...prev,
      {
        itemDescription: isUrdu ? 'جدید ہارڈویئر سامان' : 'Custom Hardware Item',
        itemDescriptionUr: 'جدید ہارڈویئر سامان',
        qty: 1,
        unit: 'Pcs',
        rate: 100,
        amount: 100
      }
    ]);
  };

  // Cart row updates
  const updateCartItem = (idx: number, field: keyof InvoiceItem, value: any) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[idx], [field]: value };

      if (field === 'qty' || field === 'rate') {
        const q = Number(target.qty) || 0;
        const r = Number(target.rate) || 0;
        target.amount = q * r;
      }

      updated[idx] = target;
      return updated;
    });
  };

  const removeCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Totals calculations
  const subTotal = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = Math.max(0, subTotal - discount);
  const effectivePaid = paymentMethod === 'CASH' ? grandTotal : paidAmount;
  const balanceDue = Math.max(0, grandTotal - effectivePaid);

  // Submit & Save Invoice / Quotation
  const handleSaveInvoice = () => {
    if (cartItems.length === 0) {
      alert(isUrdu ? 'براہ کرم انوائس میں کم از کم ایک آئٹم شامل کریں۔' : 'Please add at least one item to the invoice.');
      return;
    }

    const created = addInvoice({
      type: invoiceType,
      date: new Date().toISOString().split('T')[0],
      customerId: selectedCustomerId || undefined,
      customerName: customerName || (isUrdu ? 'عام نقد خریدار' : 'Walk-in Customer'),
      customerPhone: customerPhone || '0300-6560253',
      customerAddress: customerAddress || 'فیصل آباد',
      items: cartItems,
      subTotal,
      discount,
      grandTotal,
      paymentMethod,
      paymentStatus: balanceDue === 0 ? 'PAID' : balanceDue === grandTotal ? 'UNPAID' : 'PARTIAL',
      paidAmount: effectivePaid,
      balanceDue,
      notes
    });

    setCreatedInvoiceForPreview(created);

    // Reset Form
    setCartItems([]);
    setDiscount(0);
    setPaidAmount(0);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {isUrdu ? 'فروخت رجسٹر و کوٹیشن پیڈ' : 'POS Sales & A5 Invoice Pad'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'نئی فروخت یا کوٹیشن بنائیں اور A5 پیڈ پر پرنٹ لیں' : 'Generate new sales bills and A5 quotation pads.'}
          </p>
        </div>

        {/* Invoice Type Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setInvoiceType('INVOICE')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              invoiceType === 'INVOICE'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'فائنل بل / انوائس' : 'Final Invoice'}
          </button>
          <button
            onClick={() => setInvoiceType('QUOTATION')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              invoiceType === 'QUOTATION'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'کوٹیشن / تخمینہ' : 'Quotation Pad'}
          </button>
        </div>
      </div>

      {/* Main Grid: Catalog vs Billing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Product Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation(language, 'searchProducts')}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 font-urdu">
                {isUrdu ? 'سامان کی فہرست' : 'Available Inventory'}
              </span>
              <button
                onClick={handleAddCustomLine}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 font-urdu"
              >
                <Plus className="w-3 h-3" />
                <span>{isUrdu ? '+ بغیر سٹاک آئٹم' : '+ Custom Line Item'}</span>
              </button>
            </div>

            {/* Product Cards List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className="cursor-pointer p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white font-urdu">
                      {p.nameUr}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {p.nameEn} ({p.code})
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Stock: <span className={p.stockQty <= p.lowStockThreshold ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {p.stockQty} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-xs text-blue-900 dark:text-blue-300 font-sans">
                      Rs. {p.salePrice.toLocaleString()}
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[9px] font-bold mt-1 group-hover:bg-blue-600 group-hover:text-white transition">
                      + Add
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cart & Bill Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Customer Selection Box */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-3 font-urdu">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{isUrdu ? 'کسٹمر کی معلومات (گاہک)' : 'Customer Info'}</span>
              </span>

              <select
                value={selectedCustomerId}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="">{isUrdu ? '-- کھاتہ کسٹمر منتخب کریں --' : '-- Choose Khata Customer --'}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - Bal: Rs.{c.outstandingBalance}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isUrdu ? 'نام گاہک (Name)' : 'Customer Name'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={isUrdu ? 'فون نمبر (Phone)' : 'Phone Number'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder={isUrdu ? 'ایڈریس (Address)' : 'Address'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>
          </div>

          {/* Cart Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 font-urdu font-bold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2 text-right">تفصیل</th>
                    <th className="p-2 text-center w-20">تعداد</th>
                    <th className="p-2 text-right w-24">ریٹ</th>
                    <th className="p-2 text-right w-24">رقم</th>
                    <th className="p-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-urdu">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        {isUrdu ? 'کوئی سامان شامل نہیں ہوا۔ بائیں طرف سے شامل کریں۔' : 'No items added. Click products on left to add.'}
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.itemDescriptionUr || item.itemDescription}
                            onChange={(e) => updateCartItem(idx, 'itemDescriptionUr', e.target.value)}
                            className="w-full bg-transparent font-semibold text-slate-900 dark:text-white border-b border-transparent focus:border-blue-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateCartItem(idx, 'qty', Number(e.target.value))}
                            className="w-16 text-center font-bold font-sans bg-slate-100 dark:bg-slate-800 rounded-lg p-1"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateCartItem(idx, 'rate', Number(e.target.value))}
                            className="w-20 text-right font-sans font-bold bg-slate-100 dark:bg-slate-800 rounded-lg p-1"
                          />
                        </td>
                        <td className="p-2 font-bold font-sans text-blue-900 dark:text-blue-300">
                          Rs. {item.amount.toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeCartItem(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment & Totals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-urdu">
            {/* Payment Method Selector */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isUrdu ? 'ادائیگی کا ذریعہ' : 'Payment Mode'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['CASH', 'KHATA', 'EASYPAISA', 'BANK'] as PaymentMethod[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-2 rounded-xl font-bold border transition ${
                      paymentMethod === pm
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {pm === 'CASH' && (isUrdu ? 'نقد (Cash)' : 'Cash')}
                    {pm === 'KHATA' && (isUrdu ? 'ادھار / کھاتہ' : 'Khata Credit')}
                    {pm === 'EASYPAISA' && (isUrdu ? 'ایزی پیسہ / جیز' : 'EasyPaisa')}
                    {pm === 'BANK' && (isUrdu ? 'بینک ٹرانسفر' : 'Bank')}
                  </button>
                ))}
              </div>

              {paymentMethod !== 'CASH' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    {isUrdu ? 'وصول شدہ نقد رقم' : 'Paid Amount Now'}
                  </label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-sans"
                  />
                </div>
              )}
            </div>

            {/* Calculations Box */}
            <div className="bg-blue-900 text-white p-4 rounded-2xl space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span>سب ٹوٹل:</span>
                <span className="font-bold font-sans">Rs. {subTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>رعایت (Discount):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 text-right bg-blue-950 border border-blue-700 rounded-lg p-1 text-xs font-bold font-sans text-orange-400"
                />
              </div>

              <div className="pt-2 border-t border-blue-800 flex justify-between items-center text-sm font-black">
                <span>کل ٹوٹل (Grand Total):</span>
                <span className="text-base font-sans text-orange-400">Rs. {grandTotal.toLocaleString()}</span>
              </div>

              {balanceDue > 0 && (
                <div className="flex justify-between items-center text-xs text-rose-300 font-bold pt-1">
                  <span>باقی ادھار کھاتہ:</span>
                  <span className="font-sans">Rs. {balanceDue.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveInvoice}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg transition transform active:scale-95 font-urdu"
            >
              <Printer className="w-5 h-5" />
              <span>
                {invoiceType === 'QUOTATION'
                  ? (isUrdu ? 'کوٹیشن بنائیں اور A5 پرنٹ لیں' : 'Save & Print Quotation')
                  : (isUrdu ? 'سیل انوائس بنائیں اور A5 پرنٹ لیں' : 'Save & Print A5 Bill')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal A5 Invoice Pad Preview when Invoice is saved */}
      {createdInvoiceForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl my-8">
            <A5InvoicePad
              invoice={createdInvoiceForPreview}
              onClose={() => setCreatedInvoiceForPreview(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

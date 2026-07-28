import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Product, InvoiceItem, InvoiceType, PaymentMethod, Customer, Invoice, ProductCategory } from '../types';
import { A5InvoicePad } from './A5InvoicePad';
import { ThermalReceipt } from './ThermalReceipt';
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
  FileText,
  UserPlus,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
  X,
  FileCheck,
  RotateCcw
} from 'lucide-react';

interface POSBillingProps {
  editingInvoice?: Invoice | null;
  onFinishedEdit?: () => void;
}

export const POSBilling: React.FC<POSBillingProps> = ({ editingInvoice, onFinishedEdit }) => {
  const { language, products, customers, addInvoice, updateInvoice, addCustomer, invoices, settings } = useApp();
  const isUrdu = language === 'ur';
  const company = settings.company;

  // State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('INVOICE');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [customerNtn, setCustomerNtn] = useState<string>('');

  // Manual Bill No Override
  const [useManualInvoiceNo, setUseManualInvoiceNo] = useState<boolean>(false);
  const [manualInvoiceNo, setManualInvoiceNo] = useState<string>('');

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Cart Items
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);

  // Totals & Calculations
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0); // e.g. 0% or 18% GST
  const [freightAmount, setFreightAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [receivedCash, setReceivedCash] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Quick Add Customer Dialog
  const [showQuickCustomerModal, setShowQuickCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustNtn, setNewCustNtn] = useState('');

  // Preview Modal
  const [createdInvoiceForPreview, setCreatedInvoiceForPreview] = useState<Invoice | null>(null);
  const [previewFormat, setPreviewFormat] = useState<'A5' | 'THERMAL'>('A5');

  // Load existing invoice if editing
  useEffect(() => {
    if (editingInvoice) {
      setInvoiceType(editingInvoice.type);
      setSelectedCustomerId(editingInvoice.customerId || '');
      setCustomerName(editingInvoice.customerName);
      setCustomerPhone(editingInvoice.customerPhone);
      setCustomerAddress(editingInvoice.customerAddress);
      setCustomerNtn(editingInvoice.customerNtn || '');
      setCartItems([...editingInvoice.items]);
      setDiscount(editingInvoice.discount || 0);
      setTaxRate(editingInvoice.taxRate || 0);
      setFreightAmount(editingInvoice.freightAmount || 0);
      setPaymentMethod(editingInvoice.paymentMethod);
      setPaidAmount(editingInvoice.paidAmount);
      setReceivedCash(editingInvoice.receivedCash || 0);
      setNotes(editingInvoice.notes || '');
      setUseManualInvoiceNo(true);
      setManualInvoiceNo(editingInvoice.invoiceNo);
    }
  }, [editingInvoice]);

  // Categories list
  const categories: ProductCategory[] = [
    'Steel & Iron',
    'Machinery Parts',
    'Bearings',
    'Fasteners & Bolts',
    'Tools & Equipment',
    'Pipes & Fittings',
    'Electrical & Cables',
    'General Hardware'
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameUr.includes(searchQuery) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Select existing customer
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
      setCustomerNtn(found.ntnOrCnic || '');
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setCustomerNtn('');
    }
  };

  // Add new customer inline
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    addCustomer({
      name: newCustName,
      phone: newCustPhone || '0300-6560253',
      address: newCustAddress || 'فیصل آباد',
      ntnOrCnic: newCustNtn,
      creditLimit: 500000
    });

    setCustomerName(newCustName);
    setCustomerPhone(newCustPhone);
    setCustomerAddress(newCustAddress);
    setCustomerNtn(newCustNtn);

    setShowQuickCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustNtn('');
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

  // Add custom non-stock line item
  const handleAddCustomLine = () => {
    setCartItems((prev) => [
      ...prev,
      {
        itemDescription: isUrdu ? 'خاص ہارڈویئر سامان' : 'Custom Hardware Item',
        itemDescriptionUr: 'خاص ہارڈویئر سامان',
        qty: 1,
        unit: 'Pcs',
        rate: 500,
        amount: 500
      }
    ]);
  };

  // Update cart item row
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

  // Financial calculations
  const subTotal = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round((subTotal * taxRate) / 100);
  const grandTotal = Math.max(0, subTotal - discount + taxAmount + freightAmount);

  const effectivePaid = paymentMethod === 'CASH' ? grandTotal : paidAmount;
  const balanceDue = Math.max(0, grandTotal - effectivePaid);
  const changeReturn = paymentMethod === 'CASH' && receivedCash > grandTotal ? receivedCash - grandTotal : 0;

  // Save / Submit Bill
  const handleSaveInvoice = (isDraft: boolean = false, format: 'A5' | 'THERMAL' = 'A5') => {
    if (cartItems.length === 0) {
      alert(isUrdu ? 'براہ کرم انوائس میں کم از کم ایک آئٹم شامل کریں۔' : 'Please add at least one item to the invoice.');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    let created: Invoice;

    if (editingInvoice) {
      updateInvoice(editingInvoice.id, {
        type: invoiceType,
        date: editingInvoice.date || todayDate,
        customerId: selectedCustomerId || undefined,
        customerName: customerName || (isUrdu ? 'عام نقد خریدار' : 'Walk-in Customer'),
        customerPhone: customerPhone || '0300-6560253',
        customerAddress: customerAddress || 'فیصل آباد',
        customerNtn: customerNtn || undefined,
        items: cartItems,
        subTotal,
        discount,
        taxRate,
        taxAmount,
        freightAmount,
        grandTotal,
        paymentMethod,
        paymentStatus: isDraft ? 'DRAFT' : balanceDue === 0 ? 'PAID' : balanceDue === grandTotal ? 'UNPAID' : 'PARTIAL',
        paidAmount: effectivePaid,
        balanceDue,
        receivedCash,
        changeReturn,
        notes,
        isDraft
      });

      created = {
        ...editingInvoice,
        type: invoiceType,
        customerName,
        customerPhone,
        customerAddress,
        items: cartItems,
        subTotal,
        discount,
        grandTotal,
        paymentMethod,
        paymentStatus: balanceDue === 0 ? 'PAID' : 'PARTIAL',
        paidAmount: effectivePaid,
        balanceDue
      };

      if (onFinishedEdit) onFinishedEdit();
    } else {
      created = addInvoice({
        type: invoiceType,
        manualInvoiceNo: useManualInvoiceNo ? manualInvoiceNo : undefined,
        date: todayDate,
        customerId: selectedCustomerId || undefined,
        customerName: customerName || (isUrdu ? 'عام نقد خریدار' : 'Walk-in Customer'),
        customerPhone: customerPhone || '0300-6560253',
        customerAddress: customerAddress || 'فیصل آباد',
        customerNtn: customerNtn || undefined,
        items: cartItems,
        subTotal,
        discount,
        taxRate,
        taxAmount,
        freightAmount,
        grandTotal,
        paymentMethod,
        paymentStatus: isDraft ? 'DRAFT' : balanceDue === 0 ? 'PAID' : balanceDue === grandTotal ? 'UNPAID' : 'PARTIAL',
        paidAmount: effectivePaid,
        balanceDue,
        receivedCash,
        changeReturn,
        notes,
        isDraft
      });
    }

    setPreviewFormat(format);
    setCreatedInvoiceForPreview(created);

    // Reset Form
    if (!editingInvoice) {
      setCartItems([]);
      setDiscount(0);
      setTaxRate(0);
      setFreightAmount(0);
      setPaidAmount(0);
      setReceivedCash(0);
      setNotes('');
      setManualInvoiceNo('');
      setUseManualInvoiceNo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Invoice Type Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-[10px] font-urdu">
              {company.nameUr}
            </span>
            {editingInvoice && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] font-mono">
                EDITING #{editingInvoice.invoiceNo}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {isUrdu ? 'پروفیشنل انوائسنگ و بلنگ ڈیسک' : 'Professional Hardware POS Invoicing Desk'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'کامل ٹریڈرز - A5 پرنٹ، تھرمل 80mm، PDF ڈاؤن لوڈ، اور WhatsApp شیئرنگ' : 'Generate bills, quotations, and returns with instant A5, Thermal, and WhatsApp PDF output.'}
          </p>
        </div>

        {/* Invoice Type Selector Buttons */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold font-urdu">
          <button
            onClick={() => setInvoiceType('INVOICE')}
            className={`px-3.5 py-2 rounded-xl transition ${
              invoiceType === 'INVOICE' ? 'bg-blue-900 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'فروخت کا بل (Invoice)' : 'Sale Invoice'}
          </button>

          <button
            onClick={() => setInvoiceType('QUOTATION')}
            className={`px-3.5 py-2 rounded-xl transition ${
              invoiceType === 'QUOTATION' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'کوٹیشن (Estimate)' : 'Quotation'}
          </button>

          <button
            onClick={() => setInvoiceType('SALES_RETURN')}
            className={`px-3.5 py-2 rounded-xl transition ${
              invoiceType === 'SALES_RETURN' ? 'bg-rose-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {isUrdu ? 'سیل واپسی (Return)' : 'Sales Return'}
          </button>
        </div>
      </div>

      {/* Main Grid: Catalog vs Billing Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Inventory Search & Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation(language, 'searchProducts')}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold font-urdu">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isUrdu ? 'تمام کیٹیگریز' : 'All Categories'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 font-urdu">
                {isUrdu ? 'دستیاب سامان (' + filteredProducts.length + ')' : 'Available Stock (' + filteredProducts.length + ')'}
              </span>
              <button
                onClick={handleAddCustomLine}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-urdu"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isUrdu ? '+ بغیر سٹاک آئٹم' : '+ Custom Line'}</span>
              </button>
            </div>

            {/* Product Cards List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
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
                      Stock:{' '}
                      <span className={p.stockQty <= p.lowStockThreshold ? 'text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {p.stockQty} {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-xs text-blue-900 dark:text-blue-300 font-sans">
                      Rs. {p.salePrice.toLocaleString()}
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[9px] font-bold mt-1 group-hover:bg-blue-600 group-hover:text-white transition">
                      + Add
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Billing Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Customer Selection & Manual Invoice # */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-3 font-urdu">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-orange-500" />
                <span>{isUrdu ? 'کسٹمر کی معلومات (گاہک)' : 'Customer Details'}</span>
              </span>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="">{isUrdu ? '-- کھاتہ کسٹمر منتخب کریں --' : '-- Choose Saved Khata Customer --'}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - Bal: Rs.{c.outstandingBalance}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowQuickCustomerModal(true)}
                  className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  title="Add New Customer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ نیا</span>
                </button>
              </div>
            </div>

            {/* Customer Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
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
              <input
                type="text"
                value={customerNtn}
                onChange={(e) => setCustomerNtn(e.target.value)}
                placeholder={isUrdu ? 'NTN / CNIC (Optional)' : 'NTN Number'}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            {/* Manual Invoice # Override Option */}
            <div className="pt-2 border-t border-blue-200/40 dark:border-blue-900/40 flex items-center justify-between text-xs font-sans">
              <label className="flex items-center gap-2 cursor-pointer font-urdu">
                <input
                  type="checkbox"
                  checked={useManualInvoiceNo}
                  onChange={(e) => setUseManualInvoiceNo(e.target.checked)}
                  className="rounded text-blue-900 focus:ring-0"
                />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {isUrdu ? 'مینول انوائس نمبر درج کریں (Manual Override)' : 'Manual Invoice No. Override'}
                </span>
              </label>

              {useManualInvoiceNo && (
                <input
                  type="text"
                  value={manualInvoiceNo}
                  onChange={(e) => setManualInvoiceNo(e.target.value)}
                  placeholder="e.g. KT-2026-99"
                  className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono text-blue-900 dark:text-blue-300"
                />
              )}
            </div>
          </div>

          {/* Billing Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 font-urdu font-bold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-2 text-right">تفصیل سامان</th>
                    <th className="p-2 text-center w-20">تعداد</th>
                    <th className="p-2 text-center w-20">یونٹ</th>
                    <th className="p-2 text-right w-24">ریٹ</th>
                    <th className="p-2 text-right w-24">رقم</th>
                    <th className="p-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-urdu">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {isUrdu ? 'کوئی سامان شامل نہیں ہوا۔ بائیں طرف سے سامان کا انتخاب کریں۔' : 'No items added yet. Click items on left.'}
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
                        <td className="p-2 text-center">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                            {item.unit}
                          </span>
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

          {/* Payment Mode & Calculation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-urdu">
            {/* Payment Method & Cash Received */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isUrdu ? 'ادائیگی کا ذریعہ' : 'Payment Mode'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['CASH', 'KHATA', 'BANK', 'EASYPAISA', 'JAZZCASH'] as PaymentMethod[]).map((pm) => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    className={`py-2 px-2 rounded-xl font-bold border transition text-center ${
                      paymentMethod === pm
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {pm === 'CASH' && (isUrdu ? 'نقد (Cash)' : 'Cash')}
                    {pm === 'KHATA' && (isUrdu ? 'ادھار / کھاتہ' : 'Khata')}
                    {pm === 'BANK' && (isUrdu ? 'بینک' : 'Bank')}
                    {pm === 'EASYPAISA' && (isUrdu ? 'ایزی پیسہ' : 'Easypaisa')}
                    {pm === 'JAZZCASH' && (isUrdu ? 'جیز کیش' : 'JazzCash')}
                  </button>
                ))}
              </div>

              {/* Cash Given & Change Return Calculator */}
              {paymentMethod === 'CASH' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {isUrdu ? 'دیا گیا نقد (Given)' : 'Received Cash'}
                    </label>
                    <input
                      type="number"
                      value={receivedCash}
                      onChange={(e) => setReceivedCash(Number(e.target.value))}
                      placeholder="e.g. 5000"
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      {isUrdu ? 'واپسی نقد (Change)' : 'Change Return'}
                    </label>
                    <div className="w-full px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-sans">
                      Rs. {changeReturn.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'CASH' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    {isUrdu ? 'موقع پر ادا شدہ نقد رقم' : 'Partial Paid Amount'}
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

            {/* Calculations & Taxes Box */}
            <div className="bg-blue-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>سب ٹوٹل:</span>
                <span className="font-bold font-sans">Rs. {subTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>رعایت (Discount):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 text-right bg-blue-950 border border-blue-700 rounded-lg p-1 text-xs font-bold font-sans text-orange-400"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>ٹیکس / GST (%):</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-12 text-right bg-blue-950 border border-blue-700 rounded-lg p-1 text-xs font-bold font-sans text-white"
                  />
                  <span>%</span>
                  <span className="text-[10px] text-blue-200 font-sans">(Rs. {taxAmount})</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>کرایہ / ٹرانسپورٹ:</span>
                <input
                  type="number"
                  value={freightAmount}
                  onChange={(e) => setFreightAmount(Number(e.target.value))}
                  className="w-20 text-right bg-blue-950 border border-blue-700 rounded-lg p-1 text-xs font-bold font-sans text-white"
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

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 font-urdu">
            {/* Save & Print A5 */}
            <button
              onClick={() => handleSaveInvoice(false, 'A5')}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'محفوظ کریں + A5 پرنٹ' : 'Save & Print A5 Pad'}</span>
            </button>

            {/* Save & Print Thermal 80mm */}
            <button
              onClick={() => handleSaveInvoice(false, 'THERMAL')}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? 'تھرمل پرنٹ (80mm)' : 'Thermal 80mm'}</span>
            </button>

            {/* Save Draft */}
            <button
              onClick={() => handleSaveInvoice(true, 'A5')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition"
              title="Save Draft"
            >
              <Save className="w-4 h-4 inline mr-1" />
              <span>{isUrdu ? 'ڈرافٹ محفوظ' : 'Draft'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add New Customer Modal */}
      {showQuickCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 font-urdu">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-blue-900 dark:text-blue-300">
                {isUrdu ? 'نیا کھاتہ کسٹمر شامل کریں' : 'Add New Khata Customer'}
              </h3>
              <button onClick={() => setShowQuickCustomerModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نام (Customer Name)*
                </label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="محمد بلال"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  فون نمبر (Phone Number)*
                </label>
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="0300-6560253"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ایڈریس (Address)
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="سمندری روڈ، فیصل آباد"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  NTN / CNIC (Optional)
                </label>
                <input
                  type="text"
                  value={newCustNtn}
                  onChange={(e) => setNewCustNtn(e.target.value)}
                  placeholder="3491028-4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickCustomerModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {createdInvoiceForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto flex justify-center items-start">
          <div className="w-full max-w-4xl my-8">
            {previewFormat === 'A5' ? (
              <A5InvoicePad
                invoice={createdInvoiceForPreview}
                onClose={() => setCreatedInvoiceForPreview(null)}
              />
            ) : (
              <ThermalReceipt
                invoice={createdInvoiceForPreview}
                onClose={() => setCreatedInvoiceForPreview(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

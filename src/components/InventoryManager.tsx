import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Product, ProductCategory, UnitType } from '../types';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calculator,
  CheckCircle2,
  X
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { language, products, addProduct, updateProduct, deleteProduct, adjustStock } = useApp();
  const isUrdu = language === 'ur';

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);
  const [stockQtyChange, setStockQtyChange] = useState<number>(0);
  const [stockAdjustReason, setStockAdjustReason] = useState<string>('New Arrival Stock In');

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    nameEn: string;
    nameUr: string;
    category: ProductCategory;
    unit: UnitType;
    costPrice: number;
    salePrice: number;
    stockQty: number;
    lowStockThreshold: number;
    location: string;
  }>({
    code: '',
    nameEn: '',
    nameUr: '',
    category: 'General Hardware',
    unit: 'Pcs',
    costPrice: 0,
    salePrice: 0,
    stockQty: 0,
    lowStockThreshold: 10,
    location: 'Rack 1'
  });

  const categoriesList: ProductCategory[] = [
    'Steel & Iron',
    'Machinery Parts',
    'Bearings',
    'Fasteners & Bolts',
    'Tools & Equipment',
    'Pipes & Fittings',
    'Electrical & Cables',
    'General Hardware'
  ];

  const unitsList: UnitType[] = ['Feet', 'Kg', 'Pcs', 'Meter', 'Box', 'Bundle', 'Set', 'Ltr'];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesQuery =
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameUr.includes(searchQuery) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || p.stockQty <= p.lowStockThreshold;

    return matchesQuery && matchesCategory && matchesLowStock;
  });

  const handleOpenAdd = () => {
    setFormData({
      code: 'KT-HW-' + Math.floor(100 + Math.random() * 900),
      nameEn: '',
      nameUr: '',
      category: 'General Hardware',
      unit: 'Pcs',
      costPrice: 100,
      salePrice: 130,
      stockQty: 50,
      lowStockThreshold: 10,
      location: 'Rack A'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      code: p.code,
      nameEn: p.nameEn,
      nameUr: p.nameUr,
      category: p.category,
      unit: p.unit,
      costPrice: p.costPrice,
      salePrice: p.salePrice,
      stockQty: p.stockQty,
      lowStockThreshold: p.lowStockThreshold,
      location: p.location || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsAddModalOpen(false);
  };

  const handleApplyStockAdjustment = () => {
    if (!stockAdjustProduct) return;
    adjustStock(stockAdjustProduct.id, stockQtyChange, stockAdjustReason);
    setStockAdjustProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
            {getTranslation(language, 'inventory')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isUrdu ? 'تمام ہارڈویئر سامان، ریٹ، اور سٹاک آمد و رفت کا انتظام' : 'Manage steel, machinery parts, bearings & hardware inventory.'}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform active:scale-95 font-urdu"
        >
          <Plus className="w-5 h-5 text-orange-400" />
          <span>{getTranslation(language, 'addProduct')}</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation(language, 'searchProducts')}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-urdu"
          >
            <option value="ALL">{getTranslation(language, 'allCategories')}</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
              showLowStockOnly
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="font-urdu">{isUrdu ? 'صرف کم سٹاک اشیاء' : 'Low Stock Only'}</span>
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 font-urdu font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4 text-right">{getTranslation(language, 'productCode')}</th>
                <th className="py-3 px-4 text-right">{getTranslation(language, 'description')}</th>
                <th className="py-3 px-4 text-right">{getTranslation(language, 'category')}</th>
                <th className="py-3 px-4 text-right">{getTranslation(language, 'costPrice')}</th>
                <th className="py-3 px-4 text-right">{getTranslation(language, 'salePrice')}</th>
                <th className="py-3 px-4 text-center">{getTranslation(language, 'currentStock')}</th>
                <th className="py-3 px-4 text-center">{getTranslation(language, 'actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-urdu">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-urdu text-sm">
                    {isUrdu ? 'کوئی ہارڈویئر سامان نہیں ملا۔' : 'No hardware products found.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stockQty <= p.lowStockThreshold;
                  const profitMargin = p.salePrice - p.costPrice;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-900 dark:text-blue-300 dir-ltr text-right">
                        {p.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {p.nameUr}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          {p.nameEn}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-400">
                        Rs. {p.costPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-bold text-emerald-600 dark:text-emerald-400">
                        Rs. {p.salePrice.toLocaleString()}
                        <span className="block text-[9px] text-slate-400 font-normal">
                          (+Rs. {profitMargin} profit)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs ${
                            isLow
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {p.stockQty} {p.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Adjust Stock Button */}
                          <button
                            onClick={() => {
                              setStockAdjustProduct(p);
                              setStockQtyChange(10);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-100 transition"
                            title="Stock In / Out"
                          >
                            <Package className="w-4 h-4" />
                          </button>

                          {/* Edit Product */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-100 transition"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete Product */}
                          <button
                            onClick={() => {
                              if (confirm(isUrdu ? 'کیا آپ اس سامان کو ختم کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this product?')) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 hover:bg-rose-100 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl font-urdu">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">
                {editingProduct
                  ? (isUrdu ? 'سامان کی معلومات تبدیل کریں' : 'Edit Hardware Product')
                  : (isUrdu ? 'نیا ہارڈویئر سامان شامل کریں' : 'Add New Hardware Product')}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    آئٹم کوڈ (SKU Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کیٹیگری (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  >
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اردو نام (Urdu Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: ایم ایس اینگل آئرن"
                    value={formData.nameUr}
                    onChange={(e) => setFormData({ ...formData, nameUr: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    انگریزی نام (English Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MS Angle Iron 2x2"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    یونٹ (Unit)
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitType })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans"
                  >
                    {unitsList.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    قیمت خرید (Cost)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    قیمت فروخت (Sale)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    موجودہ سٹاک (Stock Qty)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کم از کم الرٹ حد (Min Alert)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-rose-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white font-bold hover:bg-blue-800 transition"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjust Modal */}
      {stockAdjustProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl font-urdu space-y-4">
            <h3 className="text-base font-bold text-blue-900 dark:text-blue-300">
              سٹاک آمد / اخراج ({stockAdjustProduct.nameUr})
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                مقدار (+ آمد / - اخراج)
              </label>
              <input
                type="number"
                value={stockQtyChange}
                onChange={(e) => setStockQtyChange(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                تفصیل / وجہ
              </label>
              <input
                type="text"
                value={stockAdjustReason}
                onChange={(e) => setStockAdjustReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setStockAdjustProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
              >
                منسوخ
              </button>
              <button
                onClick={handleApplyStockAdjustment}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                سٹاک اپڈیٹ کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

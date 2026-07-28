import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { QrCode, Barcode, Printer, Download, Search, CheckSquare, Square, Sliders, RefreshCw } from 'lucide-react';

export const BarcodeManager: React.FC = () => {
  const { products, language, settings } = useApp();
  const isUrdu = language === 'ur';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    products.slice(0, 4).map((p) => p.id)
  );
  const [labelCopies, setLabelCopies] = useState<number>(3);
  const [showPriceOnLabel, setShowPriceOnLabel] = useState<boolean>(true);
  const [showCompanyOnLabel, setShowCompanyOnLabel] = useState<boolean>(true);
  const [codeType, setCodeType] = useState<'BARCODE' | 'QRCODE'>('BARCODE');

  const filteredProducts = products.filter(
    (p) =>
      p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.nameUr && p.nameUr.includes(searchTerm))
  );

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedProductIds(filteredProducts.map((p) => p.id));
  };

  const clearSelect = () => {
    setSelectedProductIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedProductsList = products.filter((p) => selectedProductIds.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Barcode className="w-6 h-6 text-orange-600" />
            {isUrdu ? 'بارکوڈ و کیو آر کوڈ جنریٹر (Barcode & QR Label Print)' : 'Barcode & QR Code Printing Center'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'سامان کے سٹیکرز، بارکوڈ پرنٹنگ اور تھرمل ڈائریکٹ پرنٹنگ' : 'Generate & batch-print barcode labels for items and shelf tags'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            disabled={selectedProductIds.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>{isUrdu ? '🖨 پرنٹ بارکوڈ سٹیکرز' : '🖨 Print Barcode Stickers'}</span>
          </button>
        </div>
      </div>

      {/* Control Panel & Product Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Left Options */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
            <Sliders className="w-4 h-4 text-orange-600" />
            {isUrdu ? 'پرنٹنگ کی سیٹنگز' : 'Label Design Settings'}
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {isUrdu ? 'کوڈ کی قسم (Code Style)' : 'Code Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCodeType('BARCODE')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition ${
                  codeType === 'BARCODE'
                    ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Barcode className="w-4 h-4" />
                Barcode 128
              </button>

              <button
                onClick={() => setCodeType('QRCODE')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-semibold border transition ${
                  codeType === 'QRCODE'
                    ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {isUrdu ? 'ہر آئٹم کے سٹیکرز کی تعداد (Copies)' : 'Copies per item'}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={labelCopies}
              onChange={(e) => setLabelCopies(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompanyOnLabel}
                onChange={(e) => setShowCompanyOnLabel(e.target.checked)}
                className="rounded text-orange-600"
              />
              <span>{isUrdu ? 'کمپنی کا نام (Kamil Traders) دکھائیں' : 'Show Shop Title on Label'}</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showPriceOnLabel}
                onChange={(e) => setShowPriceOnLabel(e.target.checked)}
                className="rounded text-orange-600"
              />
              <span>{isUrdu ? 'قیمت فروخت (Sale Price) دکھائیں' : 'Show Sale Price'}</span>
            </label>
          </div>
        </div>

        {/* Right Product Selection List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {isUrdu ? 'پرنٹنگ کے لیے سامان منتخب کریں' : 'Select Inventory Products'} ({selectedProductIds.length})
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <button onClick={selectAll} className="text-orange-600 hover:underline">
                {isUrdu ? 'سب منتخب کریں' : 'Select All'}
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={clearSelect} className="text-slate-500 hover:underline">
                {isUrdu ? 'کوئی نہیں' : 'Clear'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isUrdu ? '🔍 سامان کا نام یا کوڈ تلاش کریں...' : 'Filter item code or name...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700 border border-slate-100 dark:border-slate-700 rounded-lg">
            {filteredProducts.map((p) => {
              const selected = selectedProductIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleSelectProduct(p.id)}
                  className={`flex items-center justify-between p-2.5 text-xs cursor-pointer transition ${
                    selected ? 'bg-orange-50/60 dark:bg-orange-900/20 font-medium' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selected ? (
                      <CheckSquare className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <div className="text-slate-800 dark:text-slate-100">{p.nameEn}</div>
                      <div className="text-[10px] text-slate-400">{p.code} • {p.category}</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-700 dark:text-slate-200">
                    Rs. {p.salePrice.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Printable Stickers Preview Stage */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700 no-print">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {isUrdu ? 'پرنٹ ڈسپلے پیش نظارہ (Print Preview Sheet)' : 'Label Sheet Preview'}
          </h3>
          <span className="text-xs text-slate-400">
            {isUrdu ? '38mm x 25mm سٹینڈرڈ تھرمل بارکوڈ سائز' : 'Standard Thermal 38x25mm / Sheet Labels'}
          </span>
        </div>

        {selectedProductsList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs no-print">
            {isUrdu ? 'پرنٹنگ کے لیے سامان منتخب کریں۔' : 'Please select at least one item from the list above.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {selectedProductsList.flatMap((p) =>
              Array.from({ length: labelCopies }).map((_, idx) => (
                <div
                  key={`${p.id}_${idx}`}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-center flex flex-col items-center justify-between bg-white text-slate-900 shadow-sm min-h-[120px] print:border-solid print:border-black print:m-1"
                >
                  {showCompanyOnLabel && (
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 w-full pb-0.5 mb-1">
                      {settings.company.nameEn || 'KAMIL TRADERS'}
                    </div>
                  )}

                  <div className="text-[10px] font-semibold line-clamp-1 leading-tight text-slate-900 w-full">
                    {p.nameEn}
                  </div>

                  {codeType === 'BARCODE' ? (
                    <div className="my-1.5 w-full flex flex-col items-center">
                      <div className="h-8 w-11/12 bg-slate-900 flex items-center justify-center p-0.5 rounded-sm">
                        <div className="w-full h-full bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,#000_2px,#000_5px)]"></div>
                      </div>
                      <span className="text-[9px] font-mono tracking-widest text-slate-800 mt-0.5">
                        {p.code}
                      </span>
                    </div>
                  ) : (
                    <div className="my-1 flex flex-col items-center">
                      <div className="w-10 h-10 border border-slate-800 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-800">
                        [QR CODE]
                      </div>
                      <span className="text-[8px] font-mono mt-0.5 text-slate-700">{p.code}</span>
                    </div>
                  )}

                  {showPriceOnLabel && (
                    <div className="text-[10px] font-extrabold text-slate-900 border-t border-slate-200 w-full pt-0.5 mt-0.5">
                      Rs. {p.salePrice.toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

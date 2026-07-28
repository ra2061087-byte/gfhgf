import React, { useRef, useState } from 'react';
import { Invoice } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, FileDown, Smartphone, Loader2, X } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfExport';

interface ThermalReceiptProps {
  invoice: Invoice;
  onClose?: () => void;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ invoice, onClose }) => {
  const { settings, language } = useApp();
  const company = settings.company;
  const isUrdu = language === 'ur';

  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      setIsExporting(true);
      const { pdf, fileName } = await generateInvoicePDF(receiptRef.current, invoice);
      pdf.save(fileName);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 text-slate-100 p-4 rounded-3xl max-w-md mx-auto space-y-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-slate-800 p-3 rounded-2xl border border-slate-700">
        <span className="text-xs font-bold font-urdu text-orange-400">
          {isUrdu ? 'تھرمل رسید پرنٹ preview (80mm)' : 'Thermal Receipt (80mm)'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>پرنٹ</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Actual 80mm Thermal Receipt Layout */}
      <div className="overflow-x-auto flex justify-center py-2">
        <div
          ref={receiptRef}
          className="printable-a5-pad bg-white text-black p-4 font-mono text-[11px] leading-tight border border-slate-300 shadow-2xl rounded-sm"
          style={{ width: '80mm', minHeight: '120mm' }}
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-2 border-b border-dashed border-black">
            <h2 className="text-base font-bold font-urdu leading-none">{company.nameUr}</h2>
            <div className="text-[12px] font-black tracking-wider uppercase">{company.nameEn}</div>
            <div className="text-[9px]">{company.addressUr}</div>
            <div className="text-[9px]">☎ {company.phone} | NTN: {company.ntn}</div>
            <div className="mt-1 pt-1 font-bold text-xs uppercase border-t border-black">
              {invoice.type === 'QUOTATION' 
                ? '*** QUOTATION / ESTIMATE ***' 
                : invoice.type === 'SALES_RETURN' 
                ? '*** SALES RETURN ***'
                : '*** SALES INVOICE ***'}
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[10px]">
            <div className="flex justify-between">
              <span>Inv #: {invoice.invoiceNo}</span>
              <span>Date: {invoice.date}</span>
            </div>
            {invoice.time && (
              <div className="flex justify-between text-[9px]">
                <span>Time: {invoice.time}</span>
                <span>FY: {invoice.financialYear || '2025-26'}</span>
              </div>
            )}
            <div className="font-bold font-urdu">
              Cust: {invoice.customerName} ({invoice.customerPhone})
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left my-2 border-b border-dashed border-black">
            <thead>
              <tr className="border-b border-black text-[9px] font-bold uppercase">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Rate</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[10px]">
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1 pr-1 font-urdu font-semibold max-w-[110px] truncate">
                    {item.itemDescriptionUr || item.itemDescription}
                  </td>
                  <td className="py-1 text-center">{item.qty} {item.unit}</td>
                  <td className="py-1 text-right">{item.rate}</td>
                  <td className="py-1 text-right font-bold">Rs.{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations */}
          <div className="space-y-1 text-right font-bold text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {invoice.subTotal.toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span>- Rs. {invoice.discount.toLocaleString()}</span>
              </div>
            )}
            {invoice.freightAmount ? (
              <div className="flex justify-between">
                <span>Freight:</span>
                <span>Rs. {invoice.freightAmount.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-xs pt-1 border-t border-black font-black">
              <span>Grand Total:</span>
              <span>Rs. {invoice.grandTotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-[10px] font-normal pt-1">
              <span>Payment Mode:</span>
              <span className="font-bold">{invoice.paymentMethod}</span>
            </div>

            {invoice.balanceDue > 0 ? (
              <div className="flex justify-between text-[10px] text-red-600 font-bold">
                <span>Khata Balance Due:</span>
                <span>Rs. {invoice.balanceDue.toLocaleString()}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[10px] text-emerald-700 font-bold">
                <span>Status:</span>
                <span>PAID IN FULL</span>
              </div>
            )}

            {invoice.changeReturn !== undefined && invoice.changeReturn > 0 && (
              <div className="flex justify-between text-[10px] text-blue-800 font-bold">
                <span>Change Returned:</span>
                <span>Rs. {invoice.changeReturn.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-2 border-t border-dashed border-black text-center text-[9px] space-y-1 font-urdu">
            <p className="font-bold">شکریہ! دوبارہ تشریف لائیں۔</p>
            <p className="text-[8px] font-sans">Software powered by Kamil Traders Faisalabad</p>
          </div>
        </div>
      </div>
    </div>
  );
};

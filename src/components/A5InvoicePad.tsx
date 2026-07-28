import React from 'react';
import { Invoice } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, Share2, Download, CheckCircle, FileText, Smartphone } from 'lucide-react';

interface A5InvoicePadProps {
  invoice: Invoice;
  onClose?: () => void;
  isPrintOnly?: boolean;
}

export const A5InvoicePad: React.FC<A5InvoicePadProps> = ({ invoice, onClose }) => {
  const { settings, language } = useApp();
  const company = settings.company;

  const isUrdu = language === 'ur';

  // Total rows to display on the pre-printed pad (Pad standard is 15 rows)
  const TOTAL_ROWS = 15;
  const items = invoice.items || [];
  const emptyRowCount = Math.max(0, TOTAL_ROWS - items.length);
  const emptyRows = Array.from({ length: emptyRowCount });

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const rawPhone = invoice.customerPhone.replace(/[^0-9]/g, '');
    const formattedPhone = rawPhone.startsWith('0') ? '92' + rawPhone.substring(1) : rawPhone;

    const itemsSummary = invoice.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.itemDescriptionUr || it.itemDescription} (${it.qty} ${it.unit}) @ Rs.${it.rate} = Rs.${it.amount}`
      )
      .join('\n');

    const msg = `*${company.nameUr} (${company.nameEn})*
📍 ${company.addressUr}
☎ ${company.phone}
-----------------------------------
*${invoice.type === 'QUOTATION' ? 'کوٹیشن / ESTIMATE' : 'فروخت کا بل / INVOICE'}*
*نمبر:* ${invoice.invoiceNo}
*تاریخ:* ${invoice.date}
*گاہک:* ${invoice.customerName} (${invoice.customerPhone})
-----------------------------------
*تفصیلات:*
${itemsSummary}
-----------------------------------
*سب ٹوٹل:* Rs. ${invoice.subTotal.toLocaleString()}
*رعایت:* Rs. ${invoice.discount.toLocaleString()}
*ٹوٹل رقم (Grand Total):* Rs. ${invoice.grandTotal.toLocaleString()}
${invoice.balanceDue > 0 ? `*بقایا واجب الادا (Khata):* Rs. ${invoice.balanceDue.toLocaleString()}` : '*مکمل ادا شدہ (PAID)*'}
-----------------------------------
شکریہ! کامل ٹریڈرز فیصل آباد`;

    const encodedMsg = encodeURIComponent(msg);
    const url = formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;

    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto my-4">
      {/* Top Floating Action Controls (Hidden during printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 w-full bg-slate-900 text-white p-4 rounded-2xl shadow-xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            A5
          </div>
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span>{invoice.invoiceNo}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                invoice.type === 'QUOTATION' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {invoice.type === 'QUOTATION' ? (isUrdu ? 'کوٹیشن' : 'QUOTATION') : (isUrdu ? 'انوائس / بل' : 'INVOICE')}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {invoice.customerName || (isUrdu ? 'نقد گاہک' : 'Walk-in Customer')} • Rs. {invoice.grandTotal.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{isUrdu ? 'پرنٹ پینڈ (A5)' : 'Print A5 Pad'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>{isUrdu ? 'واٹس ایپ بل' : 'Send WhatsApp'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
            >
              {isUrdu ? 'بند کریں' : 'Close'}
            </button>
          )}
        </div>
      </div>

      {/* Printable A5 Pad Container (148mm x 210mm proportions) */}
      <div 
        className="printable-a5-pad relative bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200 overflow-hidden select-text text-xs"
        style={{
          width: '148mm',
          minHeight: '210mm',
          padding: '8mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Background Watermark (KT Logo centered behind table) */}
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-5"
          style={{ transform: 'rotate(-15deg)' }}
        >
          <div className="text-center font-black tracking-tighter text-blue-900 select-none">
            <div className="text-9xl font-black leading-none">KT</div>
            <div className="text-2xl font-bold tracking-widest mt-2 uppercase">Kamil Traders</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[194mm]">
          <div>
            {/* Header Section */}
            <div className="flex justify-between items-start border-b-2 border-blue-900 pb-3 mb-3">
              {/* Left: Modern KT Logo Badge */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-blue-900 rounded-xl flex flex-col items-center justify-center text-white border-2 border-orange-500 shadow-sm shrink-0">
                  <span className="text-xl font-black tracking-tighter text-orange-400 leading-none">KT</span>
                  <span className="text-[8px] font-bold tracking-widest text-blue-200 uppercase mt-0.5">EST. 2012</span>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-blue-900 font-urdu leading-tight">
                    {company.nameUr}
                  </h1>
                  <h2 className="text-sm font-black text-slate-800 tracking-wider font-sans -mt-1 uppercase">
                    {company.nameEn}
                  </h2>
                  <p className="text-[9px] font-bold text-orange-600 font-urdu mt-0.5">
                    {company.subtitleUr}
                  </p>
                </div>
              </div>

              {/* Right Header Info */}
              <div className="text-right flex flex-col items-end">
                <div className="bg-blue-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mb-1">
                  {invoice.type === 'QUOTATION' ? 'کوٹیشن / QUOTATION' : 'انوائس / CASH BILL'}
                </div>
                <div className="text-[10px] font-bold text-slate-700">
                  <span className="text-slate-500 font-normal">NTN No:</span> {company.ntn}
                </div>
                <div className="text-[10px] font-semibold text-blue-900">
                  <span className="text-slate-500 font-normal">Bill No:</span> {invoice.invoiceNo}
                </div>
              </div>
            </div>

            {/* Top Customer & Date Information Fields */}
            <div className="grid grid-cols-12 gap-2 text-[10px] bg-blue-50/60 p-2.5 rounded-lg border border-blue-200/80 mb-3 font-urdu">
              <div className="col-span-8 flex items-center gap-1.5">
                <span className="font-bold text-blue-900 shrink-0">نام (Customer):</span>
                <span className="font-semibold text-slate-900 border-b border-dotted border-slate-400 flex-1 px-1">
                  {invoice.customerName || 'عام نقد خریدار (Walk-in Customer)'}
                </span>
              </div>

              <div className="col-span-4 flex items-center gap-1.5 justify-end">
                <span className="font-bold text-blue-900 shrink-0">تاریخ (Date):</span>
                <span className="font-semibold text-slate-900 border-b border-dotted border-slate-400 px-2">
                  {invoice.date}
                </span>
              </div>

              <div className="col-span-8 flex items-center gap-1.5 mt-1">
                <span className="font-bold text-blue-900 shrink-0">ایڈریس (Address):</span>
                <span className="font-medium text-slate-800 border-b border-dotted border-slate-400 flex-1 px-1 truncate">
                  {invoice.customerAddress || 'فیصل آباد / Faisalabad Market'}
                </span>
              </div>

              <div className="col-span-4 flex items-center gap-1.5 justify-end mt-1">
                <span className="font-bold text-blue-900 shrink-0">فون نمبر (Phone):</span>
                <span className="font-medium text-slate-800 border-b border-dotted border-slate-400 px-1">
                  {invoice.customerPhone || company.phone}
                </span>
              </div>
            </div>

            {/* Quotation Table with Rounded Blue Borders */}
            <div className="border border-blue-900 rounded-lg overflow-hidden mb-3">
              <table className="w-full text-right border-collapse text-[10px]">
                <thead>
                  <tr className="bg-blue-900 text-white font-urdu font-bold text-[10px] leading-tight">
                    <th className="py-1.5 px-2 text-center w-8 border-r border-blue-800">
                      نمبر
                    </th>
                    <th className="py-1.5 px-2 text-right border-r border-blue-800">
                      تفصیل سامان (Description)
                    </th>
                    <th className="py-1.5 px-1.5 text-center w-14 border-r border-blue-800">
                      تعداد (Qty)
                    </th>
                    <th className="py-1.5 px-2 text-right w-16 border-r border-blue-800">
                      ریٹ (Rate)
                    </th>
                    <th className="py-1.5 px-2 text-right w-20">
                      رقم (Amount)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100/80 font-urdu">
                  {items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                      <td className="py-1 px-2 text-center text-slate-600 border-r border-blue-100 font-sans font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-1 px-2 text-slate-900 font-semibold border-r border-blue-100">
                        <div>{item.itemDescriptionUr || item.itemDescription}</div>
                        {item.itemDescriptionUr && (
                          <div className="text-[8px] text-slate-500 font-sans font-normal">
                            {item.itemDescription}
                          </div>
                        )}
                      </td>
                      <td className="py-1 px-1.5 text-center text-slate-800 border-r border-blue-100 font-sans font-semibold">
                        {item.qty} <span className="text-[8px] text-slate-500">{item.unit}</span>
                      </td>
                      <td className="py-1 px-2 text-right text-slate-800 border-r border-blue-100 font-sans">
                        {item.rate.toLocaleString()}
                      </td>
                      <td className="py-1 px-2 text-right font-bold text-slate-900 font-sans">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {/* Empty Padded Rows for Authentic Pre-printed Pad Look */}
                  {emptyRows.map((_, idx) => (
                    <tr key={`empty-${idx}`} className="h-6">
                      <td className="border-r border-blue-100 text-center text-slate-200">
                        {items.length + idx + 1}
                      </td>
                      <td className="border-r border-blue-100"></td>
                      <td className="border-r border-blue-100"></td>
                      <td className="border-r border-blue-100"></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary & Signatures Row */}
            <div className="grid grid-cols-12 gap-3 mb-2 font-urdu">
              {/* Left Side: Notes & Terms */}
              <div className="col-span-7 flex flex-col justify-between text-[9px] text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200">
                <div>
                  <span className="font-bold text-blue-900 block mb-0.5">ضروری ہدایات / Note:</span>
                  <p className="leading-tight text-[8.5px]">
                    1. تمام معاملات اور بقایا جات بعد از خریداری 7 ایام کے اندر نمٹائے جائیں۔
                  </p>
                  <p className="leading-tight text-[8.5px] mt-0.5">
                    2. سامان کا معیار اور تعداد موقع پر چیک فرمائیں۔
                  </p>
                  {invoice.notes && (
                    <p className="font-semibold text-slate-800 mt-1 italic">
                      نوٹ: {invoice.notes}
                    </p>
                  )}
                </div>

                <div className="mt-2 text-[8px] text-slate-500 border-t border-slate-200 pt-1 flex justify-between">
                  <span>ادائیگی طریقہ: <strong className="text-slate-800">{invoice.paymentMethod}</strong></span>
                  <span>حالت: <strong className="text-slate-800">{invoice.paymentStatus}</strong></span>
                </div>
              </div>

              {/* Right Side: Totals Box */}
              <div className="col-span-5 bg-blue-50/80 rounded-md border border-blue-200 p-2 text-[10px]">
                <div className="flex justify-between items-center py-0.5 border-b border-blue-200/60">
                  <span className="font-bold text-slate-700">سب ٹوٹل (Sub Total):</span>
                  <span className="font-bold text-slate-900 font-sans">Rs. {invoice.subTotal.toLocaleString()}</span>
                </div>

                {invoice.discount > 0 && (
                  <div className="flex justify-between items-center py-0.5 border-b border-blue-200/60 text-orange-600">
                    <span className="font-bold">رعایت (Discount):</span>
                    <span className="font-bold font-sans">- Rs. {invoice.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 mt-1 bg-blue-900 text-white px-2 rounded font-bold text-[11px]">
                  <span>کل ٹوٹل (Grand Total):</span>
                  <span className="font-sans">Rs. {invoice.grandTotal.toLocaleString()}</span>
                </div>

                {invoice.balanceDue > 0 && (
                  <div className="flex justify-between items-center py-0.5 mt-1 text-rose-700 font-bold text-[9.5px]">
                    <span>باقی ادھار (Khata Due):</span>
                    <span className="font-sans">Rs. {invoice.balanceDue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-2 font-urdu text-[10px]">
              <div className="text-center">
                <div className="h-6 border-b border-dotted border-slate-400"></div>
                <span className="font-bold text-slate-700 mt-1 block">دستخط گاہک (Customer Signature)</span>
              </div>
              <div className="text-center">
                <div className="h-6 border-b border-dotted border-slate-400 flex items-end justify-center">
                  <span className="text-[8px] text-blue-900 font-sans font-bold">Kamil Traders Faisalabad</span>
                </div>
                <span className="font-bold text-blue-900 mt-1 block">دستخط پروپرائیٹر (Authorized Signature)</span>
              </div>
            </div>
          </div>

          {/* Bottom Orange Full-width Footer Banner */}
          <div className="mt-4 -mx-[8mm] -mb-[8mm] bg-orange-600 text-white px-3 py-2 text-center text-[9px] font-urdu font-bold shadow-md">
            <div className="flex items-center justify-center gap-2 flex-wrap leading-tight">
              <span>📍 {company.addressUr}</span>
              <span className="opacity-60">|</span>
              <span className="font-sans dir-ltr font-bold">☎ {company.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

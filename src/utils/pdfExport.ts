import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Invoice } from '../types';

/**
 * Renders the A5 Invoice DOM element into a crisp PDF file
 * capturing all custom branding, Urdu fonts (Noto Nastaliq / Arabic), and styling.
 */
export const generateInvoicePDF = async (
  element: HTMLElement,
  invoice: Invoice
): Promise<{ pdf: jsPDF; fileName: string; blob: Blob; file: File }> => {
  // Capture DOM with html2canvas at high resolution scale (scale 2.5)
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      // Ensure the cloned node is visible and nicely styled in clone
      const clonedElement = clonedDoc.querySelector('.printable-a5-pad') as HTMLElement;
      if (clonedElement) {
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.border = '1px solid #cbd5e1';
      }
    }
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  // Create jsPDF in A5 dimensions (148mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  const sanitizedCustomer = (invoice.customerName || 'Customer')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_\-]/g, '_')
    .substring(0, 20);
    
  const fileName = `${invoice.invoiceNo || 'Invoice'}_${sanitizedCustomer}.pdf`;
  const blob = pdf.output('blob');
  const file = new File([blob], fileName, { type: 'application/pdf' });

  return { pdf, fileName, blob, file };
};

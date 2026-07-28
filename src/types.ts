export type Language = 'en' | 'ur';
export type ThemeMode = 'light' | 'dark';

export type UnitType = 'Feet' | 'Kg' | 'Pcs' | 'Meter' | 'Box' | 'Bundle' | 'Set' | 'Ltr';

export type ProductCategory = 
  | 'Steel & Iron'
  | 'Machinery Parts'
  | 'Bearings'
  | 'Fasteners & Bolts'
  | 'Tools & Equipment'
  | 'Pipes & Fittings'
  | 'Electrical & Cables'
  | 'General Hardware';

export interface Product {
  id: string;
  code: string;
  nameEn: string;
  nameUr: string;
  category: ProductCategory;
  unit: UnitType;
  costPrice: number;
  salePrice: number;
  stockQty: number;
  lowStockThreshold: number;
  supplierId?: string;
  location?: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  nameUr?: string;
  phone: string;
  address: string;
  ntnOrCnic?: string;
  totalPurchases: number;
  outstandingBalance: number; // positive = customer owes money (Credit/Khata)
  creditLimit: number;
  notes?: string;
  createdAt: string;
}

export type LedgerEntryType = 'SALE' | 'PAYMENT' | 'RETURN' | 'DISCOUNT_ADJUSTMENT';

export interface LedgerEntry {
  id: string;
  customerId: string;
  date: string;
  type: LedgerEntryType;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceNo?: string;
  paymentMethod?: 'CASH' | 'KHATA' | 'BANK' | 'EASYPAISA';
}

export interface InvoiceItem {
  productId?: string;
  itemDescription: string;
  itemDescriptionUr?: string;
  qty: number;
  unit: UnitType;
  rate: number;
  amount: number;
}

export type InvoiceType = 'QUOTATION' | 'INVOICE';
export type PaymentMethod = 'CASH' | 'KHATA' | 'BANK' | 'EASYPAISA';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

export interface Invoice {
  id: string;
  invoiceNo: string;
  type: InvoiceType;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  createdByName?: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address: string;
  balancePayable: number;
  categoryProvided: string;
}

export interface CompanyProfile {
  nameEn: string;
  nameUr: string;
  subtitleEn: string;
  subtitleUr: string;
  ntn: string;
  phone: string;
  altPhone?: string;
  addressEn: string;
  addressUr: string;
  logoStyle: 'KT_ORANGE_BLUE' | 'KT_MINIMAL' | 'KT_CLASSIC';
}

export interface InvoiceSettings {
  pageSize: 'A5' | 'A4' | 'THERMAL';
  showWatermark: boolean;
  watermarkOpacity: number;
  footerNoteEn: string;
  footerNoteUr: string;
  defaultTaxRate: number;
  showSignatureFields: boolean;
}

export interface SystemSettings {
  company: CompanyProfile;
  invoice: InvoiceSettings;
  currency: string;
  currencySymbolUr: string;
  language: Language;
  theme: ThemeMode;
  defaultLowStockThreshold: number;
  whatsAppTemplateUr: string;
  whatsAppTemplateEn: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

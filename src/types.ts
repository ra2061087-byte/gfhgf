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
  paymentMethod?: PaymentMethod;
}

export interface InvoiceItem {
  productId?: string;
  itemDescription: string;
  itemDescriptionUr?: string;
  qty: number;
  unit: UnitType;
  rate: number;
  discount?: number;
  tax?: number;
  amount: number;
}

export type InvoiceType = 'INVOICE' | 'QUOTATION' | 'CASH_SALE' | 'CREDIT_SALE' | 'SALES_RETURN';
export type PaymentMethod = 'CASH' | 'KHATA' | 'BANK' | 'EASYPAISA' | 'JAZZCASH' | 'MULTIPLE';
export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID' | 'DRAFT' | 'CANCELLED' | 'RETURNED';

export interface Invoice {
  id: string;
  invoiceNo: string;
  manualInvoiceNo?: string;
  type: InvoiceType;
  date: string;
  time?: string;
  financialYear?: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNtn?: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  taxRate?: number;
  taxAmount?: number;
  freightAmount?: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  balanceDue: number;
  receivedCash?: number;
  changeReturn?: number;
  notes?: string;
  createdByName?: string;
  isDraft?: boolean;
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

export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  active: boolean;
  lastLogin?: string;
}

export type AccountType = 'INCOME' | 'EXPENSE';
export type AccountCategory = 'SALES' | 'HARDWARE_PURCHASE' | 'RENT' | 'ELECTRICITY' | 'SALARIES' | 'FREIGHT' | 'TEA_FOOD' | 'MAINTENANCE' | 'OTHER';

export interface AccountRecord {
  id: string;
  date: string;
  type: AccountType;
  category: AccountCategory;
  amount: number;
  paymentMode: 'CASH' | 'BANK' | 'EASYPAISA' | 'JAZZCASH';
  description: string;
  referenceNo?: string;
  createdByName?: string;
}

export interface Employee {
  id: string;
  name: string;
  nameUr?: string;
  designation: string;
  phone: string;
  cnic: string;
  monthlySalary: number;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  advanceTaken: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY';
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  action: string;
  module: string;
  details: string;
}

export interface TrashItem {
  id: string;
  originalId: string;
  itemType: 'PRODUCT' | 'CUSTOMER' | 'INVOICE' | 'SUPPLIER' | 'EMPLOYEE' | 'ACCOUNT';
  deletedAt: string;
  title: string;
  data: any;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  date: string;
  read: boolean;
}


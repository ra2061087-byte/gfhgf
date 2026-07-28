import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  ThemeMode, 
  SystemSettings, 
  Product, 
  Customer, 
  Invoice, 
  Supplier, 
  LedgerEntry, 
  ToastMessage,
  InvoiceItem
} from '../types';
import { 
  initialCompanySettings, 
  initialProducts, 
  initialCustomers, 
  initialSuppliers, 
  initialInvoices, 
  initialLedgerEntries 
} from '../data/initialData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, qtyChange: number, reason?: string) => void;
  
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'outstandingBalance'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  recordCustomerPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;
  
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNo'> & { customInvoiceNo?: string }) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  convertQuotationToInvoice: (quotationId: string) => void;
  
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  ledgerEntries: LedgerEntry[];
  
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Data management
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'kamil_traders_data_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage or fallback to initial dataset
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [language, setLanguageState] = useState<Language>('ur');
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [settings, setSettings] = useState<SystemSettings>(initialCompanySettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(initialLedgerEntries);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.language) setLanguageState(parsed.language);
        if (parsed.theme) setThemeState(parsed.theme);
        if (parsed.products) setProducts(parsed.products);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.ledgerEntries) setLedgerEntries(parsed.ledgerEntries);
      }
    } catch (err) {
      console.error('Failed to load local storage state:', err);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Save to localStorage when state updates
  useEffect(() => {
    if (!dataLoaded) return;
    try {
      const storeObj = {
        language,
        theme,
        settings,
        products,
        customers,
        invoices,
        suppliers,
        ledgerEntries
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storeObj));
    } catch (err) {
      console.error('Failed to save to local storage:', err);
    }
  }, [dataLoaded, language, theme, settings, products, customers, invoices, suppliers, ledgerEntries]);

  // Apply RTL/LTR and Theme classes to html/body
  useEffect(() => {
    const root = document.documentElement;
    if (language === 'ur') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ur');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [language, theme]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  const setTheme = (thm: ThemeMode) => {
    setThemeState(thm);
    setSettings((prev) => ({ ...prev, theme: thm }));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.company) {
        updated.company = { ...prev.company, ...newSettings.company };
      }
      if (newSettings.invoice) {
        updated.invoice = { ...prev.invoice, ...newSettings.invoice };
      }
      return updated;
    });
    addToast({
      type: 'success',
      title: language === 'ur' ? 'ترتیبات محفوظ ہو گئیں' : 'Settings Saved',
      message: language === 'ur' ? 'سسٹم کی ترتیبات کامپیاپی سے اپڈیٹ ہو گئیں۔' : 'System preferences updated successfully.'
    });
  };

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id' | 'updatedAt'>) => {
    const id = 'p_' + Date.now().toString();
    const newProduct: Product = {
      ...productData,
      id,
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast({
      type: 'success',
      title: language === 'ur' ? 'سامان شامل ہو گیا' : 'Product Added',
      message: `${newProduct.nameUr || newProduct.nameEn} (${newProduct.code})`
    });
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p))
    );
    addToast({
      type: 'info',
      title: language === 'ur' ? 'سامان کی معلومات اپڈیٹ' : 'Product Updated',
      message: language === 'ur' ? 'معلومات تبدیل کر دی گئی ہیں۔' : 'Product details updated successfully.'
    });
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'warning',
      title: language === 'ur' ? 'سامان ڈیلیٹ کر دیا گیا' : 'Product Deleted',
      message: target?.nameEn || id
    });
  };

  const adjustStock = (id: string, qtyChange: number, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(0, p.stockQty + qtyChange);
          return { ...p, stockQty: newQty, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    addToast({
      type: 'success',
      title: language === 'ur' ? 'سٹاک تبدیل ہو گیا' : 'Stock Adjusted',
      message: `${qtyChange > 0 ? '+' : ''}${qtyChange} ${reason ? `(${reason})` : ''}`
    });
  };

  // Customer Actions
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'outstandingBalance'>) => {
    const id = 'c_' + Date.now().toString();
    const newCustomer: Customer = {
      ...customerData,
      id,
      totalPurchases: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    addToast({
      type: 'success',
      title: language === 'ur' ? 'نیا کسٹمر شامل ہو گیا' : 'Customer Added',
      message: newCustomer.name
    });
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...customerData } : c)));
    addToast({
      type: 'info',
      title: language === 'ur' ? 'کسٹمر ریکارڈ اپڈیٹ' : 'Customer Updated'
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    addToast({
      type: 'warning',
      title: language === 'ur' ? 'کسٹمر ریکارڈ ڈیلیٹ' : 'Customer Deleted'
    });
  };

  const recordCustomerPayment = (customerId: string, amount: number, paymentMethod: string, notes?: string) => {
    const target = customers.find((c) => c.id === customerId);
    if (!target) return;

    const newBalance = Math.max(0, target.outstandingBalance - amount);

    // Update customer balance
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, outstandingBalance: newBalance } : c))
    );

    // Create ledger entry
    const newLedger: LedgerEntry = {
      id: 'l_' + Date.now().toString(),
      customerId,
      date: new Date().toISOString().split('T')[0],
      type: 'PAYMENT',
      amount,
      balanceAfter: newBalance,
      description: notes || `Payment received via ${paymentMethod}`,
      paymentMethod: paymentMethod as any
    };

    setLedgerEntries((prev) => [newLedger, ...prev]);

    addToast({
      type: 'success',
      title: language === 'ur' ? 'وصولی درج کر لی گئی' : 'Payment Recorded',
      message: `Rs. ${amount.toLocaleString()} ${language === 'ur' ? 'وصول ہوئے' : 'received from'} ${target.name}`
    });
  };

  // Invoice & Sales Actions
  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNo'> & { customInvoiceNo?: string }) => {
    const nextNum = invoices.length + 1003;
    const prefix = invoiceData.type === 'QUOTATION' 
      ? 'KT-Q-2026-' 
      : invoiceData.type === 'SALES_RETURN' 
      ? 'KT-SR-2026-' 
      : 'KT-2026-';
    
    const formattedNum = String(nextNum).padStart(6, '0');
    const invoiceNo = invoiceData.customInvoiceNo || invoiceData.manualInvoiceNo || `${prefix}${formattedNum}`;
    const id = 'inv_' + Date.now().toString();

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newInvoice: Invoice = {
      time: timeStr,
      financialYear: '2025-2026',
      ...invoiceData,
      id,
      invoiceNo
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Handle stock adjustments for non-quotations and non-drafts
    if (newInvoice.type !== 'QUOTATION' && newInvoice.paymentStatus !== 'DRAFT') {
      if (newInvoice.type === 'SALES_RETURN') {
        // Return adds back to stock
        newInvoice.items.forEach((item) => {
          if (item.productId) {
            adjustStock(item.productId, item.qty, `Sales Return ${invoiceNo}`);
          }
        });
      } else {
        // Normal sale deducts stock
        newInvoice.items.forEach((item) => {
          if (item.productId) {
            adjustStock(item.productId, -item.qty, `Sale ${invoiceNo}`);
          }
        });
      }

      // Handle Customer Khata Ledger if Khata purchase or partial payment
      if (newInvoice.customerId) {
        const cust = customers.find((c) => c.id === newInvoice.customerId);
        if (cust) {
          const isReturn = newInvoice.type === 'SALES_RETURN';
          const unpaidBalance = isReturn ? -newInvoice.balanceDue : newInvoice.balanceDue;
          const updatedTotalPurchases = isReturn 
            ? cust.totalPurchases - newInvoice.grandTotal 
            : cust.totalPurchases + newInvoice.grandTotal;
          const updatedOutstanding = Math.max(0, cust.outstandingBalance + unpaidBalance);

          setCustomers((prev) =>
            prev.map((c) =>
              c.id === newInvoice.customerId
                ? { ...c, totalPurchases: updatedTotalPurchases, outstandingBalance: updatedOutstanding }
                : c
            )
          );

          // Add Ledger entry
          const ledgerEntry: LedgerEntry = {
            id: 'l_' + Date.now().toString(),
            customerId: cust.id,
            date: newInvoice.date,
            type: isReturn ? 'RETURN' : 'SALE',
            amount: newInvoice.grandTotal,
            balanceAfter: updatedOutstanding,
            description: isReturn ? `Return Invoice ${invoiceNo}` : `Hardware Sale Invoice ${invoiceNo}`,
            referenceNo: invoiceNo,
            paymentMethod: newInvoice.paymentMethod
          };

          setLedgerEntries((prev) => [ledgerEntry, ...prev]);
        }
      }
    }

    addToast({
      type: 'success',
      title: newInvoice.type === 'QUOTATION' 
        ? (language === 'ur' ? 'کوٹیشن تیار ہو گئی' : 'Quotation Generated')
        : newInvoice.type === 'SALES_RETURN'
        ? (language === 'ur' ? 'سیل واپسی ریکارڈ' : 'Sales Return Recorded')
        : (language === 'ur' ? 'سیل انوائس تیار ہو گئی' : 'Invoice Created'),
      message: `${invoiceNo} - Rs. ${newInvoice.grandTotal.toLocaleString()}`
    });

    return newInvoice;
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...invoiceData } : inv)));
    addToast({
      type: 'info',
      title: language === 'ur' ? 'بل تبدیل کر دیا گیا' : 'Invoice Updated',
      message: language === 'ur' ? 'معلومات محفوظ کر لی گئیں۔' : 'Changes saved successfully.'
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    addToast({
      type: 'warning',
      title: language === 'ur' ? 'انوائس ڈیلیٹ کر دی گئی' : 'Invoice Deleted'
    });
  };

  const convertQuotationToInvoice = (quotationId: string) => {
    const quote = invoices.find((inv) => inv.id === quotationId);
    if (!quote) return;

    const nextNum = invoices.length + 1003;
    const newInvoiceNo = `KT-2026-${nextNum}`;

    const convertedInvoice: Invoice = {
      ...quote,
      id: 'inv_' + Date.now().toString(),
      invoiceNo: newInvoiceNo,
      type: 'INVOICE',
      date: new Date().toISOString().split('T')[0],
      notes: `Converted from quotation ${quote.invoiceNo}`
    };

    setInvoices((prev) => [convertedInvoice, ...prev.filter((inv) => inv.id !== quotationId)]);

    // Deduct stock for converted sale
    convertedInvoice.items.forEach((item) => {
      if (item.productId) {
        adjustStock(item.productId, -item.qty, `Converted ${newInvoiceNo}`);
      }
    });

    addToast({
      type: 'success',
      title: language === 'ur' ? 'کوٹیشن انوائس میں تبدیل ہو گئی' : 'Quotation Converted to Invoice',
      message: `${newInvoiceNo}`
    });
  };

  // Supplier Actions
  const addSupplier = (sData: Omit<Supplier, 'id'>) => {
    const id = 's_' + Date.now().toString();
    const newSupplier = { ...sData, id };
    setSuppliers((prev) => [newSupplier, ...prev]);
    addToast({
      type: 'success',
      title: language === 'ur' ? 'نیا سپلائر شامل ہو گیا' : 'Supplier Added',
      message: newSupplier.companyName
    });
  };

  const updateSupplier = (id: string, sData: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...sData } : s)));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // Export / Import Backup Data
  const exportDataJSON = () => {
    try {
      const exportObj = {
        app: 'Kamil Traders Hardware System',
        exportDate: new Date().toISOString(),
        settings,
        language,
        theme,
        products,
        customers,
        invoices,
        suppliers,
        ledgerEntries
      };
      const jsonStr = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kamil_traders_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      addToast({
        type: 'success',
        title: language === 'ur' ? 'ڈیٹا بیک اپ ڈاؤن لوڈ ہو گیا' : 'Backup File Saved',
        message: language === 'ur' ? 'تمام ڈیٹا محفوظ ہو گیا ہے۔' : 'All system data exported to JSON.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Export Failed',
        message: String(err)
      });
    }
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.invoices) setInvoices(parsed.invoices);
      if (parsed.suppliers) setSuppliers(parsed.suppliers);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.ledgerEntries) setLedgerEntries(parsed.ledgerEntries);

      addToast({
        type: 'success',
        title: language === 'ur' ? 'ڈیٹا بحال ہو گیا' : 'Data Restored Successfully',
        message: language === 'ur' ? 'تمام ڈیٹا اپڈیٹ ہو چکا ہے۔' : 'Database imported successfully.'
      });
      return true;
    } catch (err) {
      addToast({
        type: 'error',
        title: language === 'ur' ? 'فائل درست نہیں ہے' : 'Invalid File',
        message: 'Could not parse JSON backup file.'
      });
      return false;
    }
  };

  const resetAllData = () => {
    setSettings(initialCompanySettings);
    setProducts(initialProducts);
    setCustomers(initialCustomers);
    setInvoices(initialInvoices);
    setSuppliers(initialSuppliers);
    setLedgerEntries(initialLedgerEntries);
    localStorage.removeItem(STORAGE_KEY);
    addToast({
      type: 'info',
      title: language === 'ur' ? 'سسٹم ری سیٹ ہو گیا' : 'System Reset',
      message: language === 'ur' ? 'تمام ڈیٹا ڈیمو سیٹ پر ری سیٹ کر دیا گیا۔' : 'Reset to default sample dataset.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        recordCustomerPayment,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        convertQuotationToInvoice,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        ledgerEntries,
        toasts,
        addToast,
        removeToast,
        exportDataJSON,
        importDataJSON,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

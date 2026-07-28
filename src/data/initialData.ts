import { Product, Customer, Invoice, Supplier, SystemSettings, LedgerEntry } from '../types';

export const initialCompanySettings: SystemSettings = {
  company: {
    nameEn: 'KAMIL TRADERS',
    nameUr: 'کامل ٹریڈرز',
    subtitleEn: 'Steel, Machinery Parts & General Hardware Dealer',
    subtitleUr: 'سٹیل، مشینری پارٹس اینڈ جنرل ہارڈویئر ڈیلر',
    ntn: '7347257-8',
    phone: '0300-6560253',
    altPhone: '0301-8650253',
    addressEn: 'Shop No. 4, 1st Floor, Khan Plaza, Canal Sadiq Market, Railway Road, Faisalabad',
    addressUr: 'دکان نمبر 4، فرسٹ فلور، خان پلازہ، نہر صادق مارکیٹ، ریلوے روڈ، فیصل آباد',
    logoStyle: 'KT_ORANGE_BLUE'
  },
  invoice: {
    pageSize: 'A5',
    showWatermark: true,
    watermarkOpacity: 0.08,
    footerNoteEn: 'Thank you for your business! Goods once sold will not be returned without original receipt.',
    footerNoteUr: 'آپ کے تعاوُن کا شکریہ! خریداری کے بعد رسید دکھانا ضروری ہے۔',
    defaultTaxRate: 0,
    showSignatureFields: true
  },
  currency: 'PKR',
  currencySymbolUr: 'روپے',
  language: 'ur', // Defaulting to Urdu as specified for local shop workflow
  theme: 'light',
  defaultLowStockThreshold: 10,
  whatsAppTemplateUr: 'محترم {CUSTOMER_NAME} صاحب! کامل ٹریڈرز (فیصل آباد) کا آپ کی طرف بقایا حساب {AMOUNT} روپے ہے۔ برائے مہربانی جلد ادائیگی فرمائیں۔ شکریہ! رابطہ: 0300-6560253',
  whatsAppTemplateEn: 'Respected {CUSTOMER_NAME}, your outstanding balance at Kamil Traders is Rs. {AMOUNT}. Kindly clear the bill at your earliest convenience. Contact: 0300-6560253'
};

export const initialProducts: Product[] = [
  {
    id: 'p1',
    code: 'MS-ANG-22',
    nameEn: 'MS Angle Iron 2" x 2" (1/4" Thick)',
    nameUr: 'ایم ایس اینگل آئرن 2x2 انچ',
    category: 'Steel & Iron',
    unit: 'Feet',
    costPrice: 280,
    salePrice: 340,
    stockQty: 450,
    lowStockThreshold: 50,
    location: 'Rack A-1',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p2',
    code: 'SKF-BRG-6204',
    nameEn: 'SKF Deep Groove Ball Bearing 6204 2RS',
    nameUr: 'ایس کے ایف بال بیرنگ 6204',
    category: 'Bearings',
    unit: 'Pcs',
    costPrice: 850,
    salePrice: 1150,
    stockQty: 85,
    lowStockThreshold: 20,
    location: 'Drawer B-12',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p3',
    code: 'MS-PIPE-3IN',
    nameEn: 'MS Pipe 3" Gauge 16 (Heavy Duty)',
    nameUr: 'ایم ایس پائپ 3 انچ (16 گیج)',
    category: 'Pipes & Fittings',
    unit: 'Feet',
    costPrice: 420,
    salePrice: 510,
    stockQty: 220,
    lowStockThreshold: 30,
    location: 'Yard Yard-3',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p4',
    code: 'BOLT-M12-50',
    nameEn: 'Stainless Steel Hex Bolt M12 x 50mm + Nut',
    nameUr: 'ایس ایس نٹ بولٹ M12 x 50',
    category: 'Fasteners & Bolts',
    unit: 'Pcs',
    costPrice: 45,
    salePrice: 65,
    stockQty: 1200,
    lowStockThreshold: 200,
    location: 'Bin F-04',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p5',
    code: 'BSH-GRN-4IN',
    nameEn: 'Bosch Professional Angle Grinder GWS 750 (4")',
    nameUr: 'بوش اینگل گرائنڈر 4 انچ',
    category: 'Tools & Equipment',
    unit: 'Pcs',
    costPrice: 14500,
    salePrice: 17200,
    stockQty: 8,
    lowStockThreshold: 3,
    location: 'Showcase S-1',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p6',
    code: 'WLD-ROD-10G',
    nameEn: 'Super Welder Welding Rod 10G E6013 (2.5kg Box)',
    nameUr: 'ویلڈنگ راڈ 10 گیج (ڈبہ)',
    category: 'General Hardware',
    unit: 'Box',
    costPrice: 1850,
    salePrice: 2250,
    stockQty: 42,
    lowStockThreshold: 10,
    location: 'Rack W-2',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p7',
    code: 'PVC-PIPE-2IN',
    nameEn: 'Popular PVC Pressure Pipe 2" Class B',
    nameUr: 'پاپولر پی وی سی پائپ 2 انچ',
    category: 'Pipes & Fittings',
    unit: 'Feet',
    costPrice: 140,
    salePrice: 180,
    stockQty: 18,
    lowStockThreshold: 25, // Low stock alert trigger
    location: 'Pipe Rack 2',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p8',
    code: 'CBL-COP-4MM',
    nameEn: 'Pakistan Cables 4mm Single Core Copper Wire',
    nameUr: 'پاکستان کیبلز 4 ایم ایم کاپر وائر',
    category: 'Electrical & Cables',
    unit: 'Meter',
    costPrice: 310,
    salePrice: 380,
    stockQty: 350,
    lowStockThreshold: 50,
    location: 'Cable Spool C-1',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p9',
    code: 'VBELT-B52',
    nameEn: 'Bando Industrial V-Belt B-52',
    nameUr: 'انڈسٹریل وی بیلٹ B-52',
    category: 'Machinery Parts',
    unit: 'Pcs',
    costPrice: 650,
    salePrice: 880,
    stockQty: 5,
    lowStockThreshold: 10, // Low stock trigger
    location: 'Belt Rack B',
    updatedAt: new Date().toISOString()
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Chaudhry Engineering Works',
    nameUr: 'چوہدری انجینئرنگ ورکس',
    phone: '0300-8651234',
    address: 'Samanabad Industrial Area, Faisalabad',
    ntnOrCnic: '31301-9876543-1',
    totalPurchases: 285000,
    outstandingBalance: 45000,
    creditLimit: 100000,
    notes: 'Regular buyer for machinery parts & MS angles.',
    createdAt: '2026-01-10T10:00:00.000Z'
  },
  {
    id: 'c2',
    name: 'Al-Madina Textile Mills Repair Shop',
    nameUr: 'المدینہ ٹیکسٹائل ملز ریپیئر شاپ',
    phone: '0302-7654321',
    address: 'Millat Road, Near Steel Market, Faisalabad',
    ntnOrCnic: '33100-1234567-9',
    totalPurchases: 540000,
    outstandingBalance: 125000,
    creditLimit: 200000,
    notes: 'Weekly billing cycle. Always clears on Monday.',
    createdAt: '2026-01-15T11:30:00.000Z'
  },
  {
    id: 'c3',
    name: 'Mian Imran Hardware Store',
    nameUr: 'میاں عمران ہارڈویئر سٹور',
    phone: '0304-9812763',
    address: 'Jhang Road Market, Gojra',
    ntnOrCnic: '33102-5432109-3',
    totalPurchases: 180000,
    outstandingBalance: 0,
    creditLimit: 50000,
    notes: 'Cash buyer. Very punctual.',
    createdAt: '2026-02-01T09:15:00.000Z'
  },
  {
    id: 'c4',
    name: 'Tariq Lathe & Machine Master',
    nameUr: 'طارق لیتھ اینڈ مشین ماسٹر',
    phone: '0321-6549870',
    address: 'Small Industrial Estate, Sargodha Road, Faisalabad',
    totalPurchases: 95000,
    outstandingBalance: 18500,
    creditLimit: 40000,
    notes: 'Purchases bearings and welding rods.',
    createdAt: '2026-03-05T14:20:00.000Z'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 's1',
    companyName: 'Mughal Steel Re-Rolling Mills Ltd',
    contactPerson: 'Mian Tariq Mughal',
    phone: '042-36541200',
    address: 'Badami Bagh Steel Market, Lahore',
    balancePayable: 180000,
    categoryProvided: 'MS Angles, Channel Steel, Flat Bars'
  },
  {
    id: 's2',
    companyName: 'SKF Bearings Pakistan Official Agency',
    contactPerson: 'Zubair Shah',
    phone: '0300-4455667',
    address: 'Brandreth Road, Lahore',
    balancePayable: 65000,
    categoryProvided: 'Ball Bearings & Taper Roller Bearings'
  },
  {
    id: 's3',
    companyName: 'Master Tools Depot',
    contactPerson: 'Khawaja Asif',
    phone: '0322-1122334',
    address: 'Liaquat Market, Faisalabad',
    balancePayable: 0,
    categoryProvided: 'Power Tools, Welding Rods & Safety Gear'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNo: 'KT-2026-1001',
    type: 'INVOICE',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    customerId: 'c1',
    customerName: 'Chaudhry Engineering Works',
    customerPhone: '0300-8651234',
    customerAddress: 'Samanabad Industrial Area, Faisalabad',
    items: [
      {
        productId: 'p1',
        itemDescription: 'MS Angle Iron 2" x 2" (1/4" Thick)',
        itemDescriptionUr: 'ایم ایس اینگل آئرن 2x2 انچ',
        qty: 100,
        unit: 'Feet',
        rate: 340,
        amount: 34000
      },
      {
        productId: 'p2',
        itemDescription: 'SKF Deep Groove Ball Bearing 6204 2RS',
        itemDescriptionUr: 'ایس کے ایف بال بیرنگ 6204',
        qty: 10,
        unit: 'Pcs',
        rate: 1150,
        amount: 11500
      }
    ],
    subTotal: 45500,
    discount: 500,
    grandTotal: 45000,
    paymentMethod: 'KHATA',
    paymentStatus: 'UNPAID',
    paidAmount: 0,
    balanceDue: 45000,
    notes: 'Carried to customer Khata ledger.'
  },
  {
    id: 'inv-1002',
    invoiceNo: 'KT-2026-1002',
    type: 'INVOICE',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    customerId: 'c3',
    customerName: 'Mian Imran Hardware Store',
    customerPhone: '0304-9812763',
    customerAddress: 'Jhang Road Market, Gojra',
    items: [
      {
        productId: 'p6',
        itemDescription: 'Super Welder Welding Rod 10G E6013 (2.5kg Box)',
        itemDescriptionUr: 'ویلڈنگ راڈ 10 گیج (ڈبہ)',
        qty: 5,
        unit: 'Box',
        rate: 2250,
        amount: 11250
      },
      {
        productId: 'p4',
        itemDescription: 'Stainless Steel Hex Bolt M12 x 50mm + Nut',
        itemDescriptionUr: 'ایس ایس نٹ بولٹ M12 x 50',
        qty: 100,
        unit: 'Pcs',
        rate: 65,
        amount: 6500
      }
    ],
    subTotal: 17750,
    discount: 250,
    grandTotal: 17500,
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    paidAmount: 17500,
    balanceDue: 0,
    notes: 'Paid in cash at shop counter.'
  },
  {
    id: 'q-2001',
    invoiceNo: 'KT-Q-2026-001',
    type: 'QUOTATION',
    date: new Date().toISOString().split('T')[0],
    customerId: 'c2',
    customerName: 'Al-Madina Textile Mills Repair Shop',
    customerPhone: '0302-7654321',
    customerAddress: 'Millat Road, Near Steel Market, Faisalabad',
    items: [
      {
        productId: 'p3',
        itemDescription: 'MS Pipe 3" Gauge 16 (Heavy Duty)',
        itemDescriptionUr: 'ایم ایس پائپ 3 انچ (16 گیج)',
        qty: 150,
        unit: 'Feet',
        rate: 510,
        amount: 76500
      },
      {
        productId: 'p5',
        itemDescription: 'Bosch Professional Angle Grinder GWS 750 (4")',
        itemDescriptionUr: 'بوش اینگل گرائنڈر 4 انچ',
        qty: 2,
        unit: 'Pcs',
        rate: 17200,
        amount: 34400
      }
    ],
    subTotal: 110900,
    discount: 1900,
    grandTotal: 109000,
    paymentMethod: 'KHATA',
    paymentStatus: 'UNPAID',
    paidAmount: 0,
    balanceDue: 109000,
    notes: 'Estimate validity: 7 days due to fluctuating steel market rates.'
  }
];

export const initialLedgerEntries: LedgerEntry[] = [
  {
    id: 'l1',
    customerId: 'c1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    type: 'SALE',
    amount: 45000,
    balanceAfter: 45000,
    description: 'Hardware purchase bill KT-2026-1001',
    referenceNo: 'KT-2026-1001',
    paymentMethod: 'KHATA'
  },
  {
    id: 'l2',
    customerId: 'c2',
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    type: 'SALE',
    amount: 175000,
    balanceAfter: 175000,
    description: 'Machine parts & bearings order',
    referenceNo: 'KT-2026-0988',
    paymentMethod: 'KHATA'
  },
  {
    id: 'l3',
    customerId: 'c2',
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
    type: 'PAYMENT',
    amount: 50000,
    balanceAfter: 125000,
    description: 'Cash payment received by counter clerk',
    paymentMethod: 'CASH'
  }
];

export const initialAccounts = [
  {
    id: 'acc_1',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE' as const,
    category: 'RENT' as const,
    amount: 35000,
    paymentMode: 'CASH' as const,
    description: 'دکان کا ماہانہ کرایہ - ریلوے روڈ پلازہ',
    referenceNo: 'RENT-JUL-26',
    createdByName: 'Admin'
  },
  {
    id: 'acc_2',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE' as const,
    category: 'ELECTRICITY' as const,
    amount: 18450,
    paymentMode: 'BANK' as const,
    description: 'FESCO بجلی کا بل ادا کیا',
    referenceNo: 'FESCO-88231',
    createdByName: 'Admin'
  },
  {
    id: 'acc_3',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE' as const,
    category: 'TEA_FOOD' as const,
    amount: 1200,
    paymentMode: 'CASH' as const,
    description: 'دکان چائے و کسٹمر ریفریشمنٹ خرچہ',
    createdByName: 'Cashier'
  },
  {
    id: 'acc_4',
    date: new Date().toISOString().split('T')[0],
    type: 'INCOME' as const,
    category: 'SALES' as const,
    amount: 45000,
    paymentMode: 'CASH' as const,
    description: 'نقد فروخت انوائس KT-2026-1001',
    referenceNo: 'KT-2026-1001',
    createdByName: 'Cashier'
  }
];

export const initialEmployees = [
  {
    id: 'emp_1',
    name: 'Muhammad Tariq',
    nameUr: 'محمد طارق',
    designation: 'Head Sales Manager',
    phone: '0302-7711223',
    cnic: '33100-1234567-1',
    monthlySalary: 45000,
    joiningDate: '2023-01-15',
    status: 'ACTIVE' as const,
    advanceTaken: 5000
  },
  {
    id: 'emp_2',
    name: 'Ali Raza',
    nameUr: 'علی رضا',
    designation: 'Store Keeper & Counter Cashier',
    phone: '0313-9876543',
    cnic: '33100-7654321-9',
    monthlySalary: 32000,
    joiningDate: '2024-03-01',
    status: 'ACTIVE' as const,
    advanceTaken: 0
  }
];

export const initialAuditLogs = [
  {
    id: 'log_1',
    timestamp: new Date().toLocaleString(),
    userRole: 'ADMIN' as const,
    userName: 'Kamil Proprietor',
    action: 'System Startup & Database Synced',
    module: 'System',
    details: 'System loaded with 10 products, 4 customers, and 3 initial invoices.'
  },
  {
    id: 'log_2',
    timestamp: new Date().toLocaleString(),
    userRole: 'CASHIER' as const,
    userName: 'Ali Raza Counter',
    action: 'Invoice Created',
    module: 'POS Billing',
    details: 'Generated Sale Invoice #KT-2026-1001 for Rs. 45,000'
  }
];

export const initialUserAccounts = [
  {
    id: 'usr_1',
    name: 'Kamil Proprietor (Admin)',
    email: 'admin@kamiltraders.com',
    role: 'ADMIN' as const,
    phone: '0300-6560253',
    active: true,
    lastLogin: 'Today, 09:00 AM'
  },
  {
    id: 'usr_2',
    name: 'Tariq Manager',
    email: 'manager@kamiltraders.com',
    role: 'MANAGER' as const,
    phone: '0302-7711223',
    active: true,
    lastLogin: 'Today, 09:15 AM'
  },
  {
    id: 'usr_3',
    name: 'Ali Counter Cashier',
    email: 'cashier@kamiltraders.com',
    role: 'CASHIER' as const,
    phone: '0313-9876543',
    active: true,
    lastLogin: 'Today, 08:30 AM'
  }
];

export const initialNotifications = [
  {
    id: 'notif_1',
    title: 'کم سٹاک الرٹ (Low Stock)',
    message: 'بوش اینگل گرائنڈر 4 انچ کا سٹاک صرف 8 پیس باقی ہے!',
    type: 'WARNING' as const,
    date: new Date().toISOString().split('T')[0],
    read: false
  },
  {
    id: 'notif_2',
    title: 'بقایا جات یاد دہانی',
    message: 'مقصود احمد (چشتیہ ٹیکسٹائل) کی طرف 125,000 روپے بقایا ہیں۔',
    type: 'INFO' as const,
    date: new Date().toISOString().split('T')[0],
    read: false
  }
];


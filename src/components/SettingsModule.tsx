import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations/translations';
import { Language, ThemeMode } from '../types';
import { 
  Building2, 
  Palette, 
  FileCheck2, 
  Languages, 
  DollarSign, 
  Database, 
  Sun, 
  Sliders,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Check
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    settings, 
    updateSettings, 
    exportDataJSON, 
    importDataJSON, 
    resetAllData 
  } = useApp();

  const isUrdu = language === 'ur';

  // Sub tab state
  const [activeSection, setActiveSection] = useState<
    'profile' | 'logo' | 'invoice' | 'language' | 'currency' | 'backup' | 'theme' | 'preferences'
  >('profile');

  // Form states initialized with settings
  const [companyForm, setCompanyForm] = useState(settings.company);
  const [invoiceForm, setInvoiceForm] = useState(settings.invoice);
  const [whatsAppFormUr, setWhatsAppFormUr] = useState(settings.whatsAppTemplateUr);
  const [lowStockDefault, setLowStockDefault] = useState(settings.defaultLowStockThreshold);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ company: companyForm });
  };

  const handleSaveInvoiceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ invoice: invoiceForm });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsAppTemplateUr: whatsAppFormUr,
      defaultLowStockThreshold: lowStockDefault
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
  };

  const settingsTabs = [
    { id: 'profile', labelKey: 'companyProfile' as const, icon: Building2 },
    { id: 'logo', labelKey: 'logo' as const, icon: Palette },
    { id: 'invoice', labelKey: 'invoiceDesign' as const, icon: FileCheck2 },
    { id: 'language', labelKey: 'language' as const, icon: Languages },
    { id: 'currency', labelKey: 'currency' as const, icon: DollarSign },
    { id: 'backup', labelKey: 'backup' as const, icon: Database },
    { id: 'theme', labelKey: 'theme' as const, icon: Sun },
    { id: 'preferences', labelKey: 'systemPreferences' as const, icon: Sliders }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold font-urdu text-blue-900 dark:text-blue-300">
          {getTranslation(language, 'settings')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isUrdu ? 'کمپنی پروفائل، لوگو، انوائس پیڈ، زبان اور سسٹم بیک اپ کی ترتیبات' : 'Configure company profile, invoice pad design, language, backup & theme.'}
        </p>
      </div>

      {/* Settings Grid (Sidebar Tabs + Content Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Navigation Tabs (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            const label = getTranslation(language, tab.labelKey);

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                <span className={isUrdu ? 'font-urdu font-bold text-sm' : ''}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Box (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm font-urdu">
          {/* 1. Company Profile */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'companyProfile')}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام دوکان (اردو)
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.nameUr}
                    onChange={(e) => setCompanyForm({ ...companyForm, nameUr: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Company Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.nameEn}
                    onChange={(e) => setCompanyForm({ ...companyForm, nameEn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ذیلی عنوان / ہارڈویئر قسم (Subtitle Urdu)
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.subtitleUr}
                  onChange={(e) => setCompanyForm({ ...companyForm, subtitleUr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    این ٹی این نمبر (NTN No)
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.ntn}
                    onChange={(e) => setCompanyForm({ ...companyForm, ntn: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابطہ فون (Phone)
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  دکان ایڈریس (Urdu Address)
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.addressUr}
                  onChange={(e) => setCompanyForm({ ...companyForm, addressUr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
                >
                  {getTranslation(language, 'saveChanges')}
                </button>
              </div>
            </form>
          )}

          {/* 2. Logo Customization */}
          {activeSection === 'logo' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'logo')}
              </h3>

              <p className="text-slate-500">
                A5 کوٹیشن پیڈ اور انوائس پر ظاہر ہونے والا برانڈ لوگو منتخب کریں۔
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div
                  onClick={() => {
                    setCompanyForm({ ...companyForm, logoStyle: 'KT_ORANGE_BLUE' });
                    updateSettings({ company: { ...companyForm, logoStyle: 'KT_ORANGE_BLUE' } });
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border text-center space-y-2 transition ${
                    companyForm.logoStyle === 'KT_ORANGE_BLUE'
                      ? 'border-blue-900 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-900'
                      : 'border-slate-200 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto bg-blue-900 rounded-2xl border-2 border-orange-500 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-2xl font-black text-orange-400 leading-none">KT</span>
                    <span className="text-[7px] font-bold text-blue-200 uppercase tracking-widest mt-0.5">EST. 2012</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white">کلاسک اورنج اینڈ بلیو (KT)</h4>
                </div>
              </div>
            </div>
          )}

          {/* 3. Invoice & Quotation Pad Design */}
          {activeSection === 'invoice' && (
            <form onSubmit={handleSaveInvoiceSettings} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'invoiceDesign')}
              </h3>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="watermarkCheck"
                  checked={invoiceForm.showWatermark}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, showWatermark: e.target.checked })}
                  className="w-4 h-4 text-blue-900 rounded"
                />
                <label htmlFor="watermarkCheck" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  A5 پیڈ کے پیچھے ہلکا KT واٹر مارک (Watermark) دکھائیں
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  پیڈ کے نیچے ضروری نوٹ / ہدایت (Urdu Footer Terms)
                </label>
                <input
                  type="text"
                  value={invoiceForm.footerNoteUr}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, footerNoteUr: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
                >
                  {getTranslation(language, 'saveChanges')}
                </button>
              </div>
            </form>
          )}

          {/* 4. Language Settings */}
          {activeSection === 'language' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'language')}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLanguage('ur')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    language === 'ur'
                      ? 'border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-sm font-urdu">اردو (Urdu Local Mode)</span>
                  {language === 'ur' && <Check className="w-5 h-5 text-blue-900" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    language === 'en'
                      ? 'border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-sm font-sans">English (LTR Mode)</span>
                  {language === 'en' && <Check className="w-5 h-5 text-blue-900" />}
                </button>
              </div>
            </div>
          )}

          {/* 5. Currency Settings */}
          {activeSection === 'currency' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'currency')}
              </h3>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  کرنسی کی علامت (Currency Standard)
                </label>
                <input
                  type="text"
                  disabled
                  value="PKR / Rs. (پاکستانی روپے)"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-blue-900"
                />
              </div>
            </div>
          )}

          {/* 6. Backup & Restore Data */}
          {activeSection === 'backup' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'backup')} & {getTranslation(language, 'restore')}
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-300">سسٹم ڈیٹا بیک اپ ڈاؤن لوڈ کریں</h4>
                    <p className="text-[11px] text-slate-500">تمام انوائسز، کسٹمرز، اور سامان کا فل ڈیٹا ذخیرہ کریں۔</p>
                  </div>
                  <button
                    onClick={exportDataJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition"
                  >
                    <Download className="w-4 h-4 text-orange-400" />
                    <span>بیک اپ (JSON)</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">ڈیٹا بیک اپ فائل اپلوڈ کریں</h4>
                    <p className="text-[11px] text-slate-500">پہلے سے ڈاؤن لوڈ شدہ JSON فائل اپلوڈ کر کے ڈیٹا بحال کریں۔</p>
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>فائل منتخب کریں</span>
                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-rose-700 dark:text-rose-400">سسٹم ڈیمو ڈیٹا پر ری سیٹ کریں</h4>
                    <p className="text-[11px] text-rose-500">ابتدائی کامل ٹریڈرز ڈیمو ڈیٹا پر سسٹم کو لائیں۔</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('کیا آپ واقعی سسٹم کو ڈیمو سیٹ پر ری سیٹ کرنا چاہتے ہیں؟')) {
                        resetAllData();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ری سیٹ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. Theme Settings */}
          {activeSection === 'theme' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'theme')}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    theme === 'light'
                      ? 'border-blue-900 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200'
                  }`}
                >
                  <span>لائٹ تھیم (Light Clean Mode)</span>
                  {theme === 'light' && <Check className="w-5 h-5 text-blue-900" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                    theme === 'dark'
                      ? 'border-blue-900 bg-slate-800 text-white font-bold'
                      : 'border-slate-200'
                  }`}
                >
                  <span>ڈارک تھیم (Dark Luxury)</span>
                  {theme === 'dark' && <Check className="w-5 h-5 text-amber-400" />}
                </button>
              </div>
            </div>
          )}

          {/* 8. System Preferences */}
          {activeSection === 'preferences' && (
            <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                {getTranslation(language, 'systemPreferences')}
              </h3>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ڈیفالٹ کم سٹاک الرٹ حد (Low Stock Alert Threshold)
                </label>
                <input
                  type="number"
                  value={lowStockDefault}
                  onChange={(e) => setLowStockDefault(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-sans font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  واٹس ایپ بل یاد دہانی کا اردو میسج ٹیمپلیٹ
                </label>
                <textarea
                  rows={3}
                  value={whatsAppFormUr}
                  onChange={(e) => setWhatsAppFormUr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold leading-relaxed"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
                >
                  {getTranslation(language, 'saveChanges')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

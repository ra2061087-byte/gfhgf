import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, History, Trash2, RotateCcw, Lock, UserCheck, Key, AlertTriangle, FileText, Database } from 'lucide-react';
import { UserRole } from '../types';

export const AuditLogManager: React.FC = () => {
  const { 
    auditLogs, 
    trashItemList, 
    restoreFromTrash, 
    permanentlyDeleteFromTrash, 
    currentRole, 
    setCurrentRole, 
    language,
    exportDataJSON,
    resetAllData
  } = useApp();
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'LOGS' | 'TRASH' | 'ROLES'>('LOGS');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            {isUrdu ? 'سیکیورٹی، آڈٹ لاگ و ری سائیکل بن (Security & Audit Logs)' : 'Security, Audit Log & Recovery Center'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'صارفین کے اجازت نامے، تبدیلیوں کا آڈٹ لاگ اور ڈیلیٹ شدہ ڈیٹا کی بحالی (Restore)' : 'Manage user permissions, monitor system audit trails & restore soft-deleted items'}
          </p>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-300 px-2">
            {isUrdu ? 'موجودہ رول:' : 'Role:'}
          </span>
          {(['ADMIN', 'MANAGER', 'CASHIER'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentRole === role
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 space-x-4 rtl:space-x-reverse">
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`pb-3 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'LOGS'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{isUrdu ? '📜 آڈٹ لاگ ہسٹری (Audit Log)' : 'Audit Trail Logs'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {auditLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('TRASH')}
          className={`pb-3 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'TRASH'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isUrdu ? '♻ ری سائیکل بن و بحالی (Restore Trash)' : 'Recycle Bin & Restore'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300">
            {trashItemList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ROLES')}
          className={`pb-3 px-1 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ROLES'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>{isUrdu ? '🔑 اجازت نامے (Role Permissions)' : 'Role Permissions'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'LOGS' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              placeholder={isUrdu ? '🔍 آڈٹ لاگ میں عمل، تبدیلی یا ماڈیول تلاش کریں...' : 'Search activity details or module...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'وقت' : 'Timestamp'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'صارف / رول' : 'User / Role'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'ماڈیول' : 'Module'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'عمل' : 'Action'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'تفصیل' : 'Details'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        {isUrdu ? 'کوئی لاگ موجود نہیں ہے۔' : 'No audit log entries found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                          {log.timestamp}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-semibold">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            {log.userRole}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">
                          {log.module}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-800 dark:text-slate-100">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'TRASH' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>
                {isUrdu
                  ? 'ڈیلیٹ شدہ سامان، کسٹمر اور انوائسز یہاں محفوظ ہیں۔ ضرورت پڑنے پر ایک کلک سے بحال (Restore) کریں۔'
                  : 'Soft-deleted records are stored safely. Click Restore to immediately recover any deleted record.'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right rtl:text-right ltr:text-left text-xs text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'ڈیلیٹ کا وقت' : 'Deleted At'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'قسم' : 'Record Type'}</th>
                    <th className="px-4 py-3 font-semibold">{isUrdu ? 'تفصیل' : 'Title'}</th>
                    <th className="px-4 py-3 font-semibold text-center">{isUrdu ? 'کارروائی' : 'Restore Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {trashItemList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        {isUrdu ? 'ری سائیکل بن خالی ہے (No deleted items in trash).' : 'Trash is currently empty.'}
                      </td>
                    </tr>
                  ) : (
                    trashItemList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-400 text-[11px]">{item.deletedAt}</td>
                        <td className="px-4 py-3 whitespace-nowrap font-bold text-rose-600">{item.itemType}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{item.title}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => restoreFromTrash(item.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{isUrdu ? '♻ بحال کریں (Restore)' : 'Restore Record'}</span>
                            </button>

                            {currentRole === 'ADMIN' && (
                              <button
                                onClick={() => permanentlyDeleteFromTrash(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition"
                                title="Permanently Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ROLES' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {isUrdu ? 'رولز اور اختیارات میٹرکس (Role Permissions Matrix)' : 'Role Permissions Matrix'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left border border-slate-200 dark:border-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3 border-b">{isUrdu ? 'ماڈیول / عمل' : 'Module Action'}</th>
                  <th className="p-3 border-b text-center text-purple-600">ADMIN (مالک / ایڈمن)</th>
                  <th className="p-3 border-b text-center text-indigo-600">MANAGER (مینیجر)</th>
                  <th className="p-3 border-b text-center text-slate-600">CASHIER (کاؤنٹر کیشیر)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                <tr>
                  <td className="p-3 font-semibold">POS Billing & Invoice Creation</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Add / Edit Products & Stock</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                  <td className="p-3 text-center text-rose-500">❌ View Only</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Delete Invoices / Products (ڈیلیٹ)</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Allowed</td>
                  <td className="p-3 text-center text-rose-500 font-bold">❌ Restricted</td>
                  <td className="p-3 text-center text-rose-500 font-bold">❌ Restricted</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">System Backup & Restore</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✔ Full</td>
                  <td className="p-3 text-center text-rose-500">❌ No</td>
                  <td className="p-3 text-center text-rose-500">❌ No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Employee } from '../types';
import { 
  Users, UserPlus, Search, Edit2, Trash2, Calendar, 
  CheckCircle, XCircle, Clock, DollarSign, FileSpreadsheet, Printer 
} from 'lucide-react';

export const EmployeeManager: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, language, currentRole } = useApp();
  const isUrdu = language === 'ur';

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameUr, setNameUr] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [advanceTaken, setAdvanceTaken] = useState(0);

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.nameUr && e.nameUr.includes(searchTerm)) ||
      e.phone.includes(searchTerm)
  );

  const openAdd = () => {
    setEditingEmployee(null);
    setName('');
    setNameUr('');
    setDesignation('Sales Clerk');
    setPhone('');
    setCnic('');
    setMonthlySalary(30000);
    setAdvanceTaken(0);
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setName(emp.name);
    setNameUr(emp.nameUr || '');
    setDesignation(emp.designation);
    setPhone(emp.phone);
    setCnic(emp.cnic);
    setMonthlySalary(emp.monthlySalary);
    setAdvanceTaken(emp.advanceTaken);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name,
        nameUr,
        designation,
        phone,
        cnic,
        monthlySalary,
        advanceTaken
      });
    } else {
      addEmployee({
        name,
        nameUr,
        designation,
        phone,
        cnic,
        monthlySalary,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        advanceTaken
      });
    }

    setShowModal(false);
  };

  const totalPayroll = employees.reduce((sum, e) => sum + e.monthlySalary, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            {isUrdu ? 'ملازمین کا ریکارڑ و تنخواہیں (Employees & Payroll)' : 'Employees & Payroll Management'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isUrdu ? 'دوکان کے ملازمین کی معلومات، تنخواہ، ایڈوانس رقم اور حاضری ہسٹری' : 'Manage shop staff, monthly salaries, advances, and attendance'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isUrdu ? '➕ نیا ملازم (Add Staff)' : '➕ Add Employee'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isUrdu ? 'کل ملازمین (Total Staff)' : 'Total Employees'}
          </span>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
            {employees.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isUrdu ? 'ماہانہ پے رول (Monthly Payroll)' : 'Total Monthly Payroll'}
          </span>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            Rs. {totalPayroll.toLocaleString()}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isUrdu ? 'ایڈوانس وصولی (Advances Total)' : 'Total Advances Granted'}
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            Rs. {employees.reduce((sum, e) => sum + e.advanceTaken, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={isUrdu ? '🔍 ملازم کا نام یا فون نمبر تلاش کریں...' : 'Search employee by name or phone...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
        />
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 relative hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {emp.name} {emp.nameUr && <span className="text-slate-500 font-normal">({emp.nameUr})</span>}
                </h3>
                <span className="text-xs text-indigo-600 font-medium">{emp.designation}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">{isUrdu ? 'فون:' : 'Phone:'}</span>
                <span className="font-medium">{emp.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isUrdu ? 'شناختی کارڈ:' : 'CNIC:'}</span>
                <span className="font-medium">{emp.cnic || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-2">
                <span className="text-slate-400">{isUrdu ? 'ماہانہ تنخواہ:' : 'Salary:'}</span>
                <span className="font-bold text-indigo-600">Rs. {emp.monthlySalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isUrdu ? 'ایڈوانس رقم:' : 'Advance:'}</span>
                <span className="font-semibold text-amber-600">Rs. {emp.advanceTaken.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => openEdit(emp)}
                className="p-1.5 text-slate-500 hover:text-indigo-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded transition"
                title={isUrdu ? 'ترمیم کریں (Edit)' : 'Edit Employee'}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              {currentRole === 'ADMIN' && (
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded transition"
                  title={isUrdu ? 'ڈیلیٹ کریں (Delete)' : 'Delete Employee'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
              {editingEmployee
                ? (isUrdu ? 'ملازم کا ریکارڈ اپڈیٹ کریں' : 'Edit Employee')
                : (isUrdu ? 'نیا ملازم رجسٹر کریں' : 'Register New Employee')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'نام (English)' : 'Name (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'نام (اردو)' : 'Name (Urdu)'}
                </label>
                <input
                  type="text"
                  value={nameUr}
                  onChange={(e) => setNameUr(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {isUrdu ? 'عہدہ (Designation)' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'فون نمبر' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'شناختی کارڈ' : 'CNIC'}
                  </label>
                  <input
                    type="text"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'ماہانہ تنخواہ (Rs.)' : 'Monthly Salary'}
                  </label>
                  <input
                    type="number"
                    value={monthlySalary}
                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {isUrdu ? 'ایڈوانس رقم (Rs.)' : 'Advance Taken'}
                  </label>
                  <input
                    type="number"
                    value={advanceTaken}
                    onChange={(e) => setAdvanceTaken(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  {isUrdu ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {isUrdu ? '💾 محفوظ کریں' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

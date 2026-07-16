import { useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { mockInsuranceCompanies, mockInsuranceOffers } from '../data/mockData';

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCompanies = mockInsuranceCompanies.filter(
    (company) =>
      company.name.includes(searchTerm) ||
      company.name_en?.includes(searchTerm)
  );

  const getOffersCount = (companyId) => {
    return mockInsuranceOffers.filter((o) => o.company_id === companyId).length;
  };

  const getActiveOffersCount = (companyId) => {
    return mockInsuranceOffers.filter(
      (o) => o.company_id === companyId && o.is_active
    ).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">شركات التأمين</h1>
          <p className="text-dark-400 mt-1">إدارة شركات التأمين والعروض</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة شركة جديدة</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">إجمالي الشركات</p>
              <p className="text-3xl font-bold mt-1">
                {mockInsuranceCompanies.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">الشركات النشطة</p>
              <p className="text-3xl font-bold mt-1">
                {mockInsuranceCompanies.filter((c) => c.is_active).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">إجمالي العروض</p>
              <p className="text-3xl font-bold mt-1">
                {mockInsuranceOffers.length}
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-dark-100">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="ابحث عن شركة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-2xl border border-dark-100 overflow-hidden card-hover"
          >
            {/* Header */}
            <div className="p-6 border-b border-dark-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-800">{company.name}</h3>
                    <p className="text-sm text-dark-400">{company.name_en}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    company.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {company.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-dark-800">
                    {getOffersCount(company.id)}
                  </p>
                  <p className="text-sm text-dark-400">إجمالي العروض</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {getActiveOffersCount(company.id)}
                  </p>
                  <p className="text-sm text-green-600">العروض النشطة</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Eye className="w-4 h-4" />
                عرض
              </button>
              <button className="p-2.5 bg-dark-100 rounded-xl hover:bg-dark-200 transition-colors">
                <Edit className="w-5 h-5 text-dark-500" />
              </button>
              <button className="p-2.5 bg-dark-100 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 animate-fade-in">
            <div className="p-6 border-b border-dark-100">
              <h2 className="text-xl font-bold text-dark-800">إضافة شركة جديدة</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  اسم الشركة (عربي)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="مثال: شركة التأمين السعودية"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  اسم الشركة (إنجليزي)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Example: Saudi Insurance Co."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  رابط الشعار
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" className="w-5 h-5" />
                <label htmlFor="isActive" className="text-sm text-dark-600">
                  نشط
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-dark-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 bg-dark-100 text-dark-600 rounded-xl hover:bg-dark-200 transition-colors"
              >
                إلغاء
              </button>
              <button className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

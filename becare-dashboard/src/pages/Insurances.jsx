import { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { mockVisitors, mockInsuranceOffers, mockInsuranceCompanies } from '../data/mockData';

export default function Insurances() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('all');

  const itemsPerPage = 10;

  const insurances = mockVisitors.map((visitor) => {
    const offer = mockInsuranceOffers.find((o) => o.type === visitor.insurance_coverage);
    const company = mockInsuranceCompanies[0];
    return {
      ...visitor,
      offer,
      company,
    };
  });

  const filteredInsurances = insurances.filter((insurance) => {
    const matchesSearch =
      insurance.owner_name?.includes(searchTerm) ||
      insurance.vehicle_model?.includes(searchTerm);
    const matchesType =
      selectedType === 'all' || insurance.insurance_coverage === selectedType;
    return matchesSearch && matchesType;
  });

  const paginatedInsurances = filteredInsurances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInsurances.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: 'مكتمل', class: 'bg-green-100 text-green-700', icon: CheckCircle },
      pending: { label: 'في الانتظار', class: 'bg-amber-100 text-amber-700', icon: Clock },
      processing: { label: 'قيد التنفيذ', class: 'bg-blue-100 text-blue-700', icon: AlertCircle },
      failed: { label: 'فاشل', class: 'bg-red-100 text-red-700', icon: XCircle },
    };
    const { label, class: className, icon: Icon } = statusMap[status] || statusMap.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">التأمينات</h1>
          <p className="text-dark-400 mt-1">قائمة جميع التأمينات</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dark-200 rounded-xl hover:bg-dark-50 transition-colors">
          <Download className="w-5 h-5" />
          <span>تصدير</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">602</p>
              <p className="text-sm text-dark-400">إجمالي التأمينات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">456</p>
              <p className="text-sm text-dark-400">مكتمل</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">34</p>
              <p className="text-sm text-dark-400">في الانتظار</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">1.85M</p>
              <p className="text-sm text-dark-400">إجمالي الإيرادات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-dark-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم المركبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">جميع الأنواع</option>
            <option value="comprehensive">تأمين شامل</option>
            <option value="third-party">ضد الغير</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  رقم التأمين
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  العميل
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  نوع التأمين
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  الشركة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  قيمة التأمين
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  الحالة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {paginatedInsurances.map((insurance) => (
                <tr key={insurance.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-dark-600">#{insurance.id.slice(0, 8).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {insurance.owner_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-dark-800">{insurance.owner_name}</p>
                        <p className="text-xs text-dark-400">{insurance.vehicle_model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        insurance.insurance_coverage === 'comprehensive'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {insurance.insurance_coverage === 'comprehensive' ? 'شامل' : 'ضد الغير'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-600">{insurance.company?.name}</td>
                  <td className="px-6 py-4 font-medium text-dark-800">
                    {formatCurrency(insurance.vehicle_value * 0.035)}
                  </td>
                  <td className="px-6 py-4 text-dark-600">{formatDate(insurance.created_at)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(insurance.payment_status)}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-dark-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-dark-100">
          <p className="text-sm text-dark-400">
            عرض {(currentPage - 1) * itemsPerPage + 1} إلى{' '}
            {Math.min(currentPage * itemsPerPage, filteredInsurances.length)} من{' '}
            {filteredInsurances.length} تأمين
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-dark-200 hover:bg-dark-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-dark-200 hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

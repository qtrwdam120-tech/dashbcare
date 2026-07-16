import { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from 'lucide-react';
import { mockVisitors } from '../data/mockData';

export default function Visitors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  const filteredVisitors = mockVisitors.filter((visitor) => {
    const matchesSearch =
      visitor.owner_name?.includes(searchTerm) ||
      visitor.identity_number?.includes(searchTerm) ||
      visitor.phone_number?.includes(searchTerm);
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'completed' && visitor.payment_status === 'completed') ||
      (selectedStatus === 'pending' && visitor.payment_status === 'pending') ||
      (selectedStatus === 'processing' && visitor.payment_status === 'processing');
    return matchesSearch && matchesStatus;
  });

  const paginatedVisitors = filteredVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: 'مكتمل', class: 'bg-green-100 text-green-700' },
      pending: { label: 'في الانتظار', class: 'bg-amber-100 text-amber-700' },
      processing: { label: 'قيد التنفيذ', class: 'bg-blue-100 text-blue-700' },
      failed: { label: 'فاشل', class: 'bg-red-100 text-red-700' },
    };
    const { label, class: className } = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
        {label}
      </span>
    );
  };

  const getStepLabel = (step) => {
    const steps = {
      1: 'الرئيسية',
      2: 'التأمين',
      3: 'المقارنة',
      4: 'الدفع',
      5: 'اكتمل',
    };
    return steps[step] || step;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">الزوار</h1>
          <p className="text-dark-400 mt-1">إدارة ومتابعة جميع الزوار</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dark-200 rounded-xl hover:bg-dark-50 transition-colors">
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
            <RefreshCw className="w-5 h-5" />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">1,247</p>
              <p className="text-sm text-dark-400">إجمالي الزوار</p>
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
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">23</p>
              <p className="text-sm text-dark-400">فاشل</p>
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
              placeholder="ابحث بالاسم أو رقم الهوية أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="completed">مكتمل</option>
              <option value="pending">في الانتظار</option>
              <option value="processing">قيد التنفيذ</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border transition-colors ${
                showFilters
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white border-dark-200 hover:bg-dark-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  الزائر
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  رقم الهوية
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  رقم الهاتف
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  نوع التأمين
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  المركبة
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-dark-600">
                  الخطوة الحالية
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
              {paginatedVisitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {visitor.owner_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-dark-800">{visitor.owner_name}</p>
                        <p className="text-xs text-dark-400">{visitor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-dark-600">{visitor.identity_number}</td>
                  <td className="px-6 py-4 text-dark-600">{visitor.phone_number}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        visitor.insurance_type === 'تأمين جديد'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {visitor.insurance_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-600">{visitor.vehicle_model}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-dark-100 text-dark-600">
                      {getStepLabel(visitor.current_step)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(visitor.payment_status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-dark-500" />
                      </button>
                      <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
                        <Ban className="w-5 h-5 text-amber-500" />
                      </button>
                      <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
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
            {Math.min(currentPage * itemsPerPage, filteredVisitors.length)} من{' '}
            {filteredVisitors.length} زائر
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

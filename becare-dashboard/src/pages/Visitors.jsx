import { useState, useEffect, useCallback } from 'react';
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
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { api, helpers, pageLabels, statusLabels } from '../services/api';

export default function Visitors() {
  const { isConnected, visitors, setVisitorsList, blockVisitor, unblockVisitor } = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // جلب الزوار عند التحميل
  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllVisitors();
      setVisitorsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('خطأ في جلب الزوار:', err);
      setError('فشل في الاتصال بالخادم');
      // استخدام بيانات تجريبية في حالة فشل الاتصال
      setVisitorsList([]);
    } finally {
      setLoading(false);
    }
  };

  // تصفية الزوار
  const filteredVisitors = visitors.filter((visitor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      visitor.ownerName?.toLowerCase().includes(searchLower) ||
      visitor.identity_number?.toLowerCase().includes(searchLower) ||
      visitor.phone_number?.toLowerCase().includes(searchLower) ||
      visitor.id?.toLowerCase().includes(searchLower);
    
    if (selectedStatus === 'all') return matchesSearch;
    
    if (selectedStatus === 'online') return matchesSearch && visitor.isOnline;
    if (selectedStatus === 'offline') return matchesSearch && !visitor.isOnline;
    if (selectedStatus === 'blocked') return matchesSearch && visitor.isBlocked;
    
    return matchesSearch;
  });

  const paginatedVisitors = filteredVisitors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  const getOnlineStatus = (visitor) => {
    if (visitor.isBlocked) {
      return { label: 'محظور', class: 'bg-red-100 text-red-700', icon: Ban };
    }
    if (visitor.isOnline) {
      return { label: 'متصل', class: 'bg-green-100 text-green-700', icon: Wifi };
    }
    return { label: 'غير متصل', class: 'bg-gray-100 text-gray-700', icon: WifiOff };
  };

  const getCardStatusBadge = (visitor) => {
    if (!visitor.cardStatus) return null;
    const labels = statusLabels.cardStatus || {};
    const label = labels[visitor.cardStatus] || visitor.cardStatus;
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${helpers.getStatusColor(visitor.cardStatus)}`}>
        {label}
      </span>
    );
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
          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">متصل</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">غير متصل</span>
              </>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dark-200 rounded-xl hover:bg-dark-50 transition-colors">
            <Download className="w-5 h-5" />
            <span>تصدير</span>
          </button>
          <button 
            onClick={fetchVisitors}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">{visitors.length}</p>
              <p className="text-sm text-dark-400">إجمالي الزوار</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">
                {visitors.filter(v => v.isOnline && !v.isBlocked).length}
              </p>
              <p className="text-sm text-dark-400">متصلين الآن</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">
                {visitors.filter(v => v.isOnline).length}
              </p>
              <p className="text-sm text-dark-400">نشطين</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">
                {visitors.filter(v => v.isBlocked).length}
              </p>
              <p className="text-sm text-dark-400">محظورين</p>
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
              placeholder="ابحث بالاسم أو رقم الهوية أو رقم الهاتف أو معرف الزائر..."
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
              <option value="all">جميع الزوار</option>
              <option value="online">متصلين</option>
              <option value="offline">غير متصلين</option>
              <option value="blocked">محظورين</option>
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

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-dark-100 text-center">
          <RefreshCw className="w-8 h-8 text-primary-500 mx-auto mb-4 animate-spin" />
          <p className="text-dark-400">جاري تحميل الزوار...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVisitors.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-dark-100 text-center">
          <Users className="w-16 h-16 text-dark-300 mx-auto mb-4" />
          <p className="text-dark-500">لا يوجد زوار</p>
          {error && <p className="text-sm text-dark-400 mt-2">تحقق من الاتصال بالخادم</p>}
        </div>
      )}

      {/* Table */}
      {!loading && filteredVisitors.length > 0 && (
        <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    الزائر
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    رقم الهوية
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    رقم الهاتف
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    الصفحة الحالية
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    حالة البطاقة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-dark-600">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {paginatedVisitors.map((visitor) => {
                  const onlineStatus = getOnlineStatus(visitor);
                  const OnlineIcon = onlineStatus.icon;
                  const pageLabel = pageLabels[visitor.currentPage] || visitor.currentPage || '-';
                  
                  return (
                    <tr key={visitor.id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                              <span className="text-primary-600 font-semibold">
                                {(visitor.ownerName || visitor.phone_number || visitor.id)?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            {visitor.isOnline && !visitor.isBlocked && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-dark-800">{visitor.ownerName || '-'}</p>
                            <p className="text-xs text-dark-400 font-mono">{visitor.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-dark-600">{visitor.identity_number || '-'}</td>
                      <td className="px-4 py-3 text-dark-600">{visitor.phone_number || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {pageLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getCardStatusBadge(visitor)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${onlineStatus.class}`}>
                          <OnlineIcon className="w-3 h-3" />
                          {onlineStatus.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors" title="عرض">
                            <Eye className="w-4 h-4 text-dark-500" />
                          </button>
                          <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors" title="رسالة">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          {visitor.isBlocked ? (
                            <button 
                              onClick={() => unblockVisitor(visitor.id)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors" 
                              title="إلغاء الحظر"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => blockVisitor(visitor.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors" 
                              title="حظر"
                            >
                              <Ban className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
      )}
    </div>
  );
}

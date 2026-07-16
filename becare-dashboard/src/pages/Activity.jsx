import { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  MousePointer,
  FileText,
  CreditCard,
  MessageSquare,
  User,
  LogIn,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { mockActivityLog, mockVisitors } from '../data/mockData';

export default function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  const activitiesWithVisitor = mockActivityLog.map((activity) => {
    const visitor = mockVisitors.find((v) => v.id === activity.visitor_id);
    return { ...activity, visitor };
  });

  const filteredActivities = activitiesWithVisitor.filter((activity) => {
    const matchesSearch =
      activity.visitor?.owner_name.includes(searchTerm) ||
      activity.action.includes(searchTerm);
    const matchesAction = selectedAction === 'all' || activity.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action) => {
    const icons = {
      page_view: Eye,
      form_submit: FileText,
      offer_selected: MousePointer,
      payment_initiated: CreditCard,
      message_sent: MessageSquare,
      login: LogIn,
      logout: LogOut,
      error: AlertTriangle,
    };
    return icons[action] || Activity;
  };

  const getActionLabel = (action) => {
    const labels = {
      page_view: 'عرض صفحة',
      form_submit: 'إرسال نموذج',
      offer_selected: 'اختيار عرض',
      payment_initiated: 'بدء الدفع',
      message_sent: 'إرسال رسالة',
      login: 'تسجيل دخول',
      logout: 'تسجيل خروج',
      error: 'خطأ',
    };
    return labels[action] || action;
  };

  const getActionColor = (action) => {
    const colors = {
      page_view: 'bg-blue-100 text-blue-600',
      form_submit: 'bg-green-100 text-green-600',
      offer_selected: 'bg-purple-100 text-purple-600',
      payment_initiated: 'bg-amber-100 text-amber-600',
      message_sent: 'bg-cyan-100 text-cyan-600',
      login: 'bg-indigo-100 text-indigo-600',
      logout: 'bg-gray-100 text-gray-600',
      error: 'bg-red-100 text-red-600',
    };
    return colors[action] || 'bg-dark-100 text-dark-600';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">سجل النشاط</h1>
          <p className="text-dark-400 mt-1">تتبع جميع الأنشطة على النظام</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-dark-200 rounded-xl hover:bg-dark-50 transition-colors">
          <Download className="w-5 h-5" />
          <span>تصدير السجل</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">1,245</p>
              <p className="text-sm text-dark-400">عرض الصفحات</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">856</p>
              <p className="text-sm text-dark-400">نماذج مرسلة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">423</p>
              <p className="text-sm text-dark-400">عروض مختارة</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-dark-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-800">156</p>
              <p className="text-sm text-dark-400">دفعات</p>
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
              placeholder="ابحث بالنشاط أو اسم الزائر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">جميع الأنشطة</option>
            <option value="page_view">عرض صفحة</option>
            <option value="form_submit">إرسال نموذج</option>
            <option value="offer_selected">اختيار عرض</option>
            <option value="payment_initiated">بدء الدفع</option>
            <option value="message_sent">إرسال رسالة</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
        <div className="divide-y divide-dark-100">
          {filteredActivities.map((activity) => {
            const Icon = getActionIcon(activity.action);
            const { date, time } = formatDateTime(activity.created_at);

            return (
              <div
                key={activity.id}
                className="p-4 hover:bg-dark-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActionColor(activity.action)}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-dark-800">
                        {getActionLabel(activity.action)}
                      </p>
                      <span className="text-dark-300">|</span>
                      <p className="text-dark-600">
                        {activity.visitor?.owner_name || 'زائر غير معروف'}
                      </p>
                    </div>
                    {activity.page && (
                      <p className="text-sm text-dark-400 mt-1">
                        الصفحة: {activity.page}
                      </p>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-left">
                    <p className="text-sm text-dark-600">{date}</p>
                    <p className="text-xs text-dark-400">{time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">لا توجد أنشطة</p>
          </div>
        )}
      </div>
    </div>
  );
}

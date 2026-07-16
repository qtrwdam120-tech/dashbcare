import {
  Users,
  Shield,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Eye,
  MousePointer,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import {
  getDashboardStats,
  getVisitorsChartData,
  getInsuranceTypeData,
  getPaymentStatusData,
  getRecentActivities,
  mockVisitors,
} from '../data/mockData';

const stats = getDashboardStats();
const visitorsData = getVisitorsChartData();
const insuranceTypeData = getInsuranceTypeData();
const paymentStatusData = getPaymentStatusData();
const recentActivities = getRecentActivities();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 text-white px-4 py-3 rounded-xl shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">لوحة التحكم</h1>
          <p className="text-dark-400 mt-1">مرحباً بك في لوحة تحكم بي كير للتأمين</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-dark-200">
          <Clock className="w-5 h-5 text-primary-500" />
          <span className="text-dark-600 font-medium">
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الزوار"
          value={stats.totalVisitors}
          icon={Users}
          trend="up"
          trendValue={stats.weeklyGrowth}
          color="primary"
        />
        <StatCard
          title="زوار نشطين حالياً"
          value={stats.activeVisitors}
          icon={Activity}
          trend="up"
          trendValue={5.2}
          color="success"
        />
        <StatCard
          title="تأمينات مكتملة"
          value={stats.completedInsurances}
          icon={Shield}
          trend="up"
          trendValue={12.3}
          color="secondary"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={stats.totalRevenue}
          icon={DollarSign}
          trend="up"
          trendValue={8.7}
          color="warning"
          suffix="ر.س"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="الزيارات والتأمينات المكتملة"
            subtitle="آخر 7 أيام"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorsData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="الزيارات"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="المكتملة"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Insurance Type Distribution */}
        <ChartCard
          title="نوع التأمين"
          subtitle="توزيع النسب"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insuranceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {insuranceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visitors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-dark-800">آخر الزوار</h3>
            <button className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {mockVisitors.slice(0, 5).map((visitor) => (
              <div
                key={visitor.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-dark-50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-800 truncate">{visitor.owner_name}</p>
                  <p className="text-sm text-dark-400">{visitor.vehicle_model}</p>
                </div>
                <div className="text-left">
                  <span
                    className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                      visitor.payment_status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : visitor.payment_status === 'processing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-dark-100 text-dark-600'
                    }`}
                  >
                    {visitor.payment_status === 'completed'
                      ? 'مكتمل'
                      : visitor.payment_status === 'processing'
                      ? 'قيد التنفيذ'
                      : 'في الانتظار'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status */}
        <ChartCard title="حالة الدفع" subtitle="توزيع التأمينات">
          <div className="space-y-4">
            {paymentStatusData.map((item) => (
              <div key={item.status} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-dark-600 flex-1">{item.status}</span>
                <span className="font-bold text-dark-800">{item.count}</span>
                <div className="w-24 h-2 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.count / 602) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-dark-800">النشاط الأخير</h3>
            <Activity className="w-5 h-5 text-primary-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'success'
                      ? 'bg-green-100'
                      : activity.type === 'error'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}
                >
                  {activity.type === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {activity.type === 'error' && (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  {activity.type === 'info' && (
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-800">{activity.action}</p>
                  <p className="text-xs text-dark-400">{activity.visitor}</p>
                </div>
                <span className="text-xs text-dark-400 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row - Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white">
          <Eye className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">36.5%</p>
          <p className="text-sm opacity-80">معدل التحويل</p>
        </div>
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-5 text-white">
          <MousePointer className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">4.2</p>
          <p className="text-sm opacity-80">دقيقة متوسط الوقت</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <MessageSquare className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">89</p>
          <p className="text-sm opacity-80">رسالة غير مقروءة</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">156</p>
          <p className="text-sm opacity-80">زيارة اليوم</p>
        </div>
      </div>
    </div>
  );
}

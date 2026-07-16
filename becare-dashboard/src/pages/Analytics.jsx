import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ChartCard from '../components/dashboard/ChartCard';
import {
  getVisitorsChartData,
  getMonthlyRevenueData,
  getConversionFunnelData,
  getVehicleUsageData,
  getDeviceTypeData,
  getTopInsuranceCompanies,
  getInsuranceTypeData,
} from '../data/mockData';

const visitorsData = getVisitorsChartData();
const revenueData = getMonthlyRevenueData();
const funnelData = getConversionFunnelData();
const vehicleUsageData = getVehicleUsageData();
const deviceTypeData = getDeviceTypeData();
const companiesData = getTopInsuranceCompanies();
const insuranceTypeData = getInsuranceTypeData();

const COLORS = ['#0ea5e9', '#a855f7', '#22c55e', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 text-white px-4 py-3 rounded-xl shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color || entry.fill }}>
            {entry.name || entry.dataKey}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-800">التحليلات</h1>
        <p className="text-dark-400 mt-1">تحليلات متقدمة وشاملة</p>
      </div>

      {/* First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Trend */}
        <ChartCard
          title="اتجاه الزيارات"
          subtitle="آخر 7 أيام"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorsData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="الزيارات"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Revenue Trend */}
        <ChartCard
          title="الإيرادات الشهرية"
          subtitle="آخر 7 أشهر (بالريال)"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="الإيرادات"
                  fill="#a855f7"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-1">
          <ChartCard
            title="قانون التحويل"
            subtitle="نسبة كل مرحلة"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Funnel
                    dataKey="count"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="#64748b"
                      stroke="none"
                      dataKey="stage"
                    />
                    <LabelList
                      position="center"
                      fill="#fff"
                      stroke="none"
                      dataKey="percentage"
                      formatter={(value) => `${value}%`}
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Vehicle Usage */}
        <ChartCard
          title="استخدام المركبة"
          subtitle="توزيع الأنواع"
        >
          <div className="space-y-4">
            {vehicleUsageData.map((item, index) => (
              <div key={item.usage} className="flex items-center gap-4">
                <span className="w-24 text-sm text-dark-600">{item.usage}</span>
                <div className="flex-1 h-6 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
                <span className="w-16 text-sm font-medium text-dark-800 text-left">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Device Types */}
        <ChartCard
          title="أجهزة الزوار"
          subtitle="توزيع الأجهزة"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="type"
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insurance Companies Performance */}
        <ChartCard
          title="أداء شركات التأمين"
          subtitle="المبيعات والإيرادات"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companiesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  width={150}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="المبيعات"
                  fill="#0ea5e9"
                  radius={[0, 8, 8, 0]}
                />
                <Bar
                  dataKey="revenue"
                  name="الإيرادات"
                  fill="#22c55e"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Insurance Type Distribution */}
        <ChartCard
          title="توزيع أنواع التأمين"
          subtitle="النسب المئوية"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insuranceTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {insuranceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Fourth Row - Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-dark-100 text-center">
          <p className="text-4xl font-bold text-primary-600">36.5%</p>
          <p className="text-dark-400 mt-2">معدل التحويل</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-dark-100 text-center">
          <p className="text-4xl font-bold text-secondary-600">4.2</p>
          <p className="text-dark-400 mt-2">دقيقة للاكتمال</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-dark-100 text-center">
          <p className="text-4xl font-bold text-green-600">67.8%</p>
          <p className="text-dark-400 mt-2">زوار الجوال</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-dark-100 text-center">
          <p className="text-4xl font-bold text-amber-600">62.5%</p>
          <p className="text-dark-400 mt-2">تأمين شامل</p>
        </div>
      </div>
    </div>
  );
}

// بيانات تجريبية للعرض في لوحة التحكم

export const mockVisitors = [
  {
    id: 'v1',
    owner_name: 'أحمد محمد العلي',
    identity_number: '1234567890',
    phone_number: '0555123456',
    insurance_type: 'تأمين جديد',
    insurance_coverage: 'comprehensive',
    vehicle_model: 'تويوتا كورولا 2024',
    vehicle_value: 95000,
    current_step: 5,
    current_page: 'payment',
    payment_status: 'completed',
    created_at: '2026-07-16T10:30:00Z',
    country: 'SA',
    device_type: 'mobile'
  },
  {
    id: 'v2',
    owner_name: 'فاطمة خالد السعيد',
    identity_number: '9876543210',
    phone_number: '0555987654',
    insurance_type: 'نقل ملكية',
    insurance_coverage: 'third-party',
    vehicle_model: 'هونداي سوناتا 2023',
    vehicle_value: 75000,
    current_step: 3,
    current_page: 'comparison',
    payment_status: 'pending',
    created_at: '2026-07-16T11:45:00Z',
    country: 'SA',
    device_type: 'desktop'
  },
  {
    id: 'v3',
    owner_name: 'محمد عبدالله الحربي',
    identity_number: '5678901234',
    phone_number: '0555333444',
    insurance_type: 'تأمين جديد',
    insurance_coverage: 'comprehensive',
    vehicle_model: 'لكزس ES 2024',
    vehicle_value: 180000,
    current_step: 4,
    current_page: 'nafad',
    payment_status: 'processing',
    created_at: '2026-07-16T09:15:00Z',
    country: 'SA',
    device_type: 'mobile'
  },
  {
    id: 'v4',
    owner_name: 'نورة سعد القحطاني',
    identity_number: '2345678901',
    phone_number: '0555666777',
    insurance_type: 'نقل ملكية',
    insurance_coverage: 'third-party',
    vehicle_model: 'نissan ألتيما 2023',
    vehicle_value: 68000,
    current_step: 2,
    current_page: 'insurance',
    payment_status: null,
    created_at: '2026-07-16T14:20:00Z',
    country: 'SA',
    device_type: 'tablet'
  },
  {
    id: 'v5',
    owner_name: 'خالد إبراهيم الدوسري',
    identity_number: '3456789012',
    phone_number: '0555888999',
    insurance_type: 'تأمين جديد',
    insurance_coverage: 'comprehensive',
    vehicle_model: 'مرسيدس C-Class 2024',
    vehicle_value: 250000,
    current_step: 5,
    current_page: 'payment',
    payment_status: 'completed',
    created_at: '2026-07-16T08:00:00Z',
    country: 'SA',
    device_type: 'mobile'
  }
];

export const mockVisitorHistory = [
  { id: 1, visitor_id: 'v1', type: '_st1', status: 'approved', timestamp: '2026-07-16T10:35:00Z' },
  { id: 2, visitor_id: 'v1', type: '_t2', status: 'approved', timestamp: '2026-07-16T10:40:00Z' },
  { id: 3, visitor_id: 'v1', type: '_t6', status: 'approved', timestamp: '2026-07-16T10:50:00Z' },
  { id: 4, visitor_id: 'v2', type: '_st1', status: 'approved', timestamp: '2026-07-16T11:50:00Z' },
  { id: 5, visitor_id: 'v2', type: '_t2', status: 'pending', timestamp: '2026-07-16T12:00:00Z' },
  { id: 6, visitor_id: 'v3', type: '_st1', status: 'approved', timestamp: '2026-07-16T09:20:00Z' },
  { id: 7, visitor_id: 'v3', type: '_t2', status: 'approved', timestamp: '2026-07-16T09:25:00Z' },
  { id: 8, visitor_id: 'v3', type: '_t3', status: 'approved', timestamp: '2026-07-16T09:30:00Z' },
];

export const mockMessages = [
  { id: 1, visitor_id: 'v1', message: 'هل يمكنني تغيير تاريخ بدء التأمين؟', sender_name: 'أحمد محمد العلي', is_from_admin: 0, is_read: 1, created_at: '2026-07-16T11:00:00Z' },
  { id: 2, visitor_id: 'v1', message: 'نعم يمكنك تغييره من إعدادات الوثيقة', sender_name: 'الدعم الفني', is_from_admin: 1, is_read: 1, created_at: '2026-07-16T11:05:00Z' },
  { id: 3, visitor_id: 'v2', message: 'ما هي شركات التأمين المتاحة؟', sender_name: 'فاطمة خالد السعيد', is_from_admin: 0, is_read: 0, created_at: '2026-07-16T12:30:00Z' },
  { id: 4, visitor_id: 'v3', message: 'انتظرت وقت طويل في التحقق من نفاذ', sender_name: 'محمد عبدالله الحربي', is_from_admin: 0, is_read: 1, created_at: '2026-07-16T10:00:00Z' },
];

export const mockInsuranceCompanies = [
  { id: 'c1', name: 'شركة التأمين السعودية', name_en: 'Saudi Insurance Co.', logo_url: null, is_active: 1 },
  { id: 'c2', name: 'شركة بوبا للتأمين', name_en: 'Bupa Insurance', logo_url: null, is_active: 1 },
  { id: 'c3', name: 'شركة أكسا للتأمين', name_en: 'Axa Insurance', logo_url: null, is_active: 1 },
  { id: 'c4', name: 'شركة ميدغلف للتأمين', name_en: 'Medgulf Insurance', logo_url: null, is_active: 0 },
];

export const mockInsuranceOffers = [
  { id: 'o1', company_id: 'c1', name: 'تأمين شامل', type: 'comprehensive', main_price: 3500, is_active: 1 },
  { id: 'o2', company_id: 'c1', name: 'تأمين ضد الغير', type: 'against-others', main_price: 1200, is_active: 1 },
  { id: 'o3', company_id: 'c2', name: 'بوبا الشامل', type: 'comprehensive', main_price: 4200, is_active: 1 },
  { id: 'o4', company_id: 'c3', name: 'أكسي الشامل', type: 'special', main_price: 3800, is_active: 1 },
];

export const mockActivityLog = [
  { id: 1, visitor_id: 'v1', action: 'page_view', page: 'home', created_at: '2026-07-16T10:30:00Z' },
  { id: 2, visitor_id: 'v1', action: 'form_submit', page: 'insurance', created_at: '2026-07-16T10:35:00Z' },
  { id: 3, visitor_id: 'v1', action: 'offer_selected', page: 'comparison', created_at: '2026-07-16T10:45:00Z' },
  { id: 4, visitor_id: 'v2', action: 'page_view', page: 'home', created_at: '2026-07-16T11:45:00Z' },
  { id: 5, visitor_id: 'v3', action: 'payment_initiated', page: 'payment', created_at: '2026-07-16T09:35:00Z' },
];

export const mockSettings = {
  siteName: 'بي كير',
  supportEmail: 'support@becare.com',
  maintenanceMode: false,
  blockedCountries: [],
  blockedBankPrefixes: []
};

// إحصائيات عامة
export const getDashboardStats = () => ({
  totalVisitors: 1247,
  activeVisitors: 89,
  completedInsurances: 456,
  pendingInsurances: 34,
  totalRevenue: 1850000,
  todayVisitors: 156,
  weeklyGrowth: 12.5,
  conversionRate: 36.5,
  averageProcessingTime: 4.2,
});

// بيانات الرسوم البيانية
export const getVisitorsChartData = () => [
  { date: 'السبت', visitors: 145, completed: 52 },
  { date: 'الأحد', visitors: 178, completed: 68 },
  { date: 'الاثنين', visitors: 201, completed: 75 },
  { date: 'الثلاثاء', visitors: 189, completed: 71 },
  { date: 'الأربعاء', visitors: 215, completed: 82 },
  { date: 'الخميس', visitors: 198, completed: 76 },
  { date: 'الجمعة', visitors: 121, completed: 32 },
];

export const getInsuranceTypeData = () => [
  { name: 'تأمين شامل', value: 65, color: '#0ea5e9' },
  { name: 'ضد الغير', value: 35, color: '#a855f7' },
];

export const getPaymentStatusData = () => [
  { status: 'مكتمل', count: 456, color: '#22c55e' },
  { status: 'قيد التنفيذ', count: 89, color: '#f59e0b' },
  { status: 'فاشل', count: 23, color: '#ef4444' },
  { status: 'في الانتظار', count: 34, color: '#64748b' },
];

export const getVehicleUsageData = () => [
  { usage: 'شخصي', count: 780, percentage: 62.5 },
  { usage: 'تجاري', count: 245, percentage: 19.6 },
  { usage: 'نقل ركاب', count: 120, percentage: 9.6 },
  { usage: 'ايجار', count: 67, percentage: 5.4 },
  { usage: 'نقل بضائع', count: 35, percentage: 2.9 },
];

export const getMonthlyRevenueData = () => [
  { month: 'يناير', revenue: 145000 },
  { month: 'فبراير', revenue: 168000 },
  { month: 'مارس', revenue: 192000 },
  { month: 'أبريل', revenue: 175000 },
  { month: 'مايو', revenue: 210000 },
  { month: 'يونيو', revenue: 235000 },
  { month: 'يوليو', revenue: 185000 },
];

export const getConversionFunnelData = () => [
  { stage: 'الزيارة', count: 1247, percentage: 100 },
  { stage: 'إدخال البيانات', count: 980, percentage: 78.6 },
  { stage: 'اختيار العرض', count: 756, percentage: 60.6 },
  { stage: 'الدفع', count: 602, percentage: 48.3 },
  { stage: 'اكتمل', count: 456, percentage: 36.6 },
];

export const getDeviceTypeData = () => [
  { type: 'جوال', count: 845, percentage: 67.8 },
  { type: 'كمبيوتر', count: 280, percentage: 22.5 },
  { type: 'جهاز لوحي', count: 122, percentage: 9.7 },
];

export const getTopInsuranceCompanies = () => [
  { name: 'شركة التأمين السعودية', sales: 156, revenue: 546000 },
  { name: 'شركة بوبا للتأمين', sales: 134, revenue: 562800 },
  { name: 'شركة أكسا للتأمين', sales: 98, revenue: 372400 },
  { name: 'شركة ميدغلف', sales: 68, revenue: 258000 },
];

export const getRecentActivities = () => [
  { id: 1, action: 'اكتمل تأمين جديد', visitor: 'أحمد محمد العلي', time: 'منذ 5 دقائق', type: 'success' },
  { id: 2, action: 'بدأ زائر جديد', visitor: 'فاطمة خالد السعيد', time: 'منذ 12 دقيقة', type: 'info' },
  { id: 3, action: 'فشل الدفع', visitor: 'خالد إبراهيم الدوسري', time: 'منذ 25 دقيقة', type: 'error' },
  { id: 4, action: 'تم اختيار عرض', visitor: 'نورة سعد القحطاني', time: 'منذ 35 دقيقة', type: 'success' },
  { id: 5, action: 'بدأ زائر جديد', visitor: 'عبدالله محمد الشهري', time: 'منذ 45 دقيقة', type: 'info' },
];

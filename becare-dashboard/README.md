# لوحة تحكم بي كير للتأمين

<div align="center">
  <h1>🛡️ لوحة تحكم بي كير للتأمين</h1>
  <p>لوحة تحكم شاملة لإدارة مشروع بي كير للتأمين</p>
</div>

## 📋 الجداول المعروضة

| الجدول | الوصف |
|--------|-------|
| `visitors` | جدول الزوار الرئيسي مع بيانات الهوية والمركبة والتأمين |
| `visitor_history` | سجل زيارات الزوار وتتبع الخطوات |
| `visitor_messages` | رسائل الزوار مع الإدارة |
| `insurance_companies` | شركات التأمين |
| `insurance_offers` | عروض التأمين |
| `offer_features` | الميزات الإضافية للعروض |
| `offer_expenses` | الرسوم الإضافية |
| `public_settings` | الإعدادات العامة |
| `socket_sessions` | جلسات Socket |
| `activity_log` | سجل النشاط |

## 🗄️ قاعدة البيانات

- **نوع**: PostgreSQL
- **الرابط**: `postgresql://postgres:Fa%40%4020yiz2020@db.zspliwktncgjznoerwlu.supabase.co:5432/postgres`

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19** - إطار العمل
- **Vite** - أداة البناء
- **Tailwind CSS 4** - التصميم
- **Recharts** - الرسوم البيانية
- **Lucide React** - الأيقونات
- **React Router** - التوجيه

### Backend
- **Express.js** - API Server
- **Node.js** - بيئة التشغيل
- **pg** - PostgreSQL Client

## 🚀 تشغيل المشروع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. تشغيل الخادم (Backend)
```bash
npm run server
```

### 3. تشغيل لوحة التحكم (Frontend)
```bash
npm run dev
```

### أو تشغيل كل شيء معاً
```bash
npm run dev:all
```

## ⚙️ الإعدادات

### متغيرات البيئة (Frontend)
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### متغيرات البيئة (Backend)
```env
DATABASE_URL=postgresql://postgres:password@host:5432/database
PORT=3001
```

## 📁 هيكل المشروع

```
becare-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── DashboardLayout.jsx
│   │   └── dashboard/
│   │       ├── StatCard.jsx
│   │       └── ChartCard.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Visitors.jsx
│   │   ├── Insurances.jsx
│   │   ├── Companies.jsx
│   │   ├── Messages.jsx
│   │   ├── Offers.jsx
│   │   ├── Activity.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── SocketContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── index.js          # API Server
│   └── .env              # متغيرات البيئة
├── .env.example
├── package.json
└── vite.config.js
```

## 🌐 API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/visitors` | جلب جميع الزوار |
| GET | `/api/visitors/:id` | جلب زائر واحد |
| PATCH | `/api/visitors/:id` | تحديث زائر |
| POST | `/api/visitors/:id/redirect` | تحويل زائر |
| POST | `/api/visitors/:id/block` | حظر زائر |
| POST | `/api/visitors/:id/unblock` | إلغاء الحظر |
| GET | `/api/visitors/:id/messages` | جلب الرسائل |
| POST | `/api/visitors/:id/messages` | إرسال رسالة |
| GET | `/api/visitors/:id/history` | جلب السجل |
| POST | `/api/visitors/:id/history` | إضافة سجل |
| GET | `/api/settings` | جلب الإعدادات |
| GET | `/api/companies` | جلب الشركات |
| GET | `/api/offers` | جلب العروض |
| GET | `/api/stats` | الإحصائيات |
| GET | `/api/health` | فحص الصحة |

## 🎨 التصميم

- تصميم عصري واحترافي
- دعم RTL للغة العربية
- خط Cairo العربي
- ألوان متناسقة (slate/sky)
- تصميم متجاوب
- تأثيرات حركية سلسة

## 📱 الصفحات

| المسار | الصفحة |
|--------|--------|
| `/` | لوحة التحكم الرئيسية |
| `/visitors` | إدارة الزوار |
| `/insurances` | قائمة التأمينات |
| `/companies` | شركات التأمين |
| `/messages` | الرسائل |
| `/offers` | العروض |
| `/activity` | سجل النشاط |
| `/analytics` | التحليلات |
| `/settings` | الإعدادات |

## ☁️ النشر على Render

### Backend (Web Service)
- **Root Directory**: `becare-dashboard`
- **Build Command**: `npm install && npm install -g serve`
- **Start Command**: `node server/index.js`

### Environment Variables
```
DATABASE_URL=postgresql://postgres:Fa%40%4020yiz2020@db.zspliwktncgjznoerwlu.supabase.co:5432/postgres
PORT=3001
```

---

<div align="center">
  <p>صُنع بـ ❤️ بواسطة OpenHands</p>
</div>

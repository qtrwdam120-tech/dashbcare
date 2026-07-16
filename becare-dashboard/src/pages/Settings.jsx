import { useState } from 'react';
import {
  Settings,
  Shield,
  Globe,
  CreditCard,
  Bell,
  Mail,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { mockSettings } from '../data/mockData';

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs = [
    { id: 'general', label: 'عام', icon: Settings },
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'countries', label: 'الدول المحظورة', icon: Globe },
    { id: 'banks', label: 'البنوك المحظورة', icon: CreditCard },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
  ];

  const [blockedCountries, setBlockedCountries] = useState([]);
  const [blockedBanks, setBlockedBanks] = useState([]);
  const [newCountry, setNewCountry] = useState('');
  const [newBank, setNewBank] = useState('');

  const addCountry = () => {
    if (newCountry && !blockedCountries.includes(newCountry)) {
      setBlockedCountries([...blockedCountries, newCountry]);
      setNewCountry('');
    }
  };

  const removeCountry = (country) => {
    setBlockedCountries(blockedCountries.filter((c) => c !== country));
  };

  const addBank = () => {
    if (newBank && !blockedBanks.includes(newBank)) {
      setBlockedBanks([...blockedBanks, newBank]);
      setNewBank('');
    }
  };

  const removeBank = (bank) => {
    setBlockedBanks(blockedBanks.filter((b) => b !== bank));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-800">الإعدادات</h1>
        <p className="text-dark-400 mt-1">إدارة إعدادات النظام</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64">
          <div className="bg-white rounded-2xl border border-dark-100 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-600 hover:bg-dark-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">الإعدادات العامة</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    اسم الموقع
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    بريد الدعم الفني
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                  <div>
                    <p className="font-medium text-dark-800">وضع الصيانة</p>
                    <p className="text-sm text-dark-400">تفعيل وضع الصيانة للموقع</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">إعدادات الأمان</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    مفتاح API
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-3 bg-dark-100 rounded-xl hover:bg-dark-200 transition-colors"
                    >
                      {showApiKey ? (
                        <EyeOff className="w-5 h-5 text-dark-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-dark-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    وقت انتهاء صلاحية OTP (بالثواني)
                  </label>
                  <input
                    type="number"
                    defaultValue={120}
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    الحد الأقصى لمحاولات OTP
                  </label>
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                  <div>
                    <p className="font-medium text-dark-800">تسجيل الدخول الثنائي</p>
                    <p className="text-sm text-dark-400">طلب تحقق إضافي عند تسجيل الدخول</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          )}

          {/* Blocked Countries */}
          {activeTab === 'countries' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">الدول المحظورة</h2>
              <p className="text-dark-400">إدارة الدول التي لا يمكن للزوار منها الوصول للموقع</p>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="أضف دولة..."
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="flex-1 px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={addCountry}
                  className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="space-y-2">
                {blockedCountries.length > 0 ? (
                  blockedCountries.map((country) => (
                    <div
                      key={country}
                      className="flex items-center justify-between p-3 bg-dark-50 rounded-xl"
                    >
                      <span className="text-dark-800">{country}</span>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-dark-200 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-dark-500" />
                        </button>
                        <button
                          onClick={() => removeCountry(country)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-dark-400 py-8">لا توجد دول محظورة</p>
                )}
              </div>
            </div>
          )}

          {/* Blocked Banks */}
          {activeTab === 'banks' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">البنوك المحظورة</h2>
              <p className="text-dark-400">إدارة البنوك التي لا يمكن استخدام بطاقاتها في الدفع</p>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="أضف بنك..."
                  value={newBank}
                  onChange={(e) => setNewBank(e.target.value)}
                  className="flex-1 px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={addBank}
                  className="flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة</span>
                </button>
              </div>

              <div className="space-y-2">
                {blockedBanks.length > 0 ? (
                  blockedBanks.map((bank) => (
                    <div
                      key={bank}
                      className="flex items-center justify-between p-3 bg-dark-50 rounded-xl"
                    >
                      <span className="text-dark-800">{bank}</span>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-dark-200 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-dark-500" />
                        </button>
                        <button
                          onClick={() => removeBank(bank)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-dark-400 py-8">لا توجد بنوك محظورة</p>
                )}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">إعدادات الإشعارات</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'إشعارات زوار جدد', desc: 'إشعار عند تسجيل زائر جديد' },
                  { label: 'إشعارات رسائل جديدة', desc: 'إشعار عند وصول رسالة من زائر' },
                  { label: 'إشعارات دفع ناجح', desc: 'إشعار عند اكتمال عملية دفع' },
                  { label: 'إشعارات دفع فاشل', desc: 'إشعار عند فشل عملية دفع' },
                  { label: 'تقرير يومي', desc: 'إرسال تقرير يومي بالبريد الإلكتروني' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                    <div>
                      <p className="font-medium text-dark-800">{item.label}</p>
                      <p className="text-sm text-dark-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="bg-white rounded-2xl border border-dark-100 p-6 space-y-6">
              <h2 className="text-xl font-bold text-dark-800">إعدادات البريد الإلكتروني</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    خادم SMTP
                  </label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">
                      المنفذ
                    </label>
                    <input
                      type="number"
                      placeholder="587"
                      className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">
                      التشفير
                    </label>
                    <select className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option>TLS</option>
                      <option>SSL</option>
                      <option>بدون تشفير</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

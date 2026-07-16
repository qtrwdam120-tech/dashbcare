import { useState } from 'react';
import { Bell, Search, Moon, Sun, Menu, ChevronDown } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'تم اكتمال تأمين جديد', time: '5 دقائق', unread: true },
    { id: 2, text: 'رسالة جديدة من زائر', time: '12 دقيقة', unread: true },
    { id: 3, text: 'تنبيه: فشل دفع', time: '25 دقيقة', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Right side - Search */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="بحث..."
              className="w-64 pr-10 pl-4 py-2 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {/* Left side - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-semibold text-slate-800 text-sm">الإشعارات</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors ${
                        notif.unread ? 'bg-sky-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></span>
                        )}
                        <div className={notif.unread ? '' : 'mr-5'}>
                          <p className="text-sm text-slate-700">{notif.text}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                  <button className="w-full text-center text-sm text-sky-600 hover:text-sky-700 font-medium">
                    عرض كل الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                أ
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-800">أحمد المشرف</p>
                <p className="text-[10px] text-slate-500">مدير النظام</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>
            
            {showUserMenu && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-right transition-colors">
                    الملف الشخصي
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-right transition-colors">
                    الإعدادات
                  </button>
                  <div className="border-t border-slate-100 my-2" />
                  <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-right transition-colors">
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

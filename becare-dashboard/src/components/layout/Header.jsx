import { useState } from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'تم اكتمال تأمين جديد', time: '5 دقائق', unread: true },
    { id: 2, text: 'رسالة جديدة من زائر', time: '12 دقيقة', unread: true },
    { id: 3, text: 'تنبيه: فشل دفع', time: '25 دقيقة', unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-dark-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Right side - Search */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-dark-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="بحث في لوحة التحكم..."
              className="w-80 pr-10 pl-4 py-2.5 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Left side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-dark-100 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5 text-dark-500" />
              <span className="absolute top-1 left-1 w-2.5 h-2.5 bg-danger-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-dark-200 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-dark-100">
                  <h3 className="font-semibold text-dark-800">الإشعارات</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-dark-50 cursor-pointer border-b border-dark-100 last:border-0 ${
                        notif.unread ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                        )}
                        <div className={notif.unread ? '' : 'mr-5'}>
                          <p className="text-sm text-dark-800">{notif.text}</p>
                          <p className="text-xs text-dark-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-dark-100">
                  <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                    عرض كل الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 hover:bg-dark-100 rounded-xl transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-warning-500" />
            ) : (
              <Moon className="w-5 h-5 text-dark-500" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pr-4 border-r border-dark-200">
            <div className="text-left hidden sm:block">
              <h4 className="font-semibold text-dark-800">أحمد المشرف</h4>
              <p className="text-xs text-dark-400">مدير النظام</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              أ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

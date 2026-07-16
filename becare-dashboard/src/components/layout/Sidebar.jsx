import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Building2,
  Gift,
  Settings,
  Activity,
  ChevronRight,
  ChevronLeft,
  Shield,
  LogOut,
  BarChart3,
  Circle
} from 'lucide-react';

const menuItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/visitors', label: 'الزوار', icon: Users },
  { path: '/insurances', label: 'التأمينات', icon: FileText },
  { path: '/companies', label: 'شركات التأمين', icon: Building2 },
  { path: '/messages', label: 'الرسائل', icon: MessageSquare },
  { path: '/offers', label: 'العروض', icon: Gift },
  { path: '/activity', label: 'سجل النشاط', icon: Activity },
  { path: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 right-0 h-screen bg-slate-900 text-white z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ boxShadow: '4px 0 30px rgba(0, 0, 0, 0.4)' }}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-slate-700/50">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white">بي كير</h1>
              <p className="text-[10px] text-slate-400">BeCare Insurance</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="py-4 px-3">
        {!collapsed && (
          <p className="px-4 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            القائمة الرئيسية
          </p>
        )}
        
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group relative block"
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sky-500 rounded-l-full" />
                  )}
                  
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? 'bg-sky-500/20' 
                      : 'bg-slate-800 group-hover:bg-slate-700'
                  }`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-white'}`} />
                  </div>
                  
                  {!collapsed && (
                    <span className={`font-medium text-sm ${isActive ? 'text-sky-400' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </div>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 border border-slate-700">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45 border-b border-r border-slate-700" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collapse Button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <>
              <ChevronRight className="w-5 h-5" />
              <span className="text-sm">طي القائمة</span>
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700/50">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          {!collapsed && <span className="text-sm font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}

import { useState } from 'react';
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
  BarChart3
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
      className={`fixed top-0 right-0 h-full bg-gradient-to-b from-dark-800 to-dark-900 text-white z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-dark-600">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">بي كير</h1>
              <p className="text-xs text-dark-300">BeCare Insurance</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                  : 'text-dark-200 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-dark-300 group-hover:text-white'}`} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute right-full mr-2 px-3 py-2 bg-dark-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 bg-dark-700 hover:bg-dark-600 rounded-full flex items-center justify-center transition-colors"
      >
        {collapsed ? (
          <ChevronLeft className="w-5 h-5 text-dark-300" />
        ) : (
          <ChevronRight className="w-5 h-5 text-dark-300" />
        )}
      </button>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 right-0 p-3 border-t border-dark-600">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-dark-300 hover:text-danger-500 hover:bg-dark-700 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}

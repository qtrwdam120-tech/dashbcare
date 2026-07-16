import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'primary', suffix = '' }) {
  const colors = {
    primary: {
      bg: 'bg-primary-100',
      icon: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600',
    },
    secondary: {
      bg: 'bg-secondary-100',
      icon: 'text-secondary-600',
      gradient: 'from-secondary-500 to-secondary-600',
    },
    success: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
    },
    warning: {
      bg: 'bg-amber-100',
      icon: 'text-amber-600',
      gradient: 'from-amber-500 to-amber-600',
    },
    danger: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      gradient: 'from-red-500 to-red-600',
    },
  };

  const colorScheme = colors[color] || colors.primary;
  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-100 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-dark-400 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-dark-800">{value.toLocaleString()}</h3>
            {suffix && <span className="text-dark-400 text-sm">{suffix}</span>}
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? '+' : '-'}{trendValue}%
              </span>
              <span className="text-dark-400 text-sm">من الأسبوع الماضي</span>
            </div>
          )}
        </div>
        
        <div className={`w-14 h-14 rounded-2xl ${colorScheme.bg} flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${colorScheme.icon}`} />
        </div>
      </div>
    </div>
  );
}

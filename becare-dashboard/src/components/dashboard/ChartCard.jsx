export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-dark-100 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-dark-800">{title}</h3>
        {subtitle && <p className="text-sm text-dark-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

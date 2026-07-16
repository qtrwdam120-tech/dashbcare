import { useState } from 'react';
import {
  Gift,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';
import { mockInsuranceOffers, mockInsuranceCompanies } from '../data/mockData';

export default function Offers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const offersWithCompany = mockInsuranceOffers.map((offer) => {
    const company = mockInsuranceCompanies.find((c) => c.id === offer.company_id);
    return { ...offer, company };
  });

  const filteredOffers = offersWithCompany.filter((offer) => {
    const matchesSearch =
      offer.name.includes(searchTerm) ||
      offer.company?.name.includes(searchTerm);
    const matchesType = selectedType === 'all' || offer.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type) => {
    const types = {
      comprehensive: 'شامل',
      'against-others': 'ضد الغير',
      special: 'خاص',
    };
    return types[type] || type;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">العروض</h1>
          <p className="text-dark-400 mt-1">إدارة عروض شركات التأمين</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>إضافة عرض جديد</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <Gift className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{mockInsuranceOffers.length}</p>
          <p className="text-sm opacity-80">إجمالي العروض</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <CheckCircle className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">
            {mockInsuranceOffers.filter((o) => o.is_active).length}
          </p>
          <p className="text-sm opacity-80">العروض النشطة</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <Gift className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">
            {mockInsuranceOffers.filter((o) => o.type === 'comprehensive').length}
          </p>
          <p className="text-sm opacity-80">تأمين شامل</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <Gift className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">
            {mockInsuranceOffers.filter((o) => o.type === 'against-others').length}
          </p>
          <p className="text-sm opacity-80">ضد الغير</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-dark-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="ابحث عن عرض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">جميع الأنواع</option>
            <option value="comprehensive">شامل</option>
            <option value="against-others">ضد الغير</option>
            <option value="special">خاص</option>
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-dark-100 overflow-hidden card-hover"
          >
            {/* Header */}
            <div className="p-6 border-b border-dark-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-dark-800 text-lg">{offer.name}</h3>
                  <p className="text-sm text-dark-400 mt-1">{offer.company?.name}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    offer.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {offer.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dark-400">نوع التأمين</span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    offer.type === 'comprehensive'
                      ? 'bg-blue-100 text-blue-700'
                      : offer.type === 'against-others'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {getTypeLabel(offer.type)}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-dark-400 text-sm">السعر الأساسي</span>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(offer.main_price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Eye className="w-4 h-4" />
                عرض
              </button>
              <button className="p-2.5 bg-dark-100 rounded-xl hover:bg-dark-200 transition-colors">
                <Edit className="w-5 h-5 text-dark-500" />
              </button>
              <button className="p-2.5 bg-dark-100 rounded-xl hover:bg-red-100 transition-colors">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

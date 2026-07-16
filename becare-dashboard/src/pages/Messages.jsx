import { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  User,
  CheckCheck,
  Clock,
  MessageSquare,
  Inbox,
} from 'lucide-react';
import { mockMessages, mockVisitors } from '../data/mockData';

export default function Messages() {
  const [selectedVisitor, setSelectedVisitor] = useState(mockVisitors[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const visitorMessages = mockMessages.filter(
    (msg) => msg.visitor_id === selectedVisitor?.id
  );

  const filteredVisitors = mockVisitors.filter((v) =>
    v.owner_name.includes(searchTerm)
  );

  const getUnreadCount = (visitorId) => {
    return mockMessages.filter(
      (m) => m.visitor_id === visitorId && !m.is_read && !m.is_from_admin
    ).length;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    }
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-800">الرسائل</h1>
          <p className="text-dark-400 mt-1">التواصل مع الزوار</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-dark-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            <span className="font-medium text-dark-800">
              {mockMessages.filter((m) => !m.is_read && !m.is_from_admin).length} غير مقروءة
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden h-[calc(100vh-280px)] min-h-[500px]">
        <div className="flex h-full">
          {/* Visitors List */}
          <div className="w-80 border-l border-dark-100 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-dark-100">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="ابحث عن زائر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredVisitors.map((visitor) => {
                const unreadCount = getUnreadCount(visitor.id);
                const isSelected = selectedVisitor?.id === visitor.id;

                return (
                  <div
                    key={visitor.id}
                    onClick={() => setSelectedVisitor(visitor)}
                    className={`p-4 cursor-pointer border-b border-dark-100 transition-colors ${
                      isSelected
                        ? 'bg-primary-50'
                        : 'hover:bg-dark-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium truncate ${isSelected ? 'text-primary-700' : 'text-dark-800'}`}>
                            {visitor.owner_name}
                          </p>
                          <span className="text-xs text-dark-400">10:30</span>
                        </div>
                        <p className="text-sm text-dark-400 truncate mt-1">
                          {visitor.vehicle_model}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedVisitor ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-dark-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-dark-800">
                        {selectedVisitor.owner_name}
                      </p>
                      <p className="text-xs text-dark-400">
                        {selectedVisitor.vehicle_model}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-dark-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-dark-500" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {visitorMessages.length > 0 ? (
                    visitorMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.is_from_admin ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            message.is_from_admin
                              ? 'bg-dark-100 text-dark-800'
                              : 'bg-primary-600 text-white'
                          } rounded-2xl px-4 py-3`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center gap-2 mt-2 text-xs ${message.is_from_admin ? 'text-dark-400' : 'text-white/70'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(message.created_at)}</span>
                            {message.is_from_admin && message.is_read && (
                              <CheckCheck className="w-3 h-3 text-primary-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Inbox className="w-16 h-16 text-dark-300 mb-4" />
                      <p className="text-dark-400">لا توجد رسائل مع هذا الزائر</p>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-dark-100">
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5 text-dark-400" />
                    </button>
                    <input
                      type="text"
                      placeholder="اكتب رسالتك..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-3 bg-dark-50 border border-dark-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <MessageSquare className="w-16 h-16 text-dark-300 mb-4" />
                <p className="text-dark-400">اختر زائراً لعرض الرسائل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

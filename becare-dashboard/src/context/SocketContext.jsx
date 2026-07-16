// ═══════════════════════════════════════════════════════
// Socket.io Context - إدارة الاتصال بالخادم
// ═══════════════════════════════════════════════════════

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../services/api';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);

  // الاتصال بالخادم
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // عند الاتصال
    newSocket.on('connect', () => {
      console.log('✅ متصل بالخادم');
      setIsConnected(true);
      // الانضمام كمسؤول
      newSocket.emit('admin:join');
    });

    // عند قطع الاتصال
    newSocket.on('disconnect', () => {
      console.log('❌ انقطع الاتصال بالخادم');
      setIsConnected(false);
    });

    // عند خطأ
    newSocket.on('connect_error', (error) => {
      console.error('🔴 خطأ في الاتصال:', error.message);
    });

    // زائر جديد
    newSocket.on('visitor:joined', (data) => {
      console.log('👤 زائر جديد:', data);
      setLastEvent({ type: 'visitor:joined', data, time: new Date() });
      setVisitors((prev) => {
        const exists = prev.find((v) => v.id === data.id);
        if (exists) {
          return prev.map((v) => (v.id === data.id ? { ...v, ...data } : v));
        }
        return [{ ...data, isNew: true }, ...prev];
      });
    });

    // تحديث زائر
    newSocket.on('visitor:updated', (data) => {
      console.log('🔄 تحديث زائر:', data);
      setLastEvent({ type: 'visitor:updated', data, time: new Date() });
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === data.visitorId
            ? { ...v, [data.field]: data.value, lastUpdate: new Date() }
            : v
        )
      );
    });

    // تغيير حالة
    newSocket.on('status_changed', (data) => {
      console.log('📊 تغيير حالة:', data);
      setLastEvent({ type: 'status_changed', data, time: new Date() });
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === data.visitorId
            ? { ...v, [data.field]: data.status, lastUpdate: new Date() }
            : v
        )
      );
    });

    // رسالة جديدة
    newSocket.on('visitor:new_message', (data) => {
      console.log('💬 رسالة جديدة:', data);
      setLastEvent({ type: 'visitor:new_message', data, time: new Date() });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ═══════════════════════════════════════════════════════
  // Actions - الإجراءات
  // ═══════════════════════════════════════════════════════

  // تحويل زائر لصفحة معينة
  const redirectVisitor = useCallback(
    (visitorId, targetPage) => {
      if (socket) {
        socket.emit('visitor:redirect', {
          visitorId,
          targetPage,
        });
        return true;
      }
      return false;
    },
    [socket]
  );

  // تحديث حالة زائر
  const updateVisitorStatus = useCallback(
    (visitorId, field, status) => {
      if (socket) {
        socket.emit('visitor:status_updated', {
          visitorId,
          field,
          status,
        });
        return true;
      }
      return false;
    },
    [socket]
  );

  // إرسال رسالة
  const sendMessage = useCallback(
    (visitorId, message, senderName = 'لوحة التحكم') => {
      if (socket) {
        socket.emit('visitor:send_message', {
          visitorId,
          message,
          senderName,
        });
        return true;
      }
      return false;
    },
    [socket]
  );

  // حظر زائر
  const blockVisitor = useCallback(
    (visitorId) => {
      if (socket) {
        socket.emit('visitor:block', { visitorId });
        setVisitors((prev) =>
          prev.map((v) =>
            v.id === visitorId ? { ...v, isBlocked: true } : v
          )
        );
        return true;
      }
      return false;
    },
    [socket]
  );

  // إلغاء حظر زائر
  const unblockVisitor = useCallback(
    (visitorId) => {
      if (socket) {
        socket.emit('visitor:unblock', { visitorId });
        setVisitors((prev) =>
          prev.map((v) =>
            v.id === visitorId ? { ...v, isBlocked: false } : v
          )
        );
        return true;
      }
      return false;
    },
    [socket]
  );

  // تحديث قائمة الزوار
  const setVisitorsList = useCallback((list) => {
    setVisitors(list);
  }, []);

  // إزالة زائر من القائمة
  const removeVisitor = useCallback((visitorId) => {
    setVisitors((prev) => prev.filter((v) => v.id !== visitorId));
  }, []);

  const value = {
    socket,
    isConnected,
    visitors,
    lastEvent,
    redirectVisitor,
    updateVisitorStatus,
    sendMessage,
    blockVisitor,
    unblockVisitor,
    setVisitorsList,
    removeVisitor,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

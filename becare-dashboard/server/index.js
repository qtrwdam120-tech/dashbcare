// ═══════════════════════════════════════════════════════
// Backend API Server للوحة التحكم
// يتصل بقاعدة البيانات PostgreSQL
// ═══════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

// ES Module paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'https://newbcare.onrender.com';
const RENDER_PORT = process.env.PORT || 10000; // Render uses PORT env var

// ═══════════════════════════════════════════════════════
// Logger Utility
// ═══════════════════════════════════════════════════════

const logger = {
  info: (msg, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️  INFO: ${msg}`, Object.keys(data).length ? data : '');
  },
  success: (msg, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ✅ SUCCESS: ${msg}`, Object.keys(data).length ? data : '');
  },
  error: (msg, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ERROR: ${msg}`, error ? error.message || error : '');
  },
  warn: (msg, data = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️  WARN: ${msg}`, Object.keys(data).length ? data : '');
  },
  incoming: (method, path, origin) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📥 INCOMING REQUEST: ${method} ${path} from ${origin || 'unknown'}`);
  },
  outgoing: (method, path, status, duration) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 📤 OUTGOING RESPONSE: ${method} ${path} | Status: ${status} | Duration: ${duration}ms`);
  }
};

// Middleware - Request Logger
app.use((req, res, next) => {
  const startTime = Date.now();
  const origin = req.headers.origin || req.ip;
  
  logger.incoming(req.method, req.path, origin);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.outgoing(req.method, req.path, res.statusCode, duration);
  });
  
  next();
});

// Middleware - CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Serve static files from dist folder
const distPath = join(__dirname, '..', 'dist');

// Check if dist folder exists and serve static files
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  logger.info('Static files will be served from dist folder');
}

// Serve index.html for all non-API routes (SPA support)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  
  const indexPath = join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.status(404).send('Not Found');
});

logger.info('Static file serving configured');

// ═══════════════════════════════════════════════════════
// اتصال قاعدة البيانات
// ═══════════════════════════════════════════════════════

// Parse the connection string to handle IPv4 fallback
const getDbConfig = () => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Fa%40%4020yiz2020@db.zspliwktncgjznoerwlu.supabase.co:5432/postgres';
  
  // Try IPv4 connection first
  return {
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    // Force IPv4
    host: 'db.zspliwktncgjznoerwlu.supabase.co',
    port: 5432,
    // Fallback DNS settings
    query_timeout: 10000,
    connectionTimeoutMillis: 10000,
  };
};

const pool = new Pool(getDbConfig());

// اختبار الاتصال بقاعدة البيانات
pool.query('SELECT NOW()')
  .then(() => {
    logger.success('Database connected successfully', { 
      host: 'db.zspliwktncgjznoerwlu.supabase.co',
      database: 'postgres'
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to database - Supabase may not be accessible from this network', error);
    logger.warn('Make sure Supabase project allows connections from 0.0.0.0/0 or specific IPs');
  });

pool.on('error', (error) => {
  logger.error('Unexpected database error', error);
});

// ═══════════════════════════════════════════════════════
// API Endpoints
// ═══════════════════════════════════════════════════════

// جلب جميع الزوار
app.get('/api/visitors', async (req, res) => {
  try {
    logger.info('Fetching all visitors');
    const result = await pool.query(`
      SELECT * FROM visitors 
      ORDER BY last_active_at DESC 
      LIMIT 100
    `);
    logger.success(`Fetched ${result.rows.length} visitors`);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching visitors', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب زائر واحد
app.get('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching visitor', { visitorId: id });
    const result = await pool.query('SELECT * FROM visitors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      logger.warn('Visitor not found', { visitorId: id });
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    logger.success('Visitor fetched', { visitorId: id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching visitor', error);
    res.status(500).json({ error: error.message });
  }
});

// تحديث زائر
app.patch('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    logger.info('Updating visitor', { visitorId: id, updates: Object.keys(updates) });
    
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    if (keys.length === 0) {
      logger.warn('No data to update', { visitorId: id });
      return res.status(400).json({ error: 'لا توجد بيانات للتحديث' });
    }
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const query = `UPDATE visitors SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const result = await pool.query(query, [...values, id]);
    
    if (result.rows.length === 0) {
      logger.warn('Visitor not found for update', { visitorId: id });
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    logger.success('Visitor updated', { visitorId: id, updatedFields: keys });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating visitor', error);
    res.status(500).json({ error: error.message });
  }
});

// تحويل زائر لصفحة معينة
app.post('/api/visitors/:id/redirect', async (req, res) => {
  try {
    const { id } = req.params;
    const { targetPage } = req.body;
    
    logger.info('Redirecting visitor', { visitorId: id, targetPage });
    
    if (!targetPage) {
      logger.warn('Target page not specified', { visitorId: id });
      return res.status(400).json({ error: 'الصفحة المطلوبة غير محددة' });
    }
    
    const result = await pool.query(
      'UPDATE visitors SET redirect_page = $1 WHERE id = $2 RETURNING *',
      [targetPage, id]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Visitor not found for redirect', { visitorId: id });
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    logger.success('Visitor redirected', { visitorId: id, targetPage });
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    logger.error('Error redirecting visitor', error);
    res.status(500).json({ error: error.message });
  }
});

// حظر زائر
app.post('/api/visitors/:id/block', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Blocking visitor', { visitorId: id });
    
    const result = await pool.query(
      'UPDATE visitors SET is_blocked = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Visitor not found for block', { visitorId: id });
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    logger.success('Visitor blocked', { visitorId: id });
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    logger.error('Error blocking visitor', error);
    res.status(500).json({ error: error.message });
  }
});

// إلغاء حظر زائر
app.post('/api/visitors/:id/unblock', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Unblocking visitor', { visitorId: id });
    
    const result = await pool.query(
      'UPDATE visitors SET is_blocked = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Visitor not found for unblock', { visitorId: id });
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    logger.success('Visitor unblocked', { visitorId: id });
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    logger.error('Error unblocking visitor', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب الرسائل
app.get('/api/visitors/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching messages', { visitorId: id });
    
    const result = await pool.query(
      'SELECT * FROM visitor_messages WHERE visitor_id = $1 ORDER BY created_at DESC',
      [id]
    );
    
    logger.success(`Fetched ${result.rows.length} messages`, { visitorId: id });
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching messages', error);
    res.status(500).json({ error: error.message });
  }
});

// إرسال رسالة
app.post('/api/visitors/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, senderName } = req.body;
    
    logger.info('Sending message', { visitorId: id, senderName });
    
    if (!message) {
      logger.warn('Message is empty', { visitorId: id });
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }
    
    const result = await pool.query(
      `INSERT INTO visitor_messages (visitor_id, message, sender_name, is_from_admin) 
       VALUES ($1, $2, $3, true) RETURNING *`,
      [id, message, senderName || 'لوحة التحكم']
    );
    
    logger.success('Message sent', { visitorId: id, messageId: result.rows[0].id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error sending message', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب سجل التاريخ
app.get('/api/visitors/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Fetching history', { visitorId: id });
    
    const result = await pool.query(
      'SELECT * FROM visitor_history WHERE visitor_id = $1 ORDER BY timestamp DESC',
      [id]
    );
    
    logger.success(`Fetched ${result.rows.length} history records`, { visitorId: id });
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching history', error);
    res.status(500).json({ error: error.message });
  }
});

// إضافة سجل تاريخ
app.post('/api/visitors/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data, status } = req.body;
    
    logger.info('Adding history record', { visitorId: id, type });
    
    if (!type) {
      logger.warn('History type not specified', { visitorId: id });
      return res.status(400).json({ error: 'النوع مطلوب' });
    }
    
    const result = await pool.query(
      `INSERT INTO visitor_history (visitor_id, type, data, status) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, type, JSON.stringify(data || {}), status || 'pending']
    );
    
    logger.success('History record added', { visitorId: id, historyId: result.rows[0].id });
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error adding history', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب الإعدادات العامة
app.get('/api/settings', async (req, res) => {
  try {
    logger.info('Fetching settings');
    const result = await pool.query('SELECT * FROM public_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    logger.success('Settings fetched');
    res.json(settings);
  } catch (error) {
    logger.error('Error fetching settings', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب شركات التأمين
app.get('/api/companies', async (req, res) => {
  try {
    logger.info('Fetching companies');
    const result = await pool.query('SELECT * FROM insurance_companies ORDER BY name');
    logger.success(`Fetched ${result.rows.length} companies`);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching companies', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب العروض
app.get('/api/offers', async (req, res) => {
  try {
    logger.info('Fetching offers');
    const result = await pool.query('SELECT * FROM insurance_offers ORDER BY main_price');
    logger.success(`Fetched ${result.rows.length} offers`);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching offers', error);
    res.status(500).json({ error: error.message });
  }
});

// إحصائيات
app.get('/api/stats', async (req, res) => {
  try {
    logger.info('Fetching stats');
    const totalVisitors = await pool.query('SELECT COUNT(*) FROM visitors');
    const activeVisitors = await pool.query('SELECT COUNT(*) FROM visitors WHERE is_online = true');
    const blockedVisitors = await pool.query('SELECT COUNT(*) FROM visitors WHERE is_blocked = true');
    const totalMessages = await pool.query('SELECT COUNT(*) FROM visitor_messages WHERE is_from_admin = false AND is_read = false');
    
    const stats = {
      totalVisitors: parseInt(totalVisitors.rows[0].count),
      activeVisitors: parseInt(activeVisitors.rows[0].count),
      blockedVisitors: parseInt(blockedVisitors.rows[0].count),
      unreadMessages: parseInt(totalMessages.rows[0].count)
    };
    
    logger.success('Stats fetched', stats);
    res.json(stats);
  } catch (error) {
    logger.error('Error fetching stats', error);
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════
// Socket.io Events
// ═══════════════════════════════════════════════════════

io.on('connection', (socket) => {
  logger.info('Client connected to Socket.io', { socketId: socket.id });

  // الانضمام كمسؤول
  socket.on('admin:join', () => {
    logger.success('Admin joined via Socket.io', { socketId: socket.id });
    socket.join('admin');
  });

  // تحويل زائر لصفحة معينة
  socket.on('visitor:redirect', async (data) => {
    const { visitorId, targetPage } = data;
    logger.info('Socket: Redirecting visitor', { visitorId, targetPage });
    
    try {
      await pool.query(
        'UPDATE visitors SET redirect_page = $1, updated_at = NOW() WHERE id = $2',
        [targetPage, visitorId]
      );
      io.to(visitorId).emit('redirect', { page: targetPage });
      logger.success('Socket: Visitor redirected', { visitorId, targetPage });
    } catch (error) {
      logger.error('Socket: Error redirecting visitor', error);
    }
  });

  // تحديث حالة زائر
  socket.on('visitor:status_updated', async (data) => {
    const { visitorId, field, status } = data;
    logger.info('Socket: Updating visitor status', { visitorId, field, status });
    
    try {
      await pool.query(
        `UPDATE visitors SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
        [status, visitorId]
      );
      io.to(visitorId).emit('status_updated', { field, status });
      logger.success('Socket: Visitor status updated', { visitorId, field, status });
    } catch (error) {
      logger.error('Socket: Error updating status', error);
    }
  });

  // إرسال رسالة لزائر
  socket.on('visitor:send_message', async (data) => {
    const { visitorId, message, senderName } = data;
    logger.info('Socket: Sending message', { visitorId, senderName });
    
    try {
      const result = await pool.query(
        `INSERT INTO visitor_messages (visitor_id, message, sender_name, is_from_admin) 
         VALUES ($1, $2, $3, true) RETURNING *`,
        [visitorId, message, senderName || 'لوحة التحكم']
      );
      io.to(visitorId).emit('new_message', result.rows[0]);
      logger.success('Socket: Message sent', { visitorId, messageId: result.rows[0].id });
    } catch (error) {
      logger.error('Socket: Error sending message', error);
    }
  });

  // حظر زائر
  socket.on('visitor:block', async (data) => {
    const { visitorId } = data;
    logger.info('Socket: Blocking visitor', { visitorId });
    
    try {
      await pool.query(
        'UPDATE visitors SET is_blocked = true WHERE id = $1',
        [visitorId]
      );
      io.to(visitorId).emit('blocked');
      logger.success('Socket: Visitor blocked', { visitorId });
    } catch (error) {
      logger.error('Socket: Error blocking visitor', error);
    }
  });

  // إلغاء حظر زائر
  socket.on('visitor:unblock', async (data) => {
    const { visitorId } = data;
    logger.info('Socket: Unblocking visitor', { visitorId });
    
    try {
      await pool.query(
        'UPDATE visitors SET is_blocked = false WHERE id = $1',
        [visitorId]
      );
      io.to(visitorId).emit('unblocked');
      logger.success('Socket: Visitor unblocked', { visitorId });
    } catch (error) {
      logger.error('Socket: Error unblocking visitor', error);
    }
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected from Socket.io', { socketId: socket.id });
  });
});

// تشغيل الخادم
httpServer.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     🚀 Backend API Server Started Successfully!             ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  📍 Server URL:     http://localhost:${PORT}                    ║`);
  console.log(`║  📍 API Base URL:    http://localhost:${PORT}/api              ║`);
  console.log(`║  🔌 Socket.io:      Enabled                               ║`);
  console.log(`║  🗄️  Database:       PostgreSQL (Supabase)                  ║`);
  console.log(`║  🌐 Client URL:      ${CLIENT_URL.substring(0, 30).padEnd(30)}  ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Available Endpoints:                                   ║');
  console.log('║     GET  /api/visitors          - List all visitors      ║');
  console.log('║     GET  /api/visitors/:id      - Get visitor           ║');
  console.log('║     PATCH /api/visitors/:id      - Update visitor        ║');
  console.log('║     GET  /api/stats              - Dashboard stats       ║');
  console.log('║     GET  /api/health             - Health check          ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  💡 Waiting for requests...                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
});

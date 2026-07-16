// ═══════════════════════════════════════════════════════
// Backend API Server للوحة التحكم
// يتصل بقاعدة البيانات PostgreSQL
// ═══════════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════
// اتصال قاعدة البيانات
// ═══════════════════════════════════════════════════════

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Fa%40%4020yiz2020@db.zspliwktncgjznoerwlu.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// ═══════════════════════════════════════════════════════
// API Endpoints
// ═══════════════════════════════════════════════════════

// جلب جميع الزوار
app.get('/api/visitors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM visitors 
      ORDER BY last_active_at DESC 
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب زائر واحد
app.get('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM visitors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching visitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// تحديث زائر
app.patch('/api/visitors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    
    if (keys.length === 0) {
      return res.status(400).json({ error: 'لا توجد بيانات للتحديث' });
    }
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const query = `UPDATE visitors SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    const result = await pool.query(query, [...values, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating visitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// تحويل زائر لصفحة معينة
app.post('/api/visitors/:id/redirect', async (req, res) => {
  try {
    const { id } = req.params;
    const { targetPage } = req.body;
    
    if (!targetPage) {
      return res.status(400).json({ error: 'الصفحة المطلوبة غير محددة' });
    }
    
    const result = await pool.query(
      'UPDATE visitors SET redirect_page = $1 WHERE id = $2 RETURNING *',
      [targetPage, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    console.error('Error redirecting visitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// حظر زائر
app.post('/api/visitors/:id/block', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE visitors SET is_blocked = true WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    console.error('Error blocking visitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// إلغاء حظر زائر
app.post('/api/visitors/:id/unblock', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE visitors SET is_blocked = false WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'الزائر غير موجود' });
    }
    
    res.json({ success: true, visitor: result.rows[0] });
  } catch (error) {
    console.error('Error unblocking visitor:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب الرسائل
app.get('/api/visitors/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM visitor_messages WHERE visitor_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// إرسال رسالة
app.post('/api/visitors/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, senderName } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }
    
    const result = await pool.query(
      `INSERT INTO visitor_messages (visitor_id, message, sender_name, is_from_admin) 
       VALUES ($1, $2, $3, true) RETURNING *`,
      [id, message, senderName || 'لوحة التحكم']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب سجل التاريخ
app.get('/api/visitors/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM visitor_history WHERE visitor_id = $1 ORDER BY timestamp DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: error.message });
  }
});

// إضافة سجل تاريخ
app.post('/api/visitors/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data, status } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'النوع مطلوب' });
    }
    
    const result = await pool.query(
      `INSERT INTO visitor_history (visitor_id, type, data, status) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, type, JSON.stringify(data || {}), status || 'pending']
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب الإعدادات العامة
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public_settings');
    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب شركات التأمين
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_companies ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

// جلب العروض
app.get('/api/offers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_offers ORDER BY main_price');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: error.message });
  }
});

// إحصائيات
app.get('/api/stats', async (req, res) => {
  try {
    const totalVisitors = await pool.query('SELECT COUNT(*) FROM visitors');
    const activeVisitors = await pool.query('SELECT COUNT(*) FROM visitors WHERE is_online = true');
    const blockedVisitors = await pool.query('SELECT COUNT(*) FROM visitors WHERE is_blocked = true');
    const totalMessages = await pool.query('SELECT COUNT(*) FROM visitor_messages WHERE is_from_admin = false AND is_read = false');
    
    res.json({
      totalVisitors: parseInt(totalVisitors.rows[0].count),
      activeVisitors: parseInt(activeVisitors.rows[0].count),
      blockedVisitors: parseInt(blockedVisitors.rows[0].count),
      unreadMessages: parseInt(totalMessages.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
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

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`🚀 Backend API Server running on port ${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
});

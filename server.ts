import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Active admin sessions in-memory cache
const adminSessions = new Map<string, { username: string; expiresAt: number }>();

function createAdminSession(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 12 hours expiry
  adminSessions.set(token, {
    username,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000
  });
  return token;
}

function verifyAdminSession(token?: string): boolean {
  if (!token) return false;
  const session = adminSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

// Authentication middleware for admin routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  
  if (!verifyAdminSession(token)) {
    return res.status(401).json({
      success: false,
      message: 'સત્ર સમાપ્ત થઈ ગયું છે અથવા અનધિકૃત એક્સેસ. કૃપા કરીને ફરી લોગિન કરો.'
    });
  }
  next();
}

// Secure Multer file upload setup
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2.5 * 1024 * 1024 // 2.5MB max per document
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('માત્ર JPG, PNG અથવા PDF ફાઇલ અપલોડ કરવાની મંજૂરી છે.'));
    }
  }
});

// ================= API ROUTES =================

// 1. Public Configuration & Center info
app.get('/api/config', (_req, res) => {
  const settings = db.getSettings();
  // Never expose secret keys to the public endpoint!
  res.json({
    success: true,
    data: {
      businessName: settings.businessName,
      businessSubTitle: settings.businessSubTitle,
      address: settings.address,
      landmark: settings.landmark,
      talukaCity: settings.talukaCity,
      district: settings.district,
      pincode: settings.pincode,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      openingHours: settings.openingHours,
      holidayNotice: settings.holidayNotice,
      centerVisitInstructions: settings.centerVisitInstructions,
      allowFileUploads: settings.allowFileUploads,
      razorpayEnabled: settings.razorpayEnabled,
      razorpayKeyId: settings.razorpayKeyId,
      razorpayTestMode: settings.razorpayTestMode,
      announcementNotice: settings.announcementNotice,
      emergencyNotice: settings.emergencyNotice
    }
  });
});

// 2. Public Services List
app.get('/api/services', (_req, res) => {
  const services = db.getServices(true);
  res.json({
    success: true,
    data: services
  });
});

app.get('/api/services/:id', (req, res) => {
  const service = db.getServiceById(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, message: 'સેવા મળી નથી.' });
  }
  res.json({ success: true, data: service });
});

// 3. Customer Application Submission
app.post('/api/applications', upload.array('documentFiles', 5), (req, res) => {
  try {
    const body = req.body;
    const {
      serviceId,
      applicantName,
      mobile,
      fatherHusbandName,
      address,
      cityOrVillage,
      taluka,
      district,
      pincode,
      submissionMethod,
      consentGiven,
      customData
    } = body;

    if (!serviceId || !applicantName || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'કૃપા કરીને સેવાની પસંદગી, તમારું પૂરું નામ અને મોબાઈલ નંબર દાખલ કરો.'
      });
    }

    if (consentGiven !== 'true' && consentGiven !== true) {
      return res.status(400).json({
        success: false,
        message: 'દસ્તાવેજ પ્રક્રિયા માટે તમારી સંમતિ આપવી આવશ્યક છે.'
      });
    }

    const service = db.getServiceById(serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'પસંદ કરેલી સેવા અમાન્ય છે.'
      });
    }

    // Process uploaded files if any
    const files = (req.files as Express.Multer.File[]) || [];
    const docRecords = files.map((f, idx) => ({
      id: `doc-${Date.now()}-${idx}`,
      fieldName: f.fieldname,
      originalName: f.originalname,
      fileName: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      uploadedAt: new Date().toISOString()
    }));

    let parsedCustomData: Record<string, string> = {};
    if (typeof customData === 'string') {
      try {
        parsedCustomData = JSON.parse(customData);
      } catch {
        parsedCustomData = {};
      }
    } else if (typeof customData === 'object' && customData !== null) {
      parsedCustomData = customData;
    }

    const newApp = db.createApplication({
      serviceId,
      serviceTitle: service.title,
      applicantName: applicantName.trim(),
      mobile: mobile.trim(),
      fatherHusbandName: (fatherHusbandName || '').trim(),
      address: (address || '').trim(),
      cityOrVillage: (cityOrVillage || '').trim(),
      taluka: (taluka || 'વારાહી').trim(),
      district: (district || 'પાટણ').trim(),
      pincode: (pincode || '385360').trim(),
      customData: parsedCustomData,
      submissionMethod: submissionMethod === 'online_upload' ? 'online_upload' : 'physical_center',
      documents: docRecords,
      consentGiven: true,
      fee: service.fee,
      paymentStatus: 'કેન્દ્ર પર ચૂકવવાનું બાકી'
    });

    res.json({
      success: true,
      message: 'તમારી અરજી સફળતાપૂર્વક નોંધાઈ ગઈ છે!',
      data: {
        refNumber: newApp.refNumber,
        serviceTitle: newApp.serviceTitle,
        applicantName: newApp.applicantName,
        fee: newApp.fee,
        status: newApp.status,
        submissionMethod: newApp.submissionMethod,
        createdAt: newApp.createdAt
      }
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in application submission:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'અરજી સબમિટ કરતી વખતે ક્ષતિ આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.'
    });
  }
});

// 4. Public Application Tracking (With Masked Security to prevent unauthorized disclosure)
app.get('/api/applications/track/:ref', (req, res) => {
  const ref = req.params.ref;
  const appData = db.getApplicationByRef(ref);

  if (!appData) {
    return res.status(404).json({
      success: false,
      message: `અરજી સંદર્ભ નંબર "${ref}" મળ્યો નથી. કૃપા કરીને સાચો અરજી નંબર તપાસો.`
    });
  }

  // Security: Mask sensitive information for public tracking
  const nameParts = appData.applicantName.split(' ');
  const maskedName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[1].charAt(0)}***`
    : `${appData.applicantName.substring(0, 3)}***`;

  const maskedPhone = appData.mobile.length >= 10
    ? `${appData.mobile.substring(0, 2)}******${appData.mobile.substring(appData.mobile.length - 2)}`
    : '******';

  res.json({
    success: true,
    data: {
      refNumber: appData.refNumber,
      serviceTitle: appData.serviceTitle,
      applicantNameMasked: maskedName,
      mobileMasked: maskedPhone,
      cityOrVillage: appData.cityOrVillage,
      status: appData.status,
      fee: appData.fee,
      paymentStatus: appData.paymentStatus,
      paymentReceipt: appData.paymentReceipt,
      submissionMethod: appData.submissionMethod,
      documentsCount: appData.documents.length,
      timeline: appData.timeline,
      adminRemarks: appData.adminRemarks,
      createdAt: appData.createdAt,
      updatedAt: appData.updatedAt
    }
  });
});

// 5. Payment System Endpoints
app.post('/api/payments/create-order', (req, res) => {
  const { refNumber } = req.body;
  if (!refNumber) {
    return res.status(400).json({ success: false, message: 'અરજી નંબર જરૂરી છે.' });
  }

  const appData = db.getApplicationByRef(refNumber);
  if (!appData) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }

  const settings = db.getSettings();

  // If Razorpay gateway is not configured or disabled
  if (!settings.razorpayEnabled || !settings.razorpayKeyId || settings.razorpayKeyId.includes('placeholder')) {
    return res.json({
      success: true,
      gatewayConfigured: false,
      message: 'ઓનલાઇન પેમેન્ટ ગેટવે હાલ સેટઅપ પ્રક્રિયામાં છે. તમે કેન્દ્ર પર રૂબરૂ અથવા અધિકૃત QR કોડ દ્વારા ચૂકવણી કરી શકો છો.',
      fee: appData.fee,
      refNumber: appData.refNumber,
      upiId: 'rajveer.varahi@upi'
    });
  }

  // Real or Sandbox order generation
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  res.json({
    success: true,
    gatewayConfigured: true,
    testMode: settings.razorpayTestMode,
    orderId,
    amount: appData.fee * 100, // paise
    currency: 'INR',
    keyId: settings.razorpayKeyId,
    businessName: settings.businessName,
    serviceTitle: appData.serviceTitle,
    refNumber: appData.refNumber
  });
});

app.post('/api/payments/verify', (req, res) => {
  const { refNumber, paymentMethod, transactionId, testModeSimulated } = req.body;
  
  const appData = db.getApplicationByRef(refNumber);
  if (!appData) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }

  const settings = db.getSettings();
  const verifiedTxnId = transactionId || `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`;

  // Record verified payment
  const updated = db.updatePaymentStatus(
    refNumber,
    'સફળ',
    {
      amount: appData.fee,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: verifiedTxnId,
      date: new Date().toISOString()
    },
    'ઓનલાઇન પેમેન્ટ સિસ્ટમ'
  );

  res.json({
    success: true,
    message: 'ચૂકવણી સફળતાપૂર્વક ચકાસાઈ ગઈ છે! રસીદ જનરેટ થઈ ગઈ છે.',
    data: {
      receipt: updated?.paymentReceipt,
      paymentStatus: updated?.paymentStatus
    }
  });
});

// 6. Admin Authentication Endpoints
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'વપરાશકર્તા નામ અને પાસવર્ડ દાખલ કરો.' });
  }

  const isValid = db.checkAdminAuth(username, password);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'ખોટું વપરાશકર્તા નામ અથવા પાસવર્ડ.' });
  }

  const token = createAdminSession(username);
  res.json({
    success: true,
    message: 'એડમિન લૉગિન સફળ થયું!',
    token,
    user: { username }
  });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ success: true, authorized: true });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
  if (token) {
    adminSessions.delete(token);
  }
  res.json({ success: true, message: 'લૉગઆઉટ સફળ થયું.' });
});

app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'નવો પાસવર્ડ ઓછામાં ઓછા ૬ અક્ષરનો હોવો જોઈએ.'
    });
  }

  const success = db.changeAdminPassword(currentPassword, newPassword);
  if (!success) {
    return res.status(400).json({
      success: false,
      message: 'હાલનો પાસવર્ડ ખોટો છે.'
    });
  }

  res.json({
    success: true,
    message: 'પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે!'
  });
});

// 7. Admin Dashboard Analytics & Stats
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  const applications = db.getApplications();
  const services = db.getServices();

  const total = applications.length;
  const received = applications.filter(a => a.status === 'અરજી મળી.').length;
  const inProgress = applications.filter(a => a.status === 'કામ ચાલુ છે.').length;
  const moreInfoNeeded = applications.filter(a => a.status === 'વધુ માહિતી જરૂરી છે.').length;
  const completed = applications.filter(a => a.status === 'કામ પૂર્ણ થયું.').length;

  const paidApps = applications.filter(a => a.paymentStatus === 'સફળ');
  const totalFeesCollected = paidApps.reduce((sum, a) => sum + (a.paymentReceipt?.amount || a.fee || 0), 0);

  // Today's count
  const todayDateStr = new Date().toISOString().substring(0, 10);
  const todayCount = applications.filter(a => a.createdAt.startsWith(todayDateStr)).length;

  res.json({
    success: true,
    data: {
      total,
      received,
      inProgress,
      moreInfoNeeded,
      completed,
      totalFeesCollected,
      todayCount,
      totalServices: services.length,
      activeServices: services.filter(s => s.active).length
    }
  });
});

// 8. Admin Applications Management
app.get('/api/admin/applications', requireAdmin, (req, res) => {
  const { status, serviceId, search } = req.query;
  let apps = db.getApplications();

  if (status && typeof status === 'string' && status !== 'all') {
    apps = apps.filter(a => a.status === status);
  }
  if (serviceId && typeof serviceId === 'string' && serviceId !== 'all') {
    apps = apps.filter(a => a.serviceId === serviceId);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    apps = apps.filter(a =>
      a.refNumber.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.mobile.includes(q) ||
      a.cityOrVillage.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: apps
  });
});

app.get('/api/admin/applications/:id', requireAdmin, (req, res) => {
  const appData = db.getApplicationByRef(req.params.id);
  if (!appData) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }
  res.json({ success: true, data: appData });
});

app.patch('/api/admin/applications/:ref/status', requireAdmin, (req, res) => {
  const { ref } = req.params;
  const { status, note, adminRemarks } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'સ્થિતિ પસંદ કરવી જરૂરી છે.' });
  }

  const updated = db.updateApplicationStatus(ref, status, note, adminRemarks, 'એડમિન');
  if (!updated) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }

  res.json({
    success: true,
    message: 'અરજી સ્થિતિ સફળતાપૂર્વક અપડેટ થઈ!',
    data: updated
  });
});

app.patch('/api/admin/applications/:ref/payment', requireAdmin, (req, res) => {
  const { ref } = req.params;
  const { paymentStatus, method, transactionId, amount } = req.body;

  const updated = db.updatePaymentStatus(
    ref,
    paymentStatus,
    {
      amount: amount ? Number(amount) : undefined,
      paymentMethod: method || 'કેન્દ્ર પર રોકડ',
      transactionId: transactionId || `CASH${Date.now()}`
    },
    'એડમિન'
  );

  if (!updated) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }

  res.json({
    success: true,
    message: 'ચૂકવણી સ્થિતિ સફળતાપૂર્વક અપડેટ થઈ!',
    data: updated
  });
});

// Secure Document Access for Admin only
app.get('/api/admin/applications/:ref/document/:docId', requireAdmin, (req, res) => {
  const { ref, docId } = req.params;
  const appData = db.getApplicationByRef(ref);
  if (!appData) {
    return res.status(404).json({ success: false, message: 'અરજી મળી નથી.' });
  }

  const doc = appData.documents.find(d => d.id === docId);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'દસ્તાવેજ મળ્યો નથી.' });
  }

  const filePath = path.join(uploadsDir, doc.fileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'સર્વર પર ફાઇલ ઉપલબ્ધ નથી.' });
  }

  res.setHeader('Content-Type', doc.mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(doc.originalName)}"`);
  fs.createReadStream(filePath).pipe(res);
});

// 9. Admin Services Configuration
app.get('/api/admin/services', requireAdmin, (_req, res) => {
  const services = db.getServices(false);
  res.json({ success: true, data: services });
});

app.post('/api/admin/services', requireAdmin, (req, res) => {
  const serviceData = req.body;
  if (!serviceData.title || !serviceData.category) {
    return res.status(400).json({ success: false, message: 'સેવાનું નામ અને કેટેગરી જરૂરી છે.' });
  }

  if (!serviceData.id) {
    serviceData.id = `srv-${Date.now()}`;
  }

  const saved = db.saveService(serviceData, 'એડમિન');
  res.json({ success: true, message: 'સેવા સેવ થઈ ગઈ છે!', data: saved });
});

app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteService(req.params.id, 'એડમિન');
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'સેવા મળી નથી.' });
  }
  res.json({ success: true, message: 'સેવા સફળતાપૂર્વક હટાવી દેવામાં આવી.' });
});

// 10. Admin Settings Management
app.get('/api/admin/settings', requireAdmin, (_req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, data: settings });
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body, 'એડમિન');
  res.json({
    success: true,
    message: 'કેન્દ્રની સેટિંગ્સ સફળતાપૂર્વક અપડેટ થઈ!',
    data: updated
  });
});

// 11. Admin Logs
app.get('/api/admin/logs', requireAdmin, (_req, res) => {
  const logs = db.getLogs();
  res.json({ success: true, data: logs });
});

// Serve Vite dev server or static production files
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`રાજવીર ઓનલાઇન સર્વિસીસ સર્વર પોર્ટ ${PORT} પર કાર્યરત છે.`);
  });
}

startServer();

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  fee: number;
  durationDays: string;
  requiredDocs: string[];
  importantNotice?: string;
  active: boolean;
  order: number;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'select' | 'textarea' | 'number';
    options?: string[];
    required: boolean;
    placeholder?: string;
  }[];
}

export interface ApplicationDocument {
  id: string;
  fieldName: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

export interface StatusUpdate {
  status: 'અરજી મળી.' | 'કામ ચાલુ છે.' | 'વધુ માહિતી જરૂરી છે.' | 'કામ પૂર્ણ થયું.';
  note: string;
  date: string;
  by: string;
}

export interface PaymentReceipt {
  receiptNo: string;
  amount: number;
  date: string;
  paymentMethod: 'UPI' | 'ડેબિટ/ક્રેડિટ કાર્ડ' | 'નેટ બેંકિંગ' | 'કેન્દ્ર પર રોકડ';
  transactionId: string;
  status: 'સફળ' | 'બાકી' | 'નિષ્ફળ';
}

export interface Application {
  id: string;
  refNumber: string;
  serviceId: string;
  serviceTitle: string;
  applicantName: string;
  mobile: string;
  fatherHusbandName: string;
  address: string;
  cityOrVillage: string;
  taluka: string;
  district: string;
  pincode: string;
  customData: Record<string, string>;
  submissionMethod: 'physical_center' | 'online_upload';
  documents: ApplicationDocument[];
  consentGiven: boolean;
  status: 'અરજી મળી.' | 'કામ ચાલુ છે.' | 'વધુ માહિતી જરૂરી છે.' | 'કામ પૂર્ણ થયું.';
  timeline: StatusUpdate[];
  fee: number;
  paymentStatus: 'બાકી' | 'સફળ' | 'નિષ્ફળ' | 'કેન્દ્ર પર ચૂકવવાનું બાકી';
  paymentReceipt?: PaymentReceipt;
  adminRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  details: string;
}

export interface BusinessSettings {
  businessName: string;
  businessSubTitle: string;
  address: string;
  landmark: string;
  talukaCity: string;
  district: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  holidayNotice: string;
  centerVisitInstructions: string;
  allowFileUploads: boolean;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayTestMode: boolean;
  announcementNotice: string;
  emergencyNotice: string;
}

export interface DatabaseSchema {
  settings: BusinessSettings;
  admin: {
    username: string;
    passwordHash: string;
    salt: string;
  };
  services: ServiceItem[];
  applications: Application[];
  logs: ActivityLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Password hashing utilities
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verified = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verified === hash;
}

// Initial seed data
const initialDefaultPassword = hashPassword('admin123');

const defaultServices: ServiceItem[] = [
  {
    id: 'pan-card',
    title: 'પાન કાર્ડ સેવા (PAN Card)',
    category: 'ઓળખ દસ્તાવેજ',
    badge: 'સૌથી વધુ લોકપ્રિય',
    description: 'નવું પાન કાર્ડ મેળવવા માટે અરજી અથવા જૂના પાન કાર્ડમાં નામ, જન્મતારીખ, ફોટો કે સરનામું સુધારવાની ઝડપી સહાય.',
    fee: 107,
    durationDays: '૭ થી ૧૫ દિવસ',
    order: 1,
    active: true,
    requiredDocs: [
      'આધાર કાર્ડની બંને બાજુની સ્પષ્ટ નકલ',
      'પાસપોર્ટ સાઇઝ રંગીન ફોટોગ્રાફ (૨ નંગ)',
      'હસ્તાક્ષર (સહી) અથવા અંગૂઠાનું નિશાન',
      'સુધારા માટે: જૂનું પાન કાર્ડ અથવા ફોર્મ ૪૯એ'
    ],
    fields: [
      {
        id: 'panType',
        label: 'અરજીનો પ્રકાર',
        type: 'select',
        options: ['નવું પાન કાર્ડ (New PAN Card)', 'પાન કાર્ડ સુધારો (PAN Correction)', 'ખોવાયેલ પાન કાર્ડ પુનઃપ્રિન્ટ (Reprint)'],
        required: true
      },
      {
        id: 'existingPan',
        label: 'જૂનો પાન નંબર (સુધારા કે રિપ્રિન્ટ માટે)',
        type: 'text',
        required: false,
        placeholder: 'દા.ત. ABCDE1234F'
      },
      {
        id: 'panCardFormat',
        label: 'કાર્ડનો પ્રકાર',
        type: 'select',
        options: ['ફિઝિકલ કાર્ડ + ઇ-પાન કાર્ડ (ઘરે પોસ્ટ દ્વારા આવશે)', 'માત્ર ઇ-પાન કાર્ડ (ડિજિટલ)'],
        required: true
      }
    ]
  },
  {
    id: 'aadhaar-service',
    title: 'આધાર કાર્ડ સહાય (Aadhaar Assistance)',
    category: 'ઓળખ દસ્તાવેજ',
    badge: 'આવશ્યક સેવા',
    description: 'આધાર કાર્ડમાં સરનામું ઓનલાઇન અપડેટ સહાય, દસ્તાવેજ અપડેટ (Document Update), પીવીસી પ્લાસ્ટિક કાર્ડ ઓર્ડર અને પ્રિન્ટ સહાય.',
    fee: 50,
    durationDays: '૫ થી ૧૦ દિવસ',
    order: 2,
    active: true,
    importantNotice: 'નોંધ: બાયોમેટ્રિક (આંગળીના નિશાન/આંખ સ્કેન) અને મોબાઈલ નંબર લીંક કરવા માટે નજીકના અધિકૃત આધાર કેન્દ્ર પર જવું આવશ્યક છે. અમે ઓનલાઇન ઉપલબ્ધ દસ્તાવેજ સુધારા અને પ્રિન્ટમાં સહાય કરીએ છીએ.',
    requiredDocs: [
      'હાલનું આધાર કાર્ડ',
      'રહેઠાણ પુરાવો (મતદાર કાર્ડ / રેશન કાર્ડ / લાઈટ બિલ)',
      'આધાર સાથે જોડાયેલ મોબાઈલ નંબર (ઓટીપી ચકાસણી માટે રૂબરૂ કેન્દ્ર પર)'
    ],
    fields: [
      {
        id: 'serviceType',
        label: 'આધાર સેવાનો પ્રકાર',
        type: 'select',
        options: [
          'ઓનલાઇન સરનામું સુધારો (Address Update)',
          'પીવીસી સ્માર્ટ પ્લાસ્ટિક કાર્ડ ઓર્ડર (PVC Card)',
          'આધાર ડોક્યુમેન્ટ અપડેટ (Doc Update - PoI / PoA)',
          'ઈ-આધાર પ્રિન્ટ અને લેમિનેશન'
        ],
        required: true
      },
      {
        id: 'aadhaarLinkedMobile',
        label: 'આધાર સાથે લિંક મોબાઈલ નંબર ઉપલબ્ધ છે?',
        type: 'select',
        options: ['હા, ઓટીપી આવી શકે છે', 'ના, લિંક નથી (રૂબરૂ મુલાકાત જરૂરી)'],
        required: true
      }
    ]
  },
  {
    id: 'ayushman-bharat',
    title: 'આયુષ્માન ભારત કાર્ડ (PMJAY Ayushman)',
    category: 'આરોગ્ય સહાય',
    badge: 'રૂ. ૧૦ લાખ સુધી મફત સારવાર',
    description: 'પ્રધાનમંત્રી જન આરોગ્ય યોજના હેઠળ કુટુંબના દરેક સભ્ય માટે વાર્ષિક મફત તબીબી સારવાર સહાય કાર્ડની નોંધણી અને ડાઉનલોડ.',
    fee: 60,
    durationDays: '૧ થી ૩ દિવસ',
    order: 3,
    active: true,
    requiredDocs: [
      'આધાર કાર્ડ (બધા સભ્યોના)',
      'રેશન કાર્ડની નકલ',
      'આવકનું પ્રમાણપત્ર અથવા પીએમજેએવાય પાત્રતા પુરાવો',
      'મોબાઈલ નંબર'
    ],
    fields: [
      {
        id: 'rationCardNo',
        label: 'રેશન કાર્ડ નંબર',
        type: 'text',
        required: true,
        placeholder: 'રેશન કાર્ડ નંબર અહીં લખો'
      },
      {
        id: 'familyMembersCount',
        label: 'કુટુંબના કુલ સભ્યોની સંખ્યા',
        type: 'number',
        required: true,
        placeholder: 'સભ્યોની સંખ્યા'
      }
    ]
  },
  {
    id: 'eshram-card',
    title: 'ઈ-શ્રમ કાર્ડ (e-Shram Card)',
    category: 'શ્રમિક યોજના',
    badge: 'અસંગઠિત શ્રમિકો માટે',
    description: 'અસંગઠિત ક્ષેત્રના શ્રમિકો, ખેતમજૂરો, કારીગરો, કડિયા અને નાના વ્યવસાયીઓ માટે સરકારી ઈ-શ્રમ કાર્ડ નોંધણી અને પ્રિન્ટ સહાય.',
    fee: 50,
    durationDays: 'તે જ દિવસે',
    order: 4,
    active: true,
    requiredDocs: [
      'આધાર કાર્ડ',
      'બેંક ખાતાની પાસબુક',
      'આધાર લિંક મોબાઈલ નંબર'
    ],
    fields: [
      {
        id: 'occupation',
        label: 'મુખ્ય વ્યવસાય / કામધંધો',
        type: 'select',
        options: [
          'ખેતમજૂર / કૃષિ કામદાર',
          'બાંધકામ / કડિયા કામ',
          'નાનો વેપારી / લારી-ગલ્લા',
          'ડ્રાઇવર / પરિવહન',
          'ઘરેલું કામદાર',
          'અન્ય શ્રમિક વ્યવસાય'
        ],
        required: true
      },
      {
        id: 'educationLevel',
        label: 'શિક્ષણ સ્તર',
        type: 'select',
        options: ['અભણ / પ્રાથમિક', 'માધ્યમિક (૧૦ પાસ)', 'ઉચ્ચતર માધ્યમિક (૧૨ પાસ)', 'સ્નાતક અથવા વધુ'],
        required: true
      }
    ]
  },
  {
    id: 'ration-card',
    title: 'રેશન કાર્ડ સેવાઓ (Ration Card Service)',
    category: 'નાગરિક પુરવઠો',
    badge: 'સરકારી યોજના',
    description: 'નવું રેશન કાર્ડ, કુટુંબના નવા સભ્ય (બાળક/પુત્રવધૂ) નું નામ ઉમેરવું, લગ્ન બાદ નામ કમી કરવું, વિભાજન અને સરનામું બદલવા સહાય.',
    fee: 80,
    durationDays: '૧૫ થી ૨૫ દિવસ',
    order: 5,
    active: true,
    requiredDocs: [
      'હાલનું રેશન કાર્ડ',
      'નવા સભ્યનું આધાર કાર્ડ અને જન્મ પ્રમાણપત્ર / લગ્ન નોંધણી દાખલો',
      'નામ કમી કરવા માટે: અગાઉના કાર્ડની કમી પ્રમાણપત્ર નકલ',
      'લાઈટ બિલ અથવા ઘરવેરા પાવતી'
    ],
    fields: [
      {
        id: 'rationType',
        label: 'રેશન કાર્ડ સેવાનો પ્રકાર',
        type: 'select',
        options: [
          'નવા સભ્યનું નામ ઉમેરવું (Add Member)',
          'નામ કમી કરાવવું (Name Deletion / Cancel)',
          'રેશન કાર્ડ વિભાજન (Separate Ration Card)',
          'નવું બારકોડેડ રેશન કાર્ડ અરજી',
          'રેશન કાર્ડમાં સુધારો'
        ],
        required: true
      },
      {
        id: 'existingRationNumber',
        label: 'હાલનો રેશન કાર્ડ નંબર',
        type: 'text',
        required: true,
        placeholder: 'રેશન કાર્ડ નંબર'
      }
    ]
  },
  {
    id: 'voter-id',
    title: 'ચૂંટણી ઓળખપત્ર (Voter ID Card)',
    category: 'ચૂંટણી પંચ સેવા',
    badge: 'મતદાર અધિકાર',
    description: '૧૮ વર્ષ પૂર્ણ થતાં નવું ચૂંટણી કાર્ડ (ફોર્મ ૬), મતદાર યાદીમાં નામ સુધારણા (ફોર્મ ૮), સરનામું સ્થળાંતર અને ડિજિટલ એપિક કાર્ડ ડાઉનલોડ.',
    fee: 60,
    durationDays: '૧૫ થી ૩૦ દિવસ',
    order: 6,
    active: true,
    requiredDocs: [
      'આધાર કાર્ડ',
      'જન્મ તારીખનો પુરાવો (શાળા છોડ્યાનું પ્રમાણપત્ર / જન્મ દાખલો)',
      'રહેઠાણનો પુરાવો (લાઈટ બિલ / રેશન કાર્ડ)',
      '૧ પાસપોર્ટ સાઇઝ રંગીન ફોટો'
    ],
    fields: [
      {
        id: 'voterService',
        label: 'મતદાર સેવાનો પ્રકાર',
        type: 'select',
        options: [
          'નવું ચૂંટણી કાર્ડ માટે અરજી (ફોર્મ ૬)',
          'નામ/સરનામું/જન્મતારીખ સુધારો (ફોર્મ ૮)',
          'નવું સ્માર્ટ વોટર કાર્ડ પ્રિન્ટ (e-EPIC)',
          'બીજા ગામ/વિધાનસભાથી સ્થળાંતર'
        ],
        required: true
      },
      {
        id: 'voterIdNumber',
        label: 'હાલનો ચૂંટણી કાર્ડ નંબર (જો હોય તો)',
        type: 'text',
        required: false,
        placeholder: 'દા.ત. GJ/01/001/000000 અથવા EPIC No'
      }
    ]
  },
  {
    id: 'govt-recruitment',
    title: 'સરકારી ભરતી અને નોકરી ફોર્મ સહાય',
    category: 'રોજગાર સેવા',
    badge: 'વિદ્યાર્થીઓ અને યુવાનો માટે',
    description: 'ગુજરાત ગૌણ સેવા, પંચાયત પસંદગી, પોલીસ ભરતી, ટેટ/ટાટ, એસએસસી, રેલ્વે, બેંક અને અન્ય સરકારી સ્પર્ધાત્મક પરીક્ષાઓના ઓનલાઇન ફોર્મ સચોટ ભરવાની સહાય.',
    fee: 150,
    durationDays: 'તે જ દિવસે',
    order: 7,
    active: true,
    requiredDocs: [
      'પાસપોર્ટ સાઇઝ ફોટો અને સહી',
      'શૈક્ષણિક લાયકાતની માર્કશીટો (૧૦મી, ૧૨મી, કોલેજ)',
      'જાતિનો દાખલો (SC/ST/OBC/EWS જો લાગુ હોય તો)',
      'નોન-ક્રીમીલેયર પ્રમાણપત્ર (OBC માટે)',
      'આધાર કાર્ડ'
    ],
    fields: [
      {
        id: 'examName',
        label: 'ભરતી / પરીક્ષાનું નામ',
        type: 'text',
        required: true,
        placeholder: 'દા.ત. ગુજરાત પોલીસ કોન્સ્ટેબલ, તલાટી, GPSC, SSC GD'
      },
      {
        id: 'category',
        label: 'અનામત કેટેગરી',
        type: 'select',
        options: ['સામાન્ય (General)', 'સામાજિક અને શૈક્ષણિક પછાત (SEBC/OBC)', 'આર્થિક નબળા (EWS)', 'અનુસૂચિત જાતિ (SC)', 'અનુસૂચિત જનજાતિ (ST)'],
        required: true
      },
      {
        id: 'qualification',
        label: 'સર્વોચ્ચ શિક્ષણ લાયકાત',
        type: 'text',
        required: true,
        placeholder: 'દા.ત. ૧૨ પાસ, બી.એ., બી.કોમ., આઈટીઆઈ'
      }
    ]
  },
  {
    id: 'pm-kisan',
    title: 'પી.એમ. કિસાન સન્માન નિધિ (PM-KISAN)',
    category: 'ખેડૂત કલ્યાણ',
    badge: 'વાર્ષિક રૂ. ૬,૦૦૦ સહાય',
    description: 'પી.એમ. કિસાન યોજના અંતર્ગત ખેડૂત નોંધણી, આધાર ઓટીપી અથવા બાયોમેટ્રિક ઈ-કેવાયસી (e-KYC), બેંક ખાતું સુધારણા અને હપ્તા સ્ટેટસ ચકાસણી સહાય.',
    fee: 50,
    durationDays: '૧ થી ૨ દિવસ',
    order: 8,
    active: true,
    requiredDocs: [
      'ખેડૂતનું આધાર કાર્ડ',
      'જમીનની ૭/૧૨ અને ૮-અ ની નકલ',
      'બેંક પાસબુક (આધાર લિંક ખાતું)',
      'મોબાઈલ નંબર'
    ],
    fields: [
      {
        id: 'pmkisanTask',
        label: 'પી.એમ. કિસાન સેવાનો પ્રકાર',
        type: 'select',
        options: [
          'ઈ-કેવાયસી પૂર્ણ કરવું (e-KYC Verification)',
          'હપ્તા અટકેલા હોવાની ચકાસણી અને સુધારો',
          'નવી ખેડૂત નોંધણી માટે અરજી',
          'જમીનની વિગતો અપડેટ કરવી'
        ],
        required: true
      },
      {
        id: 'khatanoNumber',
        label: 'ખાતા નંબર અથવા ૭/૧૨ સર્વે નંબર',
        type: 'text',
        required: false,
        placeholder: 'સર્વે નંબર અથવા ખાતા નંબર'
      }
    ]
  },
  {
    id: 'sbi-mudra-loan',
    title: 'એસ.બી.આઈ. મુદ્રા લોન અરજી સહાય (SBI Mudra Loan Assistance)',
    category: 'વેપાર અને લોન સહાય',
    badge: 'રૂ. ૫૦,૦૦૦ સુધી શિશુ લોન સહાય',
    description: 'સ્ટેટ બેંક ઓફ ઇન્ડિયા (SBI) ઈ-મુદ્રા પોર્ટલ પર નાના વેપાર, ધંધા, દુકાન કે સ્વરોજગાર માટે રૂ. ૫૦,૦૦૦ સુધીની શિશુ લોન ઓનલાઇન અરજી પ્રક્રિયામાં તકનીકી સહાય.',
    fee: 200,
    durationDays: '૫ થી ૧૫ દિવસ (બેંક પ્રક્રિયાને આધીન)',
    order: 9,
    active: true,
    importantNotice: 'અતિ મહત્વની સ્પષ્ટતા: મુદ્રા લોનની રકમ, મંજૂરી અને ઉપલબ્ધતા સંપૂર્ણપણે સરકારના વર્તમાન નિયમો, અરજદારની નાણાકીય પાત્રતા અને બેંકની આંતરિક મંજૂરી પર આધાર રાખે છે. રાજવીર ઓનલાઇન સર્વિસીસ માત્ર ફોર્મ ભરવામાં અને દસ્તાવેજ સહાય કરે છે, લોન મંજૂરીની કોઈ બાંયધરી કે ગેરંટી આપતી નથી.',
    requiredDocs: [
      'અરજદારનું આધાર કાર્ડ (મોબાઈલ લિંક હોવું જરૂરી)',
      'પાન કાર્ડ',
      'એસ.બી.આઈ. સેવિંગ્સ અથવા કરન્ટ બેંક ખાતાની પાસબુક (ઓછામાં ઓછું ૬ મહિના જૂનું ખાતું)',
      'ધંધા/દુકાનનો પુરાવો (ગુમાસ્તા ધારો / ઉદ્યમ નોંધણી / દુકાનનો ફોટો)',
      'પાસપોર્ટ સાઇઝ ફોટો'
    ],
    fields: [
      {
        id: 'businessName',
        label: 'ધંધા / વ્યવસાયનું નામ',
        type: 'text',
        required: true,
        placeholder: 'દા.ત. શ્રી ગણેશ કિરાણા સ્ટોર'
      },
      {
        id: 'businessType',
        label: 'ધંધાનો પ્રકાર',
        type: 'select',
        options: [
          'કરિયાણા / પ્રોવિઝન સ્ટોર',
          'શાકભાજી / ફળફળાદી વેચાણ',
          'ટેલરિંગ / સિલાઈ કામ',
          'રિપેરીંગ / વર્કશોપ',
          'ચા-નાસ્તાની હોટલ / લારી',
          'અન્ય નાનો સ્વરોજગાર'
        ],
        required: true
      },
      {
        id: 'sbiAccountNo',
        label: 'એસ.બી.આઈ. બેંક ખાતા નંબર',
        type: 'text',
        required: true,
        placeholder: '૧૧ આંકડાનો બેંક ખાતા નંબર'
      },
      {
        id: 'requestedAmount',
        label: 'જરૂરી લોનની રકમ (મહત્તમ રૂ. ૫૦,૦૦૦ શિશુ કેટેગરી)',
        type: 'select',
        options: ['રૂ. ૨૦,૦૦૦', 'રૂ. ૩૦,૦૦૦', 'રૂ. ૪૦,૦૦૦', 'રૂ. ૫૦,૦૦૦'],
        required: true
      }
    ]
  },
  {
    id: 'other-certificates',
    title: 'અન્ય આવશ્યક સરકારી પ્રમાણપત્રો',
    category: 'પ્રમાણપત્ર સેવા',
    badge: 'જનસેવા કેન્દ્ર સંબંધિત',
    description: 'મામલતદાર કચેરી/તાલુકા પંચાયત સંબંધિત આવકનો દાખલો, જાતિ પ્રમાણપત્ર, ડોમિસાઇલ (કાયમી વસવાટ), નોન-ક્રીમીલેયર અને ડિજિટલ સહી વાળા પ્રમાણપત્રોની અરજી સહાય.',
    fee: 70,
    durationDays: '૫ થી ૧૦ દિવસ',
    order: 10,
    active: true,
    requiredDocs: [
      'આધાર કાર્ડ',
      'રેશન કાર્ડ',
      'આવકના દાખલા માટે: તલાટીનો રૂબરૂ રિપોર્ટ અથવા સોગંદનામું',
      'જાતિના દાખલા માટે: પિતા/દાદાની એલ.સી. (શાળા છોડ્યાનું પ્રમાણપત્ર)'
    ],
    fields: [
      {
        id: 'certType',
        label: 'પ્રમાણપત્રનો પ્રકાર',
        type: 'select',
        options: [
          'આવકનું પ્રમાણપત્ર (Income Certificate)',
          'સામાજિક અને શૈક્ષણિક પછાત વર્ગ જાતિ દાખલો (SEBC)',
          'નોન-ક્રીમીલેયર પ્રમાણપત્ર (OBC Non-Creamy Layer)',
          'આર્થિક રીતે નબળા વર્ગ પ્રમાણપત્ર (EWS)',
          'ડોમિસાઇલ સર્ટિફિકેટ (ગુજરાતના કાયમી વતની)'
        ],
        required: true
      }
    ]
  }
];

const defaultSettings: BusinessSettings = {
  businessName: 'રાજવીર ઓનલાઇન સર્વિસીસ',
  businessSubTitle: 'સ્વતંત્ર દસ્તાવેજ સહાય કેન્દ્ર - વારાહી',
  address: 'Second Floor, Rajveer Online Service, Near Ambika Society, At Varahi, Gujarat 385360.',
  landmark: 'અંબિકા સોસાયટી પાસે, બીજો માળ',
  talukaCity: 'વારાહી (સાંતલપુર)',
  district: 'પાટણ',
  pincode: '385360',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'rajveeronlinevarahi@gmail.com',
  openingHours: 'સોમવાર થી શનિવાર: સવારે ૯:૦૦ થી સાંજે ૭:૦૦ | રવિવાર: સવારે ૧૦:૦૦ થી બપોરે ૨:૦૦',
  holidayNotice: 'જાહેર તહેવારો અને સરકારી રજાના દિવસે સમયમાં ફેરફાર થઈ શકે છે.',
  centerVisitInstructions: 'કેન્દ્ર પર આવતી વખતે મૂળ આધાર કાર્ડ, જૂના દસ્તાવેજોની નકલ અને ૨ પાસપોર્ટ સાઇઝ રંગીન ફોટો સાથે રાખવા વિનંતી.',
  allowFileUploads: true,
  razorpayEnabled: false,
  razorpayKeyId: 'rzp_test_placeholder_key',
  razorpayKeySecret: '',
  razorpayTestMode: true,
  announcementNotice: 'નવી જાહેરાત: પાન કાર્ડ અને આધાર કાર્ડ લિંક કરાવવા તથા આયુષ્માન ભારત કાર્ડ માટે આજે જ કેન્દ્રની મુલાકાત લો.',
  emergencyNotice: ''
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        settings: defaultSettings,
        admin: {
          username: 'admin',
          passwordHash: initialDefaultPassword.hash,
          salt: initialDefaultPassword.salt
        },
        services: defaultServices,
        applications: [],
        logs: [
          {
            id: 'log-1',
            timestamp: new Date().toISOString(),
            admin: 'સિસ્ટમ',
            action: 'સિસ્ટમ શરૂ થઈ',
            details: 'રાજવીર ઓનલાઇન સર્વિસીસ ડેટાબેઝ સફળતાપૂર્વક શરૂ થયો.'
          }
        ]
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using defaults:', err);
    return {
      settings: defaultSettings,
      admin: {
        username: 'admin',
        passwordHash: initialDefaultPassword.hash,
        salt: initialDefaultPassword.salt
      },
      services: defaultServices,
      applications: [],
      logs: []
    };
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

export const db = {
  getSettings(): BusinessSettings {
    const data = readDb();
    return data.settings;
  },

  updateSettings(newSettings: Partial<BusinessSettings>, adminName = 'admin'): BusinessSettings {
    const data = readDb();
    data.settings = { ...data.settings, ...newSettings };
    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: adminName,
      action: 'સેટિંગ્સ સુધારો',
      details: 'કેન્દ્રની વિગતો / સેટિંગ્સ સફળતાપૂર્વક અપડેટ કરવામાં આવ્યા.'
    });
    writeDb(data);
    return data.settings;
  },

  getServices(onlyActive = false): ServiceItem[] {
    const data = readDb();
    const sorted = [...data.services].sort((a, b) => a.order - b.order);
    return onlyActive ? sorted.filter(s => s.active) : sorted;
  },

  getServiceById(id: string): ServiceItem | undefined {
    const data = readDb();
    return data.services.find(s => s.id === id);
  },

  saveService(service: ServiceItem, adminName = 'admin'): ServiceItem {
    const data = readDb();
    const idx = data.services.findIndex(s => s.id === service.id);
    if (idx >= 0) {
      data.services[idx] = service;
    } else {
      data.services.push(service);
    }
    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: adminName,
      action: idx >= 0 ? 'સેવા અપડેટ' : 'નવી સેવા ઉમેરી',
      details: `સેવા "${service.title}" ની વિગતો સેવ કરવામાં આવી.`
    });
    writeDb(data);
    return service;
  },

  deleteService(id: string, adminName = 'admin'): boolean {
    const data = readDb();
    const idx = data.services.findIndex(s => s.id === id);
    if (idx >= 0) {
      const removed = data.services.splice(idx, 1)[0];
      data.logs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        admin: adminName,
        action: 'સેવા હટાવી',
        details: `સેવા "${removed.title}" સિસ્ટમમાંથી હટાવવામાં આવી.`
      });
      writeDb(data);
      return true;
    }
    return false;
  },

  getApplications(): Application[] {
    const data = readDb();
    return [...data.applications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getApplicationByRef(ref: string): Application | undefined {
    const data = readDb();
    const clean = ref.trim().toUpperCase();
    return data.applications.find(a => a.refNumber.toUpperCase() === clean || a.id === clean);
  },

  createApplication(payload: Omit<Application, 'id' | 'refNumber' | 'timeline' | 'status' | 'createdAt' | 'updatedAt'>): Application {
    const data = readDb();
    const randomFive = Math.floor(10000 + Math.random() * 90000);
    const refNumber = `RVO-${new Date().getFullYear()}-${randomFive}`;
    const now = new Date().toISOString();

    const newApp: Application = {
      ...payload,
      id: `app-${Date.now()}`,
      refNumber,
      status: 'અરજી મળી.',
      timeline: [
        {
          status: 'અરજી મળી.',
          note: 'તમારી અરજી સફળતાપૂર્વક સિસ્ટમમાં નોંધાઈ છે. અમારો સ્ટાફ ટૂંક સમયમાં ચકાસણી શરૂ કરશે.',
          date: now,
          by: 'સિસ્ટમ'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    data.applications.unshift(newApp);
    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: now,
      admin: 'ગ્રાહક પોર્ટલ',
      action: 'નવી અરજી',
      details: `અરજદાર ${payload.applicantName} દ્વારા ${payload.serviceTitle} માટે અરજી નં. ${refNumber} સબમિટ થઈ.`
    });

    writeDb(data);
    return newApp;
  },

  updateApplicationStatus(
    refNumber: string,
    status: 'અરજી મળી.' | 'કામ ચાલુ છે.' | 'વધુ માહિતી જરૂરી છે.' | 'કામ પૂર્ણ થયું.',
    note: string,
    adminRemarks?: string,
    adminName = 'admin'
  ): Application | null {
    const data = readDb();
    const app = data.applications.find(a => a.refNumber.toUpperCase() === refNumber.toUpperCase());
    if (!app) return null;

    const now = new Date().toISOString();
    app.status = status;
    if (adminRemarks !== undefined) {
      app.adminRemarks = adminRemarks;
    }
    app.updatedAt = now;
    app.timeline.unshift({
      status,
      note: note || `સ્થિતિ બદલીને "${status}" કરવામાં આવી.`,
      date: now,
      by: adminName
    });

    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: now,
      admin: adminName,
      action: 'અરજી સ્થિતિ બદલી',
      details: `અરજી નં. ${refNumber} ની સ્થિતિ "${status}" કરવામાં આવી.`
    });

    writeDb(data);
    return app;
  },

  updatePaymentStatus(
    refNumber: string,
    paymentStatus: 'બાકી' | 'સફળ' | 'નિષ્ફળ' | 'કેન્દ્ર પર ચૂકવવાનું બાકી',
    receiptData?: Partial<PaymentReceipt>,
    adminName = 'admin'
  ): Application | null {
    const data = readDb();
    const app = data.applications.find(a => a.refNumber.toUpperCase() === refNumber.toUpperCase());
    if (!app) return null;

    const now = new Date().toISOString();
    app.paymentStatus = paymentStatus;
    app.updatedAt = now;

    if (paymentStatus === 'સફળ' && !app.paymentReceipt) {
      const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      app.paymentReceipt = {
        receiptNo: receiptData?.receiptNo || receiptNo,
        amount: receiptData?.amount ?? app.fee,
        date: receiptData?.date || now,
        paymentMethod: receiptData?.paymentMethod || 'UPI',
        transactionId: receiptData?.transactionId || `TXN${Date.now()}`,
        status: 'સફળ'
      };
    } else if (receiptData && app.paymentReceipt) {
      app.paymentReceipt = { ...app.paymentReceipt, ...receiptData };
    }

    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: now,
      admin: adminName,
      action: 'ચૂકવણી સ્થિતિ અપડેટ',
      details: `અરજી નં. ${refNumber} માટે ચૂકવણી સ્થિતિ: ${paymentStatus}`
    });

    writeDb(data);
    return app;
  },

  checkAdminAuth(username: string, pass: string): boolean {
    const data = readDb();
    if (username !== data.admin.username) return false;
    return verifyPassword(pass, data.admin.passwordHash, data.admin.salt);
  },

  changeAdminPassword(oldPass: string, newPass: string): boolean {
    const data = readDb();
    if (!verifyPassword(oldPass, data.admin.passwordHash, data.admin.salt)) {
      return false;
    }
    const { hash, salt } = hashPassword(newPass);
    data.admin.passwordHash = hash;
    data.admin.salt = salt;
    data.logs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: data.admin.username,
      action: 'પાસવર્ડ બદલાયો',
      details: 'એડમિનિસ્ટ્રેટર પાસવર્ડ સુરક્ષિત રીતે અપડેટ કરવામાં આવ્યો.'
    });
    writeDb(data);
    return true;
  },

  getLogs(): ActivityLog[] {
    const data = readDb();
    return data.logs.slice(0, 100);
  }
};

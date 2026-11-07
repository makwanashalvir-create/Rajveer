export interface ServiceField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'number';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

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
  fields: ServiceField[];
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

export interface TrackedApplication {
  refNumber: string;
  serviceTitle: string;
  applicantNameMasked: string;
  mobileMasked: string;
  cityOrVillage: string;
  status: 'અરજી મળી.' | 'કામ ચાલુ છે.' | 'વધુ માહિતી જરૂરી છે.' | 'કામ પૂર્ણ થયું.';
  fee: number;
  paymentStatus: 'બાકી' | 'સફળ' | 'નિષ્ફળ' | 'કેન્દ્ર પર ચૂકવવાનું બાકી';
  paymentReceipt?: PaymentReceipt;
  submissionMethod: 'physical_center' | 'online_upload';
  documentsCount: number;
  timeline: StatusUpdate[];
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
  razorpayKeySecret?: string;
  razorpayTestMode: boolean;
  announcementNotice: string;
  emergencyNotice: string;
}

export interface AdminStats {
  total: number;
  received: number;
  inProgress: number;
  moreInfoNeeded: number;
  completed: number;
  totalFeesCollected: number;
  todayCount: number;
  totalServices: number;
  activeServices: number;
}

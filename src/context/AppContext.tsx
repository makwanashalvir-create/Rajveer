import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessSettings, ServiceItem, PaymentReceipt } from '../types.ts';

interface ReceiptModalData {
  receipt: PaymentReceipt;
  refNumber: string;
  applicantName: string;
  serviceTitle: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  settings: BusinessSettings | null;
  services: ServiceItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Modals & Active Views
  activeView: 'home' | 'services' | 'track' | 'contact' | 'admin';
  setActiveView: (view: 'home' | 'services' | 'track' | 'contact' | 'admin') => void;
  
  applyModalOpen: boolean;
  setApplyModalOpen: (open: boolean) => void;
  selectedServiceForApply: ServiceItem | null;
  openApplyModal: (service?: ServiceItem | string) => void;
  
  trackModalOpen: boolean;
  setTrackModalOpen: (open: boolean) => void;
  trackingRef: string;
  setTrackingRef: (ref: string) => void;
  openTrackModal: (ref?: string) => void;
  
  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  paymentRefNumber: string;
  paymentFee: number;
  openPaymentModal: (refNumber: string, fee: number) => void;
  
  receiptModalOpen: boolean;
  setReceiptModalOpen: (open: boolean) => void;
  receiptData: ReceiptModalData | null;
  openReceiptModal: (data: ReceiptModalData) => void;
  
  serviceDetailModal: ServiceItem | null;
  setServiceDetailModal: (service: ServiceItem | null) => void;
  
  // Admin Auth
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  adminLogout: () => void;
  
  // Toast notifications in Gujarati
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState<'home' | 'services' | 'track' | 'contact' | 'admin'>('home');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedServiceForApply, setSelectedServiceForApply] = useState<ServiceItem | null>(null);

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackingRef, setTrackingRef] = useState('');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [paymentFee, setPaymentFee] = useState(0);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptModalData | null>(null);

  const [serviceDetailModal, setServiceDetailModal] = useState<ServiceItem | null>(null);

  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    return sessionStorage.getItem('rajveer_admin_token');
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setAdminToken = (token: string | null) => {
    if (token) {
      sessionStorage.setItem('rajveer_admin_token', token);
    } else {
      sessionStorage.removeItem('rajveer_admin_token');
    }
    setAdminTokenState(token);
  };

  const adminLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      }).catch(() => {});
    }
    setAdminToken(null);
    showToast('એડમિન લૉગઆઉટ સફળ થયું.', 'info');
  };

  const refreshData = async () => {
    try {
      const [configRes, servicesRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/services')
      ]);

      if (configRes.ok) {
        const configJson = await configRes.json();
        if (configJson.success) {
          setSettings(configJson.data);
        }
      }

      if (servicesRes.ok) {
        const servicesJson = await servicesRes.json();
        if (servicesJson.success) {
          setServices(servicesJson.data);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const openApplyModal = (service?: ServiceItem | string) => {
    if (typeof service === 'string') {
      const found = services.find((s) => s.id === service);
      setSelectedServiceForApply(found || null);
    } else if (service) {
      setSelectedServiceForApply(service);
    } else {
      setSelectedServiceForApply(services[0] || null);
    }
    setApplyModalOpen(true);
  };

  const openTrackModal = (ref?: string) => {
    if (ref) {
      setTrackingRef(ref);
    }
    setTrackModalOpen(true);
  };

  const openPaymentModal = (refNumber: string, fee: number) => {
    setPaymentRefNumber(refNumber);
    setPaymentFee(fee);
    setPaymentModalOpen(true);
  };

  const openReceiptModal = (data: ReceiptModalData) => {
    setReceiptData(data);
    setReceiptModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        services,
        loading,
        refreshData,
        activeView,
        setActiveView,
        applyModalOpen,
        setApplyModalOpen,
        selectedServiceForApply,
        openApplyModal,
        trackModalOpen,
        setTrackModalOpen,
        trackingRef,
        setTrackingRef,
        openTrackModal,
        paymentModalOpen,
        setPaymentModalOpen,
        paymentRefNumber,
        paymentFee,
        openPaymentModal,
        receiptModalOpen,
        setReceiptModalOpen,
        receiptData,
        openReceiptModal,
        serviceDetailModal,
        setServiceDetailModal,
        adminToken,
        setAdminToken,
        adminLogout,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

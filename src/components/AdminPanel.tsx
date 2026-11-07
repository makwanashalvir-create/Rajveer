import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Application, ServiceItem, BusinessSettings, ActivityLog, AdminStats } from '../types.ts';
import { 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Layers, 
  History, 
  KeyRound, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  Download, 
  CreditCard,
  Building,
  Save,
  Check,
  X
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { adminToken, setAdminToken, adminLogout, showToast, refreshData, openReceiptModal } = useApp();

  // Login form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'stats' | 'apps' | 'services' | 'settings' | 'logs' | 'password'>('stats');

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [adminServices, setAdminServices] = useState<ServiceItem[]>([]);
  const [adminSettings, setAdminSettings] = useState<BusinessSettings | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // App Filter & Search
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected App for Detail / Status Update Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<'અરજી મળી.' | 'કામ ચાલુ છે.' | 'વધુ માહિતી જરૂરી છે.' | 'કામ પૂર્ણ થયું.'>('અરજી મળી.');
  const [statusNote, setStatusNote] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Payment Status update state
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [markPaidMethod, setMarkPaidMethod] = useState<'કેન્દ્ર પર રોકડ' | 'UPI' | 'નેટ બેંકિંગ'>('કેન્દ્ર પર રોકડ');

  // Change Password form
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChanging, setPassChanging] = useState(false);

  // Edit Service Modal
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [savingService, setSavingService] = useState(false);

  useEffect(() => {
    if (adminToken) {
      loadAdminData();
    }
  }, [adminToken, activeTab]);

  const loadAdminData = async () => {
    if (!adminToken) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };

      if (activeTab === 'stats') {
        const res = await fetch('/api/admin/stats', { headers });
        const json = await res.json();
        if (json.success) setStats(json.data);
      } else if (activeTab === 'apps') {
        let url = `/api/admin/applications?status=${statusFilter}&serviceId=${serviceFilter}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url, { headers });
        const json = await res.json();
        if (json.success) setApplications(json.data);
      } else if (activeTab === 'services') {
        const res = await fetch('/api/admin/services', { headers });
        const json = await res.json();
        if (json.success) setAdminServices(json.data);
      } else if (activeTab === 'settings') {
        const res = await fetch('/api/admin/settings', { headers });
        const json = await res.json();
        if (json.success) setAdminSettings(json.data);
      } else if (activeTab === 'logs') {
        const res = await fetch('/api/admin/logs', { headers });
        const json = await res.json();
        if (json.success) setLogs(json.data);
      }
    } catch (err) {
      console.error(err);
      showToast('એડમિન ડેટા લોડ કરવામાં ક્ષતિ આવી.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAdminToken(json.token);
        setPassword('');
        showToast('એડમિન લૉગિન સફળ થયું!', 'success');
        setActiveTab('stats');
      } else {
        showToast(json.message || 'ખોટું યુઝરનેમ અથવા પાસવર્ડ.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('સર્વર સાથે કનેક્શન થઈ શક્યું નથી.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.refNumber}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote,
          adminRemarks: adminRemarks
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedApp(json.data);
        showToast('અરજી સ્થિતિ સફળતાપૂર્વક બદલાઈ ગઈ છે!', 'success');
        loadAdminData();
      } else {
        showToast(json.message || 'સ્થિતિ બદલવામાં નિષ્ફળતા.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('સ્થિતિ અપડેટ કરવામાં ક્ષતિ આવી.', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleUpdatePayment = async (status: 'સફળ' | 'બાકી' | 'નિષ્ફળ') => {
    if (!selectedApp) return;
    setPaymentUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.refNumber}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          paymentStatus: status,
          method: markPaidMethod,
          amount: selectedApp.fee
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedApp(json.data);
        showToast(`ચૂકવણી સ્થિતિ "${status}" કરવામાં આવી.`, 'success');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
      showToast('ચૂકવણી અપડેટ કરવામાં ક્ષતિ આવી.', 'error');
    } finally {
      setPaymentUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ સરખા નથી.', 'error');
      return;
    }
    setPassChanging(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          currentPassword: currPass,
          newPassword: newPass
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે!', 'success');
        setCurrPass('');
        setNewPass('');
        setConfirmPass('');
      } else {
        showToast(json.message || 'પાસવર્ડ બદલવામાં ભૂલ આવી.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('સર્વર સાથે જોડાણ થઈ શક્યું નથી.', 'error');
    } finally {
      setPassChanging(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSettings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(adminSettings)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('કેન્દ્રની સેટિંગ્સ સફળતાપૂર્વક સેવ થઈ!', 'success');
        refreshData();
      } else {
        showToast(json.message || 'સેટિંગ્સ સેવ કરવામાં ભૂલ આવી.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('સેટિંગ્સ સેવ કરવામાં ક્ષતિ આવી.', 'error');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSavingService(true);
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(editingService)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('સેવા સફળતાપૂર્વક સેવ થઈ!', 'success');
        setEditingService(null);
        loadAdminData();
        refreshData();
      }
    } catch (err) {
      console.error(err);
      showToast('સેવા સેવ કરવામાં ભૂલ આવી.', 'error');
    } finally {
      setSavingService(false);
    }
  };

  // IF NOT LOGGED IN: SHOW ADMIN LOGIN CARD
  if (!adminToken) {
    return (
      <section className="py-16 sm:py-24 bg-slate-100 min-h-[70vh] flex items-center justify-center px-4 no-print">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-blue-950">એડમિનિસ્ટ્રેટર લૉગિન</h2>
            <p className="text-xs text-slate-500 mt-1">
              રાજવીર ઓનલાઇન સર્વિસીસ અધિકૃત સ્ટાફ એક્સેસ
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                યુઝરનેમ (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                પાસવર્ડ (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="એડમિન પાસવર્ડ દાખલ કરો"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                * ડિફોલ્ટ પાસવર્ડ: admin123 (પ્રથમ લૉગિન બાદ બદલી શકાય છે)
              </span>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold text-sm transition-colors cursor-pointer shadow-md"
            >
              {loginLoading ? 'ચકાસણી ચાલુ છે...' : 'સુરક્ષિત લૉગિન કરો'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              સુરક્ષા નિયમ: માત્ર અધિકૃત કર્મચારીઓ માટે જ માન્ય
            </span>
          </div>
        </div>
      </section>
    );
  }

  // LOGGED IN: FULL ADMIN DASHBOARD
  return (
    <section className="py-8 bg-slate-100 min-h-screen text-slate-900 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Admin Header Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-950">રાજવીર સર્વિસીસ એડમિન પોર્ટલ</h2>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ● લૉગિન સક્રિય (એડમિન)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('password');
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>પાસવર્ડ બદલો</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>લૉગઆઉટ</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ડેશબોર્ડ અને આંકડા</span>
          </button>

          <button
            onClick={() => setActiveTab('apps')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ગ્રાહક અરજીઓ મેનેજ કરો</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>સેવાઓ અને ફી સેટિંગ્સ</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>કેન્દ્ર માહિતી અને પેમેન્ટ કી</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>એક્ટિવિટી લૉગ્સ</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Apps */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 uppercase">કુલ અરજીઓ</span>
                <div className="text-3xl font-black text-blue-950 mt-1">{stats?.total ?? 0}</div>
                <span className="text-[11px] text-slate-400 mt-1 block">આજની અરજીઓ: {stats?.todayCount ?? 0}</span>
              </div>

              {/* Pending / In progress */}
              <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs">
                <span className="text-xs font-bold text-amber-700 uppercase">કામ ચાલુ / બાકી</span>
                <div className="text-3xl font-black text-amber-900 mt-1">
                  {(stats?.received ?? 0) + (stats?.inProgress ?? 0)}
                </div>
                <span className="text-[11px] text-amber-600 mt-1 block">
                  નવી: {stats?.received ?? 0} | પ્રક્રિયામાં: {stats?.inProgress ?? 0}
                </span>
              </div>

              {/* More info needed */}
              <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-rose-700 uppercase">વધુ માહિતી જરૂરી</span>
                <div className="text-3xl font-black text-rose-900 mt-1">{stats?.moreInfoNeeded ?? 0}</div>
                <span className="text-[11px] text-rose-600 mt-1 block">અધૂરા પુરાવા વાળી અરજીઓ</span>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-700 uppercase">કામ પૂર્ણ થયું</span>
                <div className="text-3xl font-black text-emerald-900 mt-1">{stats?.completed ?? 0}</div>
                <span className="text-[11px] text-emerald-700 mt-1 block font-bold">
                  કુલ ફી સંગ્રહ: ₹{stats?.totalFeesCollected ?? 0}
                </span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-blue-950">ઝડપી કાર્યો (Quick Actions)</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('apps');
                    setStatusFilter('અરજી મળી.');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs hover:bg-blue-100 cursor-pointer"
                >
                  નવી આવેલ અરજીઓ તપાસો ({stats?.received ?? 0})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('apps');
                    setStatusFilter('વધુ માહિતી જરૂરી છે.');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs hover:bg-rose-100 cursor-pointer"
                >
                  અધૂરા પુરાવા વાળી અરજીઓ ({stats?.moreInfoNeeded ?? 0})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  કેન્દ્રના નિયમો અને સૂચના બદલો
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS MANAGEMENT */}
        {activeTab === 'apps' && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search query input */}
                <div className="relative min-w-[200px] flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAdminData()}
                    placeholder="અરજદારનું નામ, ફોન કે RVO નંબર શોધો..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-blue-900"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="all">તમામ સ્થિતિ</option>
                  <option value="અરજી મળી.">અરજી મળી.</option>
                  <option value="કામ ચાલુ છે.">કામ ચાલુ છે.</option>
                  <option value="વધુ માહિતી જરૂરી છે.">વધુ માહિતી જરૂરી છે.</option>
                  <option value="કામ પૂર્ણ થયું.">કામ પૂર્ણ થયું.</option>
                </select>

                <button
                  onClick={loadAdminData}
                  className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 cursor-pointer"
                >
                  શોધો
                </button>
              </div>

              <span className="text-xs font-bold text-slate-500">
                કુલ દર્શાવેલ: {applications.length}
              </span>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3.5">અરજી નંબર</th>
                      <th className="p-3.5">અરજદારનું નામ</th>
                      <th className="p-3.5">મોબાઈલ</th>
                      <th className="p-3.5">સેવા</th>
                      <th className="p-3.5">દસ્તાવેજ રીત</th>
                      <th className="p-3.5">ચૂકવણી</th>
                      <th className="p-3.5">વર્તમાન સ્થિતિ</th>
                      <th className="p-3.5 text-right">ક્રિયા</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-blue-950">
                          {app.refNumber}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-900">
                          {app.applicantName}
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">
                          {app.mobile}
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">
                          {app.serviceTitle}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.submissionMethod === 'online_upload'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {app.submissionMethod === 'online_upload' ? 'અપલોડ' : 'રૂબરૂ'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.paymentStatus === 'સફળ'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            ₹{app.fee} ({app.paymentStatus})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'કામ પૂર્ણ થયું.'
                                ? 'bg-emerald-100 text-emerald-900'
                                : app.status === 'વધુ માહિતી જરૂરી છે.'
                                ? 'bg-rose-100 text-rose-900'
                                : app.status === 'કામ ચાલુ છે.'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setNewStatus(app.status);
                              setStatusNote('');
                              setAdminRemarks(app.adminRemarks || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 cursor-pointer"
                          >
                            વિગતો & સ્થિતિ
                          </button>
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          કોઈ અરજીઓ મળી નથી.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-blue-950">સેવાઓ અને નિર્ધારિત ફી સંચાલન</h3>
              <button
                onClick={() =>
                  setEditingService({
                    id: `srv-${Date.now()}`,
                    title: '',
                    category: 'સામાન્ય સેવા',
                    badge: '',
                    description: '',
                    fee: 50,
                    durationDays: '૫ થી ૭ દિવસ',
                    order: adminServices.length + 1,
                    active: true,
                    requiredDocs: ['આધાર કાર્ડની નકલ', 'પાસપોર્ટ સાઇઝ ફોટો'],
                    fields: []
                  })
                }
                className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>નવી સેવા ઉમેરો</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminServices.map((srv) => (
                <div key={srv.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">{srv.category}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        srv.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {srv.active ? 'સક્રિય' : 'નિષ્ક્રિય'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-blue-950">{srv.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>

                  <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
                    <span className="text-blue-900">સહાય ફી: ₹{srv.fee}</span>
                    <button
                      onClick={() => setEditingService(srv)}
                      className="text-xs text-blue-800 hover:text-blue-950 font-bold flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>સુધારો કરો</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CENTER SETTINGS & PAYMENT GATEWAY KEYS */}
        {activeTab === 'settings' && adminSettings && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-blue-950">કેન્દ્ર વિગતો અને પેમેન્ટ સેટિંગ્સ</h3>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>સેવ કરો</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">કેન્દ્રનું નામ</label>
                <input
                  type="text"
                  value={adminSettings.businessName}
                  onChange={(e) => setAdminSettings({ ...adminSettings, businessName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">સબટાઈટલ</label>
                <input
                  type="text"
                  value={adminSettings.businessSubTitle}
                  onChange={(e) => setAdminSettings({ ...adminSettings, businessSubTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">સરનામું</label>
                <input
                  type="text"
                  value={adminSettings.address}
                  onChange={(e) => setAdminSettings({ ...adminSettings, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">સંપર્ક ફોન નંબર</label>
                <input
                  type="text"
                  value={adminSettings.phone}
                  onChange={(e) => setAdminSettings({ ...adminSettings, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">વોટ્સએપ નંબર</label>
                <input
                  type="text"
                  value={adminSettings.whatsapp}
                  onChange={(e) => setAdminSettings({ ...adminSettings, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">કામના દિવસો અને સમય</label>
                <input
                  type="text"
                  value={adminSettings.openingHours}
                  onChange={(e) => setAdminSettings({ ...adminSettings, openingHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">કેન્દ્ર મુલાકાત સૂચના</label>
                <textarea
                  rows={2}
                  value={adminSettings.centerVisitInstructions}
                  onChange={(e) => setAdminSettings({ ...adminSettings, centerVisitInstructions: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">તાજી જાહેરાત (Announcement Banner)</label>
                <input
                  type="text"
                  value={adminSettings.announcementNotice}
                  onChange={(e) => setAdminSettings({ ...adminSettings, announcementNotice: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* RAZORPAY CONFIGURATION SECTION */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs text-blue-950 uppercase flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-800" />
                <span>Razorpay પેમેન્ટ ગેટવે કન્ફિગરેશન (Payment Credentials)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={adminSettings.razorpayKeyId}
                    onChange={(e) => setAdminSettings({ ...adminSettings, razorpayKeyId: e.target.value })}
                    placeholder="rzp_live_... અથવા rzp_test_..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Razorpay Key Secret</label>
                  <input
                    type="password"
                    value={adminSettings.razorpayKeySecret || ''}
                    onChange={(e) => setAdminSettings({ ...adminSettings, razorpayKeySecret: e.target.value })}
                    placeholder="ગુપ્ત કી દાખલ કરો"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.razorpayEnabled}
                    onChange={(e) => setAdminSettings({ ...adminSettings, razorpayEnabled: e.target.checked })}
                    className="rounded text-blue-900"
                  />
                  <span>ઓનલાઇન કાર્ડ/UPI પેમેન્ટ ગેટવે સક્રિય કરો</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={adminSettings.razorpayTestMode}
                    onChange={(e) => setAdminSettings({ ...adminSettings, razorpayTestMode: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span>ટેસ્ટ સેન્ડબોક્સ મોડ (Test Mode)</span>
                </label>
              </div>
            </div>
          </form>
        )}

        {/* TAB 5: AUDIT ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-base text-blue-950">સિસ્ટમ એક્ટિવિટી લૉગ્સ (Audit Trail)</h3>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-blue-950">[{log.action}]</span>{' '}
                    <span className="text-slate-700">{log.details}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">કર્તા: {log.admin}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {new Date(log.timestamp).toLocaleString('gu-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
            <h3 className="font-bold text-base text-blue-950">એડમિન પાસવર્ડ બદલો</h3>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">હાલનો પાસવર્ડ</label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">નવો પાસવર્ડ (ઓછામાં ઓછા ૬ અક્ષર)</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">નવો પાસવર્ડ કન્ફર્મ કરો</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={passChanging}
                className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                {passChanging ? 'બદલાઈ રહ્યો છે...' : 'પાસવર્ડ અપડેટ કરો'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODAL: VIEW APPLICATION DETAILS & UPDATE STATUS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base sm:text-lg">અરજી વિગત: {selectedApp.refNumber}</h3>
                <span className="text-xs text-amber-400">{selectedApp.serviceTitle}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-slate-800">
              {/* Applicant Info Section */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-blue-950 text-sm border-b border-slate-200 pb-1">
                  અરજદારની અંગત વિગતો:
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500">પૂરું નામ:</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedApp.applicantName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">મોબાઈલ નંબર:</span>
                    <p className="font-bold font-mono text-slate-900">{selectedApp.mobile}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">પિતા / પતિ:</span>
                    <p className="font-semibold">{selectedApp.fatherHusbandName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">ગામ / શહેર:</span>
                    <p className="font-semibold">{selectedApp.cityOrVillage}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">સરનામું:</span>
                    <p className="font-semibold">{selectedApp.address || '-'}</p>
                  </div>
                </div>

                {/* Custom service fields */}
                {Object.keys(selectedApp.customData || {}).length > 0 && (
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <span className="font-bold text-slate-700 block mb-1">સેવા વિશિષ્ટ જવાબો:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedApp.customData).map(([key, val]) => (
                        <div key={key}>
                          <span className="text-slate-500 capitalize">{key}:</span>
                          <p className="font-semibold">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Documents List with Authenticated Admin Download */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-blue-950 text-sm border-b border-slate-200 pb-1">
                  અપલોડ કરેલ દસ્તાવેજો ({selectedApp.documents?.length || 0}):
                </h4>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    {selectedApp.documents.map((doc) => (
                      <div key={doc.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">{doc.originalName}</span>
                          <span className="text-[10px] text-slate-400 block">
                            કદ: {(doc.size / 1024).toFixed(1)} KB | પ્રકાર: {doc.mimeType}
                          </span>
                        </div>
                        <a
                          href={`/api/admin/applications/${selectedApp.refNumber}/document/${doc.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-blue-900 text-white rounded-md text-[11px] font-bold hover:bg-blue-950 flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>ડાઉનલોડ / જુઓ</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 py-1">
                    કોઈ ઓનલાઇન ફાઇલ અપલોડ નથી. અરજદાર કેન્દ્ર પર રૂબરૂ મુલાકાત દ્વારા મૂળ દસ્તાવેજ આપશે.
                  </p>
                )}
              </div>

              {/* Payment Status & Receipts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-slate-500 block">ફી અને ચુકવણી સ્થિતિ:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-black text-blue-950">₹{selectedApp.fee}</span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {selectedApp.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdatePayment('સફળ')}
                    disabled={paymentUpdating || selectedApp.paymentStatus === 'સફળ'}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold cursor-pointer"
                  >
                    રોકડ/ચૂકવેલ માર્ક કરો
                  </button>
                  {selectedApp.paymentReceipt && (
                    <button
                      onClick={() =>
                        openReceiptModal({
                          receipt: selectedApp.paymentReceipt!,
                          refNumber: selectedApp.refNumber,
                          applicantName: selectedApp.applicantName,
                          serviceTitle: selectedApp.serviceTitle
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold cursor-pointer"
                    >
                      રસીદ જુઓ
                    </button>
                  )}
                </div>
              </div>

              {/* Status Update Form */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 space-y-3">
                <h4 className="font-bold text-amber-950 text-sm">અરજી સ્થિતિ બદલો (Update Status):</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">નવી સ્થિતિ પસંદ કરો:</label>
                    <select
                      value={newStatus}
                      onChange={(e: any) => setNewStatus(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 font-bold bg-white"
                    >
                      <option value="અરજી મળી.">અરજી મળી.</option>
                      <option value="કામ ચાલુ છે.">કામ ચાલુ છે.</option>
                      <option value="વધુ માહિતી જરૂરી છે.">વધુ માહિતી જરૂરી છે.</option>
                      <option value="કામ પૂર્ણ થયું.">કામ પૂર્ણ થયું.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">ટાઈમલાઈન નોંધ (Timeline Note):</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="દા.ત. ફોર્મ સરકારી પોર્ટલ પર ભરાઈ ગયું છે"
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    ગ્રાહકને દેખાતી અગત્યની નોંધ / રિમાર્ક (Admin Remarks):
                  </label>
                  <textarea
                    rows={2}
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="દા.ત. આધાર કાર્ડની નકલ ઝાંખી છે, કેન્દ્ર પર અસલ કાર્ડ લાવો..."
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={statusUpdating}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{statusUpdating ? 'અપડેટ થઈ રહ્યું છે...' : 'સ્થિતિ સેવ કરો'}</span>
                </button>
              </div>

            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                બંધ કરો
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">સેવા સંપાદન (Edit Service)</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">સેવાનું નામ</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">કેટેગરી</label>
                  <input
                    type="text"
                    required
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">સહાય ફી (રૂપિયા)</label>
                  <input
                    type="number"
                    required
                    value={editingService.fee}
                    onChange={(e) => setEditingService({ ...editingService, fee: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">સેવા વર્ણન</label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">જરૂરી દસ્તાવેજો (અલ્પવિરામથી અલગ કરો)</label>
                <textarea
                  rows={2}
                  value={editingService.requiredDocs.join(', ')}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      requiredDocs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={editingService.active}
                  onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                  className="rounded text-blue-900"
                />
                <label htmlFor="srv-active" className="font-bold text-slate-700">
                  આ સેવા વેબસાઇટ પર સક્રિય રાખો
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white font-bold cursor-pointer"
                >
                  સેવ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

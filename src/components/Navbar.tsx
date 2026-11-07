import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { FileText, Phone, Search, Menu, X, Shield, PlusCircle, MapPin, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, activeView, setActiveView, openApplyModal, openTrackModal, adminToken } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = settings?.phone || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  const handleNav = (view: 'home' | 'services' | 'track' | 'contact' | 'admin') => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      {/* Subtle India Flag Accent Header */}
      <div className="h-1.5 w-full bg-linear-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-100" />

      {/* Top Advisory Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">
              {settings?.businessName || 'રાજવીર ઓનલાઇન સર્વિસીસ'}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">સ્વતંત્ર ખાનગી દસ્તાવેજ સહાય કેન્દ્ર - વારાહી (પાટણ)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300">સમય: સવારે ૯:૦૦ થી સાંજે ૭:૦૦</span>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform border border-amber-500/30">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-950">
                  {settings?.businessName || 'રાજવીર ઓનલાઇન સર્વિસીસ'}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  વિશ્વાસપાત્ર સેવા
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {settings?.businessSubTitle || 'સરકારી યોજના અને ઓનલાઇન અરજી સહાય કેન્દ્ર'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'home'
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-900'
              }`}
            >
              મુખ્ય પૃષ્ઠ (હોમ)
            </button>

            <button
              onClick={() => handleNav('services')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'services'
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-900'
              }`}
            >
              તમામ સેવાઓ
            </button>

            <button
              onClick={() => openTrackModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-900 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-700" />
              <span>અરજી ટ્રેક કરો</span>
            </button>

            <button
              onClick={() => handleNav('contact')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeView === 'contact'
                  ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>કેન્દ્ર અને સંપર્ક</span>
            </button>

            <button
              onClick={() => handleNav('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeView === 'admin'
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="એડમિન પેનલ"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{adminToken ? 'એડમિન (સક્રિય)' : 'એડમિન લૉગિન'}</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-blue-400 bg-white text-slate-800 hover:text-blue-900 text-xs font-bold transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>હેલ્પલાઇન</span>
            </a>

            <button
              onClick={() => openApplyModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white font-bold text-sm shadow-md shadow-blue-950/20 hover:shadow-lg transition-all border border-blue-700 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>નવી અરજી કરો</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => openApplyModal()}
              className="px-3 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-xs flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>અરજી કરો</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="મેનુ ખોલો"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-3 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-semibold">📞 સહાય માટે સંપર્ક:</span>
            <a href={`tel:${cleanPhone}`} className="font-bold text-amber-950 underline">
              {phone}
            </a>
          </div>

          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeView === 'home' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>મુખ્ય પૃષ્ઠ (હોમ)</span>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => handleNav('services')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeView === 'services' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>તમામ સેવાઓ અને ફી યાદી</span>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openTrackModal();
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between text-blue-950 bg-blue-50/60 border border-blue-200"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-700" />
              <span>અરજીનું સ્ટેટસ તપાસો (ટ્રેકિંગ)</span>
            </div>
            <span className="text-blue-600 font-bold">શોધો</span>
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
              activeView === 'contact' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>વારાહી કેન્દ્રનું સરનામું અને સમય</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between text-slate-600 bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>{adminToken ? 'એડમિન ડેશબોર્ડ (સક્રિય)' : 'એડમિન લૉગિન'}</span>
            </div>
            <span className="text-slate-400">›</span>
          </button>
        </div>
      )}
    </header>
  );
};

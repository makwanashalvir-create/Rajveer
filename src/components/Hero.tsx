import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search, ShieldCheck, ArrowRight, CheckCircle, FileCheck, Users, Sparkles, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  const { openApplyModal, openTrackModal, setActiveView } = useApp();
  const [quickRef, setQuickRef] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      openTrackModal(quickRef.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-blue-950 via-slate-900 to-blue-950 text-white pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-blue-900/60">
      {/* Background Subtle Geometric Pattern & Glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Government assistance center badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>વારાહી (સાંતલપુર) સ્થિત વિશ્વસનીય સહાય કેન્દ્ર</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug">
              તમારી સરકારી અને દસ્તાવેજ સંબંધિત સેવાઓ{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-300 to-orange-400">
                હવે સરળતાથી!
              </span>
            </h1>

            {/* Short Gujarati Introduction */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              રાજવીર ઓનલાઇન સર્વિસીસ ખાતે પાન કાર્ડ, આધાર સુધારો, આયુષ્માન ભારત કાર્ડ, ચૂંટણી ઓળખપત્ર, રેશન કાર્ડ અને મુદ્રા લોન સહિતની તમામ સરકારી યોજનાઓની ઓનલાઇન અરજીમાં ઝડપી, સચોટ અને પારદર્શક સહાય મેળવો.
            </p>

            {/* Action Buttons: સેવા પસંદ કરો, અરજી કરો, સંપર્ક કરો */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => openApplyModal()}
                className="px-6 py-3.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>અરજી કરો</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveView('services');
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-base transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>સેવા પસંદ કરો</span>
              </button>

              <button
                onClick={() => {
                  setActiveView('contact');
                  window.scrollTo({ top: 1200, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>સંપર્ક કરો</span>
              </button>
            </div>

            {/* Quick Benefits Bullet Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>વાજબી અને નિર્ધારિત ફી</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>૧૦૦% સુરક્ષિત માહિતી</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <span>અનુભવી સહાયક સ્ટાફ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Status Tracking Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-900 border border-amber-500/30 relative">
              <div className="absolute -top-3 right-6 bg-linear-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
                ઓનલાઇન ટ્રેકિંગ
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-blue-950">અરજી સ્ટેટસ તપાસો</h3>
                  <p className="text-xs text-slate-600">અરજી નંબર દાખલ કરી લાઈવ સ્થિતિ જાણો</p>
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    અરજી સંદર્ભ નંબર (Application Reference No.)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={quickRef}
                      onChange={(e) => setQuickRef(e.target.value)}
                      placeholder="દા.ત. RVO-2026-12345"
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 text-sm font-medium uppercase transition-all bg-slate-50"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>તપાસો</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    * તમારી પહોંચ / રસીદમાં દર્શાવેલ RVO નંબર દાખલ કરો
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs text-slate-700 space-y-2">
                  <div className="font-semibold text-blue-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>કેન્દ્ર પર રૂબરૂ મુલાકાત સૂચના:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    અરજી કર્યા બાદ મૂળ દસ્તાવેજો ચકાસણી માટે વારાહી સ્થિત કેન્દ્ર પર લાવી શકો છો અથવા ઓનલાઇન જમા કરાવી શકો છો.
                  </p>
                </div>
              </form>

              {/* Independent center note */}
              <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  ખાનગી સહાય કેન્દ્ર • કોઈ સરકારી વિભાગ નથી
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

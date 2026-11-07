import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldAlert, Lock, FileText, Phone, MapPin, Heart, Shield } from 'lucide-react';

export const LegalFooter: React.FC = () => {
  const { settings, setActiveView, openApplyModal, openTrackModal } = useApp();

  const businessName = settings?.businessName || 'રાજવીર ઓનલાઇન સર્વિસીસ';
  const address = settings?.address || 'Second Floor, Rajveer Online Service, Near Ambika Society, At Varahi, Gujarat 385360.';
  const phone = settings?.phone || '+91 98765 43210';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 no-print">
      
      {/* 1. MANDATORY LEGAL DISCLAIMER & PRIVACY NOTICE SECTION */}
      <div className="bg-slate-900 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Section 10: Legal Disclaimer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200/90 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
              <span>કાનૂની સ્પષ્ટતા અને ડિસ્ક્લેમર (Legal Disclaimer)</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              રાજવીર ઓનલાઇન સર્વિસીસ એક સ્વતંત્ર ખાનગી દસ્તાવેજ સહાય કેન્દ્ર છે. આ કોઈ સરકારી વિભાગ કે સરકારી વેબસાઇટનું સત્તાવાર પોર્ટલ નથી. અમે માત્ર અરજી ભરવા અને દસ્તાવેજ પ્રક્રિયામાં સહાય કરીએ છીએ. અરજીની અંતિમ મંજૂરી, પાત્રતા અને નિર્ણય સંબંધિત સરકારી વિભાગ અથવા બેંક દ્વારા લેવામાં આવે છે. મંજૂરીની કોઈ ખાતરી આપવામાં આવતી નથી.
            </p>
          </div>

          {/* Section 11: Privacy Notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-600/30 text-emerald-200/90 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Lock className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>ગોપનીયતા અને સુરક્ષા સૂચના (Privacy & Security Notice)</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              તમારી વ્યક્તિગત માહિતીની સુરક્ષા મહત્વપૂર્ણ છે. તમારો આધાર નંબર, OTP, પાસવર્ડ, ATM PIN અથવા બેંકની ગુપ્ત માહિતી અસુરક્ષિત માધ્યમથી શેર કરશો નહીં. જરૂરી દસ્તાવેજો ફક્ત સુરક્ષિત પ્રક્રિયા દ્વારા જ આપો.
            </p>
          </div>

        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS & CONTACT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {businessName}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              વારાહી ખાતે પાન કાર્ડ, આધાર સુધારા સહાય, આયુષ્માન કાર્ડ, ચૂંટણી કાર્ડ અને સરકારી યોજનાઓની ઓનલાઇન અરજી માટેનું સ્વતંત્ર ખાનગી સહાય કેન્દ્ર.
            </p>
            <div className="pt-2 text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>૧૦૦% સલામત અને વિશ્વસનીય સહાય</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">ઝડપી લિંક્સ</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  મુખ્ય પૃષ્ઠ (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  તમામ સેવાઓ અને ફી યાદી
                </button>
              </li>
              <li>
                <button
                  onClick={() => openApplyModal()}
                  className="hover:text-amber-400 transition-colors font-medium"
                >
                  નવી અરજી કરો
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTrackModal()}
                  className="hover:text-amber-400 transition-colors font-medium"
                >
                  અરજી સ્ટેટસ ટ્રેક કરો
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  વારાહી કેન્દ્રનું સરનામું અને નકશો
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">મુખ્ય સેવાઓ</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => openApplyModal('pan-card')} className="hover:text-white">
                  નવું પાન કાર્ડ અને સુધારો (PAN Card)
                </button>
              </li>
              <li>
                <button onClick={() => openApplyModal('aadhaar-service')} className="hover:text-white">
                  આધાર કાર્ડ સરનામું સુધારો અને પ્રિન્ટ
                </button>
              </li>
              <li>
                <button onClick={() => openApplyModal('ayushman-bharat')} className="hover:text-white">
                  આયુષ્માન ભારત - PMJAY કાર્ડ
                </button>
              </li>
              <li>
                <button onClick={() => openApplyModal('sbi-mudra-loan')} className="hover:text-emerald-400 font-medium">
                  એસ.બી.આઈ. મુદ્રા લોન અરજી સહાય (₹૫૦,૦૦૦ સુધી)
                </button>
              </li>
              <li>
                <button onClick={() => openApplyModal('govt-recruitment')} className="hover:text-white">
                  સરકારી ભરતી અને નોકરી ફોર્મ
                </button>
              </li>
              <li>
                <button onClick={() => openApplyModal('ration-card')} className="hover:text-white">
                  રેશન કાર્ડ સેવાઓ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">કેન્દ્ર સંપર્ક</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-white">{phone}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                સમય: સવારે ૯:૦૦ થી સાંજે ૭:૦૦ (સોમ થી શનિ)
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setActiveView('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline"
              >
                એડમિનિસ્ટ્રેટર લૉગિન પેનલ
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} {businessName}. સર્વ હકો સુરક્ષિત.
          </p>
          <p className="text-[11px] text-slate-400">
            વારાહી, ગુજરાત • સ્વતંત્ર દસ્તાવેજ સહાય સેવા
          </p>
        </div>

      </div>
    </footer>
  );
};

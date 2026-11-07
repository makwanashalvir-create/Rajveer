import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageCircle, 
  Navigation, 
  FileCheck2, 
  AlertCircle,
  Building
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings } = useApp();

  const businessName = settings?.businessName || 'રાજવીર ઓનલાઇન સર્વિસીસ';
  const address = settings?.address || 'Second Floor, Rajveer Online Service, Near Ambika Society, At Varahi, Gujarat 385360.';
  const phone = settings?.phone || '+91 98765 43210';
  const whatsapp = settings?.whatsapp || '+91 98765 43210';
  const hours = settings?.openingHours || 'સોમવાર થી શનિવાર: સવારે ૯:૦૦ થી સાંજે ૭:૦૦ | રવિવાર: સવારે ૧૦:૦૦ થી બપોરે ૨:૦૦';
  const instructions = settings?.centerVisitInstructions || 'કેન્દ્ર પર આવતી વખતે મૂળ આધાર કાર્ડ, જૂના દસ્તાવેજોની નકલ અને ૨ પાસપોર્ટ સાઇઝ રંગીન ફોટો સાથે રાખવા વિનંતી.';

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
  const hasValidPhone = cleanPhone.length >= 10;
  const hasValidWhatsapp = cleanWhatsapp.length >= 10;

  // Google Maps URL with verified Varahi location
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ambika Society Varahi Gujarat 385360')}`;

  return (
    <section id="contact-section" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            અમારો સંપર્ક કરો
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-2">
            વારાહી સ્થિત કેન્દ્રનું સરનામું અને સંપર્ક
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            કોઈપણ સહાય, દસ્તાવેજ જમા કરાવવા અથવા મુલાકાત માટે સીધો સંપર્ક કરો
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-6 space-y-5">
            {/* Business Info Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-950">{businessName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    સ્વતંત્ર ખાનગી દસ્તાવેજ સહાય કેન્દ્ર
                  </p>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">કેન્દ્રનું ભૌતિક સરનામું:</span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium mt-0.5">
                    {address}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    લેન્ડમાર્ક: અંબિકા સોસાયટી પાસે, બીજો માળ, વારાહી (સાંતલપુર), જિલ્લો: પાટણ, પિનકોડ: 385360
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">કામના દિવસો અને સમય:</span>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
                    {hours}
                  </p>
                  {settings?.holidayNotice && (
                    <p className="text-[11px] text-amber-800 mt-1">
                      * {settings.holidayNotice}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Helpline */}
              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <Phone className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">સહાયક ફોન નંબર:</span>
                  <p className="text-sm font-bold text-blue-950 mt-0.5 font-mono">
                    {phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons: Call & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hasValidPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="p-3.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>સીધો કૉલ કરો</span>
                </a>
              )}

              {hasValidWhatsapp && (
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('નમસ્તે, રાજવીર ઓનલાઇન સર્વિસીસ વારાહી ખાતે દસ્તાવેજ સહાય માટે પૂછપરછ કરવી છે.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>વોટ્સએપ પર પૂછપરછ</span>
                </a>
              )}
            </div>

            {/* Center Visit Instructions Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-xs sm:text-sm">
                <FileCheck2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>કેન્દ્રની રૂબરૂ મુલાકાત માટેની ખાસ સૂચના:</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                {instructions}
              </p>
            </div>
          </div>

          {/* Right Column: Google Maps & Directions */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-900" />
                  <span className="font-bold text-xs text-blue-950">નકશા પર કેન્દ્રનું સ્થાન (Location):</span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                >
                  <span>મોટા નકશામાં જુઓ</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Verified Google Maps iframe embed pointing to Varahi */}
              <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-300 relative bg-slate-200">
                <iframe
                  title="રાજવીર ઓનલાઇન સર્વિસીસ વારાહી નકશો"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/maps?q=Varahi,+Gujarat+385360&t=&z=15&ie=UTF8&iwloc=&output=embed"
                />
              </div>

              <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">વારાહી સ્થિત સ્થાન:</span>
                  <p className="text-slate-600 text-[11px]">
                    અંબિકા સોસાયટી પાસે, નેશનલ હાઇવે નજીક, વારાહી (પાટણ)
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>દિશા (Route) મેળવો</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

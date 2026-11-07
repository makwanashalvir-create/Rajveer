import React from 'react';
import { ShieldCheck, Lock, MapPin, BadgePercent, CheckCircle, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const highlights = [
    {
      title: '૧૦૦% સુરક્ષા અને ગોપનીયતા',
      desc: 'અમે ક્યારેય તમારો પાસવર્ડ, બેંક OTP, ATM PIN કે ગુપ્ત વિગતો માંગતા નથી. તમારા દસ્તાવેજો સુરક્ષિત રહે છે.',
      icon: <Lock className="w-5 h-5 text-emerald-600" />
    },
    {
      title: 'વારાહી સ્થાનિક કેન્દ્ર પર રૂબરૂ સહાય',
      desc: 'અંબિકા સોસાયટી પાસે, વારાહી ખાતે ભૌતિક કેન્દ્ર આવેલું છે જેથી તમે રૂબરૂ આવીને સલાહ-સહાય મેળવી શકો છો.',
      icon: <MapPin className="w-5 h-5 text-blue-800" />
    },
    {
      title: 'પારદર્શક અને વાજબી સહાય ફી',
      desc: 'કોઈપણ છુપા ચાર્જ વગર સરકાર નિયત પોર્ટલ ફી અને નજીવો સેવા સહાય ચાર્જ જ લેવામાં આવે છે.',
      icon: <BadgePercent className="w-5 h-5 text-amber-600" />
    },
    {
      title: 'સચોટ અને ભૂલરહિત ફોર્મ પ્રોસેસિંગ',
      desc: 'સરકારી ભરતી અને પાન કાર્ડ જેવા મહત્વપૂર્ણ ફોર્મમાં ક્ષતિ ન રહે તે માટે અનુભવી સ્ટાફ દ્વારા બે વાર ચકાસણી થાય છે.',
      icon: <CheckCircle className="w-5 h-5 text-indigo-700" />
    },
    {
      title: 'ઓનલાઇન અરજી ટ્રેકિંગ અને રસીદ',
      desc: 'દરેક અરજી માટે યુનિક RVO સંદર્ભ નંબર અને અધિકૃત ડિજિટલ રસીદ આપવામાં આવે છે.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />
    },
    {
      title: 'સરળ ફોન અને વોટ્સએપ હેલ્પલાઇન',
      desc: 'અરજી અંગે કોઈપણ પ્રશ્ન હોય તો કામકાજના સમય દરમિયાન સીધો ફોન અથવા વોટ્સએપ દ્વારા સંપર્ક કરી શકાય છે.',
      icon: <Headphones className="w-5 h-5 text-blue-900" />
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            અમારી વિશ્વસનીયતા
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-2">
            શા માટે રાજવીર ઓનલાઇન સર્વિસીસ પસંદ કરવી?
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            ગ્રામ્ય અને નગરજનો માટે ટેક્નોલોજી સરળ બનાવી, સરકારી સેવાઓ ઘર સુધી પહોંચાડવાનો અમારો ઉદ્દેશ છે.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-blue-950 mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

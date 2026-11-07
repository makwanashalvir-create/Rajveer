import React from 'react';
import { MousePointerClick, FileCheck, Hash, Award } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '૦૧',
      title: 'સેવા પસંદ કરો',
      desc: 'પાન કાર્ડ, આધાર સહાય, આયુષ્માન ભારત કે મુદ્રા લોન પૈકી તમારી જરૂરિયાત મુજબની સેવા પસંદ કરો.',
      icon: <MousePointerClick className="w-6 h-6 text-blue-900" />
    },
    {
      number: '૦૨',
      title: 'માહિતી અને પુરાવા આપો',
      desc: 'સરળ ગુજરાતી ફોર્મ ભરો અને જરૂરી દસ્તાવેજો રૂબરૂ કેન્દ્ર પર આપો અથવા ઓનલાઇન સુરક્ષિત જમા કરો.',
      icon: <FileCheck className="w-6 h-6 text-amber-600" />
    },
    {
      number: '૦૩',
      title: 'અરજી નંબર મેળવો',
      desc: 'અરજી સબમિટ થતાં જ તમને યુનિક સંદર્ભ નંબર (દા.ત. RVO-2026-XXXXX) સાથેની સ્લિપ મળશે.',
      icon: <Hash className="w-6 h-6 text-emerald-600" />
    },
    {
      number: '૦૪',
      title: 'સરળ ટ્રેકિંગ અને પ્રાપ્તિ',
      desc: 'ઘરે બેઠા મોબાઈલથી લાઈવ સ્ટેટસ જુઓ અને કામ પૂર્ણ થતાં વારાહી કેન્દ્ર પરથી દસ્તાવેજ મેળવી લો.',
      icon: <Award className="w-6 h-6 text-indigo-700" />
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            સરળ અને ઝડપી પ્રક્રિયા
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-2">
            અમારી સહાય પ્રક્રિયા કેવી રીતે કાર્ય કરે છે?
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            માત્ર ૪ સરળ પગલાંમાં તમારી સરકારી કે અંગત દસ્તાવેજ સંબંધિત અરજી પૂર્ણ કરો
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 relative group hover:bg-white hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-slate-300 group-hover:text-amber-500 transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="text-base font-bold text-blue-950 mb-2">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

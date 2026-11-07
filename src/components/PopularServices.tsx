import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceItem } from '../types.ts';
import { 
  CreditCard, 
  FileBadge, 
  HeartHandshake, 
  Users, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Info,
  ShieldAlert,
  Coins
} from 'lucide-react';

interface PopularServicesProps {
  showAll?: boolean;
}

export const PopularServices: React.FC<PopularServicesProps> = ({ showAll = false }) => {
  const { services, openApplyModal, setServiceDetailModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'તમામ સેવાઓ' },
    { id: 'ઓળખ દસ્તાવેજ', label: 'ઓળખ દસ્તાવેજ' },
    { id: 'આરોગ્ય સહાય', label: 'આરોગ્ય અને શ્રમિક' },
    { id: 'નાગરિક પુરવઠો', label: 'રેશન કાર્ડ અને મતદાર' },
    { id: 'વેપાર અને લોન સહાય', label: 'મુદ્રા લોન અને વેપાર' },
    { id: 'રોજગાર સેવા', label: 'સરકારી ભરતી' },
    { id: 'પ્રમાણપત્ર સેવા', label: 'પ્રમાણપત્રો' }
  ];

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'pan-card':
        return <CreditCard className="w-5 h-5 text-blue-800" />;
      case 'aadhaar-service':
        return <FileBadge className="w-5 h-5 text-amber-700" />;
      case 'ayushman-bharat':
        return <HeartHandshake className="w-5 h-5 text-rose-700" />;
      case 'eshram-card':
        return <Users className="w-5 h-5 text-orange-700" />;
      case 'ration-card':
        return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'voter-id':
        return <FileBadge className="w-5 h-5 text-indigo-700" />;
      case 'govt-recruitment':
        return <Briefcase className="w-5 h-5 text-blue-900" />;
      case 'sbi-mudra-loan':
        return <Coins className="w-5 h-5 text-emerald-800" />;
      default:
        return <FileBadge className="w-5 h-5 text-slate-800" />;
    }
  };

  const filteredServices = services.filter((s) => {
    if (!s.active) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'આરોગ્ય સહાય') {
      return s.category === 'આરોગ્ય સહાય' || s.category === 'શ્રમિક યોજના';
    }
    if (selectedCategory === 'નાગરિક પુરવઠો') {
      return s.category === 'નાગરિક પુરવઠો' || s.category === 'ચૂંટણી પંચ સેવા';
    }
    return s.category === selectedCategory;
  });

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 9);

  return (
    <section id="services-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 mb-3 border border-blue-200">
            <span>સંપૂર્ણ સેવા સૂચિ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-950 tracking-tight">
            અમારી મુખ્ય ઓનલાઇન સહાય સેવાઓ
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            દરેક સેવા માટે જરૂરી દસ્તાવેજોની ચકાસણી, ઓનલાઇન અરજી પ્રક્રિયા અને ઝડપી ફોલોઅપ સહાય વારાહી કેન્દ્ર પર ઉપલબ્ધ છે.
          </p>
        </div>

        {/* Categories Filter Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                service.id === 'sbi-mudra-loan'
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div>
                {/* Header Row: Badge & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Service Title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                    {getServiceIcon(service.id)}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-blue-950 leading-snug">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>સમય: {service.durationDays}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Mudra Loan Special Warning Box */}
                {service.id === 'sbi-mudra-loan' && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <ShieldAlert className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>મહત્વની સ્પષ્ટતા:</span>
                    </div>
                    <p className="text-[11px] text-emerald-900/90 leading-tight">
                      મુદ્રા લોનની રકમ અને મંજૂરી બેંક નિયમો અને પાત્રતાને આધીન છે. મંજૂરીની કોઈ બાંયધરી નથી.
                    </p>
                  </div>
                )}

                {/* Required Documents Preview */}
                <div className="mb-4 pt-3 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-800 mb-2">જરૂરી મુખ્ય દસ્તાવેજો:</p>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {service.requiredDocs.slice(0, 3).map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{doc}</span>
                      </li>
                    ))}
                    {service.requiredDocs.length > 3 && (
                      <li className="text-[11px] text-blue-800 font-medium pl-5">
                        + વધુ {service.requiredDocs.length - 3} પુરાવા
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions & Fee */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">સહાય ફી:</span>
                    <span className="text-lg font-black text-blue-950">
                      ₹{service.fee}
                      <span className="text-[10px] text-slate-500 font-normal ml-1">(માત્ર સેવા ચાર્જ)</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setServiceDetailModal(service)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 p-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>વિગતો જુઓ</span>
                  </button>
                </div>

                <button
                  onClick={() => openApplyModal(service)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>અરજી કરો</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View all services footer note */}
        {!showAll && (
          <div className="text-center mt-10">
            <button
              onClick={() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-blue-900 text-blue-950 font-bold text-sm shadow-xs transition-all"
            >
              <span>બધી સેવાઓ જુઓ ({services.length} ઉપલબ્ધ)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

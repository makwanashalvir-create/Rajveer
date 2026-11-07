import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const ServiceDetailModal: React.FC = () => {
  const { serviceDetailModal, setServiceDetailModal, openApplyModal } = useApp();

  if (!serviceDetailModal) return null;

  const handleApply = () => {
    const s = serviceDetailModal;
    setServiceDetailModal(null);
    openApplyModal(s);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 no-print">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              {serviceDetailModal.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-blue-950">
              {serviceDetailModal.title}
            </h3>
          </div>
          <button
            onClick={() => setServiceDetailModal(null)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            aria-label="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Badge & Quick Stats */}
          <div className="flex flex-wrap items-center gap-3">
            {serviceDetailModal.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {serviceDetailModal.badge}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              અંદાજિત સમય: {serviceDetailModal.durationDays}
            </span>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              સહાય ફી: ₹{serviceDetailModal.fee}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">સેવા વિગત:</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {serviceDetailModal.description}
            </p>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-blue-950 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>જરૂરી દસ્તાવેજોની સંપૂર્ણ યાદી (Checklist):</span>
            </h4>
            <ul className="space-y-2.5">
              {serviceDetailModal.requiredDocs.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Notice / Mudra Disclaimer */}
          {serviceDetailModal.importantNotice && (
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>અગત્યની સ્પષ્ટતા અને નિયમો:</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900/90">
                {serviceDetailModal.importantNotice}
              </p>
            </div>
          )}

          {/* Process Instructions */}
          <div className="text-xs text-slate-500 space-y-1 border-t border-slate-100 pt-4">
            <p className="font-semibold text-slate-700">કેવી રીતે અરજી કરવી:</p>
            <p>૧. નીચે આપેલા &apos;હવે અરજી કરો&apos; બટન પર ક્લિક કરો.</p>
            <p>૨. તમારી મૂળભૂત વિગતો ભરો અને પુરાવા પસંદ કરો.</p>
            <p>૩. અરજી સબમિટ કરી સંદર્ભ નંબર (Reference No.) મેળવો.</p>
            <p>૪. મૂળ દસ્તાવેજ વારાહી કેન્દ્ર પર રૂબરૂ લાવો અથવા ઓનલાઇન આપો.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            સહાય ફી: <span className="text-base font-extrabold text-blue-950">₹{serviceDetailModal.fee}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setServiceDetailModal(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              બંધ કરો
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>હવે અરજી કરો</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

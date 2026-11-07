import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TrackedApplication } from '../types.ts';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CheckCheck, 
  CreditCard, 
  FileText, 
  Printer, 
  ShieldCheck,
  Building,
  HelpCircle
} from 'lucide-react';

export const TrackStatusModal: React.FC = () => {
  const { 
    trackModalOpen, 
    setTrackModalOpen, 
    trackingRef, 
    setTrackingRef, 
    openPaymentModal, 
    openReceiptModal,
    showToast 
  } = useApp();

  const [inputRef, setInputRef] = useState(trackingRef || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackedApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (trackingRef) {
      setInputRef(trackingRef);
      fetchStatus(trackingRef);
    }
  }, [trackingRef]);

  if (!trackModalOpen) return null;

  const fetchStatus = async (ref: string) => {
    const cleanRef = ref.trim().toUpperCase();
    if (!cleanRef) {
      showToast('કૃપા કરીને અરજી સંદર્ભ નંબર દાખલ કરો.', 'error');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/applications/track/${encodeURIComponent(cleanRef)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setResult(json.data);
      } else {
        setResult(null);
        setErrorMsg(json.message || 'અરજી મળી નથી. કૃપા કરીને સાચો નંબર ચકાસો.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('સર્વર સાથે જોડાણમાં ખામી આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(inputRef);
  };

  const handleClose = () => {
    setTrackModalOpen(false);
    setErrorMsg('');
  };

  // Helper for status progress steps
  const allStatuses = [
    {
      id: 'અરજી મળી.',
      title: 'અરજી મળી.',
      desc: 'તમારી અરજી કેન્દ્ર દ્વારા સ્વીકારી લેવામાં આવી છે અને પ્રારંભિક ચકાસણી પ્રક્રિયામાં છે.'
    },
    {
      id: 'કામ ચાલુ છે.',
      title: 'કામ ચાલુ છે.',
      desc: 'તમારા દસ્તાવેજો ચકાસીને સંબંધિત સરકારી/બેંકિંગ પોર્ટલ પર ઓનલાઇન અરજી પ્રક્રિયા ચાલુ છે.'
    },
    {
      id: 'વધુ માહિતી જરૂરી છે.',
      title: 'વધુ માહિતી જરૂરી છે.',
      desc: 'અમુક દસ્તાવેજ અથવા વિગત અધૂરી છે. કૃપા કરીને નીચેની નોંધ વાંચી કેન્દ્રનો સંપર્ક કરો.'
    },
    {
      id: 'કામ પૂર્ણ થયું.',
      title: 'કામ પૂર્ણ થયું.',
      desc: 'તમારી અરજી સફળતાપૂર્વક પૂર્ણ થઈ છે! તૈયાર દસ્તાવેજ કેન્દ્ર પરથી મેળવી શકો છો.'
    }
  ];

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'અરજી મળી.':
        return 0;
      case 'કામ ચાલુ છે.':
        return 1;
      case 'વધુ માહિતી જરૂરી છે.':
        return 2;
      case 'કામ પૂર્ણ થયું.':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-800 text-amber-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">અરજીનું લાઈવ સ્ટેટસ ટ્રેકિંગ</h3>
              <p className="text-xs text-slate-400">તમારા સંદર્ભ નંબર (Ref No) દ્વારા સ્થિતિ તપાસો</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="બંધ કરો"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputRef}
                onChange={(e) => setInputRef(e.target.value)}
                placeholder="દા.ત. RVO-2026-12345"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold uppercase focus:border-blue-900 focus:bg-white bg-white text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'તપાસ થઈ રહી છે...' : 'શોધો'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Result Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {result ? (
            <>
              {/* Application Details Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">અરજી સંદર્ભ નંબર:</span>
                    <h4 className="text-xl font-black text-blue-950 font-mono tracking-wide">
                      {result.refNumber}
                    </h4>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      result.status === 'કામ પૂર્ણ થયું.'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : result.status === 'વધુ માહિતી જરૂરી છે.'
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : result.status === 'કામ ચાલુ છે.'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-500">સેવાનું નામ:</span>
                    <p className="font-bold text-blue-950">{result.serviceTitle}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">અરજદારનું નામ (સુરક્ષિત):</span>
                    <p className="font-semibold">{result.applicantNameMasked}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">મોબાઈલ નંબર:</span>
                    <p className="font-semibold">{result.mobileMasked}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">ગામ / શહેર:</span>
                    <p className="font-semibold">{result.cityOrVillage}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">દસ્તાવેજ આપવાની પદ્ધતિ:</span>
                    <p className="font-semibold">
                      {result.submissionMethod === 'online_upload'
                        ? 'ઓનલાઇન અપલોડ કરેલ'
                        : 'કેન્દ્ર પર રૂબરૂ મુલાકાત'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">અરજી તારીખ:</span>
                    <p className="font-semibold">
                      {new Date(result.createdAt).toLocaleDateString('gu-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Admin Remarks Notice if any */}
                {result.adminRemarks && (
                  <div className="mt-3 p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950">
                    <span className="font-bold text-amber-900 block mb-0.5">
                      કેન્દ્ર તરફથી અગત્યની નોંધ / રિમાર્ક:
                    </span>
                    <p className="leading-relaxed">{result.adminRemarks}</p>
                  </div>
                )}
              </div>

              {/* Status Explanation Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-800" />
                  <span>અરજી પ્રક્રિયા તબક્કા (Workflow Status):</span>
                </h4>

                <div className="space-y-3">
                  {allStatuses.map((st, idx) => {
                    const currentIndex = getStatusStepIndex(result.status);
                    const isPassed = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div
                        key={st.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-900/10'
                            : isPassed
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-white border-slate-100 opacity-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              isPassed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isPassed ? '✓' : idx + 1}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-sm font-bold ${
                                  isCurrent ? 'text-blue-950' : isPassed ? 'text-slate-800' : 'text-slate-500'
                                }`}
                              >
                                {st.title}
                              </h5>
                              {isCurrent && (
                                <span className="text-[10px] font-extrabold bg-blue-900 text-white px-2 py-0.5 rounded-full">
                                  વર્તમાન સ્થિતિ
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Status & Receipts */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">સહાય ફી સ્થિતિ:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-blue-950">₹{result.fee}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        result.paymentStatus === 'સફળ'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {result.paymentStatus === 'સફળ' ? 'ચૂકવણી સફળ' : result.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {result.paymentStatus === 'સફળ' && result.paymentReceipt ? (
                    <button
                      onClick={() =>
                        openReceiptModal({
                          receipt: result.paymentReceipt!,
                          refNumber: result.refNumber,
                          applicantName: result.applicantNameMasked,
                          serviceTitle: result.serviceTitle
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>રસીદ જુઓ / પ્રિન્ટ કરો</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openPaymentModal(result.refNumber, result.fee)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>ઓનલાઇન ચૂકવણી કરો</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Update History Log */}
              {result.timeline && result.timeline.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
                    સમયરેખા નોંધણી વિગત:
                  </h4>
                  <div className="space-y-2">
                    {result.timeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{item.status}</span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{item.note}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(item.date).toLocaleDateString('gu-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                કોઈપણ અરજીની વર્તમાન સ્થિતિ જાણવા માટે ઉપરના બોક્સમાં તમારો RVO સંદર્ભ નંબર દાખલ કરો.
              </p>
              <p className="text-xs text-slate-500">
                ઉદાહરણ તરીકે: RVO-2026-89412
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            બંધ કરો
          </button>
        </div>

      </div>
    </div>
  );
};

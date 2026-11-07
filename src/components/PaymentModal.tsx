import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  X, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Building2, 
  ShieldCheck, 
  Info,
  Smartphone
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    paymentModalOpen, 
    setPaymentModalOpen, 
    paymentRefNumber, 
    paymentFee, 
    openReceiptModal, 
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'ડેબિટ/ક્રેડિટ કાર્ડ' | 'નેટ બેંકિંગ' | 'કેન્દ્ર પર રોકડ'>('UPI');
  const [loading, setLoading] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<{
    configured: boolean;
    testMode: boolean;
    keyId?: string;
    message?: string;
  } | null>(null);

  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorDetails, setErrorDetails] = useState('');
  const [createdReceipt, setCreatedReceipt] = useState<any>(null);

  useEffect(() => {
    if (paymentModalOpen && paymentRefNumber) {
      checkGateway();
      setPaymentState('idle');
      setErrorDetails('');
    }
  }, [paymentModalOpen, paymentRefNumber]);

  if (!paymentModalOpen) return null;

  const checkGateway = async () => {
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refNumber: paymentRefNumber })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setGatewayStatus({
          configured: json.gatewayConfigured ?? false,
          testMode: json.testMode ?? true,
          keyId: json.keyId,
          message: json.message
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    setPaymentState('processing');
    setErrorDetails('');

    try {
      // Backend payment verification
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refNumber: paymentRefNumber,
          paymentMethod,
          transactionId: `TXN${Date.now()}${Math.floor(100 + Math.random() * 900)}`,
          testModeSimulated: gatewayStatus?.testMode ?? true
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPaymentState('success');
        setCreatedReceipt(json.data.receipt);
        showToast('ચૂકવણી સફળ થઈ છે! રસીદ તૈયાર છે.', 'success');
      } else {
        setPaymentState('failed');
        setErrorDetails(json.message || 'ચૂકવણી પ્રોસેસિંગમાં ક્ષતિ આવી છે.');
      }
    } catch (err) {
      console.error(err);
      setPaymentState('failed');
      setErrorDetails('બેંકિંગ નેટવર્ક અથવા સર્વર સાથે જોડાણ થઈ શક્યું નથી.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPaymentModalOpen(false);
    setPaymentState('idle');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">સહાય ફી ચૂકવણી પોર્ટલ</h3>
              <p className="text-xs text-slate-400">અરજી સંદર્ભ: {paymentRefNumber}</p>
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

        <div className="p-6 space-y-5">
          {/* Fee Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">ચૂકવવાપાત્ર કુલ ફી:</span>
              <span className="text-2xl font-black text-blue-950">₹{paymentFee}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">અરજી નંબર</span>
              <span className="font-mono text-xs font-bold text-slate-800">{paymentRefNumber}</span>
            </div>
          </div>

          {/* GATEWAY STATUS PLACEHOLDER NOTICE (When gateway keys are not yet configured) */}
          {gatewayStatus && !gatewayStatus.configured && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>ઓનલાઇન પેમેન્ટ ગેટવે ગોઠવણ સ્થિતિ:</span>
              </div>
              <p className="leading-relaxed text-amber-900">
                Razorpay ગેટવે હાલ પ્લેસહોલ્ડર / ગોઠવણ મોડમાં છે. સત્તાવાર Key ID & Secret એડમિન સેટિંગ્સમાં ઉમેરી શકાય છે. હાલમાં તમે કેન્દ્ર પર રૂબરૂ રોકડ અથવા UPI સ્કેન દ્વારા ફી જમા કરાવી શકો છો.
              </p>
            </div>
          )}

          {/* PAYMENT SUCCESS STATE */}
          {paymentState === 'success' && createdReceipt ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-950">ચૂકવણી સફળતાપૂર્વક પૂર્ણ થઈ!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  રસીદ નંબર: <span className="font-mono font-bold text-blue-900">{createdReceipt.receiptNo}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">ટ્રાન્ઝેક્શન આઈડી:</span>
                  <span className="font-mono font-bold">{createdReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ચૂકવેલ રકમ:</span>
                  <span className="font-bold text-emerald-700">₹{createdReceipt.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ચુકવણી માધ્યમ:</span>
                  <span className="font-semibold">{createdReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    openReceiptModal({
                      receipt: createdReceipt,
                      refNumber: paymentRefNumber,
                      applicantName: 'અરજદાર',
                      serviceTitle: 'સરકારી દસ્તાવેજ સહાય'
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs"
                >
                  અધિકૃત રસીદ જુઓ / પ્રિન્ટ કરો
                </button>
              </div>
            </div>
          ) : paymentState === 'failed' ? (
            /* PAYMENT FAILED STATE */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-rose-950">ચૂકવણી અસફળ રહી</h4>
                <p className="text-xs text-rose-800 mt-1">{errorDetails}</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPaymentState('idle')}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>ફરી પ્રયાસ કરો (Retry Payment)</span>
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT OPTIONS SELECTION */
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-800">
                ચુકવણીનું માધ્યમ પસંદ કરો:
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-blue-950">UPI (GPay/PhonePe)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">ઝડપી QR & ID ચૂકવણી</span>
                </button>

                {/* Cards */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ડેબિટ/ક્રેડિટ કાર્ડ')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'ડેબિટ/ક્રેડિટ કાર્ડ'
                      ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-800" />
                    <span className="text-xs font-bold text-blue-950">ડેબિટ / એટીએમ કાર્ડ</span>
                  </div>
                  <span className="text-[10px] text-slate-500">RuPay, Visa, MasterCard</span>
                </button>

                {/* Net Banking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('નેટ બેંકિંગ')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'નેટ બેંકિંગ'
                      ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-indigo-700" />
                    <span className="text-xs font-bold text-blue-950">નેટ બેંકિંગ</span>
                  </div>
                  <span className="text-[10px] text-slate-500">SBI, BoB, HDFC વગેરે</span>
                </button>

                {/* Pay at Center */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('કેન્દ્ર પર રોકડ')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'કેન્દ્ર પર રોકડ'
                      ? 'border-blue-900 bg-blue-50/80 ring-2 ring-blue-900/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-blue-950">કેન્દ્ર પર રોકડ/UPI</span>
                  </div>
                  <span className="text-[10px] text-slate-500">વારાહી કેન્દ્ર પર મુલાકાતે</span>
                </button>
              </div>

              {/* UPI QR Display if UPI selected */}
              {paymentMethod === 'UPI' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                  <div className="w-28 h-28 bg-white border border-slate-300 rounded-xl mx-auto flex flex-col items-center justify-center p-2 shadow-xs">
                    <QrCode className="w-16 h-16 text-slate-800" />
                    <span className="text-[9px] font-bold text-slate-500 mt-1">UPI QR સ્કેન</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="text-slate-500 block text-[11px]">રાજવીર ઓનલાઇન સર્વિસીસ UPI ID:</span>
                    <span className="font-mono font-bold text-blue-950">rajveer.varahi@upi</span>
                  </div>
                </div>
              )}

              {/* Security Promise Note */}
              <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  સુરક્ષા ખાતરી: અમે ક્યારેય તમારો કાર્ડ પાસવર્ડ, CVV કે બેંકિંગ OTP સંગ્રહ કરતા નથી. તમામ ચુકવણી એન્ક્રિપ્ટેડ પોર્ટલ દ્વારા થાય છે.
                </p>
              </div>

              {/* Submit Payment button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleProcessPayment}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  {loading ? (
                    <span>ચકાસણી ચાલુ છે...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>₹{paymentFee} ની ચૂકવણી કન્ફર્મ કરો</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            બંધ કરો
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { receiptModalOpen, setReceiptModalOpen, receiptData, settings } = useApp();

  if (!receiptModalOpen || !receiptData) return null;

  const { receipt, refNumber, applicantName, serviceTitle } = receiptData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full my-auto shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">અધિકૃત ચુકવણી પહોંચ (રસીદ)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>પ્રિન્ટ કરો</span>
            </button>

            <button
              onClick={() => setReceiptModalOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              aria-label="બંધ કરો"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="receipt-printable-area" className="p-6 sm:p-8 bg-white text-slate-900 font-sans space-y-6">
          
          {/* Receipt Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <div className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold uppercase mb-1">
              સ્વતંત્ર દસ્તાવેજ સહાય કેન્દ્ર
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">
              {settings?.businessName || 'રાજવીર ઓનલાઇન સર્વિસીસ'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {settings?.address || 'Second Floor, Rajveer Online Service, Near Ambika Society, At Varahi, Gujarat 385360.'}
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-600 mt-1 font-medium">
              <span>ફોન: {settings?.phone || '+91 98765 43210'}</span>
              <span>•</span>
              <span>વારાહી, ગુજરાત ૩૮૫૩૬૦</span>
            </div>
          </div>

          {/* Receipt Title Badge */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
            <div>
              <span className="text-slate-500 block">રસીદ નંબર (Receipt No):</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{receipt.receiptNo}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">તારીખ અને સમય:</span>
              <span className="font-semibold text-slate-900">
                {new Date(receipt.date).toLocaleDateString('gu-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Key Receipt Fields Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">અરજી સંદર્ભ નંબર (Ref No):</span>
              <span className="font-mono font-bold text-blue-950">{refNumber}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">અરજદારનું નામ:</span>
              <span className="font-bold text-slate-900">{applicantName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">સેવાનું નામ:</span>
              <span className="font-semibold text-slate-900">{serviceTitle}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">ચુકવણી માધ્યમ:</span>
              <span className="font-semibold text-slate-900">{receipt.paymentMethod}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">ટ્રાન્ઝેક્શન સંદર્ભ:</span>
              <span className="font-mono font-medium text-slate-800">{receipt.transactionId}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">ચુકવણી સ્થિતિ:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                સફળતાપૂર્વક મળેલ (PAID)
              </span>
            </div>
          </div>

          {/* Total Amount Box */}
          <div className="p-4 bg-blue-50/70 border-2 border-blue-900 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-900 font-bold block">કુલ ચૂકવેલ સેવા ફી:</span>
              <span className="text-[11px] text-slate-600">(અક્ષરે: રૂપિયા {receipt.amount} પૂરા)</span>
            </div>
            <div className="text-2xl font-black text-blue-950">
              ₹{receipt.amount}.00
            </div>
          </div>

          {/* Seal & Authorized Signature Area */}
          <div className="pt-6 grid grid-cols-2 gap-4 items-end text-xs">
            <div>
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-900/40 flex items-center justify-center text-[10px] text-blue-900 text-center font-bold p-2 rotate-[-5deg]">
                રાજવીર ઓનલાઇન સર્વિસીસ સિક્કો
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="h-10 border-b border-slate-400" />
              <p className="font-bold text-slate-900">અધિકૃત સહી / મેનેજર</p>
              <p className="text-[10px] text-slate-500">રાજવીર ઓનલાઇન સર્વિસીસ, વારાહી</p>
            </div>
          </div>

          {/* Receipt Disclaimer */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed text-center">
            * નોંધ: આ રસીદ માત્ર અરજી ફોર્મ ભરવા અને દસ્તાવેજ સહાય સેવા માટે માન્ય છે. અરજીની અંતિમ મંજૂરી સંબંધિત સરકારી વિભાગ અથવા બેંક દ્વારા લેવામાં આવે છે.
          </div>

        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">ગ્રાહક નકલ</span>
          <div className="flex gap-2">
            <button
              onClick={() => setReceiptModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              બંધ કરો
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>પ્રિન્ટ / PDF ડાઉનલોડ</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

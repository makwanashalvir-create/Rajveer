import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceItem } from '../types.ts';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Upload, 
  FileText, 
  AlertTriangle, 
  Copy, 
  Printer, 
  CreditCard,
  Building,
  UserCheck
} from 'lucide-react';

export const ApplicationWizard: React.FC = () => {
  const { 
    services, 
    applyModalOpen, 
    setApplyModalOpen, 
    selectedServiceForApply, 
    openTrackModal, 
    openPaymentModal,
    showToast 
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  // Basic applicant info
  const [applicantName, setApplicantName] = useState('');
  const [mobile, setMobile] = useState('');
  const [fatherHusbandName, setFatherHusbandName] = useState('');
  const [address, setAddress] = useState('');
  const [cityOrVillage, setCityOrVillage] = useState('');
  const [taluka, setTaluka] = useState('વારાહી (સાંતલપુર)');
  const [district, setDistrict] = useState('પાટણ');
  const [pincode, setPincode] = useState('385360');

  // Custom service fields
  const [customData, setCustomData] = useState<Record<string, string>>({});

  // Document submission choice
  const [submissionMethod, setSubmissionMethod] = useState<'physical_center' | 'online_upload'>('physical_center');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Consent
  const [consentGiven, setConsentGiven] = useState(false);

  // Submitting state & Result
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    refNumber: string;
    serviceTitle: string;
    applicantName: string;
    fee: number;
    submissionMethod: string;
  } | null>(null);

  useEffect(() => {
    if (selectedServiceForApply) {
      setSelectedServiceId(selectedServiceForApply.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [selectedServiceForApply, services]);

  if (!applyModalOpen) return null;

  const currentService: ServiceItem | undefined = services.find((s) => s.id === selectedServiceId) || services[0];

  const resetForm = () => {
    setStep(1);
    setApplicantName('');
    setMobile('');
    setFatherHusbandName('');
    setAddress('');
    setCityOrVillage('');
    setCustomData({});
    setUploadedFiles([]);
    setConsentGiven(false);
    setSubmissionResult(null);
  };

  const handleClose = () => {
    setApplyModalOpen(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const validFiles: File[] = [];

      for (const file of selected) {
        if (file.size > 2.5 * 1024 * 1024) {
          showToast(`ફાઇલ "${file.name}" ૨.૫ MB કરતાં મોટી છે. કૃપા કરીને નાની ફાઇલ પસંદ કરો.`, 'error');
          continue;
        }
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowed.includes(file.type)) {
          showToast(`ફાઇલ "${file.name}" અમાન્ય છે. માત્ર JPG, PNG અથવા PDF સ્વીકાર્ય છે.`, 'error');
          continue;
        }
        validFiles.push(file);
      }

      setUploadedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      showToast('કૃપા કરીને અરજદારનું પૂરું નામ લખો.', 'error');
      return;
    }
    const cleanPhone = mobile.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('કૃપા કરીને ૧૦ આંકડાનો સાચો મોબાઈલ નંબર દાખલ કરો.', 'error');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required custom fields
    if (currentService?.fields) {
      for (const f of currentService.fields) {
        if (f.required && !customData[f.id]) {
          showToast(`કૃપા કરીને "${f.label}" વિગત પસંદ કરો અથવા ભરો.`, 'error');
          return;
        }
      }
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!consentGiven) {
      showToast('કૃપા કરીને આગળ વધવા માટે સંમતિ બોક્સ પર ક્લિક કરો.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('serviceId', currentService.id);
      formData.append('applicantName', applicantName);
      formData.append('mobile', mobile);
      formData.append('fatherHusbandName', fatherHusbandName);
      formData.append('address', address);
      formData.append('cityOrVillage', cityOrVillage);
      formData.append('taluka', taluka);
      formData.append('district', district);
      formData.append('pincode', pincode);
      formData.append('submissionMethod', submissionMethod);
      formData.append('consentGiven', 'true');
      formData.append('customData', JSON.stringify(customData));

      if (submissionMethod === 'online_upload') {
        uploadedFiles.forEach((file) => {
          formData.append('documentFiles', file);
        });
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmissionResult(json.data);
        setStep(4);
        showToast('અરજી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે!', 'success');
      } else {
        showToast(json.message || 'અરજી સબમિટ કરવામાં નિષ્ફળતા મળી.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('સર્વર સાથે જોડાણમાં ક્ષતિ આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRefToClipboard = () => {
    if (submissionResult?.refNumber) {
      navigator.clipboard.writeText(submissionResult.refNumber);
      showToast('અરજી નંબર કૉપિ થઈ ગયો છે!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Wizard Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              {step < 4 ? `૦${step}` : '✓'}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {step === 4 ? 'અરજી નોંધણી સફળ!' : 'ઓનલાઇન સેવા અરજી ફોર્મ'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 1 && 'પગલું ૧: સેવાની પસંદગી અને અરજદારની વિગતો'}
                {step === 2 && 'પગલું ૨: સેવા-વિશિષ્ટ પ્રશ્નો'}
                {step === 3 && 'પગલું ૩: દસ્તાવેજ ચેકલિસ્ટ અને સંમતિ'}
                {step === 4 && 'અરજી સંદર્ભ નંબર અને પહોંચ'}
              </p>
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

        {/* Progress Step Indicator (For steps 1 to 3) */}
        {step < 4 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            <div
              className="bg-amber-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Service Selection & Basic Applicant Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  જરૂરી સેવા પસંદ કરો <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — સહાય ફી: ₹{s.fee}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Quick Price & Notice Reminder */}
              {currentService && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-900">{currentService.title}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">અંદાજિત સમય: {currentService.durationDays}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">સહાય ફી:</span>
                    <span className="text-base font-extrabold text-blue-900">₹{currentService.fee}</span>
                  </div>
                </div>
              )}

              {/* Applicant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  અરજદારનું પૂરું નામ (આધાર કાર્ડ મુજબ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="દા.ત. રમેશભાઈ પ્રવીણભાઈ પટેલ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              {/* Mobile Number & Father/Husband Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    મોબાઈલ નંબર <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="૧૦ આંકડાનો મોબાઈલ નંબર"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                  />
                  <span className="text-[11px] text-slate-500">* સ્ટેટસ SMS આ નંબર પર આવશે</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    પિતા / પતિનું નામ
                  </label>
                  <input
                    type="text"
                    value={fatherHusbandName}
                    onChange={(e) => setFatherHusbandName(e.target.value)}
                    placeholder="પિતા અથવા પતિનું નામ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>
              </div>

              {/* Address & Village/City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ગામ / શહેર <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cityOrVillage}
                    onChange={(e) => setCityOrVillage(e.target.value)}
                    placeholder="દા.ત. વારાહી, સાંતલપુર, રાધનપુર..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    તાલુકો અને જિલ્લો
                  </label>
                  <input
                    type="text"
                    value={`${taluka}, ${district}`}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  રહેઠાણનું સરનામું (સોસાયટી / મહોલ્લો / ઘર નં.)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="સરનામું દાખલ કરો..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>આગળ વધો</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Service-Specific Questions */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                <span className="font-bold">પસંદ કરેલ સેવા: {currentService.title}</span>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  કૃપા કરીને આ સેવા માટે જરૂરી નીચેની ચોક્કસ વિગતો પસંદ કરો:
                </p>
              </div>

              {/* Dynamic Service Fields */}
              {currentService.fields && currentService.fields.length > 0 ? (
                currentService.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {field.label} {field.required && <span className="text-rose-500">*</span>}
                    </label>

                    {field.type === 'select' && field.options ? (
                      <select
                        required={field.required}
                        value={customData[field.id] || ''}
                        onChange={(e) =>
                          setCustomData({ ...customData, [field.id]: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:border-blue-900"
                      >
                        <option value="">-- પસંદ કરો --</option>
                        {field.options.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        required={field.required}
                        value={customData[field.id] || ''}
                        onChange={(e) =>
                          setCustomData({ ...customData, [field.id]: e.target.value })
                        }
                        placeholder={field.placeholder || 'આંકડો દાખલ કરો'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                      />
                    ) : (
                      <input
                        type="text"
                        required={field.required}
                        value={customData[field.id] || ''}
                        onChange={(e) =>
                          setCustomData({ ...customData, [field.id]: e.target.value })
                        }
                        placeholder={field.placeholder || 'અહીં વિગત લખો'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                  આ સેવા માટે કોઈ વધારાના પ્રશ્નો જરૂરી નથી. આગલા પગલામાં દસ્તાવેજ યાદી ચકાસીને આગળ વધો.
                </div>
              )}

              {/* Special Mudra Loan disclaimer if applicable */}
              {currentService.id === 'sbi-mudra-loan' && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>ખાસ મુદ્રા લોન સ્પષ્ટતા:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-900">
                    મુદ્રા લોન મંજૂરી બેંકની આંતરિક નીતિ અને પાત્રતા પર આધાર રાખે છે. અમારું કેન્દ્ર માત્ર અરજી ભરવામાં સહાયક છે.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>પાછળ જાઓ</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>દસ્તાવેજ અને સંમતિ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Required Documents Checklist, Submission Choice & Consent */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Checklist */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-blue-950 uppercase mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{currentService.title} માટે જરૂરી પુરાવા:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {currentService.requiredDocs.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Document Submission Method Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  દસ્તાવેજ જમા કરાવવાની પદ્ધતિ પસંદ કરો:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Physical Visit (Recommended) */}
                  <label
                    onClick={() => setSubmissionMethod('physical_center')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      submissionMethod === 'physical_center'
                        ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-blue-800" />
                          કેન્દ્ર પર રૂબરૂ લાવીશ
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          સુચિત
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                        અરજી કર્યા બાદ મૂળ પુરાવા સાથે વારાહી કેન્દ્ર પર આવવું. અપલોડ કરવાની જરૂર નથી.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Secure Online Upload */}
                  <label
                    onClick={() => setSubmissionMethod('online_upload')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      submissionMethod === 'online_upload'
                        ? 'border-blue-900 bg-blue-50/70 ring-2 ring-blue-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-amber-600" />
                          ઓનલાઇન ફાઇલ અપલોડ
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                          મહત્તમ ૨.૫ MB
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                        આધાર/ફોટો/દસ્તાવેજની સ્પષ્ટ JPG અથવા PDF ફાઇલ સુરક્ષિત રીતે અપલોડ કરો.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Upload Input (If online_upload selected) */}
              {submissionMethod === 'online_upload' && (
                <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">દસ્તાવેજ ફાઇલ પસંદ કરો:</span>
                    <span className="text-[11px] text-slate-500">JPG, PNG, PDF (મહત્તમ ૫ ફાઇલ)</span>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-900 file:text-white hover:file:bg-blue-950 cursor-pointer"
                  />

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-600">પસંદ કરેલ ફાઇલો:</span>
                      {uploadedFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                            <span className="truncate">{f.name}</span>
                            <span className="text-[10px] text-slate-400">
                              ({(f.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1"
                          >
                            હટાવો
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Customer Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-xs text-slate-800 font-medium leading-relaxed">
                    હું સ્વેચ્છાએ રાજવીર ઓનલાઇન સર્વિસીસને મારી અરજી પ્રક્રિયા પૂર્ણ કરવા માટે આ માહિતી આપવા સંમત છું. હું જાણું છું કે આ એક સ્વતંત્ર ખાનગી સહાય કેન્દ્ર છે અને અરજીની અંતિમ મંજૂરી સંબંધિત સરકારી વિભાગ અથવા બેંક દ્વારા લેવામાં આવે છે. <span className="text-rose-600 font-bold">*</span>
                  </span>
                </label>
              </div>

              {/* Fee Notice */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>કુલ સહાય ફી:</span>
                <span className="text-base font-extrabold text-blue-950">
                  ₹{currentService.fee}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>પાછળ જાઓ</span>
                </button>

                <button
                  type="button"
                  disabled={submitting || !consentGiven}
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  {submitting ? (
                    <span>નોંધણી થઈ રહી છે...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>અરજી કન્ફર્મ કરો</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Reference Number Slip */}
          {step === 4 && submissionResult && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-blue-950">
                  અરજી સફળતાપૂર્વક નોંધાઈ ગઈ છે!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  રાજવીર ઓનલાઇન સર્વિસીસ વારાહી ખાતે તમારી અરજી પ્રાપ્ત થઈ છે.
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="bg-slate-50 border-2 border-dashed border-blue-900/40 rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    તમારો અરજી સંદર્ભ નંબર (Ref No):
                  </span>
                  <button
                    onClick={copyRefToClipboard}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>કૉપિ</span>
                  </button>
                </div>

                <div className="text-2xl font-black text-blue-950 tracking-wider font-mono bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                  {submissionResult.refNumber}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">અરજદારનું નામ:</span>
                    <span className="font-semibold">{submissionResult.applicantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">સેવા:</span>
                    <span className="font-semibold">{submissionResult.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">સહાય ફી:</span>
                    <span className="font-bold text-blue-900">₹{submissionResult.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">દસ્તાવેજ પદ્ધતિ:</span>
                    <span className="font-medium">
                      {submissionResult.submissionMethod === 'online_upload'
                        ? 'ઓનલાઇન અપલોડ કરેલ'
                        : 'કેન્દ્ર પર રૂબરૂ મુલાકાત'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Visit Instructions if needed */}
              <div className="p-3.5 rounded-xl bg-blue-50 text-xs text-blue-950 text-left border border-blue-200">
                <span className="font-bold">કેન્દ્ર મુલાકાત સૂચના:</span>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  જો તમે રૂબરૂ દસ્તાવેજ આપવાનો વિકલ્પ પસંદ કર્યો હોય, તો ઉપર દર્શાવેલ અરજી નંબર સાથે અંબિકા સોસાયટી પાસે, વારાહી સ્થિત કેન્દ્ર પર આવી શકો છો.
                </p>
              </div>

              {/* Action Buttons: Track Status & Pay Fee */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    openTrackModal(submissionResult.refNumber);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>લાઈવ સ્ટેટસ તપાસો</span>
                </button>

                <button
                  onClick={() => {
                    handleClose();
                    openPaymentModal(submissionResult.refNumber, submissionResult.fee);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>ઓનલાઇન ફી ચૂકવો (₹{submissionResult.fee})</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

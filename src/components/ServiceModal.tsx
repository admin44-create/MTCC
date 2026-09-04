import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Printer, 
  Download, 
  QrCode, 
  Clock, 
  Check, 
  AlertTriangle,
  Building,
  User,
  Phone,
  CreditCard,
  Lock,
  Smartphone,
  Copy,
  CheckCheck,
  Wallet,
  Landmark,
  Package,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Banknote,
  Zap,
  ChevronDown,
  Building2,
  Receipt
} from 'lucide-react';
import { ServiceItem, Language, ApplicationRecord, CustomerUser, SiteSettings } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  language: Language;
  onClose: () => void;
  onSubmitApplication: (application: ApplicationRecord) => void;
  onGoToTrack: (trackingId: string) => void;
  customer?: CustomerUser | null;
  siteSettings?: SiteSettings;
  onOpenCustomerLogin?: () => void;
  onOpenCustomerRegister?: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  language,
  onClose,
  onSubmitApplication,
  onGoToTrack,
  customer,
  siteSettings,
  onOpenCustomerLogin,
  onOpenCustomerRegister,
}) => {
  if (!service) return null;

  const isBn = language === 'bn';
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State - initialized with customer if available
  const [fullName, setFullName] = useState(customer?.name || '');
  const [mobile, setMobile] = useState(customer?.mobile || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(!!customer);
  const [aadhaar, setAadhaar] = useState(customer?.aadhaar || '');
  const [district, setDistrict] = useState(customer?.district || 'North 24 Parganas');
  const [address, setAddress] = useState(customer?.address || '');
  const [pincode, setPincode] = useState(customer?.pincode || '');

  // Keep form updated if customer changes
  useEffect(() => {
    if (customer) {
      setFullName(customer.name || '');
      setMobile(customer.mobile || '');
      setAadhaar(customer.aadhaar || '');
      setDistrict(customer.district || 'North 24 Parganas');
      setAddress(customer.address || '');
      setPincode(customer.pincode || '');
      setIsOtpVerified(true);
    }
  }, [customer]);

  // Dynamic Service Fields
  const [serviceFieldsData, setServiceFieldsData] = useState<Record<string, string>>({});

  // Document Uploads
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Delivery Choice
  const isPvcCard = service.id === 'pvc-smart-card';
  const [deliveryMode, setDeliveryMode] = useState<'speed_post' | 'digital_only' | 'kendra_pickup'>(
    isPvcCard ? 'speed_post' : 'speed_post'
  );
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Payment Gateway States - All Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'paylater' | 'kendra_cash'>('upi');
  const [upiApp, setUpiApp] = useState<'qr' | 'phonepe' | 'gpay' | 'paytm' | 'bhim' | 'amazonpay' | 'cred' | 'whatsapp' | 'navi' | 'supermoney' | 'custom'>('qr');
  const [customUpiId, setCustomUpiId] = useState(customer?.mobile ? `${customer.mobile}@upi` : '');
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [selectedWallet, setSelectedWallet] = useState<'digipay' | 'paytm' | 'phonepe' | 'amazonpay' | 'mobikwik' | 'freecharge' | 'airtel' | 'jiomoney'>('digipay');
  const [selectedPayLater, setSelectedPayLater] = useState<'lazypay' | 'simpl' | 'amazon_paylater' | 'icici_paylater' | 'hdfc_flexipay'>('lazypay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(customer?.name || '');
  const [saveCardChecked, setSaveCardChecked] = useState(true);
  const [hasCopiedUpiLink, setHasCopiedUpiLink] = useState(false);
  const [qrTimer, setQrTimer] = useState(300); // 5 min countdown
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProcessingStatus, setPaymentProcessingStatus] = useState('');

  // Countdown timer for QR
  useEffect(() => {
    if (step === 3 && paymentMethod === 'upi') {
      const interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, paymentMethod]);

  // Generated Acknowledgment
  const [generatedRecord, setGeneratedRecord] = useState<ApplicationRecord | null>(null);
  const [hasCopiedTracking, setHasCopiedTracking] = useState(false);
  const [hasCopiedSpeedPost, setHasCopiedSpeedPost] = useState(false);

  const gwConfig = siteSettings?.gatewayConfig;
  const isUpiEnabled = gwConfig ? gwConfig.upi !== false : true;
  const isCardEnabled = gwConfig ? gwConfig.card !== false : true;
  const isNetbankingEnabled = gwConfig ? gwConfig.netbanking !== false : true;
  const isWalletEnabled = gwConfig ? gwConfig.wallet !== false : true;
  const isPaylaterEnabled = gwConfig ? gwConfig.paylater !== false : true;
  const isCashEnabled = gwConfig ? gwConfig.kendraCash !== false : true;
  const activeMerchantUpi = gwConfig?.merchantUpiId || 'ezyseva.pay@gov.in';
  const activeMerchantName = gwConfig?.merchantName || siteSettings?.portalName || 'EzySeva';

  const convenienceFee = gwConfig?.zeroConvenienceFee ? 0 : service.convenienceFee;
  const totalFee = service.govtFee + convenienceFee;

  const handleFieldChange = (fieldId: string, value: string) => {
    setServiceFieldsData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSendOtp = () => {
    if (mobile.length >= 10) {
      setOtpSent(true);
      setOtpValue('4921'); // Pre-fill mock OTP for smooth usability
    }
  };

  const handleVerifyOtp = () => {
    if (otpValue === '4921' || otpValue.length === 4) {
      setIsOtpVerified(true);
    }
  };

  const handleSimulateUpload = (docName: string) => {
    if (!uploadedFiles.includes(docName)) {
      setUploadedFiles((prev) => [...prev, docName]);
    }
  };

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCopyText = (text: string, type: 'tracking' | 'speedpost') => {
    navigator.clipboard.writeText(text);
    if (type === 'tracking') {
      setHasCopiedTracking(true);
      setTimeout(() => setHasCopiedTracking(false), 2000);
    } else {
      setHasCopiedSpeedPost(true);
      setTimeout(() => setHasCopiedSpeedPost(false), 2000);
    }
  };

  // Payment Gateway Execution Flow
  const handleFinalSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationAccepted) return;

    setIsProcessingPayment(true);
    setPaymentProcessingStatus(
      isBn ? 'পেমেন্ট গেটওয়েতে সুরক্ষিত সংযোগ স্থাপন করা হচ্ছে...' : 'Connecting to Bank / NPCI Payment Gateway...'
    );

    setTimeout(() => {
      setPaymentProcessingStatus(
        isBn ? 'লেনদেন অনুমোদন ও যাচাই সম্পন্ন হচ্ছে...' : 'Authorizing Transaction & Generating Official Records...'
      );
    }, 800);

    setTimeout(() => {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const isPvc = service.id === 'pvc-smart-card';
      const trackingId = isPvc ? `PVC-2026-${randomSuffix}` : `EZS-2026-${randomSuffix}`;

      // India Post Speed Post consignment number generation
      const needSpeedPost = isPvc || deliveryMode === 'speed_post';
      const speedPostNumber = needSpeedPost
        ? `SP${Math.floor(10000000 + Math.random() * 9000000)}IN`
        : undefined;

      let methodLabel = 'UPI / QR Code';
      if (paymentMethod === 'upi') {
        if (upiApp === 'phonepe') methodLabel = 'UPI (PhonePe)';
        else if (upiApp === 'gpay') methodLabel = 'UPI (Google Pay)';
        else if (upiApp === 'paytm') methodLabel = 'UPI (Paytm)';
        else if (upiApp === 'bhim') methodLabel = 'UPI (BHIM)';
        else if (upiApp === 'amazonpay') methodLabel = 'UPI (Amazon Pay)';
        else if (upiApp === 'cred') methodLabel = 'UPI (CRED)';
        else if (upiApp === 'whatsapp') methodLabel = 'UPI (WhatsApp Pay)';
        else if (upiApp === 'navi') methodLabel = 'UPI (Navi)';
        else if (upiApp === 'supermoney') methodLabel = 'UPI (Super.money)';
        else if (upiApp === 'custom') methodLabel = `UPI (${customUpiId || 'VPA'})`;
        else methodLabel = 'UPI (Scan & Pay QR)';
      } else if (paymentMethod === 'card') {
        methodLabel = `Debit / Credit Card (${cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'MasterCard' : 'RuPay'})`;
      } else if (paymentMethod === 'netbanking') {
        methodLabel = `Net Banking (${selectedBank.toUpperCase()})`;
      } else if (paymentMethod === 'wallet') {
        methodLabel = `Digital Wallet (${selectedWallet === 'digipay' ? 'EzySeva DigiPay' : selectedWallet.toUpperCase()})`;
      } else if (paymentMethod === 'paylater') {
        methodLabel = `Pay Later BNPL (${selectedPayLater.toUpperCase()})`;
      } else if (paymentMethod === 'kendra_cash') {
        methodLabel = 'Counter Cash Deposit (Challan)';
      }

      const txnId = `TXN-${paymentMethod.toUpperCase()}-2026${randomSuffix}`;

      const newRecord: ApplicationRecord = {
        trackingId,
        serviceId: service.id,
        serviceNameEn: service.titleEn,
        serviceNameBn: service.titleBn,
        applicantName: fullName || customer?.name || 'Citizen Applicant',
        mobile: mobile || customer?.mobile || '9830149210',
        aadhaarLast4: aadhaar ? aadhaar.slice(-4) : (customer?.aadhaar?.slice(-4) || '4921'),
        appliedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        expectedDate: isPvc ? '07 Mar 2026' : '10 Mar 2026',
        status: isPvc ? 'ready_for_dispatch' : 'submitted',
        currentStageNumber: isPvc ? 2 : 1,
        kendraAssignedEn: `EzySeva Regional Facilitation Center - ${district}`,
        kendraAssignedBn: `ইজি সেবা আঞ্চলিক সহায়তা কেন্দ্র - ${district}`,
        remarksEn: isPvc
          ? `PVC Card payment verified (Txn: ${txnId}). Hologram printing queued. Dispatched via India Post Speed Post: ${speedPostNumber}.`
          : `Application payment of ₹${totalFee} settled successfully (Txn: ${txnId}). Initial digital document verification initiated.`,
        remarksBn: isPvc
          ? `পিভিসি কার্ড পেমেন্ট সম্পন্ন (লেনদেন আইডি: ${txnId})। সিকিউরিটি হলোগ্রাম প্রিন্টিং ও ভারতীয় ডাক স্পিড পোস্টে প্রেরণের প্রস্তুতি চলছে (কনসাইনমেন্ট: ${speedPostNumber})।`
          : `আবেদনের ফি ₹${totalFee} সফলভাবে জমা হয়েছে (লেনদেন আইডি: ${txnId})। প্রাথমিক ডিজিটাল নথি যাচাইকরণ শুরু হয়েছে।`,
        formData: {
          ...serviceFieldsData,
          district,
          address,
          pincode,
          deliveryMode,
        },
        feePaid: totalFee,
        customerId: customer?.id || 'CUST-REGISTERED',
        deliveryMode,
        speedPostNumber,
        paymentMethod: methodLabel,
        paymentTransactionId: txnId,
        paymentStatus: 'paid',
      };

      setGeneratedRecord(newRecord);
      onSubmitApplication(newRecord);
      setIsProcessingPayment(false);
      setStep(5);
    }, 1600);
  };

  // BARRIER SCREEN: If customer is NOT logged in, enforce customer ID requirement
  if (!customer) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col p-6 sm:p-8 text-white text-center space-y-5">
          {/* Lock / ID Requirement Graphic */}
          <div className="relative mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-black items-center justify-center">!</span>
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isBn ? 'গ্রাহক আইডি আবশ্যক' : 'Customer ID Required'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-3">
              {isBn ? 'পরিষেবা নিতে গ্রাহক আইডি তৈরি করা বাধ্যতামূলক' : 'Sign In or Register Customer ID to Continue'}
            </h2>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">
              {isBn
                ? `"${service.titleBn}" আবেদন করতে বা পিভিসি কার্ড অর্ডার করতে গ্রাহক আইডি তৈরি করা প্রয়োজন। এতে আপনার পেমেন্ট সুরক্ষিত থাকে এবং স্পিড পোস্ট কনসাইনমেন্ট নম্বর দিয়ে পার্সেল ট্র্যাক করা যায়।`
                : `To order "${service.titleEn}" or smart PVC cards, a customer account is mandatory. This ensures verified payments, Speed Post tracking, and digital receipt retention.`}
            </p>
          </div>

          {/* Benefits Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left text-xs space-y-2.5">
            <div className="flex items-start gap-2.5 text-white/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isBn ? 'ভারতীয় ডাক স্পিড পোস্ট কনসাইনমেন্ট ও লাইভ ট্র্যাকিং' : 'India Post Speed Post consignment & parcel tracking'}</span>
            </div>
            <div className="flex items-start gap-2.5 text-white/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isBn ? 'সুরক্ষিত পেমেন্ট গেটওয়ে (UPI, QR, Card, NetBanking)' : 'Secure payment gateway settlement & instant invoice generation'}</span>
            </div>
            <div className="flex items-start gap-2.5 text-white/90">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isBn ? 'অটো-ফিল নাগরিক প্রোফাইল ও আজীবন ডিজিটাল রসিদ ব্যাকআপ' : 'Auto-filled profile & lifetime digital document storage'}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomerLogin?.();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{isBn ? 'লগইন করুন (Customer Sign In)' : 'Customer Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomerRegister?.();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'নতুন আইডি তৈরি করুন (বিনামূল্যে)' : 'Register Customer ID (Free)'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            {isBn ? 'ফিরে যান' : 'Cancel & Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh] text-white">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md">
                {isBn ? 'অফিসিয়াল আবেদন পোর্টাল' : 'Official Application Flow'}
              </span>
              <span className="text-xs text-white/60 font-semibold">
                {isBn ? service.officialGovtBodyBn : service.officialGovtBodyEn}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              {isBn ? service.titleBn : service.titleEn}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 py-2.5 bg-white/[0.02] border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-white/50">
              <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>
                1. {isBn ? 'নাগরিক তথ্য' : 'Citizen Info'}
              </span>
              <span className="text-white/20">→</span>
              <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>
                2. {isBn ? 'পরিষেবা ফর্ম' : 'Service Details'}
              </span>
              <span className="text-white/20">→</span>
              <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>
                3. {isBn ? 'নথি আপলোড' : 'Documents'}
              </span>
              <span className="text-white/20">→</span>
              <span className={step >= 4 ? 'text-blue-400 font-bold' : ''}>
                4. {isBn ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateway'}
              </span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Verified Customer Banner */}
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>{isBn ? 'যাচাইকৃত গ্রাহক আইডি:' : 'Verified Customer ID:'}</span>
                      <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-white">{customer.id}</span>
                    </div>
                    <div className="text-[11px] text-white/60">
                      {isBn
                        ? `লগইন ব্যবহারকারী: ${customer.name} (${customer.mobile})`
                        : `Logged in as: ${customer.name} (${customer.mobile})`}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 rounded-lg shrink-0 hidden sm:inline-block">
                  {isBn ? 'অটো-ভেরিফায়েড' : 'Auto-Verified'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  {isBn ? 'আবেদনকারীর পুরো নাম (আধার অনুযায়ী) *' : 'Applicant Full Name (as on Aadhaar) *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isBn ? 'যেমন: সুবীর কুমার দাস' : 'e.g. Subir Kumar Das'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'মোবাইল নম্বর *' : 'Active Mobile Number *'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98301XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden transition-colors font-mono"
                    />
                    {!isOtpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={mobile.length < 10}
                        className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 text-xs font-bold rounded-xl disabled:opacity-50 shrink-0 transition-colors"
                      >
                        {otpSent ? (isBn ? 'পুনরায় পাঠান' : 'Resend') : (isBn ? 'ওটিপি দিন' : 'Send OTP')}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'আধার নম্বর (১২ সংখ্যা) *' : 'Aadhaar Number (12 Digits) *'}
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXX XXXX 4921"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden transition-colors font-mono"
                  />
                </div>
              </div>

              {/* OTP Input box if mobile changed */}
              {otpSent && !isOtpVerified && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      {isBn ? 'মোবাইলে পাঠানো ওটিপি দিন (টেস্ট ওটিপি: 4921)' : 'Enter OTP sent to phone (Test OTP: 4921)'}
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-24 px-2 py-1 mt-1 text-center font-mono font-bold tracking-widest text-sm bg-white/10 border border-amber-400/40 text-white rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    {isBn ? 'যাচাই করুন' : 'Verify'}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'জেলা *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#14142b] text-white text-sm focus:border-blue-400 focus:outline-hidden"
                  >
                    {[
                      'Kolkata',
                      'North 24 Parganas',
                      'South 24 Parganas',
                      'Howrah',
                      'Hooghly',
                      'Purba Bardhaman',
                      'Paschim Bardhaman',
                      'Nadia',
                      'Murshidabad',
                      'Siliguri / Darjeeling',
                      'Purba Medinipur',
                      'Paschim Medinipur',
                      'Bankura',
                      'Birbhum',
                      'Malda',
                    ].map((d) => (
                      <option key={d} value={d} className="bg-[#0e0e24] text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'পিন কোড *' : 'PIN Code *'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="700124"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 mb-1">
                  {isBn ? 'সম্পূর্ণ আবাসিক/ডেলিভারি ঠিকানা *' : 'Full Residential / Delivery Address *'}
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isBn ? 'বাড়ি নং, রাস্তা, গ্রাম/শহর, পোস্ট অফিস ইত্যাদি' : 'House no, Street, Village/City, Post Office'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Service-Specific Fields */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-white/60">
                {isBn ? `${service.titleBn} এর জন্য প্রয়োজনীয় সরকারি তথ্য পূরণ করুন:` : `Please provide the specific details required for ${service.titleEn}:`}
              </div>

              {service.fields.map((f) => (
                <div key={f.id}>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? f.labelBn : f.labelEn} {f.required && '*'}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      value={serviceFieldsData[f.id] || ''}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#14142b] text-white text-sm focus:border-blue-400 focus:outline-hidden"
                    >
                      <option value="" className="bg-[#0e0e24] text-white">{isBn ? '-- নির্বাচন করুন --' : '-- Please Select --'}</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0e0e24] text-white">
                          {isBn ? opt.labelBn : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={2}
                      value={serviceFieldsData[f.id] || ''}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      placeholder={isBn ? f.placeholderBn : f.placeholderEn}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={serviceFieldsData[f.id] || ''}
                      onChange={(e) => handleFieldChange(f.id, e.target.value)}
                      placeholder={isBn ? f.placeholderBn : f.placeholderEn}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-sm focus:border-blue-400 focus:bg-white/10 focus:outline-hidden"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Document Uploads */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-white/70">
                {isBn
                  ? 'নিম্নলিখিত নথিগুলি স্ক্যান বা ছবি আপলোড করুন (সর্বোচ্চ ৫ MB, JPG/PDF):'
                  : 'Upload clean scanned copies or clear photos of required documents (Max 5 MB, JPG/PDF):'}
              </div>

              <div className="space-y-2.5">
                {(isBn ? service.requiredDocsBn : service.requiredDocsEn).map((doc, index) => {
                  const isUploaded = uploadedFiles.includes(doc);
                  return (
                    <div
                      key={index}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUploaded
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                          : 'bg-white/5 border-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isUploaded ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {isUploaded ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{doc}</div>
                          <div className="text-[11px] text-white/50">
                            {isUploaded ? (isBn ? 'নথি আপলোড সম্পন্ন (যাচাইকৃত)' : 'Uploaded & Verified (PDF - 420 KB)') : (isBn ? 'আপলোড প্রয়োজন' : 'Required')}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isUploaded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 border border-blue-400/30'
                        }`}
                      >
                        {isUploaded ? (isBn ? 'পরিবর্তন করুন' : 'Change') : (isBn ? 'ফাইল আপলোড' : 'Upload File')}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Upload all shortcut for demo convenience */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    const all = isBn ? service.requiredDocsBn : service.requiredDocsEn;
                    setUploadedFiles(all);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold underline"
                >
                  {isBn ? 'সমস্ত নথি এক ক্লিকে আপলোড ডেমো' : 'Quick Attach All Demo Documents'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT GATEWAY (Requested: "payment getaway de") */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Delivery Preference */}
              <div>
                <label className="block text-xs font-bold text-white/80 mb-2">
                  {isBn ? 'ডেলিভারি পদ্ধতি নির্বাচন করুন:' : 'Select Delivery Preference:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('speed_post')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMode === 'speed_post'
                        ? 'border-amber-400 bg-amber-500/20 font-bold text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <Package className="w-3.5 h-3.5" />
                      <span>{isBn ? 'স্পিড পোস্ট হোম ডেলিভারি' : 'Speed Post to Home'}</span>
                    </div>
                    <div className="text-[10px] text-white/50 mt-1">
                      {isBn ? 'ভারতীয় ডাক ট্র্যাকিং নম্বর সহ' : 'Includes India Post Consignment No.'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('digital_only')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMode === 'digital_only'
                        ? 'border-blue-400 bg-blue-500/20 font-bold text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold">{isBn ? 'ডিজিটাল কপি (e-Copy)' : 'Digital e-Copy Only'}</div>
                    <div className="text-[10px] text-white/50 mt-1">{isBn ? 'তাৎক্ষণিক ডাউনলোড' : 'Instant portal download'}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('kendra_pickup')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMode === 'kendra_pickup'
                        ? 'border-blue-400 bg-blue-500/20 font-bold text-white shadow-md'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold">{isBn ? 'কেন্দ্র থেকে সংগ্রহ' : 'Collect from Kendra'}</div>
                    <div className="text-[10px] text-white/50 mt-1">{isBn ? 'কাউন্টার পিকআপ' : 'Physical kiosk counter'}</div>
                  </button>
                </div>
              </div>

              {/* Fee Breakdown Summary */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-3.5 text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                  <span className="font-bold text-white">
                    {isBn ? 'সরকারি ফি ও সার্ভিস চার্জ হিসেব:' : 'Official Fee Breakdown:'}
                  </span>
                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    {isBn ? 'নিরাপদ গেটওয়ে' : 'Secure Gateway'}
                  </span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{isBn ? 'সরকারি ফি / স্মার্ট কার্ড উৎপাদন:' : 'Government / Smart Card Printing Fee:'}</span>
                  <span className="font-mono font-bold text-white">₹{service.govtFee}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>{isBn ? 'ইজি সেবা কেন্দ্র ও ডাক হ্যান্ডলিং ফি:' : 'EzySeva Portal & Postal Handling:'}</span>
                  <span className="font-mono font-bold text-white">₹{service.convenienceFee}</span>
                </div>
                <div className="flex justify-between text-white font-extrabold text-sm border-t border-white/10 pt-2">
                  <span>{isBn ? 'মোট প্রদেয় অর্থ (Total Payable):' : 'Total Amount Payable:'}</span>
                  <span className="text-blue-400 font-mono text-base">₹{totalFee}</span>
                </div>
              </div>

              {/* PAYMENT GATEWAY INTERFACE */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/15 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{isBn ? 'ইজি সেবা সুরক্ষিত পেমেন্ট গেটওয়ে' : 'EzySeva Secure Payment Gateway'}</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded font-mono">
                          256-BIT SSL
                        </span>
                      </div>
                      <div className="text-[10px] text-white/50">
                        {isBn ? 'NPCI / RBI অনুমোদিত তাৎক্ষণিক লেনদেন' : 'NPCI / RBI Compliant Instant Settlement'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40">{isBn ? 'প্রদেয়:' : 'Pay:'}</span>
                    <span className="font-mono font-black text-sm text-emerald-400 block">₹{totalFee}</span>
                  </div>
                </div>

                {/* Gateway Tabs - ALL OPTIONS */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[10px] sm:text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>{isBn ? 'কার্ড' : 'Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'netbanking'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Landmark className="w-3 h-3" />
                    <span>{isBn ? 'ব্যাংকিং' : 'NetBank'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'wallet'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Wallet className="w-3 h-3" />
                    <span>{isBn ? 'ওয়ালেট' : 'Wallet'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paylater')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'paylater'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isBn ? 'পে লেটার' : 'PayLater'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kendra_cash')}
                    className={`py-1.5 px-1 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                      paymentMethod === 'kendra_cash'
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-3 h-3" />
                    <span>{isBn ? 'ক্যাশ জমা' : 'Cash'}</span>
                  </button>
                </div>

                {/* TAB 1: UPI & QR CODE */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-3 pt-1">
                    {/* QR Code & 1-Tap Apps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      {/* Interactive Dynamic QR Code Box */}
                      <div className="bg-black/40 border border-white/15 rounded-xl p-3 text-center space-y-2">
                        <div className="relative inline-block mx-auto bg-white p-2.5 rounded-xl shadow-inner">
                          {/* Simulated high-fidelity QR Code */}
                          <div className="w-32 h-32 bg-[#000] rounded-lg relative overflow-hidden flex flex-col items-center justify-center">
                            {/* Scanning radar line */}
                            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-pulse top-1/2 -translate-y-1/2" />
                            
                            {/* Corner anchors */}
                            <div className="absolute top-2 left-2 w-6 h-6 border-4 border-white bg-black flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-white"></div>
                            </div>
                            <div className="absolute top-2 right-2 w-6 h-6 border-4 border-white bg-black flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-white"></div>
                            </div>
                            <div className="absolute bottom-2 left-2 w-6 h-6 border-4 border-white bg-black flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-white"></div>
                            </div>
                            
                            {/* Center emblem */}
                            <div className="bg-blue-600 text-white rounded p-1 shadow-md border border-white z-10">
                              <QrCode className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">
                          <span>{isBn ? 'যেকোনো UPI অ্যাপ দিয়ে স্ক্যান করুন' : 'Scan with Any UPI App'}</span>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            {Math.floor(qrTimer / 60)}:{String(qrTimer % 60).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                          <span>UPI ID: {activeMerchantUpi}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`upi://pay?pa=${activeMerchantUpi}&pn=${encodeURIComponent(activeMerchantName)}&am=${totalFee}`);
                              setHasCopiedUpiLink(true);
                              setTimeout(() => setHasCopiedUpiLink(false), 2000);
                            }}
                            className="text-white/60 hover:text-white"
                            title={isBn ? 'UPI লিঙ্ক কপি করুন' : 'Copy UPI Link'}
                          >
                            {hasCopiedUpiLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {/* 1-Tap UPI Apps - Extended List */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-white/70">
                          {isBn ? 'অথবা পছন্দের ১-ক্লিক UPI অ্যাপ বেছে নিন:' : 'Or choose your preferred 1-click UPI app:'}
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setUpiApp('phonepe')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'phonepe'
                                ? 'bg-purple-600/30 border-purple-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">Pe</span>
                            <span>PhonePe</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('gpay')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'gpay'
                                ? 'bg-blue-600/30 border-blue-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">G</span>
                            <span>G-Pay</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('paytm')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'paytm'
                                ? 'bg-sky-600/30 border-sky-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-black">P</span>
                            <span>Paytm</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('bhim')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'bhim'
                                ? 'bg-amber-600/30 border-amber-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">B</span>
                            <span>BHIM</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('amazonpay')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'amazonpay'
                                ? 'bg-orange-600/30 border-orange-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">a</span>
                            <span>Amazon</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('cred')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'cred'
                                ? 'bg-zinc-700/60 border-zinc-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-white/30 text-white flex items-center justify-center text-[9px] font-black">C</span>
                            <span>CRED</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('whatsapp')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'whatsapp'
                                ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">W</span>
                            <span>WhatsApp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('navi')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'navi'
                                ? 'bg-teal-600/30 border-teal-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-black">N</span>
                            <span>Navi UPI</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUpiApp('supermoney')}
                            className={`p-1.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all ${
                              upiApp === 'supermoney'
                                ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold'
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-black">S</span>
                            <span>Super.money</span>
                          </button>
                        </div>

                        {/* Custom UPI ID Input */}
                        <div className="pt-1">
                          <label className="block text-[10px] font-semibold text-white/60 mb-1">
                            {isBn ? 'অন্যান্য UPI আইডি লিখুন (VPA):' : 'Enter Other UPI ID / VPA:'}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customUpiId}
                              onChange={(e) => {
                                setCustomUpiId(e.target.value);
                                setUpiApp('custom');
                              }}
                              placeholder="9830149210@upi"
                              className="w-full px-3 py-1.5 rounded-xl border border-white/15 bg-black/30 text-white text-xs placeholder-white/30 font-mono focus:border-blue-400 focus:outline-hidden"
                            />
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1.5 rounded-xl flex items-center shrink-0 font-mono">
                              Verified
                            </span>
                          </div>
                          {/* Quick UPI Handle Suffixes */}
                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                            {['@okaxis', '@okhdfcbank', '@ybl', '@ibl', '@paytm'].map((handle) => (
                              <button
                                key={handle}
                                type="button"
                                onClick={() => {
                                  const prefix = customUpiId.split('@')[0] || (customer?.mobile || '9830149210');
                                  setCustomUpiId(`${prefix}${handle}`);
                                  setUpiApp('custom');
                                }}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10"
                              >
                                {handle}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CREDIT / DEBIT CARD */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-1">
                    {/* Live Virtual Card Preview */}
                    <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-400/30 p-4 shadow-xl overflow-hidden text-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-6 rounded bg-amber-400/80 flex items-center justify-center text-black font-bold text-[9px] shadow-sm">
                            CHIP
                          </div>
                          <span className="text-[10px] font-semibold text-white/60 tracking-wider">SECURE DIGITAL CARD</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                            {cardNumber.startsWith('4')
                              ? 'VISA'
                              : cardNumber.startsWith('5')
                              ? 'MASTERCARD'
                              : cardNumber.startsWith('6')
                              ? 'RUPAY'
                              : 'RUPAY / VISA'}
                          </span>
                        </div>
                      </div>

                      <div className="font-mono text-base sm:text-lg tracking-widest font-extrabold text-blue-100 my-2">
                        {cardNumber || '•••• •••• •••• 4242'}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/70 pt-2 border-t border-white/10">
                        <div>
                          <div className="text-[8px] uppercase tracking-wider text-white/40">CARDHOLDER</div>
                          <div className="font-bold tracking-wide uppercase truncate max-w-[150px]">
                            {cardHolder || (customer?.name || 'CITIZEN APPLICANT')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] uppercase tracking-wider text-white/40">EXPIRES</div>
                          <div className="font-mono font-bold">{cardExpiry || '08/29'}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        {isBn ? 'কার্ড নম্বর (১৬ সংখ্যা) *' : 'Card Number (16 Digits) *'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="•••• •••• •••• 4242"
                          className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/30 text-white text-xs placeholder-white/30 font-mono focus:border-blue-400 focus:outline-hidden"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded">
                            RuPay
                          </span>
                          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                            Visa
                          </span>
                          <span className="text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-400/30 px-1.5 py-0.5 rounded">
                            MasterCard
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-white/70 mb-1">
                          {isBn ? 'কার্ডধারকের নাম' : 'Cardholder Name'}
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="SUBIR KUMAR DAS"
                          className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-black/30 text-white text-xs uppercase placeholder-white/30 focus:border-blue-400 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            {isBn ? 'মেয়াদ (MM/YY)' : 'Expiry'}
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => handleCardExpiryChange(e.target.value)}
                            placeholder="08/29"
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-black/30 text-white text-xs text-center font-mono placeholder-white/30 focus:border-blue-400 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-black/30 text-white text-xs text-center font-mono placeholder-white/30 focus:border-blue-400 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RBI Tokenization Checkbox */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-white/60">
                      <input
                        type="checkbox"
                        id="save-card-rbi"
                        checked={saveCardChecked}
                        onChange={(e) => setSaveCardChecked(e.target.checked)}
                        className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                      />
                      <label htmlFor="save-card-rbi" className="cursor-pointer">
                        {isBn
                          ? 'RBI টোকেনাইজেশন নির্দেশিকা অনুযায়ী এই কার্ড সুরক্ষিতভাবে সংরক্ষণ করুন'
                          : 'Save this card securely per RBI tokenization guidelines'}
                      </label>
                    </div>
                  </div>
                )}

                {/* TAB 3: NET BANKING - 50+ BANKS */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 pt-1">
                    <div className="text-[11px] font-semibold text-white/70">
                      {isBn ? 'শীর্ষ ভারতীয় বাণিজ্যিক ও গ্রামীণ ব্যাংক:' : 'Top Indian Commercial & Rural Banks:'}
                    </div>
                    {/* 12 Instant 1-Click Banks */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
                        { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
                        { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
                        { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
                        { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
                        { id: 'bob', name: 'Bank of Baroda', code: 'BOB' },
                        { id: 'canara', name: 'Canara Bank', code: 'CANARA' },
                        { id: 'union', name: 'Union Bank of India', code: 'UBI' },
                        { id: 'bgvb', name: 'Bangiya Gramin Vikash', code: 'BGVB' },
                        { id: 'pbgb', name: 'Paschim Banga Gramin', code: 'PBGB' },
                        { id: 'wbscb', name: 'WB State Co-op Bank', code: 'WBSCB' },
                        { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KOTAK' },
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            selectedBank === bank.id
                              ? 'bg-blue-600/30 border-blue-400 text-white font-bold shadow-sm'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <div className="font-mono text-[9px] text-blue-300 font-bold">{bank.code}</div>
                          <div className="truncate text-[11px] font-semibold">{bank.name}</div>
                        </button>
                      ))}
                    </div>

                    {/* All 50+ Banks Select Dropdown */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-semibold text-white/70 mb-1">
                        {isBn ? 'অন্যান্য সমস্ত ব্যাংক (৫০+ ব্যাংক তালিকা):' : 'Or select from all 50+ Indian Banks:'}
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/20 bg-[#0d1226] text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      >
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="pnb">Punjab National Bank (PNB)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="canara">Canara Bank</option>
                        <option value="union">Union Bank of India</option>
                        <option value="bgvb">Bangiya Gramin Vikash Bank (West Bengal)</option>
                        <option value="pbgb">Paschim Banga Gramin Bank (West Bengal)</option>
                        <option value="wbscb">West Bengal State Co-operative Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="indusind">IndusInd Bank</option>
                        <option value="boi">Bank of India (BOI)</option>
                        <option value="cbi">Central Bank of India</option>
                        <option value="idbi">IDBI Bank</option>
                        <option value="indian">Indian Bank</option>
                        <option value="iob">Indian Overseas Bank</option>
                        <option value="uco">UCO Bank</option>
                        <option value="federal">Federal Bank</option>
                        <option value="yes">Yes Bank</option>
                        <option value="bandhan">Bandhan Bank</option>
                        <option value="idfc">IDFC FIRST Bank</option>
                        <option value="rbl">RBL Bank</option>
                        <option value="south_indian">South Indian Bank</option>
                        <option value="au">AU Small Finance Bank</option>
                        <option value="equitas">Equitas Small Finance Bank</option>
                        <option value="ujjivan">Ujjivan Small Finance Bank</option>
                        <option value="jk">Jammu & Kashmir Bank</option>
                        <option value="karur">Karur Vysya Bank</option>
                        <option value="city_union">City Union Bank</option>
                        <option value="karnataka">Karnataka Bank</option>
                        <option value="ippb">India Post Payments Bank (IPPB)</option>
                        <option value="airtel_bank">Airtel Payments Bank</option>
                        <option value="fino">Fino Payments Bank</option>
                        <option value="tripura_gb">Tripura Gramin Bank</option>
                        <option value="assam_gb">Assam Gramin Vikash Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* TAB 4: WALLETS - 8 OPTIONS */}
                {paymentMethod === 'wallet' && (
                  <div className="space-y-3 pt-1">
                    {/* Citizen DigiPay Wallet */}
                    <div 
                      onClick={() => setSelectedWallet('digipay')}
                      className={`cursor-pointer border rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                        selectedWallet === 'digipay'
                          ? 'bg-blue-600/20 border-blue-400 shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>EzySeva Citizen DigiPay Wallet</span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">
                              Instant 0 Fee
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50">
                            {isBn ? 'গ্রাহক অ্যাকাউন্টে সংরক্ষিত ওয়ালেট ব্যালেন্স' : 'Available balance in customer account'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/50">{isBn ? 'ব্যালেন্স:' : 'Balance:'}</span>
                        <div className="font-mono font-black text-emerald-400 text-sm">
                          ₹{customer.walletBalance || 0}
                        </div>
                      </div>
                    </div>

                    {/* 7 Other Major Digital Wallets */}
                    <div className="text-[11px] font-semibold text-white/70 pt-1">
                      {isBn ? 'অথবা অন্যান্য ডিজিটাল ওয়ালেট নির্বাচন করুন:' : 'Or choose external digital wallet:'}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'paytm', name: 'Paytm Wallet', badge: 'Paytm' },
                        { id: 'phonepe', name: 'PhonePe Wallet', badge: 'PhonePe' },
                        { id: 'amazonpay', name: 'Amazon Pay', badge: 'Amazon' },
                        { id: 'mobikwik', name: 'MobiKwik', badge: 'MobiKwik' },
                        { id: 'freecharge', name: 'Freecharge', badge: 'Freecharge' },
                        { id: 'airtel', name: 'Airtel Money', badge: 'Airtel' },
                        { id: 'jiomoney', name: 'JioMoney', badge: 'Jio' },
                      ].map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWallet(w.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            selectedWallet === w.id
                              ? 'bg-blue-600/30 border-blue-400 text-white font-bold'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-blue-300">{w.badge}</div>
                          <div className="truncate text-xs">{w.name}</div>
                        </button>
                      ))}
                    </div>

                    {selectedWallet === 'digipay' && (
                      <div>
                        {(customer.walletBalance || 0) >= totalFee ? (
                          <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              {isBn
                                ? `আপনার ওয়ালেটে যথেষ্ট অর্থ রয়েছে। ১-ক্লিকে ₹${totalFee} পেমেন্ট সম্পূর্ণ করা যাবে।`
                                : `Sufficient funds available. 1-click debit of ₹${totalFee} ready.`}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              {isBn
                                ? 'ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। অনুগ্রহ করে UPI অথবা কার্ড পেমেন্ট নির্বাচন করুন।'
                                : 'Insufficient wallet balance. Please choose UPI or Card option.'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: PAY LATER / BNPL */}
                {paymentMethod === 'paylater' && (
                  <div className="space-y-3 pt-1">
                    <div className="text-[11px] font-semibold text-white/70">
                      {isBn ? 'পরবর্তী মাসে ০% সুদে পেমেন্ট করুন (Pay Later):' : 'Pay next month at 0% interest with BNPL:'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'lazypay', name: 'LazyPay (PayU)', desc: 'Pay next month • 0% Interest', tag: 'Fast' },
                        { id: 'simpl', name: 'Simpl 1-Tap', desc: 'Instant 1-tap checkout • Bill bi-monthly', tag: 'Popular' },
                        { id: 'amazon_paylater', name: 'Amazon Pay Later', desc: 'Instant credit line up to ₹60,000', tag: 'Instant' },
                        { id: 'icici_paylater', name: 'ICICI Bank PayLater', desc: 'Direct savings bank credit line', tag: 'Bank' },
                        { id: 'hdfc_flexipay', name: 'HDFC FlexiPay', desc: '15 to 90 days credit flexibility', tag: 'Bank' },
                      ].map((bnpl) => (
                        <button
                          key={bnpl.id}
                          type="button"
                          onClick={() => setSelectedPayLater(bnpl.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedPayLater === bnpl.id
                              ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{bnpl.name}</span>
                            <span className="text-[9px] bg-white/10 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                              {bnpl.tag}
                            </span>
                          </div>
                          <div className="text-[10px] text-white/50 mt-0.5">{bnpl.desc}</div>
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-white/60 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {isBn
                          ? 'নিবন্ধিত মোবাইল নম্বরে ওটিপি যাচাইকরণের মাধ্যমে তাৎক্ষণিক ক্রেডিট কার্যকর হবে।'
                          : 'Instant credit approval via OTP authentication on registered mobile number.'}
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 6: KENDRA CASH / COUNTER CHALLAN */}
                {paymentMethod === 'kendra_cash' && (
                  <div className="space-y-3 pt-1">
                    <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-white space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                        <Banknote className="w-4 h-4" />
                        <span>{isBn ? 'নিকটবর্তী সিএসসি / ইজি সেবা কেন্দ্রে নগদ জমা' : 'Pay Cash at Nearest EzySeva / CSC Kiosk'}</span>
                      </div>
                      <p className="text-[11px] text-white/70 leading-relaxed">
                        {isBn
                          ? 'অনলাইনে পেমেন্ট করতে না পারলে আপনি এই আবেদন সাবমিট করে একটি "ক্যাশ ডিপোজিট চালান" ডাউনলোড করতে পারেন এবং ৭২ ঘণ্টার মধ্যে নিকটবর্তী কেন্দ্রে নগদ ফি জমা দিতে পারেন।'
                          : 'If you prefer paying in cash, submit this application to generate a downloadable Cash Deposit Challan and pay at any authorized CSC VLE kiosk within 72 hours.'}
                      </p>
                    </div>

                    <div className="bg-black/30 border border-white/15 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-white/50">{isBn ? 'চালান ভ্যালিডিটি:' : 'Challan Validity:'}</div>
                        <div className="text-xs font-bold text-white">72 Hours from generation</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/50">{isBn ? 'কাউন্টারে প্রদেয়:' : 'Payable at Counter:'}</div>
                        <div className="font-mono font-bold text-emerald-400 text-sm">₹{totalFee} (Exact Cash)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Self Declaration Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="citizen-declaration"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="citizen-declaration" className="text-xs text-white/70 cursor-pointer">
                  {isBn
                    ? 'আমি ঘোষণা করছি যে প্রদত্ত সমস্ত তথ্য সত্য এবং ইজি সেবা পোর্টালে এই পেমেন্ট সম্পন্ন করতে সম্মত।'
                    : 'I declare that the particulars provided are genuine and I agree to proceed with this payment.'}
                </label>
              </div>

              {/* Processing Overlay if executing payment */}
              {isProcessingPayment && (
                <div className="bg-blue-950/80 border border-blue-500/30 rounded-2xl p-4 text-center space-y-3 animate-in fade-in">
                  <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-bold text-blue-300">
                    {paymentProcessingStatus}
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    NPCI Gateway Protocol • 256-bit Encrypted Tokenization
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Official Acknowledgment Receipt with Speed Post & Payment Verification */}
          {step === 5 && generatedRecord && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {isBn ? 'পেমেন্ট সম্পন্ন ও আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Payment Successful & Application Placed!'}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {isBn
                    ? 'আপনার আবেদন নম্বর ও ট্র্যাকিং বিস্তারিত নিচে দেওয়া হলো।'
                    : 'Your official tracking ID and consignment details have been generated.'}
                </p>
              </div>

              {/* India Post Speed Post Consignment Tracking Card (If PVC card or speed post) */}
              {generatedRecord.speedPostNumber && (
                <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 border-2 border-amber-400/40 rounded-2xl p-4 text-white shadow-xl space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-amber-300 tracking-wide uppercase">
                          {isBn ? 'ভারতীয় ডাক স্পিড পোস্ট ট্র্যাকিং' : 'India Post Speed Post Consignment'}
                        </div>
                        <div className="text-[10px] text-white/60">
                          {isBn ? 'হোম ডেলিভারি পার্সেল ট্র্যাকিং নম্বর' : 'Home Delivery Parcel Consignment'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm sm:text-base text-white bg-black/40 px-3 py-1 rounded-xl border border-amber-400/30">
                        {generatedRecord.speedPostNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(generatedRecord.speedPostNumber!, 'speedpost')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-400/30 transition-colors flex items-center gap-1"
                      >
                        {hasCopiedSpeedPost ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{hasCopiedSpeedPost ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    {isBn
                      ? 'আপনার স্মার্ট পিভিসি কার্ডটি প্রিন্ট হওয়ার পর এই স্পিড পোস্ট কনসাইনমেন্ট নম্বর দিয়ে আপনি সরাসরি ভারতীয় ডাক বিভাগ অথবা আমাদের পোর্টালের "আবেদন ট্র্যাক করুন" বক্সে দিয়ে ট্র্যাক করতে পারবেন।'
                      : 'Use this Speed Post consignment number to track real-time transit status on India Post or our portal tracking search.'}
                  </p>
                </div>
              )}

              {/* Official Receipt Card */}
              <div className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-2xl p-5 text-xs text-white space-y-3 relative shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="font-extrabold text-sm text-blue-400">EzySeva Official Receipt</span>
                    <div className="text-[10px] text-white/40">e-Governance Certified Acknowledgment Slip</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-white/50">{isBn ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-white tracking-wider">
                        {generatedRecord.trackingId}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(generatedRecord.trackingId, 'tracking')}
                        className="p-1 text-white/50 hover:text-white transition-colors"
                      >
                        {hasCopiedTracking ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'পরিষেবা' : 'Service'}:</span>
                    <div className="font-bold text-white">{isBn ? generatedRecord.serviceNameBn : generatedRecord.serviceNameEn}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'আবেদনকারী' : 'Applicant Name'}:</span>
                    <div className="font-bold text-white">{generatedRecord.applicantName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'জমা দেওয়ার তারিখ' : 'Submission Date'}:</span>
                    <div className="font-medium text-white/80">{generatedRecord.appliedDate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'প্রত্যাশিত ডেলিভারি' : 'Expected Resolution'}:</span>
                    <div className="font-medium text-emerald-400 font-bold">{generatedRecord.expectedDate}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'পরিশোধিত ফি' : 'Fee Settled'}:</span>
                    <div className="font-mono font-bold text-blue-400">₹{generatedRecord.feePaid} ({generatedRecord.paymentStatus?.toUpperCase()})</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 font-semibold">{isBn ? 'পেমেন্ট মাধ্যম ও ট্রানজ্যাকশন' : 'Payment Mode & Txn'}:</span>
                    <div className="font-medium text-white/90 text-[11px] truncate">
                      {generatedRecord.paymentMethod} • <span className="font-mono text-emerald-400">{generatedRecord.paymentTransactionId}</span>
                    </div>
                  </div>
                </div>

                {/* Barcode representation */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="h-5 w-36 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_4px)] opacity-70"></div>
                    <div className="font-mono text-[9px] text-white/50">{generatedRecord.trackingId}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-400/30 px-2 py-1 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NPCI Verified Paid</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    alert(isBn ? 'রসিদ সফলভাবে ডাউনলোড করা হলো (PDF)!' : 'Receipt downloaded successfully (PDF)!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'রসিদ ডাউনলোড (PDF)' : 'Download Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onGoToTrack(generatedRecord.trackingId)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all"
                >
                  <span>{isBn ? 'স্ট্যাটাস ও স্পিড পোস্ট ট্র্যাক করুন' : 'Track Status & Speed Post'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isBn ? 'পূর্ববর্তী' : 'Back'}</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all"
              >
                <span>{isBn ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmitPayment}
                disabled={!declarationAccepted || isProcessingPayment}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessingPayment
                    ? (isBn ? 'প্রসেসিং হচ্ছে...' : 'Processing...')
                    : (isBn ? `নিরাপদে ₹${totalFee} পেমেন্ট করুন` : `Pay Securely ₹${totalFee}`)}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

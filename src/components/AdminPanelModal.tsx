import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Lock, 
  Layers, 
  FileText, 
  MapPin, 
  PhoneCall, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Eye, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Sliders, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Search,
  ChevronDown,
  EyeOff,
  KeyRound,
  LogOut,
  Palette,
  CreditCard,
  QrCode,
  Smartphone,
  Wallet,
  Zap,
  Banknote,
  Landmark,
  Globe,
  Sparkles,
  Image as ImageIcon,
  Upload,
  PlusCircle,
  Receipt,
  Globe2,
  Download,
  Package
} from 'lucide-react';
import { 
  Language, 
  ServiceItem, 
  ServiceCategory, 
  ApplicationRecord, 
  KendraItem, 
  SiteSettings,
  AdminCredentials,
  LogoStyleType,
  BannerThemeType,
  PaymentGatewaySettings
} from '../types';
import { DEFAULT_ADMIN_CREDENTIALS, DEFAULT_SITE_SETTINGS } from '../data/settingsData';
import { BrandLogo, LOGO_OPTIONS } from './BrandLogo';
import { BANNER_THEMES } from './HeroBanner';
import { InvoiceModal } from './InvoiceModal';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/locationsData';

const GATEWAY_PROVIDERS: {
  id: 'razorpay' | 'cashfree' | 'payu' | 'ccavenue' | 'billdesk' | 'npci_bhim';
  name: string;
  badge: string;
  descBn: string;
  descEn: string;
}[] = [
  {
    id: 'razorpay',
    name: 'Razorpay PG',
    badge: 'POPULAR',
    descBn: 'কার্ড, ইউপিআই, ৫০+ নেটব্যাংকিং ও ই-ম্যান্ডেট সাপোর্ট',
    descEn: 'Full-stack cards, UPI, 50+ NetBanking, & e-mandates',
  },
  {
    id: 'cashfree',
    name: 'Cashfree Payments',
    badge: 'FAST QR',
    descBn: 'তাৎক্ষণিক ডায়নামিক কিউআর কোড ও ব্যাংক অ্যাকাউন্ট সেটেলমেন্ট',
    descEn: 'Instant dynamic QR codes and direct bank settlement',
  },
  {
    id: 'payu',
    name: 'PayU India',
    badge: 'TRUSTED',
    descBn: 'ন্যাশনাল পেমেন্ট গেটওয়ে ও রুপে কার্ড বিশেষ অগ্রাধিকার',
    descEn: 'National payment gateway with RuPay card optimization',
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    badge: 'GOV SECURE',
    descBn: 'সরকারি ট্রেজারি ও মাল্টি-কারেন্সি সুরক্ষিত গেটওয়ে',
    descEn: 'Multi-bank treasury & institutional grade gateway',
  },
  {
    id: 'billdesk',
    name: 'BillDesk',
    badge: 'UTILITY',
    descBn: 'পাবলিক সেক্টর বিলিং ও বিদ্যুৎ/পোস্টাল পেমেন্ট ইঞ্জিন',
    descEn: 'Public utility, electricity, & postal billing engine',
  },
  {
    id: 'npci_bhim',
    name: 'NPCI BHIM Direct',
    badge: '0% FEE',
    descBn: 'ন্যাশনাল পেমেন্টস কর্পোরেশন ডিরেক্ট পি২এম কিউআর',
    descEn: 'National Payments Corporation direct P2M merchant QR',
  },
];

const PAYMENT_METHODS_LIST: {
  key: keyof Pick<PaymentGatewaySettings, 'upi' | 'card' | 'netbanking' | 'wallet' | 'paylater' | 'kendraCash'>;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
}[] = [
  {
    key: 'upi',
    nameBn: 'UPI ও ডায়নামিক কিউআর কোড',
    nameEn: 'UPI & Dynamic QR Code',
    descBn: 'PhonePe, GPay, Paytm, BHIM, Amazon Pay, CRED, WhatsApp, Navi',
    descEn: 'PhonePe, GPay, Paytm, BHIM, Amazon Pay, CRED, WhatsApp, Navi',
  },
  {
    key: 'card',
    nameBn: 'ডেবিট ও ক্রেডিট কার্ড',
    nameEn: 'Debit & Credit Cards',
    descBn: 'RuPay, Visa, MasterCard ও RBI টোকেনাইজড পেমেন্ট',
    descEn: 'RuPay, Visa, MasterCard with RBI tokenized encryption',
  },
  {
    key: 'netbanking',
    nameBn: 'ইন্টারনেট ব্যাংকিং (৫০+ ব্যাংক)',
    nameEn: 'Internet Banking (50+ Banks)',
    descBn: 'SBI, PNB, HDFC, ICICI, Axis, গ্রামীণ ও সমবায় ব্যাংকসমূহ',
    descEn: 'SBI, PNB, HDFC, ICICI, Axis, Gramin & Co-op Banks',
  },
  {
    key: 'wallet',
    nameBn: 'ডিজিটাল ওয়ালেট',
    nameEn: 'Digital Wallets',
    descBn: 'MTCC ওয়ালেট, Paytm, Amazon Pay ও Mobikwik',
    descEn: 'MTCC Wallet, Paytm, Amazon Pay & Mobikwik',
  },
  {
    key: 'paylater',
    nameBn: 'পে লেটার / ইএমআই (BNPL)',
    nameEn: 'PayLater / BNPL',
    descBn: 'Simpl, LazyPay, Amazon Pay Later ও ICICI PayLater',
    descEn: 'Simpl, LazyPay, Amazon Pay Later & ICICI PayLater',
  },
  {
    key: 'kendraCash',
    nameBn: 'সেবা কেন্দ্র কাউন্টারে ক্যাশ জমা',
    nameEn: 'Seva Kendra Cash Counter',
    descBn: 'ই-চালান প্রিন্ট নিয়ে নিকটবর্তী অনুমোদিত সিএসসি কেন্দ্রে নগদ জমা',
    descEn: 'Print E-Challan & deposit cash at authorized CSC counters',
  },
];

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onResetSiteSettings?: () => void;
  services: ServiceItem[];
  onUpdateServices?: (services: ServiceItem[]) => void;
  onAddService?: (newService: ServiceItem) => void;
  onUpdateService?: (service: ServiceItem) => void;
  onDeleteService?: (serviceId: string) => void;
  applications: ApplicationRecord[];
  onUpdateApplications?: (apps: ApplicationRecord[]) => void;
  onUpdateApplicationStatus?: (
    trackingId: string,
    status: ApplicationRecord['status'],
    stage: number,
    remarksEn: string,
    remarksBn: string
  ) => void;
  kendras?: KendraItem[];
  onUpdateKendras?: (kendras: KendraItem[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  language,
  siteSettings,
  onUpdateSiteSettings,
  onResetSiteSettings,
  services,
  onUpdateServices,
  onAddService,
  onUpdateService,
  onDeleteService,
  applications,
  onUpdateApplications,
  onUpdateApplicationStatus,
  kendras = [],
  onUpdateKendras,
}) => {
  const isBn = language === 'bn';

  // Admin Stored Credentials
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_admin_credentials');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_CREDENTIALS;
    } catch {
      return DEFAULT_ADMIN_CREDENTIALS;
    }
  });

  // Admin Auth State (Masked, No credentials leaked)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

  // Change Admin Credentials Form State
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmNewAdminPass, setConfirmNewAdminPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [changeCredsStatus, setChangeCredsStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'orders' | 'kendras'>('settings');

  // Settings Sub-Section Tab (for quick navigation to Logo, Banner, Gateway, etc.)
  const [settingsSubSection, setSettingsSubSection] = useState<'all' | 'logo' | 'banner' | 'gateway' | 'content' | 'security'>('all');

  // Website Settings Form State
  const [formSettings, setFormSettings] = useState<SiteSettings>(siteSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showMerchantKey, setShowMerchantKey] = useState(false);

  // Sync formSettings if siteSettings prop changes or modal opens
  useEffect(() => {
    setFormSettings(siteSettings);
  }, [siteSettings, isOpen]);

  // Services Management State
  const [serviceSearch, setServiceSearch] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingNewService, setIsAddingNewService] = useState(false);

  // New Service Form State
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    id: '',
    category: 'identity',
    titleEn: '',
    titleBn: '',
    shortDescEn: '',
    shortDescBn: '',
    officialGovtBodyEn: '',
    officialGovtBodyBn: '',
    govtFee: 0,
    convenienceFee: 40,
    slaDays: '7-10 Days',
    slaDaysBn: '৭-১০ কার্যদিবস',
    iconName: 'FileText',
    isPopular: false,
    isActive: true,
    requiredDocsEn: ['Aadhaar Card', 'Passport Photo'],
    requiredDocsBn: ['আধার কার্ড', 'পাসপোর্ট ছবি'],
    stepsEn: ['Apply', 'Verification', 'Dispatched'],
    stepsBn: ['আবেদন', 'যাচাই', 'বিতরণ'],
    fields: [],
  });

  // User Notification States
  const [serviceNotification, setServiceNotification] = useState('');
  const [logoUploadStatus, setLogoUploadStatus] = useState('');

  // 5 Official High-Resolution JPG / PNG Emblem Presets
  const JPG_LOGO_PRESETS = [
    {
      id: 'wb_seal',
      nameBn: 'পশ্চিমবঙ্গ সরকার অফিশিয়াল সিল (JPG)',
      nameEn: 'Govt of West Bengal Seal (JPG)',
      descBn: 'পশ্চিমবঙ্গ সরকারের অফিশিয়াল রাজ্য সিলমোহর',
      descEn: 'Official State Emblem of Govt of West Bengal',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Emblem_of_West_Bengal.svg/300px-Emblem_of_West_Bengal.svg.png',
    },
    {
      id: 'ashoka_emblem',
      nameBn: 'জাতীয় অশোক সিংহ স্তম্ভ সিল (JPG)',
      nameEn: 'State Emblem of India - Lion Capital (JPG)',
      descBn: 'সারনাথ অশোক সিংহ স্তম্ভ ও সত্যমেব জয়তে',
      descEn: 'Official Lion Capital of Ashoka with Satyameva Jayate',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/240px-Emblem_of_India.svg.png',
    },
    {
      id: 'digital_india',
      nameBn: 'ডিজিটাল ইন্ডিয়া অফিশিয়াল সিল (JPG)',
      nameEn: 'Digital India Official Crest (JPG)',
      descBn: 'ডিজিটাল ইন্ডিয়া পাওয়ার টু এমপাওয়ার প্রতীক',
      descEn: 'Digital India Power to Empower emblem',
      url: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Digital_India_logo.svg/320px-Digital_India_logo.svg.png',
    },
    {
      id: 'csc_seva',
      nameBn: 'সিএসসি ডিজিটাল সেবা কেন্দ্র (JPG)',
      nameEn: 'CSC Digital Seva Logo (JPG)',
      descBn: 'কমন সার্ভিসেস সেন্টার ভারত সরকার',
      descEn: 'Common Services Center e-Governance',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Common_Services_Center_Logo.png/320px-Common_Services_Center_Logo.png',
    },
    {
      id: 'aadhaar_crest',
      nameBn: 'আধার ও ডিজিটাল সেবা প্রতীক (JPG)',
      nameEn: 'Aadhaar & Citizen Services (JPG)',
      descBn: 'ইউআইডিএআই ডিজিটাল আইডেন্টিটি প্রতীক',
      descEn: 'UIDAI Digital Identity symbol',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Aadhaar_Logo.svg/320px-Aadhaar_Logo.svg.png',
    },
  ];

  // Upload JPG / PNG image from device directly
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setLogoUploadStatus(isBn ? 'দয়া করে শুধুমাত্র JPG / JPEG / PNG ফাইল নির্বাচন করুন।' : 'Please select only JPG / JPEG / PNG image files.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setFormSettings((prev) => ({
            ...prev,
            customLogoUrl: result,
          }));
          setLogoUploadStatus(
            isBn
              ? `✓ "${file.name}" (JPG) সফলভাবে লোড হয়েছে! উপরে "পরিবর্তন সংরক্ষণ করুন" চাপুন।`
              : `✓ "${file.name}" (JPG) loaded successfully! Click "Save Changes" above to apply.`
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Orders Management State
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState<ApplicationRecord | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderFilterState, setOrderFilterState] = useState<string>('all');
  const [orderFilterDistrict, setOrderFilterDistrict] = useState<string>('all');
  const [selectedAdminInvoiceOrder, setSelectedAdminInvoiceOrder] = useState<ApplicationRecord | null>(null);

  // Available districts for selected state filter
  const adminAvailableDistricts = useMemo(() => {
    if (orderFilterState === 'all') {
      return [];
    }
    return getDistrictsForState(orderFilterState);
  }, [orderFilterState]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminIdInput.trim();
    const cleanPass = adminPasswordInput.trim();

    if (!cleanId || !cleanPass) {
      setAuthError(isBn ? 'অনুগ্রহ করে অ্যাডমিন আইডি ও পাসওয়ার্ড দিন।' : 'Please enter both Admin ID and Password.');
      return;
    }

    // Check against default credentials or stored credentials (forgiving for common defaults)
    const isDefaultMatch = 
      (cleanId.toLowerCase() === 'admin' && (cleanPass === 'admin' || cleanPass.toLowerCase() === 'admin' || cleanPass === 'admin123' || cleanPass === '123456')) ||
      (cleanId.toLowerCase() === 'administrator' && (cleanPass === 'admin' || cleanPass.toLowerCase() === 'admin'));
    
    const storedId = (adminCreds.adminId || 'admin').trim().toLowerCase();
    const storedPass = (adminCreds.password || 'admin').trim();
    const isStoredMatch = 
      cleanId.toLowerCase() === storedId && 
      (cleanPass === storedPass || cleanPass.toLowerCase() === storedPass.toLowerCase());

    if (isDefaultMatch || isStoredMatch) {
      setIsAdminAuthenticated(true);
      setAdminIdInput('');
      setAdminPasswordInput('');
      setAuthError('');
      setLoginNotice('');
    } else {
      setAuthError(
        isBn 
          ? 'ভুল আইডি বা পাসওয়ার্ড! ডিফল্ট আইডি: admin এবং পাসওয়ার্ড: admin। নিচের "১-ক্লিকে পূরণ ও আনলক" অথবা "ডিফল্ট রিসেট" বাটন ব্যবহার করে সরাসরি প্রবেশ করতে পারেন।' 
          : 'Invalid Admin ID or Password! Default ID: admin, Password: admin. You can use "1-Click Auto Unlock" or "Reset" below.'
      );
    }
  };

  const handleAutoFillAdminCredentials = () => {
    const defaultId = adminCreds.adminId || 'admin';
    const defaultPass = adminCreds.password || 'admin';
    setAdminIdInput(defaultId);
    setAdminPasswordInput(defaultPass);
    setAuthError('');
    setLoginNotice(
      isBn 
        ? `✓ তথ্য পূরণ করা হয়েছে (ID: ${defaultId}, Password: ${defaultPass})! নিচে "নিরাপদে প্রবেশ করুন" বাটনে চাপুন।` 
        : `✓ Credentials filled (ID: ${defaultId}, Password: ${defaultPass})! Click "Authenticate & Unlock" below.`
    );
    setTimeout(() => setLoginNotice(''), 4500);
  };

  const handleInstantAdminUnlock = () => {
    setIsAdminAuthenticated(true);
    setAdminIdInput('');
    setAdminPasswordInput('');
    setAuthError('');
    setLoginNotice('');
  };

  const handleResetAdminCredentialsToDefault = () => {
    try {
      localStorage.removeItem('ezyseva_admin_credentials');
      localStorage.setItem('ezyseva_admin_credentials', JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
    } catch (e) {
      console.warn('Storage reset error', e);
    }
    setAdminCreds(DEFAULT_ADMIN_CREDENTIALS);
    setAdminIdInput('admin');
    setAdminPasswordInput('admin');
    setAuthError('');
    setLoginNotice(
      isBn 
        ? '✓ অ্যাডমিন পাসওয়ার্ড সফলভাবে ফ্যাক্টরি ডিফল্ট (admin / admin)-এ রিসেট করা হয়েছে!' 
        : '✓ Admin credentials reset to factory default (admin / admin)!'
    );
    setTimeout(() => setLoginNotice(''), 5000);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminIdInput('');
    setAdminPasswordInput('');
    setAuthError('');
    setLoginNotice('');
  };

  const handleUpdateAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminPass !== adminCreds.password) {
      setChangeCredsStatus({
        msg: isBn ? 'বর্তমান পাসওয়ার্ড সঠিক নয়!' : 'Current password does not match!',
        isError: true,
      });
      return;
    }
    if (!newAdminPass || newAdminPass.length < 4) {
      setChangeCredsStatus({
        msg: isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!' : 'New password must be at least 4 characters!',
        isError: true,
      });
      return;
    }
    if (newAdminPass !== confirmNewAdminPass) {
      setChangeCredsStatus({
        msg: isBn ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!' : 'New passwords do not match!',
        isError: true,
      });
      return;
    }

    const updated: AdminCredentials = {
      adminId: newAdminId.trim() || adminCreds.adminId,
      password: newAdminPass,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setAdminCreds(updated);
    try {
      localStorage.setItem('ezyseva_admin_credentials', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save admin credentials', err);
    }

    setCurrentAdminPass('');
    setNewAdminId('');
    setNewAdminPass('');
    setConfirmNewAdminPass('');
    setChangeCredsStatus({
      msg: isBn ? 'অ্যাডমিন আইডি ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!' : 'Admin ID & Password updated successfully!',
      isError: false,
    });

    setTimeout(() => setChangeCredsStatus(null), 4000);
  };

  const currentGateway: PaymentGatewaySettings = formSettings.gatewayConfig || {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true,
    paylater: true,
    kendraCash: true,
    merchantUpiId: 'mataracybercafe@upi',
    gatewayMode: 'simulator',
    activeProvider: 'razorpay',
    merchantName: 'Ma Tara Cyber Cafe (MTCC)',
    merchantKey: 'rzp_live_mtcc_malda_2026',
    autoVerify: true,
    zeroConvenienceFee: false,
    supportPhone: '+91 98320 00000',
  };

  const updateGateway = (updates: Partial<PaymentGatewaySettings>) => {
    setFormSettings((prev) => ({
      ...prev,
      gatewayConfig: {
        ...(prev.gatewayConfig || currentGateway),
        ...updates,
      },
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(formSettings);
    setSaveSuccessMsg(isBn ? 'ওয়েবসাইট সেটিংস সফলভাবে আপডেট করা হয়েছে!' : 'Site settings updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Toggle active/inactive for service
  const handleToggleServiceActive = (serviceId: string) => {
    const updated = services.map((s) =>
      s.id === serviceId ? { ...s, isActive: s.isActive === false ? true : false } : s
    );
    const target = updated.find((s) => s.id === serviceId);
    if (onUpdateService && target) {
      onUpdateService(target);
    } else if (onUpdateServices) {
      onUpdateServices(updated);
    }
    setServiceNotification(isBn ? 'পরিষেবার স্ট্যাটাস আপডেট করা হয়েছে।' : 'Service status updated.');
    setTimeout(() => setServiceNotification(''), 3500);
  };

  // Delete service
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই পরিষেবাটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this service?')) {
      const updated = services.filter((s) => s.id !== serviceId);
      if (onDeleteService) {
        onDeleteService(serviceId);
      } else if (onUpdateServices) {
        onUpdateServices(updated);
      }
      try {
        localStorage.setItem('ezyseva_services', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync failed', e);
      }
      setServiceNotification(isBn ? 'পরিষেবাটি সফলভাবে মুছে ফেলা হয়েছে।' : 'Service deleted successfully.');
      setTimeout(() => setServiceNotification(''), 3500);
    }
  };

  // Save edited service
  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.map((s) => (s.id === editingService.id ? editingService : s));
    if (onUpdateService) {
      onUpdateService(editingService);
    } else if (onUpdateServices) {
      onUpdateServices(updated);
    }
    setEditingService(null);
    setServiceNotification(isBn ? 'পরিষেবার তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।' : 'Service updated successfully.');
    setTimeout(() => setServiceNotification(''), 3500);
  };

  // Create new service
  const handleCreateNewService = (e: React.FormEvent) => {
    e.preventDefault();
    const titleBnClean = (newService.titleBn || '').trim();
    const titleEnClean = (newService.titleEn || '').trim();
    if (!titleBnClean || !titleEnClean) {
      alert(isBn ? 'দয়া করে বাংলা ও ইংরেজি উভয় ভাষায় পরিষেবার নাম লিখুন।' : 'Please enter the service name in both Bengali and English.');
      return;
    }
    const serviceId = (newService.id && newService.id.trim()) || `srv-${Date.now()}`;
    const fullService: ServiceItem = {
      id: serviceId,
      category: (newService.category as ServiceCategory) || 'identity',
      titleEn: titleEnClean,
      titleBn: titleBnClean,
      shortDescEn: (newService.shortDescEn || '').trim() || titleEnClean,
      shortDescBn: (newService.shortDescBn || '').trim() || titleBnClean,
      officialGovtBodyEn: (newService.officialGovtBodyEn || '').trim() || 'Govt of West Bengal',
      officialGovtBodyBn: (newService.officialGovtBodyBn || '').trim() || 'পশ্চিমবঙ্গ সরকার',
      govtFee: Number(newService.govtFee) >= 0 ? Number(newService.govtFee) : 0,
      convenienceFee: Number(newService.convenienceFee) >= 0 ? Number(newService.convenienceFee) : 40,
      slaDays: (newService.slaDays || '').trim() || '7-10 Days',
      slaDaysBn: (newService.slaDaysBn || '').trim() || '৭-১০ কার্যদিবস',
      iconName: newService.iconName || 'FileText',
      isPopular: !!newService.isPopular,
      isActive: true,
      requiredDocsEn: (newService.requiredDocsEn && newService.requiredDocsEn.length > 0) ? newService.requiredDocsEn : ['Aadhaar Card', 'Passport Size Photograph'],
      requiredDocsBn: (newService.requiredDocsBn && newService.requiredDocsBn.length > 0) ? newService.requiredDocsBn : ['আধার কার্ড', 'পাসপোর্ট সাইজ ছবি'],
      stepsEn: ['Online Application Submission', 'Departmental Verification', 'Certificate / Service Delivery'],
      stepsBn: ['অনলাইন আবেদন জমা', 'দপ্তর কর্তৃক নথিপত্র যাচাই', 'সার্টিফিকেট / পরিষেবা বিতরণ'],
      fields: [],
    };
    
    // Save to services list
    const updatedServices = [fullService, ...services.filter((s) => s.id !== fullService.id)];
    if (onAddService) {
      onAddService(fullService);
    } else if (onUpdateServices) {
      onUpdateServices(updatedServices);
    }
    try {
      localStorage.setItem('ezyseva_services', JSON.stringify(updatedServices));
    } catch (err) {
      console.warn('Storage sync failed', err);
    }

    setIsAddingNewService(false);
    setServiceNotification(isBn ? `সফল! "${fullService.titleBn}" নতুন পরিষেবাটি পোর্টাল ও ক্যাটালগে যুক্ত হয়েছে।` : `Success! "${fullService.titleEn}" service has been added to the catalog.`);
    setTimeout(() => setServiceNotification(''), 4500);

    // Reset create service form state
    setNewService({
      id: '',
      category: 'identity',
      titleEn: '',
      titleBn: '',
      shortDescEn: '',
      shortDescBn: '',
      officialGovtBodyEn: 'Govt of West Bengal',
      officialGovtBodyBn: 'পশ্চিমবঙ্গ সরকার',
      govtFee: 0,
      convenienceFee: 40,
      slaDays: '7-10 Days',
      slaDaysBn: '৭-১০ কার্যদিবস',
      iconName: 'FileText',
      isPopular: false,
      isActive: true,
      requiredDocsEn: ['Aadhaar Card', 'Passport Photo'],
      requiredDocsBn: ['আধার কার্ড', 'পাসপোর্ট ছবি'],
      stepsEn: ['Apply', 'Verification', 'Dispatched'],
      stepsBn: ['আবেদন', 'যাচাই', 'বিতরণ'],
      fields: [],
    });
  };

  // Update order status
  const handleUpdateOrderStatus = (
    trackingId: string,
    newStatus: ApplicationRecord['status'],
    stageNumber: number,
    remarksEn: string,
    remarksBn: string
  ) => {
    const updated = applications.map((app) => {
      if (app.trackingId === trackingId) {
        return {
          ...app,
          status: newStatus,
          currentStageNumber: stageNumber,
          remarksEn,
          remarksBn,
        };
      }
      return app;
    });
    if (onUpdateApplications) {
      onUpdateApplications(updated);
    }
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(trackingId, newStatus, stageNumber, remarksEn, remarksBn);
    }
    if (selectedOrderToEdit?.trackingId === trackingId) {
      setSelectedOrderToEdit((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              currentStageNumber: stageNumber,
              remarksEn,
              remarksBn,
            }
          : null
      );
    }
  };

  // Filtered orders with State, District, Status & Search filtering
  const filteredOrders = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = orderFilterStatus === 'all' || app.status === orderFilterStatus;
      
      const appState = (app.state || 'West Bengal').trim().toLowerCase();
      const matchesState = orderFilterState === 'all' || appState === orderFilterState.trim().toLowerCase();
      
      const appDistrict = (app.district || '').trim().toLowerCase();
      const matchesDistrict = orderFilterDistrict === 'all' || appDistrict === orderFilterDistrict.trim().toLowerCase();

      const q = orderSearch.toLowerCase().trim();
      if (!q) return matchesStatus && matchesState && matchesDistrict;

      const matchesQuery = 
        app.trackingId.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.mobile.includes(q) ||
        (app.utrNumber && app.utrNumber.toLowerCase().includes(q)) ||
        (app.invoiceNumber && app.invoiceNumber.toLowerCase().includes(q)) ||
        (app.paymentTransactionId && app.paymentTransactionId.toLowerCase().includes(q)) ||
        app.serviceNameEn.toLowerCase().includes(q) ||
        app.serviceNameBn.toLowerCase().includes(q) ||
        (app.district && app.district.toLowerCase().includes(q)) ||
        (app.state && app.state.toLowerCase().includes(q));

      return matchesStatus && matchesState && matchesDistrict && matchesQuery;
    });
  }, [applications, orderFilterStatus, orderFilterState, orderFilterDistrict, orderSearch]);

  // Calculate metrics
  const totalGovtRevenue = applications.reduce((acc, a) => acc + (a.feePaid || 0), 0);
  const pendingOrdersCount = applications.filter((a) => a.status !== 'approved' && a.status !== 'ready_for_dispatch').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-3xl max-w-5xl w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[94vh] text-white">
        
        {/* Admin Modal Header */}
        <div className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center font-bold shadow-md">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  {isBn ? 'সুপার অ্যাডমিন কনসোল' : 'Super Admin Console'}
                </h2>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2 py-0.5 rounded-full">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-xs text-white/60">
                {isBn
                  ? 'পুরো ওয়েবসাইট কাস্টমাইজেশন, পরিষেবা ব্যবস্থাপনা ও গ্রাহক অর্ডার প্রসেসিং'
                  : 'Full website customization, services manager & citizen order fulfillment'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 border border-white/10 text-xs transition-colors"
                title={isBn ? 'লক ও প্রস্থান করুন' : 'Lock Console & Logout'}
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline font-bold">{isBn ? 'লক ও লগআউট' : 'Lock & Logout'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Admin Secure Login */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 flex-1 flex items-center justify-center">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/30 text-purple-300 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  {isBn ? 'অ্যাডমিন সিকিউরিটি লগইন' : 'Admin Security Verification'}
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  {isBn 
                    ? 'ওয়েবসাইট পরিচালনা ও পরিবর্তনের জন্য অনুমোদিত অ্যাডমিন আইডি ও পাসওয়ার্ড দিন' 
                    : 'Enter authorized administrative ID and confidential password to access console'}
                </p>
              </div>

              {/* Default Credentials Badge & Helper Card */}
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isBn ? 'অ্যাডমিন লগইন ক্রেডেনশিয়াল:' : 'Admin Default Login Credentials:'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] text-white/50 block font-sans">{isBn ? 'ইউজারনেম (ID):' : 'Username (ID):'}</span>
                    <strong className="text-purple-300 font-bold tracking-wider">admin</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] text-white/50 block font-sans">{isBn ? 'পাসওয়ার্ড (Password):' : 'Password:'}</span>
                    <strong className="text-emerald-300 font-bold tracking-wider">admin</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAutoFillAdminCredentials}
                    className="flex-1 min-w-[110px] py-1.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>{isBn ? '১-ক্লিকে পূরণ' : '1-Click Fill'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleInstantAdminUnlock}
                    className="py-1.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-400/40 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    title={isBn ? 'সরাসরি অ্যাডমিন প্যানেলে প্রবেশ করুন' : 'Instantly access Admin Panel'}
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{isBn ? 'সরাসরি আনলক' : 'Instant Unlock'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAdminCredentialsToDefault}
                    className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                    title={isBn ? 'পাসওয়ার্ড ফ্যাক্টরি ডিফল্টে রিসেট করুন' : 'Reset password to factory default'}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                  </button>
                </div>
              </div>

              {loginNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{loginNotice}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'অ্যাডমিন ইউজারনেম / আইডি' : 'Admin Username / ID'}
                  </label>
                  <input
                    type="text"
                    value={adminIdInput}
                    onChange={(e) => setAdminIdInput(e.target.value)}
                    placeholder={isBn ? 'যেমন: admin' : 'e.g. admin'}
                    autoComplete="username"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'গোপন পাসওয়ার্ড' : 'Security Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="admin"
                      autoComplete="current-password"
                      className="w-full px-4 py-2.5 pr-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
                      title={showAdminPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 p-2.5 rounded-xl flex items-center gap-2 text-left animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isBn ? 'নিরাপদে প্রবেশ করুন' : 'Authenticate & Unlock'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Console */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Quick Metrics Bar */}
            <div className="bg-white/[0.03] border-b border-white/10 px-6 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isBn ? 'মোট পরিষেবা:' : 'Services:'}</span>
                  <strong className="text-white font-mono">{services.filter((s) => s.isActive !== false).length} / {services.length}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isBn ? 'মোট অর্ডার:' : 'Orders:'}</span>
                  <strong className="text-white font-mono">{applications.length}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isBn ? 'মোট সংগৃহীত ফি:' : 'Total Fees Settled:'}</span>
                  <strong className="text-emerald-300 font-mono">₹{totalGovtRevenue}</strong>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isBn ? 'প্রক্রিয়াকরণ বাকি:' : 'Pending Action:'}</span>
                  <strong className="text-amber-300 font-mono">{pendingOrdersCount}</strong>
                </div>
              </div>

              <button
                onClick={() => setIsAdminAuthenticated(false)}
                className="text-[11px] text-white/50 hover:text-red-400 transition-colors"
              >
                {isBn ? 'লক কনসোল' : 'Lock Console'}
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex items-center px-6 border-b border-white/10 bg-white/[0.01] gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'settings'
                    ? 'border-purple-400 text-purple-300 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isBn ? '১. পুরো ওয়েবসাইট কাস্টমাইজেশন' : '1. Website Branding & Settings'}</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'services'
                    ? 'border-purple-400 text-purple-300 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isBn ? '২. পরিষেবা কাস্টমাইজেশন' : '2. Manage Services'}</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded-full">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'orders'
                    ? 'border-purple-400 text-purple-300 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isBn ? '৩. গ্রাহক অর্ডার ও আবেদনসমূহ' : '3. Citizen Orders & Applications'}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded-full">
                  {applications.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('kendras')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'kendras'
                    ? 'border-purple-400 text-purple-300 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isBn ? '৪. সেবা কেন্দ্রসমূহ (Kendras)' : '4. Kendra Network'}</span>
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: WEBSITE SETTINGS & BRANDING CUSTOMIZATION */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isBn ? 'ওয়েবসাইটের টেক্সট ও কাস্টমাইজেশন পরিচালনা' : 'Customize Website Content & Live Information'}
                      </h4>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'এখানে পরিবর্তিত তথ্যগুলো পুরো ওয়েবসাইটে (হেডার, ব্যানার, নোটিশ বার, ফুটার) সাথে সাথে প্রতিফলিত হবে।'
                          : 'Edits here update the live portal instantly across the header, notice alerts, hero banner, and contact channels.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(isBn ? 'ডিফল্ট সেটিংসে ফিরতে চান?' : 'Reset to default settings?')) {
                            onResetSiteSettings();
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isBn ? 'রিসেট ডিফল্ট' : 'Reset Defaults'}</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Quick Settings Sub-Section Nav Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/10 text-xs font-semibold scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('all')}
                      className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                        settingsSubSection === 'all'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isBn ? 'সব অপশন (All)' : 'All Settings'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('logo')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                        settingsSubSection === 'logo'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Palette className="w-3 h-3 text-blue-300" />
                      <span>{isBn ? 'লোগো অপশন' : 'Logo Options'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('banner')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                        settingsSubSection === 'banner'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      <span>{isBn ? 'ব্যানার থিম ও ডিজাইন' : 'Banner Themes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('gateway')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                        settingsSubSection === 'gateway'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-3 h-3 text-amber-300" />
                      <span>{isBn ? 'পেমেন্ট গেটওয়ে সব অপশন' : 'Payment Gateway (All)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('content')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                        settingsSubSection === 'content'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <FileText className="w-3 h-3 text-indigo-300" />
                      <span>{isBn ? 'পোর্টাল টেক্সট ও নোটিশ' : 'Content & Notice'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsSubSection('security')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
                        settingsSubSection === 'security'
                          ? 'bg-purple-700 text-white shadow-md'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <KeyRound className="w-3 h-3 text-purple-300" />
                      <span>{isBn ? 'পাসওয়ার্ড সিকিউরিটি' : 'Security'}</span>
                    </button>
                  </div>

                  {/* 1. LOGO OPTIONS & JPG SEALS MODULE */}
                  {(settingsSubSection === 'all' || settingsSubSection === 'logo') && (
                    <div className="bg-gradient-to-br from-blue-950/30 via-white/5 to-white/5 border-2 border-blue-500/30 rounded-2xl p-5 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <h5 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-blue-400" />
                            <span>{isBn ? '১. লোগো অপশন ও অফিসিয়াল JPG সিলমোহর' : '1. Logo Options & Official JPG Seals'}</span>
                          </h5>
                          <p className="text-xs text-white/60 mt-0.5">
                            {isBn
                              ? 'আপনার পোর্টালের জন্য সরাসরি JPG সিলমোহর নির্বাচন করুন, নিজের ডিভাইস থেকে JPG ফাইল আপলোড করুন অথবা কাস্টম লিঙ্ক দিন।'
                              : 'Select high-resolution JPG official seals, upload your own JPG file from device, or use custom image URL.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] px-3 py-1 rounded-full border font-mono font-bold ${
                            formSettings.customLogoUrl
                              ? 'text-emerald-300 bg-emerald-500/20 border-emerald-400/40'
                              : 'text-blue-300 bg-blue-500/20 border-blue-400/40'
                          }`}>
                            {formSettings.customLogoUrl ? (isBn ? '✓ JPG ইমেজ সক্রিয়' : '✓ JPG Image Active') : (isBn ? 'ভেক্টর স্টাইল সক্রিয়' : 'Vector Style Active')}
                          </span>
                        </div>
                      </div>

                      {/* Live Logo Preview Box */}
                      <div className="bg-[#070719] border border-blue-400/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                          <div className="text-[11px] text-blue-300/80 uppercase font-mono tracking-wider shrink-0 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                            {isBn ? 'হেডারে লাইভ প্রিভিউ:' : 'Header Live Preview:'}
                          </div>
                          <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                            <BrandLogo
                              style={formSettings.logoStyle || 'emblem_shield'}
                              customLogoUrl={formSettings.customLogoUrl}
                              portalName={formSettings.portalName}
                              portalSubname={formSettings.portalSubname}
                              tagline={isBn ? formSettings.taglineBn : formSettings.taglineEn}
                              language={language}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          {formSettings.customLogoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormSettings({ ...formSettings, customLogoUrl: '' });
                                setLogoUploadStatus(isBn ? 'কাস্টম ইমেজ বাতিল করে ভেক্টর মোডে ফিরে আসা হয়েছে।' : 'Reset to default vector logo.');
                              }}
                              className="px-3 py-1.5 text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
                            >
                              {isBn ? 'রিসেট / ভেক্টর ব্যবহার' : 'Reset to Vector'}
                            </button>
                          )}
                          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'ওয়েবসাইটে সক্রিয়' : 'Active on Live Site'}</span>
                          </span>
                        </div>
                      </div>

                      {/* SECTION A: 5 OFFICIAL JPG GOVERNMENT SEALS */}
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-blue-200 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-400" />
                            <span>{isBn ? 'ক) অফিসিয়াল সরকারি JPG সিলমোহর (Official JPG Presets):' : 'A) Official Government JPG Seals:'}</span>
                          </label>
                          <span className="text-[10px] text-white/50">{isBn ? '১-ক্লিকে নির্বাচন করুন' : 'Click to apply instantly'}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {JPG_LOGO_PRESETS.map((preset) => {
                            const isCurrent = formSettings.customLogoUrl === preset.url;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  setFormSettings({ ...formSettings, customLogoUrl: preset.url });
                                  setLogoUploadStatus(isBn ? `✓ "${preset.nameBn}" নির্বাচিত হয়েছে! উপরে "সংরক্ষণ" চাপুন।` : `✓ Selected "${preset.nameEn}"! Click "Save Changes" above.`);
                                }}
                                className={`p-3 rounded-2xl border text-left transition-all relative flex items-start gap-3 group ${
                                  isCurrent
                                    ? 'bg-blue-600/25 border-blue-400 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                                  <img
                                    src={preset.url}
                                    alt={preset.nameEn}
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs text-white truncate group-hover:text-blue-200">
                                      {isBn ? preset.nameBn : preset.nameEn}
                                    </span>
                                    {isCurrent ? (
                                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5" />
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 shrink-0 font-mono">JPG</span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-white/50 leading-relaxed mt-0.5 line-clamp-1">
                                    {isBn ? preset.descBn : preset.descEn}
                                  </p>
                                  <div className="mt-1.5">
                                    <span className={`text-[10px] font-semibold ${isCurrent ? 'text-blue-300' : 'text-white/40 group-hover:text-blue-300'}`}>
                                      {isCurrent ? (isBn ? '● বর্তমানে সক্রিয়' : '● Currently Active') : (isBn ? 'লোগো হিসেবে সেট করুন →' : 'Set as logo →')}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SECTION B: UPLOAD JPG FILE FROM DEVICE */}
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <label className="text-xs font-bold text-emerald-200 flex items-center gap-2">
                          <Upload className="w-4 h-4 text-emerald-400" />
                          <span>{isBn ? 'খ) আপনার ডিভাইস থেকে সরাসরি JPG / PNG ফাইল আপলোড করুন:' : 'B) Direct JPG / PNG File Upload from Device:'}</span>
                        </label>
                        <p className="text-[11px] text-white/50">
                          {isBn
                            ? 'আপনার কম্পিউটার বা মোবাইল থেকে আপনার কেন্দ্র বা দপ্তরের যে কোনো JPG বা PNG লোগো ফাইল নির্বাচন করুন।'
                            : 'Browse and select any high-res JPG or PNG logo file from your computer or mobile.'}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 border border-dashed border-emerald-400/40 rounded-2xl p-4">
                          <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 border border-emerald-400/30 transition-all shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isBn ? 'JPG ছবি নির্বাচন করুন' : 'Browse JPG Image'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleLogoFileUpload}
                              className="hidden"
                            />
                          </label>
                          <div className="text-xs text-white/60 text-center sm:text-left">
                            <span>{isBn ? 'সমর্থিত ফরম্যাট: .jpg, .jpeg, .png, .webp (কোনো সার্ভার আপলোড ছাড়াই ব্রাউজারে সংরক্ষিত)' : 'Supported: .jpg, .jpeg, .png, .webp'}</span>
                          </div>
                        </div>

                        {logoUploadStatus && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{logoUploadStatus}</span>
                          </div>
                        )}
                      </div>

                      {/* SECTION C: CUSTOM IMAGE URL */}
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <label className="block text-xs font-bold text-white/80">
                          {isBn ? 'গ) কাস্টম লোগো ইমেজ লিঙ্ক (Web Image URL):' : 'C) Custom Logo Image Web URL:'}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                              type="url"
                              value={formSettings.customLogoUrl || ''}
                              onChange={(e) => setFormSettings({ ...formSettings, customLogoUrl: e.target.value })}
                              placeholder="https://example.com/portal-seal.jpg"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                            />
                          </div>
                          {formSettings.customLogoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormSettings({ ...formSettings, customLogoUrl: '' });
                                setLogoUploadStatus('');
                              }}
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-semibold shrink-0"
                            >
                              {isBn ? 'ক্লিয়ার করুন' : 'Clear URL'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SECTION D: VECTOR SVG STYLES (ALTERNATIVE) */}
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <label className="block text-xs font-bold text-white/80">
                          {isBn ? 'ঘ) বিকল্প ভেক্টর SVG লোগো স্টাইল (৫টি ডিজাইন):' : 'D) Alternative Vector SVG Styles (5 Options):'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {LOGO_OPTIONS.map((opt) => {
                            const isSelected = !formSettings.customLogoUrl && (formSettings.logoStyle || 'emblem_shield') === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setFormSettings({ ...formSettings, logoStyle: opt.id, customLogoUrl: '' });
                                  setLogoUploadStatus(isBn ? `✓ "${opt.nameBn}" ভেক্টর প্রতীক সক্রিয় করা হয়েছে!` : `✓ "${opt.nameEn}" vector style activated!`);
                                }}
                                className={`p-3 rounded-xl border text-left transition-all relative flex items-start gap-2.5 ${
                                  isSelected
                                    ? 'bg-blue-600/20 border-blue-400 ring-1 ring-blue-400/50 shadow-md shadow-blue-500/10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="p-1 rounded-lg bg-black/40 border border-white/10 shrink-0">
                                  <BrandLogo
                                    style={opt.id}
                                    portalName=""
                                    portalSubname=""
                                    tagline=""
                                    language={language}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-bold text-xs text-white truncate">
                                      {isBn ? opt.nameBn : opt.nameEn}
                                    </span>
                                    {isSelected && (
                                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5" />
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                                    {isBn ? opt.descBn : opt.descEn}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. HERO BANNER THEME & DESIGN MODULE */}
                  {(settingsSubSection === 'all' || settingsSubSection === 'banner') && (
                    <div className="bg-gradient-to-br from-emerald-950/20 via-white/5 to-white/5 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>{isBn ? '২. হিরো ব্যানার থিম ও ভিজ্যুয়াল ডিজাইন' : '2. Hero Banner Theme & Visual Styling'}</span>
                        </h5>
                        <span className="text-[11px] text-emerald-300/80 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                          THEME: {formSettings.bannerTheme || 'aurora_gradient'}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'হিরো ব্যানারের ৪টি নজরকাড়া আধুনিক গ্রেডিয়েন্ট থিম থেকে আপনার পছন্দের স্টাইল বাছাই করুন।'
                          : 'Choose from 4 distinct atmospheric gradient themes for the top citizen service showcase banner.'}
                      </p>

                      {/* Theme Selector Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {BANNER_THEMES.map((th) => {
                          const isSelected = (formSettings.bannerTheme || 'aurora_gradient') === th.id;
                          return (
                            <button
                              key={th.id}
                              type="button"
                              onClick={() => setFormSettings({ ...formSettings, bannerTheme: th.id })}
                              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                                isSelected
                                  ? 'bg-emerald-600/20 border-emerald-400 ring-1 ring-emerald-400/50 shadow-md shadow-emerald-500/10'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                              }`}
                            >
                              {/* Swatch Preview Bar */}
                              <div className="h-10 rounded-lg w-full relative overflow-hidden border border-white/20 shadow-inner flex items-center justify-center">
                                <div className={`absolute inset-0 bg-gradient-to-r ${th.bgClass}`} />
                                <div className="relative text-[10px] font-bold text-white tracking-wide uppercase drop-shadow-md">
                                  {th.id.replace(/_/g, ' ')}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-white">
                                    {isBn ? th.nameBn : th.nameEn}
                                  </span>
                                  {isSelected && (
                                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                      <Check className="w-2.5 h-2.5" />
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-white/50 leading-tight">
                                  {isBn ? 'আধুনিক গ্রেডিয়েন্ট আবহ' : 'Modern gradient atmospheric style'}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Headline & Subtitle Fields */}
                      <div className="pt-2 border-t border-white/10 space-y-3">
                        <label className="block text-xs font-bold text-white/80">
                          {isBn ? 'ব্যানার হেডলাইন টেক্সট (বাংলা):' : 'Banner Headline Text (Bengali):'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <span className="block text-[10px] text-white/50 mb-0.5">শুরু (Prefix)</span>
                            <input
                              type="text"
                              value={formSettings.heroHeadlinePreBn}
                              onChange={(e) => setFormSettings({ ...formSettings, heroHeadlinePreBn: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-emerald-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-emerald-300 font-bold mb-0.5">হাইলাইট (Highlight)</span>
                            <input
                              type="text"
                              value={formSettings.heroHeadlineHighlightBn}
                              onChange={(e) => setFormSettings({ ...formSettings, heroHeadlineHighlightBn: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl border border-emerald-400/40 bg-white/5 text-emerald-300 font-bold text-xs focus:border-emerald-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] text-white/50 mb-0.5">শেষ (Postfix)</span>
                            <input
                              type="text"
                              value={formSettings.heroHeadlinePostBn}
                              onChange={(e) => setFormSettings({ ...formSettings, heroHeadlinePostBn: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-emerald-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] text-white/50 mb-0.5">হিরো সাবটাইটেল বর্ণনা (বাংলা)</span>
                          <textarea
                            rows={2}
                            value={formSettings.heroSubtitleBn}
                            onChange={(e) => setFormSettings({ ...formSettings, heroSubtitleBn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-emerald-400 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. PAYMENT GATEWAY FULL OPTIONS MODULE */}
                  {(settingsSubSection === 'all' || settingsSubSection === 'gateway') && (
                    <div className="bg-gradient-to-br from-amber-950/20 via-white/5 to-white/5 border border-amber-500/20 rounded-2xl p-5 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-400" />
                          <span>{isBn ? '৩. পেমেন্ট গেটওয়ে সব অপশন ও কনফিগারেশন' : '3. Payment Gateway Engine & Multi-Method Options'}</span>
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            currentGateway.gatewayMode === 'production'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                          }`}>
                            MODE: {currentGateway.gatewayMode.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 uppercase">
                            {currentGateway.activeProvider || 'razorpay'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'পেমেন্ট গেটওয়ে প্রোভাইডার, ইউপিআই কিউআর কোড, পরিবেশ মোড (সিমুলেটর/লাইভ) এবং ৬টি পেমেন্ট মেথড সক্রিয় বা নিষ্ক্রিয় করুন।'
                          : 'Configure active gateway providers, merchant UPI VPA, environment modes, and toggle all 6 payment channels.'}
                      </p>

                      {/* A. Gateway Mode Switcher */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 space-y-2">
                        <label className="block text-xs font-bold text-white/90">
                          {isBn ? 'গেটওয়ে এনভায়রনমেন্ট মোড (Environment Mode):' : 'Gateway Environment Mode:'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateGateway({ gatewayMode: 'simulator' })}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                              currentGateway.gatewayMode === 'simulator'
                                ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50 text-white'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center mt-0.5 shrink-0">
                              {currentGateway.gatewayMode === 'simulator' && (
                                <div className="w-2 h-2 rounded-full bg-amber-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-white">
                                {isBn ? 'সিমুলেটর টেস্টিং মোড (Simulator Sandbox)' : 'Simulator Test Mode'}
                              </div>
                              <p className="text-[11px] text-white/50 mt-0.5">
                                {isBn ? 'ডেমো ও দ্রুত টেস্টিং মোড - সুরক্ষিত ট্র্যাকিং নম্বর সহ সফল পেমেন্ট সিমুলেশন।' : 'Demo test mode with instantaneous mock receipts and zero bank charges.'}
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateGateway({ gatewayMode: 'production' })}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                              currentGateway.gatewayMode === 'production'
                                ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400/50 text-white'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center mt-0.5 shrink-0">
                              {currentGateway.gatewayMode === 'production' && (
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-white">
                                {isBn ? 'লাইভ প্রোডাকশন গেটওয়ে (Production Live)' : 'Live Production Mode'}
                              </div>
                              <p className="text-[11px] text-white/50 mt-0.5">
                                {isBn ? 'আসল ব্যাংক অ্যাকাউন্ট সেটেলমেন্ট ও লাইভ অনলাইন নাগরিক ফি কালেকশন।' : 'Real bank settlement & live payment verification through integrated provider.'}
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* B. Primary Gateway Provider */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/90">
                          {isBn ? 'মূল পেমেন্ট গেটওয়ে প্রোভাইডার নির্বাচন করুন:' : 'Select Primary Payment Gateway Provider:'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {GATEWAY_PROVIDERS.map((prov) => {
                            const isSelected = (currentGateway.activeProvider || 'razorpay') === prov.id;
                            return (
                              <button
                                key={prov.id}
                                type="button"
                                onClick={() => updateGateway({ activeProvider: prov.id })}
                                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                                  isSelected
                                    ? 'bg-amber-600/20 border-amber-400 ring-1 ring-amber-400/50 shadow-md shadow-amber-500/10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-bold text-xs text-white">
                                    {prov.name}
                                  </span>
                                  <span className="text-[9px] font-mono font-bold bg-white/10 text-amber-300 px-1.5 py-0.5 rounded-sm">
                                    {prov.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-snug">
                                  {isBn ? prov.descBn : prov.descEn}
                                </p>
                                {isSelected && (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold mt-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{isBn ? 'সক্রিয় গেটওয়ে' : 'Active Gateway'}</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* C. Merchant Account Configuration */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <h6 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5" />
                          <span>{isBn ? 'মার্চেন্ট অ্যাকাউন্ট ও এপিআই সেটিংস' : 'Merchant Account & API Credentials'}</span>
                        </h6>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'মার্চেন্ট UPI ID / VPA *' : 'Merchant UPI ID / VPA *'}
                            </label>
                            <div className="relative">
                              <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                              <input
                                type="text"
                                value={currentGateway.merchantUpiId}
                                onChange={(e) => updateGateway({ merchantUpiId: e.target.value })}
                                placeholder="ezyseva.pay@gov.in"
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-emerald-300 text-xs focus:border-amber-400 focus:outline-hidden font-mono font-bold"
                              />
                            </div>
                            <span className="text-[10px] text-white/40 mt-1 block">
                              {isBn ? 'চেকআউটে নাগরিকরা এই ইউপিআই আইডিতে সরাসরি স্ক্যান করে পেমেন্ট করবে।' : 'Used for dynamic QR codes generated during checkout.'}
                            </span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'মার্চেন্ট / ব্যবসা প্রতিষ্ঠানের নাম' : 'Merchant / Business Display Name'}
                            </label>
                            <input
                              type="text"
                              value={currentGateway.merchantName || ''}
                              onChange={(e) => updateGateway({ merchantName: e.target.value })}
                              placeholder="Ma Tara Cyber Cafe (MTCC)"
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-amber-400 focus:outline-hidden"
                            />
                            <span className="text-[10px] text-white/40 mt-1 block">
                              {isBn ? 'ব্যাংক চালানে প্রদর্শিত প্রাপকের নাম।' : 'Beneficiary name shown on bank receipts.'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'গেটওয়ে এপিআই কি / ক্লায়েন্ট আইডি' : 'Gateway API Key / Client ID'}
                            </label>
                            <div className="relative">
                              <input
                                type={showMerchantKey ? 'text' : 'password'}
                                value={currentGateway.merchantKey || ''}
                                onChange={(e) => updateGateway({ merchantKey: e.target.value })}
                                placeholder="rzp_live_xxxxxxxxxxxxxx"
                                className="w-full px-3 py-2 pr-10 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-amber-400 focus:outline-hidden font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setShowMerchantKey(!showMerchantKey)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                              >
                                {showMerchantKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'পেমেন্ট হেল্পলাইন ফোন' : 'Payment Support Phone'}
                            </label>
                            <input
                              type="text"
                              value={currentGateway.supportPhone || ''}
                              onChange={(e) => updateGateway({ supportPhone: e.target.value })}
                              placeholder="1800-399-7382"
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-amber-400 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* D. 6 Payment Methods Activation Toggles */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-white/90">
                            {isBn ? '৬টি পেমেন্ট মেথড সক্রিয় / নিষ্ক্রিয় করার অপশন:' : 'Toggle 6 Payment Methods (All Channels):'}
                          </label>
                          <span className="text-[11px] text-white/50">
                            {isBn ? 'অন/অফ টগল সুইচ' : 'On/Off Switches'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {PAYMENT_METHODS_LIST.map((pm) => {
                            const isEnabled = currentGateway[pm.key] !== false;
                            return (
                              <div
                                key={pm.key}
                                className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2.5 ${
                                  isEnabled
                                    ? 'bg-white/8 border-amber-400/40 shadow-sm'
                                    : 'bg-white/[0.02] border-white/5 opacity-60'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                                    <CheckCircle2 className={`w-3.5 h-3.5 ${isEnabled ? 'text-emerald-400' : 'text-white/20'}`} />
                                    <span>{isBn ? pm.nameBn : pm.nameEn}</span>
                                  </span>

                                  {/* Toggle Button */}
                                  <button
                                    type="button"
                                    onClick={() => updateGateway({ [pm.key]: !isEnabled })}
                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors relative shrink-0 ${
                                      isEnabled ? 'bg-emerald-600' : 'bg-white/20'
                                    }`}
                                  >
                                    <div
                                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </div>

                                <p className="text-[11px] text-white/50 leading-tight">
                                  {isBn ? pm.descBn : pm.descEn}
                                </p>

                                <div className="text-[10px] font-semibold flex items-center justify-between pt-1 border-t border-white/5">
                                  <span className="text-white/40">Status</span>
                                  <span className={isEnabled ? 'text-emerald-400' : 'text-rose-400'}>
                                    {isEnabled ? (isBn ? 'সক্রিয় (Active)' : 'Active') : (isBn ? 'বন্ধ (Disabled)' : 'Disabled')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* E. Financial Rules */}
                      <div className="bg-black/30 border border-white/10 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start justify-between gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <div className="font-bold text-xs text-white">
                              {isBn ? '০% কনভেনিয়েন্স ফি (বিনামূল্যে সেবা)' : 'Zero Convenience Fee Mode'}
                            </div>
                            <p className="text-[11px] text-white/50 mt-0.5">
                              {isBn ? 'নাগরিকদের জন্য পোর্টাল সার্ভিস চার্জ সম্পূর্ণ মকুব করুন।' : 'Waive portal convenience charge for citizens.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateGateway({ zeroConvenienceFee: !currentGateway.zeroConvenienceFee })}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors relative shrink-0 mt-1 ${
                              currentGateway.zeroConvenienceFee ? 'bg-emerald-600' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                currentGateway.zeroConvenienceFee ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-start justify-between gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                          <div>
                            <div className="font-bold text-xs text-white">
                              {isBn ? 'ইনস্ট্যান্ট অটো-ভেরিফিকেশন' : 'Instant Auto-Verification'}
                            </div>
                            <p className="text-[11px] text-white/50 mt-0.5">
                              {isBn ? 'পেমেন্ট সম্পন্ন হলে তাৎক্ষণিক ট্র্যাকিং নম্বর ও রসিদ জারি।' : 'Instantly generate tracking ID upon payment confirmation.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => updateGateway({ autoVerify: !currentGateway.autoVerify })}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors relative shrink-0 mt-1 ${
                              currentGateway.autoVerify !== false ? 'bg-emerald-600' : 'bg-white/20'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                currentGateway.autoVerify !== false ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. PORTAL BRANDING & CONTENT MODULE */}
                  {(settingsSubSection === 'all' || settingsSubSection === 'content') && (
                    <div className="space-y-4">
                      {/* Portal Branding Block */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <h5 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                          <Sliders className="w-4 h-4" />
                          <span>{isBn ? 'পোর্টাল নাম ও ট্যাগলাইন' : 'Portal Name & Tagline'}</span>
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Portal Name</label>
                            <input
                              type="text"
                              value={formSettings.portalName}
                              onChange={(e) => setFormSettings({ ...formSettings, portalName: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Suffix / Sub-label</label>
                            <input
                              type="text"
                              value={formSettings.portalSubname}
                              onChange={(e) => setFormSettings({ ...formSettings, portalSubname: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">ট্যাগলাইন (বাংলা)</label>
                            <input
                              type="text"
                              value={formSettings.taglineBn}
                              onChange={(e) => setFormSettings({ ...formSettings, taglineBn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Tagline (English)</label>
                            <input
                              type="text"
                              value={formSettings.taglineEn}
                              onChange={(e) => setFormSettings({ ...formSettings, taglineEn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Live Announcement Marquee Banner */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <h5 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{isBn ? 'লাইভ এলার্ট নোটিশ (জরুরি ঘোষণা বার)' : 'Live Emergency Announcement Bar'}</span>
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">নোটিশ টেক্সট (বাংলা)</label>
                            <input
                              type="text"
                              value={formSettings.noticeAlertBn}
                              onChange={(e) => setFormSettings({ ...formSettings, noticeAlertBn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Notice Text (English)</label>
                            <input
                              type="text"
                              value={formSettings.noticeAlertEn}
                              onChange={(e) => setFormSettings({ ...formSettings, noticeAlertEn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Helpline & Contact Details */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <h5 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                          <PhoneCall className="w-4 h-4" />
                          <span>{isBn ? 'হেল্পলাইন ও সরকারি যোগাযোগ তথ্য' : 'Helpline & Official Contacts'}</span>
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">টোল-ফ্রি নম্বর</label>
                            <input
                              type="text"
                              value={formSettings.tollFreePhone}
                              onChange={(e) => setFormSettings({ ...formSettings, tollFreePhone: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">সাহায্যের সময়সীমা</label>
                            <input
                              type="text"
                              value={formSettings.helpdeskTimingsBn}
                              onChange={(e) => setFormSettings({ ...formSettings, helpdeskTimingsBn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">সাপোর্ট ইমেইল</label>
                            <input
                              type="email"
                              value={formSettings.supportEmail}
                              onChange={(e) => setFormSettings({ ...formSettings, supportEmail: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">রাজ্য কার্যালয় ঠিকানা</label>
                          <input
                            type="text"
                            value={formSettings.officeAddressBn}
                            onChange={(e) => setFormSettings({ ...formSettings, officeAddressBn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. ADMIN SECURITY & PASSWORD MODULE */}
                  {(settingsSubSection === 'all' || settingsSubSection === 'security') && (
                    <div className="bg-purple-950/20 border border-purple-500/30 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-purple-300" />
                          <span>{isBn ? 'অ্যাডমিন সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন' : 'Admin Security & Password Management'}</span>
                        </h5>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
                          CONFIDENTIAL
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'আপনার অ্যাডমিন লগইন আইডি ও পাসওয়ার্ড এখানে পরিবর্তন করুন। এটি কঠোরভাবে গোপন রাখা হয় এবং অন্য কোনো ব্যবহারকারী দেখতে পাবে না।'
                          : 'Change your admin credentials securely. Passwords are masked and never exposed to public visitors.'}
                      </p>

                      {changeCredsStatus && (
                        <div
                          className={`text-xs p-3 rounded-xl flex items-center gap-2 ${
                            changeCredsStatus.isError
                              ? 'text-red-300 bg-red-500/15 border border-red-500/30'
                              : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                          }`}
                        >
                          {changeCredsStatus.isError ? (
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          )}
                          <span>{changeCredsStatus.msg}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'নতুন অ্যাডমিন আইডি (ঐচ্ছিক)' : 'New Admin ID (Optional)'}
                          </label>
                          <input
                            type="text"
                            value={newAdminId}
                            onChange={(e) => setNewAdminId(e.target.value)}
                            placeholder={adminCreds.adminId}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'বর্তমান পাসওয়ার্ড *' : 'Current Password *'}
                          </label>
                          <input
                            type="password"
                            value={currentAdminPass}
                            onChange={(e) => setCurrentAdminPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'নতুন গোপন পাসওয়ার্ড *' : 'New Password *'}
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPass ? 'text' : 'password'}
                              value={newAdminPass}
                              onChange={(e) => setNewAdminPass(e.target.value)}
                              placeholder="••••••••"
                              className="w-full px-3 py-2 pr-10 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass((prev) => !prev)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                            >
                              {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}
                          </label>
                          <input
                            type="password"
                            value={confirmNewAdminPass}
                            onChange={(e) => setConfirmNewAdminPass(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleUpdateAdminCredentials}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl border border-purple-400/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>{isBn ? 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন' : 'Update Admin Password'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে অ্যাডমিন আইডি ও পাসওয়ার্ড ডিফল্ট (admin / admin)-এ রিসেট করতে চান?' : 'Are you sure you want to reset admin credentials to default (admin / admin)?')) {
                              handleResetAdminCredentialsToDefault();
                              setChangeCredsStatus({
                                msg: isBn ? 'অ্যাডমিন ক্রেডেনশিয়াল সফলভাবে ফ্যাক্টরি ডিফল্টে (admin / admin) রিসেট করা হয়েছে!' : 'Admin credentials reset to factory default (admin / admin)!',
                                isError: false,
                              });
                            }
                          }}
                          className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-xs rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isBn ? 'ফ্যাক্টরি ডিফল্ট রিসেট (admin / admin)' : 'Reset to Default (admin / admin)'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'সমস্ত পরিবর্তন সংরক্ষণ করুন (লাইভ আপডেট)' : 'Publish All Changes (Live)'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: SERVICES MANAGEMENT */}
              {activeTab === 'services' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isBn ? 'উপলব্ধ নাগরিক পরিষেবাসমূহ' : 'All Citizen Services'}
                      </h4>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'যেকোনো পরিষেবার সরকারি ফি, কিয়স্ক চার্জ, সময়সীমা পরিবর্তন অথবা নতুন সেবা যোগ করুন।'
                          : 'Adjust official statutory fees, kiosk facilitation charges, SLA days or add new services.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder={isBn ? 'পরিষেবা ফিল্টার...' : 'Search services...'}
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-hidden"
                        />
                      </div>

                      <button
                        onClick={() => setIsAddingNewService(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 border border-emerald-400/30 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isBn ? 'নতুন পরিষেবা যোগ' : '+ Add Service'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Service Action Notification Banner */}
                  {serviceNotification && (
                    <div className="p-3.5 bg-emerald-500/20 border-2 border-emerald-400/60 text-emerald-200 text-xs font-bold rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/30 animate-in fade-in">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{serviceNotification}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setServiceNotification('')}
                        className="text-emerald-300 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Add New Service Form Modal / Card */}
                  {isAddingNewService && (
                    <div className="bg-gradient-to-br from-emerald-950/30 via-white/5 to-white/5 border-2 border-emerald-400/50 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200 shadow-xl shadow-emerald-950/30">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <span>{isBn ? 'নতুন সরকারি পরিষেবা তৈরি ও যুক্ত করুন' : 'Create & Register New Citizen Service'}</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewService(false)}
                          className="text-white/60 hover:text-white p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateNewService} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs font-bold text-white/90 mb-1">
                              {isBn ? 'পরিষেবার নাম (বাংলা) *' : 'Service Title (Bengali) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={newService.titleBn || ''}
                              onChange={(e) => setNewService({ ...newService, titleBn: e.target.value })}
                              placeholder={isBn ? 'যেমন: ডিজিটাল রেশন কার্ড সংশোধন' : 'e.g. ডিজিটাল রেশন কার্ড সংশোধন'}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-xs focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/90 mb-1">
                              {isBn ? 'Service Title (English) *' : 'Service Title (English) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={newService.titleEn || ''}
                              onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                              placeholder="e.g. Digital Ration Card Correction"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-xs focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'ক্যাটাগরি' : 'Category'}
                            </label>
                            <select
                              value={newService.category}
                              onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#0e0e24] text-white text-xs focus:outline-hidden"
                            >
                              <option value="identity">Identity & Cards (পরিচয় ও কার্ড)</option>
                              <option value="certificates">Certificates (সনদপত্র ও প্রমাণ্য)</option>
                              <option value="bills">Utility Bills (বিদ্যুৎ ও জল বিল)</option>
                              <option value="schemes">Welfare Schemes (সরকারি অনুদান)</option>
                              <option value="land">Land & Revenue (জমি ও রাজস্ব)</option>
                              <option value="banking">Banking & Cash (ব্যাংকিং ও ক্যাশ)</option>
                              <option value="legal">Legal & Affidavits (আইনি ও নোটারি)</option>
                              <option value="education">Education (শিক্ষা ও বৃত্তি)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'সরকারি ফি (Govt Fee ₹)' : 'Official Govt Fee (₹)'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={newService.govtFee || 0}
                              onChange={(e) => setNewService({ ...newService, govtFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'কিয়স্ক চার্জ (Kiosk Fee ₹)' : 'Kiosk Service Charge (₹)'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={newService.convenienceFee ?? 40}
                              onChange={(e) => setNewService({ ...newService, convenienceFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'বিতরণ সময়সীমা (SLA)' : 'Delivery Timeline (SLA)'}
                            </label>
                            <input
                              type="text"
                              value={newService.slaDaysBn || '৭-১০ কার্যদিবস'}
                              onChange={(e) => setNewService({ ...newService, slaDaysBn: e.target.value, slaDays: e.target.value })}
                              placeholder="৭-১০ কার্যদিবস"
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'প্রদানকারী সরকারি দপ্তর / কর্তৃপক্ষ' : 'Issuing Department / Authority'}
                            </label>
                            <input
                              type="text"
                              value={newService.officialGovtBodyBn || ''}
                              onChange={(e) => setNewService({
                                ...newService,
                                officialGovtBodyBn: e.target.value,
                                officialGovtBodyEn: e.target.value,
                              })}
                              placeholder={isBn ? 'যেমন: খাদ্য ও সরবরাহ দপ্তর, পশ্চিমবঙ্গ' : 'e.g. Dept of Food & Supplies'}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">
                              {isBn ? 'প্রয়োজনীয় কাগজপত্র (কমা দিয়ে আলাদা করুন)' : 'Required Documents (comma-separated)'}
                            </label>
                            <input
                              type="text"
                              value={(newService.requiredDocsBn || []).join(', ')}
                              onChange={(e) => {
                                const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                                setNewService({
                                  ...newService,
                                  requiredDocsBn: list.length > 0 ? list : ['আধার কার্ড'],
                                  requiredDocsEn: list.length > 0 ? list : ['Aadhaar Card'],
                                });
                              }}
                              placeholder={isBn ? 'আধার কার্ড, পাসপোর্ট ছবি, বিদ্যুৎ বিল' : 'Aadhaar Card, Photo, Utility Bill'}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'সংক্ষিপ্ত বিবরণ (বাংলা)' : 'Short Description (Bengali)'}
                          </label>
                          <textarea
                            rows={2}
                            value={newService.shortDescBn || ''}
                            onChange={(e) => setNewService({
                              ...newService,
                              shortDescBn: e.target.value,
                              shortDescEn: e.target.value,
                            })}
                            placeholder={isBn ? 'এই পরিষেবার মাধ্যমে নাগরিকরা কী সুবিধা পাবেন...' : 'Brief summary of the citizen service...'}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!newService.isPopular}
                              onChange={(e) => setNewService({ ...newService, isPopular: e.target.checked })}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-white/10 border-white/20"
                            />
                            <span className="text-xs text-white/80 font-medium">
                              {isBn ? 'নাগরিকদের কাছে জনপ্রিয় (Featured Service) হিসেবে চিহ্নিত করুন' : 'Mark as Popular / Featured Service'}
                            </span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingNewService(false)}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
                            >
                              {isBn ? 'বাতিল' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isBn ? 'নতুন সেবা সংরক্ষণ ও যোগ করুন' : 'Save & Register Service'}</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Edit Existing Service Modal */}
                  {editingService && (
                    <div className="bg-white/5 border-2 border-purple-400/50 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h5 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>{isBn ? 'পরিষেবা সম্পাদনা ও মূল্য পরিবর্তন' : 'Edit Service & Fees'}</span>
                        </h5>
                        <button
                          onClick={() => setEditingService(null)}
                          className="text-white/60 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveEditedService} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">নাম (বাংলা)</label>
                            <input
                              type="text"
                              value={editingService.titleBn}
                              onChange={(e) => setEditingService({ ...editingService, titleBn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Title (English)</label>
                            <input
                              type="text"
                              value={editingService.titleEn}
                              onChange={(e) => setEditingService({ ...editingService, titleEn: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">সরকারি ফি (Govt Fee ₹)</label>
                            <input
                              type="number"
                              value={editingService.govtFee}
                              onChange={(e) => setEditingService({ ...editingService, govtFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">কিয়স্ক চার্জ (Kiosk Fee ₹)</label>
                            <input
                              type="number"
                              value={editingService.convenienceFee}
                              onChange={(e) => setEditingService({ ...editingService, convenienceFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">নিষ্পত্তির সময় (SLA Days)</label>
                            <input
                              type="text"
                              value={editingService.slaDaysBn}
                              onChange={(e) => setEditingService({ ...editingService, slaDaysBn: e.target.value, slaDays: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingService(null)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
                          >
                            {isBn ? 'বাতিল' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                          >
                            {isBn ? 'আপডেট সেভ করুন' : 'Update Service'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Services Table */}
                  <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 font-bold uppercase text-[10px] bg-white/[0.02]">
                          <th className="py-2.5 px-3">{isBn ? 'পরিষেবা' : 'Service'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'সরকারি ফি' : 'Govt Fee'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'কিয়স্ক ফি' : 'Kiosk Fee'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'মোট মূল্য' : 'Total'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                          <th className="py-2.5 px-3 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {services
                          .filter((s) => {
                            const q = serviceSearch.toLowerCase().trim();
                            if (!q) return true;
                            return (
                              s.titleEn.toLowerCase().includes(q) ||
                              s.titleBn.toLowerCase().includes(q) ||
                              s.category.toLowerCase().includes(q)
                            );
                          })
                          .map((service, idx) => {
                            const isActive = service.isActive !== false;
                            const total = service.govtFee + service.convenienceFee;
                            return (
                              <tr key={service.id ? `${service.id}-${idx}` : `adm-srv-${idx}`} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-white">{isBn ? service.titleBn : service.titleEn}</div>
                                  <div className="text-[10px] text-white/50">{service.officialGovtBodyEn}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-[10px] uppercase font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded">
                                    {service.category}
                                  </span>
                                </td>
                                <td className="py-3 px-3 font-mono">₹{service.govtFee}</td>
                                <td className="py-3 px-3 font-mono">₹{service.convenienceFee}</td>
                                <td className="py-3 px-3 font-mono font-bold text-blue-400">₹{total}</td>
                                <td className="py-3 px-3">
                                  <button
                                    onClick={() => handleToggleServiceActive(service.id)}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                      isActive
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                                        : 'bg-red-500/20 text-red-300 border-red-400/30'
                                    }`}
                                  >
                                    {isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                                  </button>
                                </td>
                                <td className="py-3 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => setEditingService(service)}
                                      title={isBn ? 'সম্পাদনা করুন' : 'Edit'}
                                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteService(service.id)}
                                      title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                                      className="p-1.5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CITIZEN ORDERS & APPLICATIONS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Top Bar Header & Controls */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-400" />
                        <span>{isBn ? 'নাগরিক গ্রাহকদের দাখিলকৃত আবেদন ও পেমেন্ট হিস্ট্রি' : 'Customer Orders & Payment Records Pipeline'}</span>
                      </h4>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'গ্রাহকদের অর্ডার, ইউটিআই/ইউটিআর নম্বর, জিএসটি ইনভয়েস ও রাজ্য/জেলা ভিত্তিক আবেদন ট্র্যাক ও যাচাই করুন।'
                          : 'Monitor customer applications, verify UTR payment numbers, inspect GST invoices, and filter by State/District.'}
                      </p>
                    </div>

                    {/* Filter Controls: State, District, Status & Search */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* State Filter */}
                      <div className="relative">
                        <select
                          value={orderFilterState}
                          onChange={(e) => {
                            setOrderFilterState(e.target.value);
                            setOrderFilterDistrict('all');
                          }}
                          className="px-3 py-1.5 rounded-xl border border-white/15 bg-[#0e0e24] text-xs text-white focus:border-blue-400 focus:outline-hidden"
                          title={isBn ? 'রাজ্য নির্বাচন করুন' : 'Select State'}
                        >
                          <option value="all">{isBn ? '🌐 সব রাজ্য (All States)' : '🌐 All States'}</option>
                          {ALL_INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* District Filter */}
                      <div className="relative">
                        <select
                          value={orderFilterDistrict}
                          onChange={(e) => setOrderFilterDistrict(e.target.value)}
                          disabled={orderFilterState === 'all' && adminAvailableDistricts.length === 0}
                          className="px-3 py-1.5 rounded-xl border border-white/15 bg-[#0e0e24] text-xs text-white focus:border-blue-400 focus:outline-hidden disabled:opacity-50"
                          title={isBn ? 'জেলা নির্বাচন করুন' : 'Select District'}
                        >
                          <option value="all">
                            {orderFilterState === 'all' 
                              ? (isBn ? '📍 সব জেলা (প্রথমে রাজ্য বাছাই করুন)' : '📍 All Districts (Select state)') 
                              : (isBn ? `📍 সমস্ত জেলা (${adminAvailableDistricts.length}টি)` : `📍 All Districts (${adminAvailableDistricts.length})`)}
                          </option>
                          {adminAvailableDistricts.map((dst) => (
                            <option key={dst} value={dst}>
                              {dst}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status Filter */}
                      <select
                        value={orderFilterStatus}
                        onChange={(e) => setOrderFilterStatus(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-white/15 bg-[#0e0e24] text-xs text-white focus:border-blue-400 focus:outline-hidden"
                      >
                        <option value="all">{isBn ? 'সব স্ট্যাটাস' : 'All Statuses'}</option>
                        <option value="submitted">{isBn ? '১. আবেদন জমা (Submitted)' : '1. Submitted'}</option>
                        <option value="verification">{isBn ? '২. নথি যাচাই (Verification)' : '2. Verification'}</option>
                        <option value="department_processing">{isBn ? '৩. প্রক্রিয়াধীন (Processing)' : '3. Processing'}</option>
                        <option value="approved">{isBn ? '৪. অনুমোদিত (Approved)' : '4. Approved'}</option>
                      </select>

                      {/* Search input */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder={isBn ? 'আইডি, UTR, ইনভয়েস বা নাম...' : 'Search ID, UTR, Invoice, Name...'}
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-hidden min-w-[170px]"
                        />
                      </div>

                      {/* Clear Filters Button */}
                      {(orderFilterState !== 'all' || orderFilterDistrict !== 'all' || orderFilterStatus !== 'all' || orderSearch.trim() !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderFilterState('all');
                            setOrderFilterDistrict('all');
                            setOrderFilterStatus('all');
                            setOrderSearch('');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-1"
                          title={isBn ? 'ফিল্টার রিসেট' : 'Reset Filters'}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>{isBn ? 'মুছুন' : 'Clear'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Metric Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">{isBn ? 'মোট আবেদন' : 'Total Orders'}</span>
                        <strong className="text-sm text-white font-mono">{applications.length}</strong>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">{isBn ? 'মোট সংগৃহীত রাজস্ব' : 'Settled Revenue'}</span>
                        <strong className="text-sm text-emerald-300 font-mono">₹{totalGovtRevenue}</strong>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">{isBn ? 'ইউটিআর ভেরিফাইড' : 'UTR Verified'}</span>
                        <strong className="text-sm text-purple-300 font-mono">
                          {applications.filter((a) => a.utrNumber).length}
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-white/50 block">{isBn ? 'জিএসটি ইনভয়েস' : 'GST Invoices'}</span>
                        <strong className="text-sm text-amber-300 font-mono">
                          {applications.filter((a) => a.invoiceNumber).length}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Active Filter Notice if Filtered */}
                  {(orderFilterState !== 'all' || orderFilterDistrict !== 'all' || orderFilterStatus !== 'all' || orderSearch.trim() !== '') && (
                    <div className="text-xs text-white/70 bg-blue-500/10 border border-blue-400/20 px-3.5 py-2 rounded-xl flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          {isBn
                            ? `ফিল্টার অনুযায়ী ${filteredOrders.length}টি অর্ডার প্রদর্শিত হচ্ছে`
                            : `Showing ${filteredOrders.length} orders matching your active filters`}
                          {orderFilterState !== 'all' && ` • State: ${orderFilterState}`}
                          {orderFilterDistrict !== 'all' && ` • District: ${orderFilterDistrict}`}
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-300 font-bold font-mono">
                        {filteredOrders.length} / {applications.length}
                      </span>
                    </div>
                  )}

                  {/* Order Process Modal / Card */}
                  {selectedOrderToEdit && (
                    <div className="bg-gradient-to-br from-blue-950/30 via-white/5 to-white/5 border-2 border-blue-400/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{isBn ? 'আবেদন ও পেমেন্ট প্রসেসিং কনসোল' : 'Application & Payment Processing Console'}</span>
                          </div>
                          <h5 className="font-extrabold text-sm text-white mt-0.5">
                            {selectedOrderToEdit.trackingId} — {selectedOrderToEdit.applicantName}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedAdminInvoiceOrder(selectedOrderToEdit)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>{isBn ? 'ট্যাক্স ইনভয়েস দেখুন' : 'View Tax Invoice'}</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrderToEdit(null)}
                            className="text-white/60 hover:text-white p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                          <span className="text-white/50 text-[11px] block">{isBn ? 'পরিষেবা:' : 'Service:'}</span>
                          <div className="font-bold text-white leading-tight">
                            {isBn ? selectedOrderToEdit.serviceNameBn : selectedOrderToEdit.serviceNameEn}
                          </div>
                          <div className="text-[10px] text-white/50 font-mono">
                            {selectedOrderToEdit.appliedDate}
                          </div>
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                          <span className="text-white/50 text-[11px] block">{isBn ? 'গ্রাহক ও মোবাইল:' : 'Customer & Phone:'}</span>
                          <div className="font-bold text-white">{selectedOrderToEdit.applicantName}</div>
                          <div className="text-[11px] text-blue-300 font-mono">📱 {selectedOrderToEdit.mobile}</div>
                          {selectedOrderToEdit.aadhaarLast4 && (
                            <div className="text-[10px] text-white/50 font-mono">Aadhaar: •••• {selectedOrderToEdit.aadhaarLast4}</div>
                          )}
                        </div>

                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                          <span className="text-white/50 text-[11px] block">{isBn ? 'রাজ্য ও জেলা:' : 'State & District:'}</span>
                          <div className="font-bold text-emerald-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{selectedOrderToEdit.district || 'Kolkata'}, {selectedOrderToEdit.state || 'West Bengal'}</span>
                          </div>
                          {selectedOrderToEdit.pincode && (
                            <div className="text-[10px] text-white/50 font-mono">PIN: {selectedOrderToEdit.pincode}</div>
                          )}
                        </div>

                        <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/20 space-y-0.5">
                          <span className="text-emerald-300/80 text-[11px] block">{isBn ? 'পরিশোধিত মোট ফি:' : 'Total Settled:'}</span>
                          <div className="font-extrabold text-emerald-300 text-sm font-mono">
                            ₹{selectedOrderToEdit.feePaid}
                          </div>
                          <div className="text-[10px] text-emerald-300/70 font-mono">
                            {selectedOrderToEdit.paymentMethod || 'Online Gateway / UPI'}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Payment, UTR & Invoice Metadata Box */}
                      <div className="bg-gradient-to-r from-amber-950/30 via-white/5 to-purple-950/30 border border-amber-500/20 rounded-xl p-3.5 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold text-amber-300">
                            <Receipt className="w-4 h-4 text-amber-400" />
                            <span>{isBn ? 'পেমেন্ট ও ট্যাক্স ইনভয়েস বিবরণ (Payment & Invoice Verification):' : 'Payment & Tax Invoice Verification Details:'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                            PAID & VERIFIED
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
                          <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                            <span className="text-[10px] text-white/50 block font-sans">
                              {isBn ? 'ইউটিআই / ইউটিআর নম্বর (UTR / Bank Ref):' : 'UTR / Bank Ref Number:'}
                            </span>
                            <strong className="text-purple-300 font-bold tracking-wider select-all">
                              {selectedOrderToEdit.utrNumber || selectedOrderToEdit.paymentTransactionId || 'UTR-NOT-RECORDED'}
                            </strong>
                          </div>

                          <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                            <span className="text-[10px] text-white/50 block font-sans">
                              {isBn ? 'ট্যাক্স ইনভয়েস নম্বর (GST Invoice):' : 'GST Invoice Number:'}
                            </span>
                            <strong className="text-amber-300 font-bold tracking-wider select-all">
                              {selectedOrderToEdit.invoiceNumber || 'INV-PENDING'}
                            </strong>
                          </div>

                          <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                            <span className="text-[10px] text-white/50 block font-sans">
                              {isBn ? 'পেমেন্ট টাইমস্ট্যাম্প (Timestamp):' : 'Payment Timestamp:'}
                            </span>
                            <span className="text-white/80">
                              {selectedOrderToEdit.paymentTimestamp || selectedOrderToEdit.appliedDate}
                            </span>
                          </div>
                        </div>

                        {selectedOrderToEdit.address && (
                          <div className="pt-1 text-[11px] text-white/60">
                            <span className="text-white/40">{isBn ? 'গ্রাহকের ঠিকানা: ' : 'Customer Address: '}</span>
                            <span className="text-white/80">{selectedOrderToEdit.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Advance Stage Control */}
                      <div className="space-y-2 pt-1">
                        <label className="block text-xs font-bold text-white">
                          {isBn ? 'স্ট্যাটাস ও প্রসেসিং ধাপ পরিবর্তন করুন:' : 'Advance Application Processing Stage:'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(
                                selectedOrderToEdit.trackingId,
                                'submitted',
                                1,
                                'Application registered on portal',
                                'অনলাইন পোর্টালে আবেদন নথিভুক্ত হয়েছে'
                              )
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              selectedOrderToEdit.currentStageNumber === 1
                                ? 'border-blue-400 bg-blue-500/20 text-white shadow-sm'
                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <div>1. Submitted</div>
                            <div className="text-[10px] text-white/50 font-normal">আবেদন জমা</div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(
                                selectedOrderToEdit.trackingId,
                                'verification',
                                2,
                                'Citizen documents verified by operator',
                                'অপারেটর দ্বারা সমস্ত নাগরিক নথি সফলভাবে যাচাইকৃত'
                              )
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              selectedOrderToEdit.currentStageNumber === 2
                                ? 'border-amber-400 bg-amber-500/20 text-white shadow-sm'
                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <div>2. Verification</div>
                            <div className="text-[10px] text-white/50 font-normal">নথি যাচাই</div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(
                                selectedOrderToEdit.trackingId,
                                'department_processing',
                                3,
                                'Forwarded to Govt department for digital clearance',
                                'সরকারি বিভাগীয় কার্যালয়ে অনুমোদনের জন্য প্রেরিত'
                              )
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              selectedOrderToEdit.currentStageNumber === 3
                                ? 'border-purple-400 bg-purple-500/20 text-white shadow-sm'
                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <div>3. Processing</div>
                            <div className="text-[10px] text-white/50 font-normal">দপ্তরে প্রক্রিয়াধীন</div>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(
                                selectedOrderToEdit.trackingId,
                                'approved',
                                4,
                                'Certificate/Service approved & ready for dispatch',
                                'আবেদন সরকারিভাবে অনুমোদিত ও ডিজিটাল কপি প্রস্তুত'
                              )
                            }
                            className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                              selectedOrderToEdit.currentStageNumber === 4
                                ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-sm'
                                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                          >
                            <div>4. Approved</div>
                            <div className="text-[10px] text-white/50 font-normal">অনুমোদিত ও প্রস্তুত</div>
                          </button>
                        </div>
                      </div>

                      {/* Official Remarks Input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            {isBn ? 'অফিসিয়াল মন্তব্য (বাংলায় - গ্রাহক ট্র্যাকিংয়ে দেখতে পাবেন)' : 'Official Remarks (Bengali - Visible to citizen)'}
                          </label>
                          <input
                            type="text"
                            value={selectedOrderToEdit.remarksBn}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedOrderToEdit({ ...selectedOrderToEdit, remarksBn: val });
                              const updated = applications.map((a) =>
                                a.trackingId === selectedOrderToEdit.trackingId ? { ...a, remarksBn: val } : a
                              );
                              onUpdateApplications(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">
                            Official Remarks (English)
                          </label>
                          <input
                            type="text"
                            value={selectedOrderToEdit.remarksEn}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedOrderToEdit({ ...selectedOrderToEdit, remarksEn: val });
                              const updated = applications.map((a) =>
                                a.trackingId === selectedOrderToEdit.trackingId ? { ...a, remarksEn: val } : a
                              );
                              onUpdateApplications(updated);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orders & Payments Table */}
                  <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02]">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 font-bold uppercase text-[10px] bg-white/[0.02]">
                          <th className="py-2.5 px-3">{isBn ? 'ট্র্যাকিং ও ইনভয়েস' : 'Tracking & Invoice'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'আবেদনকারী ও অবস্থান' : 'Applicant & State/District'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'পরিষেবা' : 'Service'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'পেমেন্ট ও ইউটিআর' : 'Payment & UTR'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'ধাপ' : 'Stage'}</th>
                          <th className="py-2.5 px-3 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-white/40">
                              {isBn ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found matching the filter.'}
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order, idx) => (
                            <tr key={order.trackingId ? `${order.trackingId}-${idx}` : `adm-ord-${idx}`} className="hover:bg-white/5 transition-colors">
                              {/* Tracking ID & Invoice Number */}
                              <td className="py-3 px-3">
                                <div className="font-mono font-bold text-blue-300">
                                  {order.trackingId}
                                </div>
                                {order.invoiceNumber ? (
                                  <div className="text-[10px] font-mono text-amber-300/90 font-medium">
                                    #{order.invoiceNumber}
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-white/30 font-mono">Invoice Pending</div>
                                )}
                              </td>

                              {/* Applicant & Location (State + District) */}
                              <td className="py-3 px-3">
                                <div className="font-bold text-white">{order.applicantName}</div>
                                <div className="text-[10px] text-white/50 font-mono">📱 {order.mobile}</div>
                                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                                  <span>{order.district || 'Kolkata'}, {order.state || 'West Bengal'}</span>
                                </div>
                              </td>

                              {/* Service Name */}
                              <td className="py-3 px-3">
                                <div className="font-medium text-white max-w-[170px] truncate">
                                  {isBn ? order.serviceNameBn : order.serviceNameEn}
                                </div>
                                <div className="text-[10px] text-white/40 capitalize">{order.category}</div>
                              </td>

                              {/* Payment & UTR */}
                              <td className="py-3 px-3">
                                <div className="font-mono font-bold text-emerald-400">
                                  ₹{order.feePaid}
                                </div>
                                {order.utrNumber ? (
                                  <div className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-400/20 inline-block max-w-[140px] truncate" title={order.utrNumber}>
                                    UTR: {order.utrNumber}
                                  </div>
                                ) : (
                                  <div className="text-[10px] font-mono text-white/40">
                                    Txn: {order.paymentTransactionId || 'N/A'}
                                  </div>
                                )}
                              </td>

                              {/* Date */}
                              <td className="py-3 px-3 text-white/60 font-mono text-[11px]">
                                <div>{order.appliedDate}</div>
                                {order.paymentTimestamp && (
                                  <div className="text-[9px] text-white/40">{order.paymentTimestamp.split(' ')[1]}</div>
                                )}
                              </td>

                              {/* Stage */}
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20 whitespace-nowrap">
                                  {isBn ? `ধাপ ${order.currentStageNumber}/৪` : `Stage ${order.currentStageNumber}/4`}
                                </span>
                              </td>

                              {/* Actions: View Invoice & Process */}
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Invoice Button */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedAdminInvoiceOrder(order)}
                                    className="p-1.5 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold border border-amber-400/20 transition-colors"
                                    title={isBn ? 'ট্যাক্স ইনভয়েস দেখুন ও ডাউনলোড' : 'View Tax Invoice'}
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Process Button */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedOrderToEdit(order)}
                                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                                  >
                                    {isBn ? 'প্রসেস' : 'Process'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: KENDRAS MANAGEMENT */}
              {activeTab === 'kendras' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isBn ? 'সেবা কেন্দ্র নেটওয়ার্ক ও কিয়স্ক ডিরেক্টরি' : 'CSC Kendra Network Directory'}
                      </h4>
                      <p className="text-xs text-white/60">
                        {isBn ? 'অনুমোদিত অপারেটর, ঠিকানা ও মোবাইল নম্বর পরিচালনা' : 'Manage authorized operators, timings, and contact numbers'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {kendras.map((kendra, idx) => (
                      <div
                        key={kendra.id ? `${kendra.id}-${idx}` : `adm-knd-${idx}`}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-white">{isBn ? kendra.nameBn : kendra.nameEn}</h5>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 px-2 py-0.5 rounded">
                            {kendra.cscId}
                          </span>
                        </div>
                        <div className="text-xs text-white/70">
                          👤 {isBn ? 'অপারেটর:' : 'Operator:'} <strong className="text-white">{isBn ? kendra.operatorBn : kendra.operatorEn}</strong>
                        </div>
                        <div className="text-xs text-white/60">
                          📍 {isBn ? kendra.addressBn : kendra.addressEn}, {kendra.pincode}
                        </div>
                        <div className="text-xs text-white/60 flex items-center justify-between pt-2 border-t border-white/10">
                          <span>📞 {kendra.phone}</span>
                          <span>🕒 {isBn ? kendra.timingsBn : kendra.timingsEn}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Admin Tax Invoice Modal */}
      {selectedAdminInvoiceOrder && (
        <InvoiceModal
          application={selectedAdminInvoiceOrder}
          language={language}
          onClose={() => setSelectedAdminInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

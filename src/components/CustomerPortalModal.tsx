import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  User, 
  ShoppingBag, 
  FileText, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  Plus, 
  Sparkles, 
  LogOut, 
  Smartphone, 
  Search, 
  MapPin, 
  AlertCircle,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  UserPlus,
  Package,
  AlertTriangle,
  Receipt,
  Globe2
} from 'lucide-react';
import { Language, CustomerUser, ApplicationRecord, ServiceItem } from '../types';
import { INITIAL_CUSTOMERS } from '../data/settingsData';
import { InvoiceModal } from './InvoiceModal';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/locationsData';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser | null;
  onLogin: (user: CustomerUser) => void;
  onLogout: () => void;
  onUpdateProfile?: (updated: CustomerUser) => void;
  onUpdateCustomer?: (updated: CustomerUser) => void;
  applications: ApplicationRecord[];
  services: ServiceItem[];
  language: Language;
  onSelectServiceToApply?: (service: ServiceItem) => void;
  onSelectService?: (service: ServiceItem) => void;
  onGoToTrack?: (trackingId: string) => void;
  onTrackApplication?: (trackingId: string) => void;
  initialAuthMode?: 'login' | 'register';
  authPromptReason?: string | null;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  customer,
  onLogin,
  onLogout,
  onUpdateProfile,
  onUpdateCustomer,
  applications,
  services,
  language,
  onSelectServiceToApply,
  onSelectService,
  onGoToTrack,
  onTrackApplication,
  initialAuthMode,
  authPromptReason,
}) => {
  const isBn = language === 'bn';

  // Unified callback resolvers
  const doUpdateProfile = onUpdateProfile || onUpdateCustomer || (() => {});
  const doSelectService = onSelectServiceToApply || onSelectService || (() => {});
  const doGoToTrack = onGoToTrack || onTrackApplication || (() => {});

  // Tabs for logged in customer
  const [activeTab, setActiveTab] = useState<'orders' | 'order_new' | 'profile' | 'wallet'>('orders');

  // Registered Customers local database
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_registered_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Auth Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (initialAuthMode) {
      setAuthMode(initialAuthMode);
    }
  }, [initialAuthMode, isOpen]);

  // Login Form States (confidential, masked)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Invoice Viewer Modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<ApplicationRecord | null>(null);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regState, setRegState] = useState('West Bengal');
  const [regDistrict, setRegDistrict] = useState('North 24 Parganas');
  const [regPincode, setRegPincode] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Dynamic districts for registration state
  const regDistricts = useMemo(() => getDistrictsForState(regState), [regState]);

  // Auth & Pin Change feedback
  const [authError, setAuthError] = useState('');
  const [currentCustomerPin, setCurrentCustomerPin] = useState('');
  const [newCustomerPin, setNewCustomerPin] = useState('');
  const [confirmNewCustomerPin, setConfirmNewCustomerPin] = useState('');
  const [showChangePin, setShowChangePin] = useState(false);
  const [pinChangeStatus, setPinChangeStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(customer?.name || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');
  const [editAddress, setEditAddress] = useState(customer?.address || '');
  const [editState, setEditState] = useState(customer?.state || 'West Bengal');
  const [editDistrict, setEditDistrict] = useState(customer?.district || 'Kolkata');
  const [editPincode, setEditPincode] = useState(customer?.pincode || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Dynamic districts for edit profile state
  const editDistricts = useMemo(() => getDistrictsForState(editState), [editState]);

  // New Order service search inside customer panel
  const [serviceFilter, setServiceFilter] = useState('');

  // Wallet add money state
  const [rechargeAmount, setRechargeAmount] = useState<number | ''>('');
  const [walletMsg, setWalletMsg] = useState('');

  if (!isOpen) return null;

  // Sync profile fields when customer changes
  const handleStartEditProfile = () => {
    if (customer) {
      setEditName(customer.name);
      setEditEmail(customer.email || '');
      setEditAddress(customer.address);
      setEditState(customer.state || 'West Bengal');
      setEditDistrict(customer.district);
      setEditPincode(customer.pincode);
      setProfileSavedMsg(false);
    }
  };

  // Filter orders for this customer (by customerId or mobile)
  const customerOrders = customer
    ? applications.filter(
        (app) =>
          app.customerId === customer.id ||
          app.mobile === customer.mobile ||
          (customer.name && app.applicantName.toLowerCase().includes(customer.name.slice(0, 5).toLowerCase()))
      )
    : [];

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginIdentifier.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanId || !cleanPass) {
      setAuthError(isBn ? 'অনুগ্রহ করে মোবাইল নম্বর/আইডি এবং গোপন পাসওয়ার্ড দিন।' : 'Please enter Mobile/ID and Password.');
      return;
    }

    // Match by mobile or ID
    const found = registeredCustomers.find(
      (c) =>
        c.mobile === cleanId ||
        c.id.toLowerCase() === cleanId.toLowerCase()
    );

    if (found) {
      const storedPass = found.password || '1234';
      if (cleanPass === storedPass) {
        onLogin(found);
        setLoginIdentifier('');
        setLoginPassword('');
        setAuthError('');
        return;
      }
    }

    // Confidential error message — NEVER leak credentials or indicate which field failed
    setAuthError(
      isBn
        ? 'ভুল মোবাইল নম্বর/আইডি অথবা গোপন পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।'
        : 'Invalid Mobile/ID or Password. Please verify your confidential credentials.'
    );
  };

  const handleCustomerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setAuthError(isBn ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।' : 'Please enter your full name.');
      return;
    }
    const cleanMobile = regMobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setAuthError(isBn ? 'অনুগ্রহ করে সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setAuthError(isBn ? 'গোপন পাসওয়ার্ড বা পিন কমপক্ষে ৪ সংখ্যার হতে হবে।' : 'Password/PIN must be at least 4 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError(isBn ? 'পাসওয়ার্ড দুটি মিলছে না! পুনরায় দিন।' : 'Passwords do not match.');
      return;
    }

    // Check if mobile already exists
    const existing = registeredCustomers.find((c) => c.mobile === cleanMobile);
    if (existing) {
      setAuthError(
        isBn
          ? 'এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত! অনুগ্রহ করে "লগইন" ট্যাবে গিয়ে পাসওয়ার্ড দিয়ে প্রবেশ করুন।'
          : 'This mobile number is already registered! Please log in using your password.'
      );
      return;
    }

    const randomId = `CUST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCustomer: CustomerUser = {
      id: randomId,
      name: regName.trim(),
      mobile: cleanMobile,
      password: regPassword,
      email: `${cleanMobile}@citizen.ezyseva.in`,
      aadhaar: `5412${Math.floor(1000 + Math.random() * 9000)}${cleanMobile.slice(-4)}`,
      state: regState,
      district: regDistrict,
      pincode: regPincode.trim() || '700001',
      address: regAddress.trim() || (isBn ? 'পশ্চিমবঙ্গ, ভারত' : 'West Bengal, India'),
      walletBalance: 250,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newCustomer, ...registeredCustomers];
    setRegisteredCustomers(updatedList);
    try {
      localStorage.setItem('ezyseva_registered_customers', JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }

    onLogin(newCustomer);
    setAuthError('');
  };

  const handleChangeCustomerPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const currentPass = customer.password || '1234';
    if (currentCustomerPin !== currentPass) {
      setPinChangeStatus({
        msg: isBn ? 'বর্তমান পাসওয়ার্ডটি সঠিক নয়!' : 'Current password is incorrect!',
        isError: true,
      });
      return;
    }
    if (!newCustomerPin || newCustomerPin.length < 4) {
      setPinChangeStatus({
        msg: isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!' : 'New password must be at least 4 characters!',
        isError: true,
      });
      return;
    }
    if (newCustomerPin !== confirmNewCustomerPin) {
      setPinChangeStatus({
        msg: isBn ? 'নতুন পাসওয়ার্ড দুটি মিলছে না!' : 'New passwords do not match!',
        isError: true,
      });
      return;
    }

    const updatedUser: CustomerUser = {
      ...customer,
      password: newCustomerPin,
    };

    doUpdateProfile(updatedUser);

    const updatedList = registeredCustomers.map((c) =>
      c.id === customer.id ? updatedUser : c
    );
    setRegisteredCustomers(updatedList);
    try {
      localStorage.setItem('ezyseva_registered_customers', JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }

    setCurrentCustomerPin('');
    setNewCustomerPin('');
    setConfirmNewCustomerPin('');
    setPinChangeStatus({
      msg: isBn ? 'পাসওয়ার্ড সফলভাবে আপডেট ও সুরক্ষিত করা হয়েছে!' : 'Password updated & secured successfully!',
      isError: false,
    });
    setTimeout(() => setPinChangeStatus(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    const updated: CustomerUser = {
      ...customer,
      name: editName,
      email: editEmail,
      address: editAddress,
      state: editState,
      district: editDistrict,
      pincode: editPincode,
    };
    doUpdateProfile(updated);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleAddWalletMoney = (amount: number) => {
    if (!customer) return;
    const updated: CustomerUser = {
      ...customer,
      walletBalance: customer.walletBalance + amount,
    };
    doUpdateProfile(updated);
    setWalletMsg(isBn ? `ওয়ালেটে ₹${amount} সফলভাবে যোগ করা হয়েছে!` : `₹${amount} added successfully to wallet!`);
    setTimeout(() => setWalletMsg(''), 3000);
  };

  // Filter available services (strictly deduplicated)
  const filteredServicesForOrder = useMemo(() => {
    const q = serviceFilter.toLowerCase().trim();
    const seen = new Set<string>();
    const result: ServiceItem[] = [];

    for (const s of services) {
      if (!s || !s.id || seen.has(s.id)) continue;
      seen.add(s.id);
      if (s.isActive === false) continue;
      if (!q || s.titleEn.toLowerCase().includes(q) || s.titleBn.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) {
        result.push(s);
      }
    }
    return result;
  }, [services, serviceFilter]);

  const getStatusBadge = (status: ApplicationRecord['status'], stage: number) => {
    switch (status) {
      case 'submitted':
        return { label: isBn ? 'আবেদন গৃহীত' : 'Submitted', bg: 'bg-blue-500/20 text-blue-300 border-blue-400/30' };
      case 'verification':
        return { label: isBn ? 'নথি যাচাই চলছে' : 'Verification', bg: 'bg-amber-500/20 text-amber-300 border-amber-400/30' };
      case 'department_processing':
        return { label: isBn ? 'দপ্তরে প্রক্রিয়াধীন' : 'Processing', bg: 'bg-purple-500/20 text-purple-300 border-purple-400/30' };
      case 'approved':
      case 'ready_for_dispatch':
        return { label: isBn ? 'অনুমোদিত ও প্রস্তুত' : 'Approved & Ready', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' };
      default:
        return { label: status, bg: 'bg-white/10 text-white border-white/20' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh] text-white">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold shadow-md shadow-blue-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  {isBn ? 'নাগরিক গ্রাহক প্যানেল' : 'Citizen Customer Panel'}
                </h2>
                {customer && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isBn ? 'ভেরিফায়েড নাগরিক' : 'Verified'}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">
                {isBn
                  ? 'আপনার সমস্ত সরকারি আবেদন অর্ডার, স্ট্যাটাস ট্র্যাকিং ও দ্রুত সেবা বুকিং'
                  : 'Manage all your orders, download official certificates & 1-click apply'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In View: Citizen Secure Login / Register */}
        {!customer ? (
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-5">
              
              {/* Header Icon and Title */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-500/10">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">
                  {isBn ? 'নাগরিক গ্রাহক লগইন ও একাউন্ট' : 'Citizen Account Portal'}
                </h3>
                <p className="text-xs text-white/60">
                  {isBn
                    ? 'আপনার আবেদনসমূহ সুরক্ষিত রাখতে আইডি ও গোপন পাসওয়ার্ড দিয়ে প্রবেশ করুন'
                    : 'Log in with your mobile/ID and confidential password to access your orders'}
                </p>
              </div>

              {/* Requirement Reason Banner (if redirected from ordering service) */}
              {authPromptReason && (
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 rounded-2xl p-4 text-xs text-amber-200 flex items-start gap-3 shadow-lg shadow-amber-500/10">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-amber-300 text-sm">
                      {isBn ? 'গ্রাহক আইডি (Customer ID) আবশ্যক' : 'Customer ID Required to Proceed'}
                    </div>
                    <div className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                      {authPromptReason}
                    </div>
                  </div>
                </div>
              )}

              {/* Login vs Register Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন নিবন্ধন' : 'Create Account'}</span>
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleCustomerLogin} className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'মোবাইল নম্বর বা কাস্টমার আইডি *' : 'Registered Mobile or Customer ID *'}
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={isBn ? 'যেমন: 9830149210 বা CUST-98301' : 'e.g. 9830149210 or CUST-98301'}
                      autoComplete="username"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'গোপন পাসওয়ার্ড বা পিন *' : 'Confidential Password / Security PIN *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 p-2.5 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isBn ? 'নিরাপদে লগইন করুন' : 'Sign In Confidentially'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError('');
                      }}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      {isBn ? 'অ্যাকাউন্ট নেই? বিনামূল্যে নতুন অ্যাকাউন্ট খুলুন →' : "Don't have an account? Create one for free →"}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {authMode === 'register' && (
                <form onSubmit={handleCustomerRegister} className="space-y-3.5 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'আপনার পুরো নাম *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={isBn ? 'যেমন: সুবীর কুমার দাস' : 'e.g. Subir Kumar Das'}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'মোবাইল নম্বর (১০ সংখ্যা) *' : 'Active Mobile Number (10 digits) *'}
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-blue-400" />
                        <span>{isBn ? 'রাজ্য' : 'State / UT'}</span>
                      </label>
                      <select
                        value={regState}
                        onChange={(e) => {
                          const st = e.target.value;
                          setRegState(st);
                          const dList = getDistrictsForState(st);
                          if (dList.length > 0) setRegDistrict(dList[0].nameEn);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#14142b] text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      >
                        {ALL_INDIAN_STATES.map((st) => (
                          <option key={st.code} value={st.nameEn} className="bg-[#0e0e24] text-white">
                            {isBn ? `${st.nameBn} (${st.nameEn})` : `${st.nameEn} (${st.code})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'জেলা' : 'District'}
                      </label>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-[#14142b] text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      >
                        {regDistricts.map((d) => (
                          <option key={d.nameEn} value={d.nameEn} className="bg-[#0e0e24] text-white">
                            {isBn ? `${d.nameBn} (${d.nameEn})` : d.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'পিন কোড' : 'PIN Code'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regPincode}
                        onChange={(e) => setRegPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="700124"
                        className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'আবাসিক ঠিকানা (ঐচ্ছিক)' : 'Address (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder={isBn ? 'গ্রাম/শহর, পোস্ট অফিস' : 'Village/City, Post Office'}
                      className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'গোপন পাসওয়ার্ড বা পিন *' : 'Set Secret Password/PIN *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2 pr-10 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm Password *'}
                      </label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-white/40 text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {authError && (
                    <div className="text-xs text-red-300 bg-red-500/15 border border-red-500/30 p-2.5 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isBn ? 'নিবন্ধন সম্পন্ন ও লগইন করুন' : 'Complete Registration & Sign In'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        ) : (
          /* Logged In Customer Portal View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Customer Profile Banner & Quick Stats */}
            <div className="bg-white/[0.03] border-b border-white/10 px-6 py-3 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {customer.name ? customer.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{customer.name}</span>
                      <span className="text-[10px] text-white/50 font-mono">📱 {customer.mobile}</span>
                    </div>
                    <div className="text-[11px] text-white/60">
                      <span>{customer.district}</span> | <span className="font-mono">Aadhaar: •••• {customer.aadhaar.slice(-4)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Digital Wallet Pill */}
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-white/70">{isBn ? 'ওয়ালেট ব্যালেন্স:' : 'Wallet:'}</span>
                    <span className="font-mono font-bold text-emerald-300 text-xs">₹{customer.walletBalance}</span>
                    <button
                      onClick={() => handleAddWalletMoney(500)}
                      title={isBn ? 'টাকা যোগ করুন (+₹500)' : 'Quick add ₹500'}
                      className="ml-1 p-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[10px] px-1 font-bold"
                    >
                      +₹500
                    </button>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1 text-xs text-white/50 hover:text-red-400 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isBn ? 'লগআউট' : 'Logout'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center px-6 border-b border-white/10 bg-white/[0.01] gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'orders'
                    ? 'border-blue-400 text-blue-400 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders & Applications'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300">
                  {customerOrders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('order_new')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'order_new'
                    ? 'border-blue-400 text-blue-400 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'নতুন সেবা অর্ডার করুন' : 'Order New Service'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  handleStartEditProfile();
                }}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'profile'
                    ? 'border-blue-400 text-blue-400 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isBn ? 'আমার প্রোফাইল ও ঠিকানা' : 'Saved Profile & Address'}</span>
              </button>

              <button
                onClick={() => setActiveTab('wallet')}
                className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeTab === 'wallet'
                    ? 'border-blue-400 text-blue-400 bg-white/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{isBn ? 'ওয়ালেট ও লেনদেন' : 'Wallet & Funds'}</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              
              {/* TAB 1: MY ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isBn ? 'আপনার দাখিলকৃত আবেদনসমূহ' : 'Your Submitted Applications'}
                      </h4>
                      <p className="text-[11px] text-white/50">
                        {isBn ? 'রিয়েল-টাইম ট্র্যাকিং স্ট্যাটাস ও ডিজিটাল রসিদ' : 'Real-time processing stage & digital acknowledgment slips'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('order_new')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isBn ? 'নতুন অর্ডার দিন' : 'New Order'}</span>
                    </button>
                  </div>

                  {customerOrders.length > 0 ? (
                    <div className="space-y-3">
                      {customerOrders.map((order, idx) => {
                        const badge = getStatusBadge(order.status, order.currentStageNumber);
                        return (
                          <div
                            key={order.trackingId ? `${order.trackingId}-${idx}` : `cust-ord-${idx}`}
                            className="bg-white/5 hover:bg-white/[0.08] transition-all border border-white/10 rounded-2xl p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-white">
                                    {isBn ? order.serviceNameBn : order.serviceNameEn}
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                                    {badge.label}
                                  </span>
                                </div>
                                <div className="text-[11px] text-white/50 font-mono mt-0.5">
                                  {isBn ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}: <strong className="text-blue-300">{order.trackingId}</strong> | {order.appliedDate}
                                </div>
                                
                                {/* Speed Post consignment badge & Payment Txn & UTR & Invoice */}
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  {order.speedPostNumber && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg font-mono font-bold">
                                      <Package className="w-3 h-3 text-amber-400" />
                                      <span>Speed Post: {order.speedPostNumber}</span>
                                    </span>
                                  )}
                                  {order.paymentTransactionId && (
                                    <span className="text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono inline-flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                      <span>Paid • {order.paymentTransactionId}</span>
                                    </span>
                                  )}
                                  {order.utrNumber && (
                                    <span className="text-[10px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono inline-flex items-center gap-1 font-bold">
                                      <span>UTR: {order.utrNumber}</span>
                                    </span>
                                  )}
                                  {order.invoiceNumber && (
                                    <span className="text-[10px] text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-md font-mono inline-flex items-center gap-1 font-bold">
                                      <Receipt className="w-3 h-3 text-purple-400" />
                                      <span>Inv: {order.invoiceNumber}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-white/50">{isBn ? 'প্রদেয় ফি' : 'Fee Settled'}</span>
                                <div className="font-mono font-bold text-sm text-blue-400">₹{order.feePaid}</div>
                              </div>
                            </div>

                            {/* 4-Step Progress Indicator */}
                            <div className="pt-2 border-t border-white/10">
                              <div className="flex items-center justify-between text-[10px] text-white/60 mb-1.5">
                                <span className={order.currentStageNumber >= 1 ? 'text-blue-300 font-bold' : ''}>
                                  1. {isBn ? 'জমা' : 'Submitted'}
                                </span>
                                <span>→</span>
                                <span className={order.currentStageNumber >= 2 ? 'text-blue-300 font-bold' : ''}>
                                  2. {isBn ? 'যাচাই' : 'Verification'}
                                </span>
                                <span>→</span>
                                <span className={order.currentStageNumber >= 3 ? 'text-blue-300 font-bold' : ''}>
                                  3. {isBn ? 'দপ্তর' : 'Processing'}
                                </span>
                                <span>→</span>
                                <span className={order.currentStageNumber >= 4 ? 'text-emerald-300 font-bold' : ''}>
                                  4. {isBn ? 'অনুমোদিত' : 'Delivered'}
                                </span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                                  style={{ width: `${(order.currentStageNumber / 4) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Remarks & Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="text-[11px] text-white/60 italic max-w-md">
                                💬 {isBn ? order.remarksBn : order.remarksEn}
                              </div>

                              <div className="flex items-center gap-2 ml-auto">
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoiceOrder(order)}
                                  className="flex items-center gap-1 text-[11px] text-purple-200 hover:text-white bg-purple-600/25 hover:bg-purple-600/40 px-3 py-1 rounded-lg border border-purple-400/40 transition-all font-bold shadow-xs"
                                >
                                  <Receipt className="w-3.5 h-3.5 text-purple-300" />
                                  <span>{isBn ? 'ট্যাক্স ইনভয়েস ডাউনলোড' : 'Tax Invoice (GST)'}</span>
                                </button>

                                <button
                                  onClick={() => {
                                    onClose();
                                    doGoToTrack(order.trackingId);
                                  }}
                                  className="flex items-center gap-1 text-[11px] text-blue-300 hover:text-blue-200 bg-blue-500/20 hover:bg-blue-500/30 px-2.5 py-1 rounded-lg border border-blue-400/30 transition-colors font-semibold"
                                >
                                  <span>{isBn ? 'বিস্তারিত ট্র্যাক' : 'Live Tracking'}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-3">
                      <ShoppingBag className="w-10 h-10 text-white/30 mx-auto" />
                      <div className="text-white font-bold text-sm">
                        {isBn ? 'আপনার এখনও কোনো অর্ডার নেই' : 'No Orders Placed Yet'}
                      </div>
                      <p className="text-xs text-white/50 max-w-sm mx-auto">
                        {isBn
                          ? 'প্যান কার্ড, ভোটার সংশোধন, বিদ্যুৎ বিল বা অন্যান্য নাগরিক সেবা মাত্র কয়েক ক্লিকে আবেদন করুন।'
                          : 'Select any public service from the catalog to submit your official application.'}
                      </p>
                      <button
                        onClick={() => setActiveTab('order_new')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                      >
                        {isBn ? 'সেবা তালিকা থেকে অর্ডার করুন' : 'Browse & Order Services'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ORDER NEW SERVICE (1-CLICK APPLY) */}
              {activeTab === 'order_new' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {isBn ? 'সরকারি নাগরিক সেবা ক্যাটালগ' : 'Citizen Service Order Catalog'}
                      </h4>
                      <p className="text-[11px] text-white/50">
                        {isBn
                          ? 'যেকোনো সেবায় ক্লিক করলেই আপনার প্রোফাইলের তথ্য স্বয়ংক্রিয়ভাবে ফর্মে পূরণ হয়ে যাবে!'
                          : 'Click any service to apply with your saved profile details pre-filled automatically!'}
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        placeholder={isBn ? 'সেবা খুঁজুন...' : 'Search service...'}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-hidden focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredServicesForOrder.map((service, idx) => (
                      <div
                        key={service.id ? `${service.id}-${idx}` : `cust-srv-${idx}`}
                        className="bg-white/5 hover:bg-white/[0.08] transition-all border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5 group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/20">
                              {service.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              ₹{service.govtFee + service.convenienceFee}
                            </span>
                          </div>
                          <h5 className="font-bold text-sm text-white mt-1.5 group-hover:text-blue-300 transition-colors">
                            {isBn ? service.titleBn : service.titleEn}
                          </h5>
                          <p className="text-[11px] text-white/60 line-clamp-2 mt-0.5">
                            {isBn ? service.shortDescBn : service.shortDescEn}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                          <span className="text-[10px] text-white/40">
                            ⏱️ {isBn ? service.slaDaysBn : service.slaDays}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              doSelectService(service);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 border border-blue-400/30 transition-all hover:scale-[1.02]"
                          >
                            <span>{isBn ? 'আবেদন / অর্ডার' : '1-Click Apply'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROFILE SETTINGS */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-xl">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isBn ? 'আপনার প্রোফাইল ও সংরক্ষিত ঠিকানা' : 'Saved Customer Profile & Address'}
                    </h4>
                    <p className="text-[11px] text-white/50">
                      {isBn
                        ? 'এই তথ্যগুলি ভবিষ্যতে প্রতিটি নতুন সেবা ফর্মে স্বয়ংক্রিয়ভাবে ব্যবহার করা হবে।'
                        : 'These details are automatically populated in the service application forms.'}
                    </p>
                  </div>

                  {profileSavedMsg && (
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile saved successfully!'}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'পুরো নাম *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-blue-400" />
                        <span>{isBn ? 'রাজ্য *' : 'State / UT *'}</span>
                      </label>
                      <select
                        value={editState}
                        onChange={(e) => {
                          const st = e.target.value;
                          setEditState(st);
                          const dList = getDistrictsForState(st);
                          if (dList.length > 0) setEditDistrict(dList[0].nameEn);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#14142b] text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      >
                        {ALL_INDIAN_STATES.map((st) => (
                          <option key={st.code} value={st.nameEn} className="bg-[#0e0e24] text-white">
                            {isBn ? `${st.nameBn} (${st.nameEn})` : `${st.nameEn} (${st.code})`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'জেলা *' : 'District *'}
                      </label>
                      <select
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-[#14142b] text-white text-xs focus:border-blue-400 focus:outline-hidden"
                      >
                        {editDistricts.map((d) => (
                          <option key={d.nameEn} value={d.nameEn} className="bg-[#0e0e24] text-white">
                            {isBn ? `${d.nameBn} (${d.nameEn})` : d.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'পিন কোড *' : 'PIN Code *'}
                      </label>
                      <input
                        type="text"
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/80 mb-1">
                      {isBn ? 'সম্পূর্ণ আবাসিক ঠিকানা (নথি ও কার্ড পৌঁছানোর জন্য) *' : 'Full Postal Address (for card delivery) *'}
                    </label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 border border-blue-400/30 transition-all"
                  >
                    {isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                  </button>
                </form>

                {/* Customer Password / Security PIN Card */}
                <div className="bg-blue-950/25 border border-blue-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-blue-300 flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-blue-400" />
                      <span>{isBn ? 'নাগরিক পাসওয়ার্ড / সিকিউরিটি পিন পরিবর্তন' : 'Change Citizen Password / PIN'}</span>
                    </h5>
                    <span className="text-[10px] font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                      PROTECTED
                    </span>
                  </div>
                  <p className="text-xs text-white/60">
                    {isBn
                      ? 'আপনার একাউন্টের গোপন পাসওয়ার্ড নিয়মিত পরিবর্তন করে সুরক্ষিত রাখুন। এটি অন্য কেউ দেখতে পারবে না।'
                      : 'Keep your citizen account safe by updating your secret password or 4-digit security PIN.'}
                  </p>

                  {pinChangeStatus && (
                    <div
                      className={`text-xs p-3 rounded-xl flex items-center gap-2 ${
                        pinChangeStatus.isError
                          ? 'text-red-300 bg-red-500/15 border border-red-500/30'
                          : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                      }`}
                    >
                      {pinChangeStatus.isError ? (
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      )}
                      <span>{pinChangeStatus.msg}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangeCustomerPassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">
                        {isBn ? 'বর্তমান পাসওয়ার্ড / পিন *' : 'Current Password / PIN *'}
                      </label>
                      <input
                        type="password"
                        value={currentCustomerPin}
                        onChange={(e) => setCurrentCustomerPin(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">
                          {isBn ? 'নতুন গোপন পাসওয়ার্ড *' : 'New Secret Password *'}
                        </label>
                        <div className="relative">
                          <input
                            type={showChangePin ? 'text' : 'password'}
                            value={newCustomerPin}
                            onChange={(e) => setNewCustomerPin(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 pr-10 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowChangePin((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
                          >
                            {showChangePin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">
                          {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}
                        </label>
                        <input
                          type="password"
                          value={confirmNewCustomerPin}
                          onChange={(e) => setConfirmNewCustomerPin(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-blue-400 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600/70 hover:bg-blue-600 text-white font-bold text-xs rounded-xl border border-blue-400/30 transition-all flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isBn ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Security Password'}</span>
                    </button>
                  </form>
                </div>
              </div>
              )}

              {/* TAB 4: WALLET & FUNDS */}
              {activeTab === 'wallet' && (
                <div className="space-y-4 max-w-lg">
                  <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/20 border border-blue-400/30 rounded-2xl p-5 space-y-3">
                    <div className="text-xs text-white/70">{isBn ? 'উপলব্ধ ওয়ালেট ব্যালেন্স' : 'Available Digital Balance'}</div>
                    <div className="text-3xl font-black font-mono text-emerald-300">
                      ₹{customer.walletBalance.toLocaleString('en-IN')}.00
                    </div>
                    <div className="text-[11px] text-white/50">
                      {isBn
                        ? 'এই ব্যালেন্স দিয়ে আপনি যেকোনো সরকারি ফি বা সার্ভিস চার্জ ইনস্ট্যান্ট পে করতে পারেন।'
                        : 'Use this balance for instant 1-click payment of any service or statutory fee.'}
                    </div>
                  </div>

                  {walletMsg && (
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{walletMsg}</span>
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="text-xs font-bold text-white">
                      {isBn ? 'দ্রুত ওয়ালেটে টাকা যোগ করুন (সিমুলেশন)' : 'Quick Add Money to Wallet (Instant)'}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[200, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleAddWalletMoney(amt)}
                          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-blue-600 text-white font-mono font-bold text-xs border border-white/15 hover:border-blue-400 transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>₹{amt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Downloadable Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          application={selectedInvoiceOrder}
          language={language}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { 
  Language, 
  ServiceItem, 
  ServiceCategory, 
  ApplicationRecord, 
  KendraItem, 
  SiteSettings,
  AdminCredentials
} from '../types';
import { DEFAULT_ADMIN_CREDENTIALS } from '../data/settingsData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onResetSiteSettings: () => void;
  services: ServiceItem[];
  onUpdateServices: (services: ServiceItem[]) => void;
  applications: ApplicationRecord[];
  onUpdateApplications: (apps: ApplicationRecord[]) => void;
  kendras: KendraItem[];
  onUpdateKendras: (kendras: KendraItem[]) => void;
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
  applications,
  onUpdateApplications,
  kendras,
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

  // Change Admin Credentials Form State
  const [currentAdminPass, setCurrentAdminPass] = useState('');
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmNewAdminPass, setConfirmNewAdminPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [changeCredsStatus, setChangeCredsStatus] = useState<{ msg: string; isError: boolean } | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'settings' | 'services' | 'orders' | 'kendras'>('settings');

  // Website Settings Form State
  const [formSettings, setFormSettings] = useState<SiteSettings>(siteSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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

  // Orders Management State
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderToEdit, setSelectedOrderToEdit] = useState<ApplicationRecord | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminIdInput.trim();
    const cleanPass = adminPasswordInput.trim();

    if (!cleanId || !cleanPass) {
      setAuthError(isBn ? 'অনুগ্রহ করে অ্যাডমিন আইডি ও পাসওয়ার্ড দিন।' : 'Please enter both Admin ID and Password.');
      return;
    }

    // Authenticate securely without disclosing credentials
    if (
      cleanId.toLowerCase() === adminCreds.adminId.toLowerCase() &&
      cleanPass === adminCreds.password
    ) {
      setIsAdminAuthenticated(true);
      setAdminIdInput('');
      setAdminPasswordInput('');
      setAuthError('');
    } else {
      setAuthError(isBn ? 'ভুল আইডি বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।' : 'Invalid Admin ID or Password! Access denied.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminIdInput('');
    setAdminPasswordInput('');
    setAuthError('');
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
    onUpdateServices(updated);
  };

  // Delete service
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত যে এই পরিষেবাটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this service?')) {
      const updated = services.filter((s) => s.id !== serviceId);
      onUpdateServices(updated);
    }
  };

  // Save edited service
  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const updated = services.map((s) => (s.id === editingService.id ? editingService : s));
    onUpdateServices(updated);
    setEditingService(null);
  };

  // Create new service
  const handleCreateNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.titleEn || !newService.titleBn) {
      alert(isBn ? 'দয়া করে পরিষেবার নাম প্রদান করুন' : 'Please provide service title');
      return;
    }
    const serviceId = newService.id?.trim() || `srv-${Date.now()}`;
    const fullService: ServiceItem = {
      id: serviceId,
      category: (newService.category as ServiceCategory) || 'identity',
      titleEn: newService.titleEn || '',
      titleBn: newService.titleBn || '',
      shortDescEn: newService.shortDescEn || '',
      shortDescBn: newService.shortDescBn || '',
      officialGovtBodyEn: newService.officialGovtBodyEn || 'Govt of West Bengal',
      officialGovtBodyBn: newService.officialGovtBodyBn || 'পশ্চিমবঙ্গ সরকার',
      govtFee: Number(newService.govtFee) || 0,
      convenienceFee: Number(newService.convenienceFee) || 40,
      slaDays: newService.slaDays || '7-10 Days',
      slaDaysBn: newService.slaDaysBn || '৭-১০ দিন',
      iconName: 'FileText',
      isPopular: !!newService.isPopular,
      isActive: true,
      requiredDocsEn: newService.requiredDocsEn || ['Aadhaar Card'],
      requiredDocsBn: newService.requiredDocsBn || ['আধার কার্ড'],
      stepsEn: ['Apply', 'Verification', 'Delivered'],
      stepsBn: ['আবেদন', 'যাচাই', 'বিতরণ'],
      fields: [],
    };
    onUpdateServices([fullService, ...services]);
    setIsAddingNewService(false);
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
    onUpdateApplications(updated);
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

  // Filtered orders
  const filteredOrders = applications.filter((app) => {
    const matchesStatus = orderFilterStatus === 'all' || app.status === orderFilterStatus;
    const q = orderSearch.toLowerCase().trim();
    if (!q) return matchesStatus;
    return (
      matchesStatus &&
      (app.trackingId.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.mobile.includes(q) ||
        app.serviceNameEn.toLowerCase().includes(q) ||
        app.serviceNameBn.toLowerCase().includes(q))
    );
  });

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

              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-white/80 mb-1">
                    {isBn ? 'অ্যাডমিন ইউজারনেম / আইডি' : 'Admin Username / ID'}
                  </label>
                  <input
                    type="text"
                    value={adminIdInput}
                    onChange={(e) => setAdminIdInput(e.target.value)}
                    placeholder={isBn ? 'অ্যাডমিন আইডি দিন' : 'Enter Admin ID'}
                    autoComplete="username"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 text-sm focus:border-purple-400 focus:outline-hidden font-mono"
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
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-2.5 pr-11 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 text-sm focus:border-purple-400 focus:outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                      title={showAdminPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center justify-center gap-2"
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

                  {/* Portal Branding Block */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h5 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                      <Sliders className="w-4 h-4" />
                      <span>{isBn ? 'পোর্টাল ব্র্যান্ডিং ও নাম' : 'Portal Name & Tagline'}</span>
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

                  {/* Hero Headline & Subtitle */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                    <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{isBn ? 'হিরো ব্যানার হেডলাইন ও বার্তা' : 'Hero Headline & Description'}</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">হেডলাইন শুরু (বাংলা)</label>
                        <input
                          type="text"
                          value={formSettings.heroHeadlinePreBn}
                          onChange={(e) => setFormSettings({ ...formSettings, heroHeadlinePreBn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">রঙিন হাইলাইট টেক্সট (বাংলা)</label>
                        <input
                          type="text"
                          value={formSettings.heroHeadlineHighlightBn}
                          onChange={(e) => setFormSettings({ ...formSettings, heroHeadlineHighlightBn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden text-emerald-300 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/80 mb-1">হেডলাইন শেষ (বাংলা)</label>
                        <input
                          type="text"
                          value={formSettings.heroHeadlinePostBn}
                          onChange={(e) => setFormSettings({ ...formSettings, heroHeadlinePostBn: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/80 mb-1">হিরো সাবটাইটেল বর্ণনা (বাংলা)</label>
                      <textarea
                        rows={2}
                        value={formSettings.heroSubtitleBn}
                        onChange={(e) => setFormSettings({ ...formSettings, heroSubtitleBn: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-purple-400 focus:outline-hidden"
                      />
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

                  {/* Admin Security & Password Change Card */}
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

                    <button
                      type="button"
                      onClick={handleUpdateAdminCredentials}
                      className="px-4 py-2 bg-purple-600/60 hover:bg-purple-600 text-white font-bold text-xs rounded-xl border border-purple-400/30 transition-all flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isBn ? 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন' : 'Update Admin Password'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center justify-center gap-2"
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

                  {/* Add New Service Modal / Box */}
                  {isAddingNewService && (
                    <div className="bg-white/5 border-2 border-emerald-400/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          <span>{isBn ? 'নতুন সরকারি পরিষেবা যোগ করুন' : 'Create New Citizen Service'}</span>
                        </h5>
                        <button
                          onClick={() => setIsAddingNewService(false)}
                          className="text-white/60 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateNewService} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">নাম (বাংলা) *</label>
                            <input
                              type="text"
                              required
                              value={newService.titleBn || ''}
                              onChange={(e) => setNewService({ ...newService, titleBn: e.target.value })}
                              placeholder="যেমন: নতুন কাস্ট সার্টিফিকেট আবেদন"
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-emerald-400 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">Title (English) *</label>
                            <input
                              type="text"
                              required
                              value={newService.titleEn || ''}
                              onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
                              placeholder="e.g. Caste Certificate Application"
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:border-emerald-400 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">ক্যাটাগরি</label>
                            <select
                              value={newService.category}
                              onChange={(e) => setNewService({ ...newService, category: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                            >
                              <option value="identity" className="bg-[#0e0e24] text-white">Identity & Cards</option>
                              <option value="certificates" className="bg-[#0e0e24] text-white">Certificates</option>
                              <option value="bills" className="bg-[#0e0e24] text-white">Utility Bills</option>
                              <option value="schemes" className="bg-[#0e0e24] text-white">Welfare Schemes</option>
                              <option value="land" className="bg-[#0e0e24] text-white">Land & Revenue</option>
                              <option value="banking" className="bg-[#0e0e24] text-white">Banking & Cash</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">সরকারি ফি (Govt Fee ₹)</label>
                            <input
                              type="number"
                              value={newService.govtFee || 0}
                              onChange={(e) => setNewService({ ...newService, govtFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">কিয়স্ক চার্জ (Kiosk Fee ₹)</label>
                            <input
                              type="number"
                              value={newService.convenienceFee || 40}
                              onChange={(e) => setNewService({ ...newService, convenienceFee: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-white/80 mb-1">SLA সময়সীমা</label>
                            <input
                              type="text"
                              value={newService.slaDaysBn || '৭-১০ দিন'}
                              onChange={(e) => setNewService({ ...newService, slaDaysBn: e.target.value, slaDays: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-white/80 mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                          <textarea
                            rows={2}
                            value={newService.shortDescBn || ''}
                            onChange={(e) => setNewService({ ...newService, shortDescBn: e.target.value })}
                            placeholder="এই পরিষেবার মাধ্যমে নাগরিকরা কী সুবিধা পাবেন..."
                            className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs focus:outline-hidden"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingNewService(false)}
                            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs"
                          >
                            {isBn ? 'বাতিল' : 'Cancel'}
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                          >
                            {isBn ? 'সেবা সেভ করুন' : 'Save Service'}
                          </button>
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
                          .map((service) => {
                            const isActive = service.isActive !== false;
                            const total = service.govtFee + service.convenienceFee;
                            return (
                              <tr key={service.id} className="hover:bg-white/5 transition-colors">
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
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {isBn ? 'নাগরিক গ্রাহকদের দাখিলকৃত আবেদনসমূহ' : 'Customer Orders & Applications Pipeline'}
                      </h4>
                      <p className="text-xs text-white/60">
                        {isBn
                          ? 'গ্রাহকদের আবেদন যাচাই করুন, স্ট্যাটাস ধাপ পরিবর্তন করুন ও রিমার্ক্স লিখে পাঠান।'
                          : 'Verify customer documents, advance status stages (1 to 4), and dispatch certificates.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={orderFilterStatus}
                        onChange={(e) => setOrderFilterStatus(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white focus:outline-hidden"
                      >
                        <option value="all" className="bg-[#0e0e24] text-white">{isBn ? 'সমস্ত স্ট্যাটাস' : 'All Statuses'}</option>
                        <option value="submitted" className="bg-[#0e0e24] text-white">Submitted</option>
                        <option value="verification" className="bg-[#0e0e24] text-white">Verification</option>
                        <option value="department_processing" className="bg-[#0e0e24] text-white">Processing</option>
                        <option value="approved" className="bg-[#0e0e24] text-white">Approved / Delivered</option>
                      </select>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder={isBn ? 'আইডি বা নাম খুঁজুন...' : 'Search tracking ID / name...'}
                          className="pl-8 pr-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-white/40 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Process Modal / Card */}
                  {selectedOrderToEdit && (
                    <div className="bg-white/5 border-2 border-blue-400/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <div className="text-xs font-bold text-blue-400">
                            {isBn ? 'আবেদন প্রসেসিং কনসোল' : 'Order Processing Console'}
                          </div>
                          <h5 className="font-extrabold text-sm text-white">
                            {selectedOrderToEdit.trackingId} — {selectedOrderToEdit.applicantName}
                          </h5>
                        </div>
                        <button
                          onClick={() => setSelectedOrderToEdit(null)}
                          className="text-white/60 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-white/50 text-[11px]">{isBn ? 'পরিষেবা:' : 'Service:'}</span>
                          <div className="font-bold text-white">{isBn ? selectedOrderToEdit.serviceNameBn : selectedOrderToEdit.serviceNameEn}</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-white/50 text-[11px]">{isBn ? 'মোবাইল ও আধার:' : 'Mobile & Aadhaar:'}</span>
                          <div className="font-bold text-white font-mono">{selectedOrderToEdit.mobile} (Aadhaar: •••• {selectedOrderToEdit.aadhaarLast4})</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <span className="text-white/50 text-[11px]">{isBn ? 'পরিশোধিত ফি:' : 'Fee Settled:'}</span>
                          <div className="font-bold text-emerald-300 font-mono">₹{selectedOrderToEdit.feePaid}</div>
                        </div>
                      </div>

                      {/* Advance Stage Control */}
                      <div className="space-y-2 pt-2">
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
                                ? 'border-blue-400 bg-blue-500/20 text-white'
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
                                ? 'border-amber-400 bg-amber-500/20 text-white'
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
                                ? 'border-purple-400 bg-purple-500/20 text-white'
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
                                ? 'border-emerald-400 bg-emerald-500/20 text-white'
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
                          <label className="block text-xs font-bold text-white/80 mb-1">অফিসিয়াল মন্তব্য (বাংলায় - গ্রাহক ট্র্যাকিংয়ে দেখতে পাবেন)</label>
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
                          <label className="block text-xs font-bold text-white/80 mb-1">Official Remarks (English)</label>
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

                  {/* Orders Table */}
                  <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02]">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50 font-bold uppercase text-[10px] bg-white/[0.02]">
                          <th className="py-2.5 px-3">{isBn ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'আবেদনকারী' : 'Applicant'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'পরিষেবা' : 'Service'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'ফি' : 'Fee'}</th>
                          <th className="py-2.5 px-3">{isBn ? 'ধাপ' : 'Stage'}</th>
                          <th className="py-2.5 px-3 text-right">{isBn ? 'প্রসেসিং' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                          <tr key={order.trackingId} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-blue-300">
                              {order.trackingId}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-white">{order.applicantName}</div>
                              <div className="text-[10px] text-white/50 font-mono">📱 {order.mobile}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-medium text-white">{isBn ? order.serviceNameBn : order.serviceNameEn}</div>
                            </td>
                            <td className="py-3 px-3 text-white/60 font-mono text-[11px]">
                              {order.appliedDate}
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                              ₹{order.feePaid}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20">
                                {isBn ? `ধাপ ${order.currentStageNumber}/৪` : `Stage ${order.currentStageNumber}/4`}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setSelectedOrderToEdit(order)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold shadow-sm"
                              >
                                {isBn ? 'প্রসেস করুন' : 'Process'}
                              </button>
                            </td>
                          </tr>
                        ))}
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
                    {kendras.map((kendra) => (
                      <div
                        key={kendra.id}
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
    </div>
  );
};

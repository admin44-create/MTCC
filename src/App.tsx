/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  db,
  fetchServicesFromFirestore, 
  saveServiceToFirestore, 
  deleteServiceFromFirestore,
  saveOrderToFirestore,
  fetchKendrasFromFirestore,
  saveKendraToFirestore,
  handleFirestoreError,
  OperationType
} from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Sparkles, 
  FileCheck2, 
  MapPin, 
  Receipt, 
  HelpCircle, 
  PhoneCall, 
  Layers, 
  ShieldCheck, 
  Wallet,
  Cpu,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

import { Language, ServiceCategory, ServiceItem, ApplicationRecord, SiteSettings, CustomerUser, KendraItem } from './types';
import { SERVICES_DATA } from './data/servicesData';
import { KENDRA_LOCATIONS } from './data/kendrasData';
import { INITIAL_APPLICATIONS } from './data/trackingData';
import { DEFAULT_SITE_SETTINGS } from './data/settingsData';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { TrackApplication } from './components/TrackApplication';
import { KendraLocator } from './components/KendraLocator';
import { AiSahayakDrawer } from './components/AiSahayakDrawer';
import { RateCardModal } from './components/RateCardModal';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';

// Utilities to prevent duplicate keys across state and localStorage
function deduplicateServices(items: ServiceItem[]): ServiceItem[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: ServiceItem[] = [];
  for (const item of items) {
    if (!item || !item.id) continue;
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

function deduplicateKendras(items: KendraItem[]): KendraItem[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: KendraItem[] = [];
  for (const item of items) {
    if (!item || !item.id) continue;
    if (!seen.has(item.id)) {
      seen.add(item.id);
      result.push(item);
    }
  }
  return result;
}

function deduplicateApplications(items: ApplicationRecord[]): ApplicationRecord[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: ApplicationRecord[] = [];
  for (const item of items) {
    if (!item || !item.trackingId) continue;
    if (!seen.has(item.trackingId)) {
      seen.add(item.trackingId);
      result.push(item);
    }
  }
  return result;
}

export default function App() {
  // Primary State
  const [language, setLanguage] = useState<Language>('bn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [activeNav, setActiveNav] = useState<'services' | 'track' | 'kendras' | 'notices'>('services');
  const [userRole, setUserRole] = useState<'citizen' | 'vle'>('citizen');

  // Customization & Site Settings (Admin Modifiable)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_site_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.portalName === 'EzySeva' || parsed.portalName === 'MTCC' || !parsed.portalName) {
          const updated: SiteSettings = {
            ...DEFAULT_SITE_SETTINGS,
            ...parsed,
            portalName: 'Ma Tara Cyber Cafe',
            portalSubname: ' (MTCC)',
            portalNameBn: 'মা তারা সাইবার ক্যাফে',
            portalSubnameBn: ' (MTCC)',
          };
          localStorage.setItem('ezyseva_site_settings', JSON.stringify(updated));
          return updated;
        }
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      }
      return DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // Services State (Admin Modifiable - Deduplicated)
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        const deduped = deduplicateServices(parsed);
        if (deduped.length > 0) {
          if (parsed.length !== deduped.length) {
            localStorage.setItem('ezyseva_services', JSON.stringify(deduped));
          }
          return deduped;
        }
      }
      return SERVICES_DATA;
    } catch {
      return SERVICES_DATA;
    }
  });

  // Kendra Locations State (Admin Modifiable - Deduplicated)
  const [kendras, setKendras] = useState<KendraItem[]>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_kendras');
      if (saved) {
        const parsed = JSON.parse(saved);
        const deduped = deduplicateKendras(parsed);
        if (deduped.length > 0) {
          if (parsed.length !== deduped.length) {
            localStorage.setItem('ezyseva_kendras', JSON.stringify(deduped));
          }
          return deduped;
        }
      }
      return KENDRA_LOCATIONS;
    } catch {
      return KENDRA_LOCATIONS;
    }
  });

  // Customer Account State (Starts as null so no user credentials or data are visible without login)
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Interactive Modals & Drawers
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isAiSahayakOpen, setIsAiSahayakOpen] = useState(false);
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [customerPortalAuthMode, setCustomerPortalAuthMode] = useState<'login' | 'register'>('login');
  const [customerAuthPromptReason, setCustomerAuthPromptReason] = useState<string | null>(null);
  const [pendingServiceToApply, setPendingServiceToApply] = useState<ServiceItem | null>(null);

  // Applications Tracking State (Deduplicated)
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ezyseva_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        const deduped = deduplicateApplications(parsed);
        if (deduped.length > 0) {
          if (parsed.length !== deduped.length) {
            localStorage.setItem('ezyseva_applications', JSON.stringify(deduped));
          }
          return deduped;
        }
      }
      return INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });
  const [trackTargetId, setTrackTargetId] = useState('');

  const isBn = language === 'bn';

  // Firestore Database Real-time Synchronization & Seeding
  useEffect(() => {
    let isMounted = true;

    async function syncDatabase() {
      try {
        // 1. Sync Services from Firestore
        const remoteServices = await fetchServicesFromFirestore();
        if (remoteServices && remoteServices.length > 0) {
          if (isMounted) {
            setServices(deduplicateServices(remoteServices));
          }
        } else {
          // Seed initial services to Firestore
          for (const s of SERVICES_DATA) {
            await saveServiceToFirestore(s);
          }
        }

        // 2. Sync Kendras from Firestore
        const remoteKendras = await fetchKendrasFromFirestore();
        if (remoteKendras && remoteKendras.length > 0) {
          if (isMounted) {
            setKendras(deduplicateKendras(remoteKendras));
          }
        } else {
          for (const k of KENDRA_LOCATIONS) {
            await saveKendraToFirestore(k);
          }
        }
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    }

    syncDatabase();

    // 3. Realtime Listener on Orders Collection
    const unsubscribeOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        if (!snapshot.empty && isMounted) {
          const remoteOrders: ApplicationRecord[] = [];
          snapshot.forEach((doc) => {
            remoteOrders.push(doc.data() as ApplicationRecord);
          });
          if (remoteOrders.length > 0) {
            setApplications(deduplicateApplications(remoteOrders));
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'orders');
      }
    );

    return () => {
      isMounted = false;
      unsubscribeOrders();
    };
  }, []);

  // Persistence helpers
  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem('ezyseva_site_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleUpdateServices = (newServices: ServiceItem[]) => {
    const deduped = deduplicateServices(newServices);
    setServices(deduped);
    for (const s of deduped) {
      saveServiceToFirestore(s);
    }
    try {
      localStorage.setItem('ezyseva_services', JSON.stringify(deduped));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleUpdateKendras = (newKendras: KendraItem[]) => {
    const deduped = deduplicateKendras(newKendras);
    setKendras(deduped);
    for (const k of deduped) {
      saveKendraToFirestore(k);
    }
    try {
      localStorage.setItem('ezyseva_kendras', JSON.stringify(deduped));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleResetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.removeItem('ezyseva_site_settings');
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleUpdateService = (updated: ServiceItem) => {
    saveServiceToFirestore(updated);
    setServices((prev) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s));
      const deduped = deduplicateServices(next);
      try {
        localStorage.setItem('ezyseva_services', JSON.stringify(deduped));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return deduped;
    });
  };

  const handleAddService = (newService: ServiceItem) => {
    saveServiceToFirestore(newService);
    setServices((prev) => {
      const filtered = prev.filter((s) => s.id !== newService.id);
      const next = [newService, ...filtered];
      try {
        localStorage.setItem('ezyseva_services', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return next;
    });
  };

  const handleDeleteService = (serviceId: string) => {
    deleteServiceFromFirestore(serviceId);
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== serviceId);
      try {
        localStorage.setItem('ezyseva_services', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return next;
    });
  };

  const handleUpdateApplications = (newApps: ApplicationRecord[]) => {
    const deduped = deduplicateApplications(newApps);
    setApplications(deduped);
    for (const app of deduped) {
      saveOrderToFirestore(app);
    }
    try {
      localStorage.setItem('ezyseva_applications', JSON.stringify(deduped));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const handleUpdateApplicationStatus = (
    trackingId: string,
    status: ApplicationRecord['status'],
    stage: number,
    remarksEn: string,
    remarksBn: string
  ) => {
    setApplications((prev) => {
      const next = prev.map((app) => {
        if (app.trackingId === trackingId) {
          const updated = {
            ...app,
            status,
            currentStageNumber: stage,
            remarksEn,
            remarksBn,
          };
          saveOrderToFirestore(updated);
          return updated;
        }
        return app;
      });
      try {
        localStorage.setItem('ezyseva_applications', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return next;
    });
  };

  const handleCustomerLogin = (user: CustomerUser) => {
    setCustomer(user);
    try {
      localStorage.setItem('ezyseva_customer', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
    setCustomerAuthPromptReason(null);
    if (pendingServiceToApply) {
      const svc = pendingServiceToApply;
      setPendingServiceToApply(null);
      setIsCustomerPortalOpen(false);
      setSelectedService(svc);
    }
  };

  const handleCustomerLogout = () => {
    setCustomer(null);
    try {
      localStorage.removeItem('ezyseva_customer');
    } catch (e) {
      console.warn('LocalStorage remove failed', e);
    }
  };

  const handleCustomerUpdate = (user: CustomerUser) => {
    setCustomer(user);
    try {
      localStorage.setItem('ezyseva_customer', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  // Filtered Services List based on dynamic services state (strictly deduplicated)
  const filteredServices = useMemo(() => {
    const seen = new Set<string>();
    const result: ServiceItem[] = [];

    for (const item of services) {
      if (!item || !item.id || seen.has(item.id)) continue;
      seen.add(item.id);

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!matchesCategory) continue;

      if (!query) {
        result.push(item);
        continue;
      }

      const matchesText =
        item.titleEn.toLowerCase().includes(query) ||
        item.titleBn.toLowerCase().includes(query) ||
        item.shortDescEn.toLowerCase().includes(query) ||
        item.shortDescBn.toLowerCase().includes(query) ||
        item.requiredDocsEn.some((d) => d.toLowerCase().includes(query)) ||
        item.requiredDocsBn.some((d) => d.toLowerCase().includes(query)) ||
        item.officialGovtBodyEn.toLowerCase().includes(query) ||
        item.officialGovtBodyBn.toLowerCase().includes(query);

      if (matchesText) {
        result.push(item);
      }
    }
    return result;
  }, [services, searchQuery, selectedCategory]);

  const handleApply = (service: ServiceItem) => {
    if (!customer) {
      setPendingServiceToApply(service);
      setCustomerPortalAuthMode('register');
      setCustomerAuthPromptReason(
        isBn
          ? `"${service.titleBn}" আবেদন করতে বা পিভিসি কার্ড অর্ডার করতে গ্রাহক আইডি আবশ্যক। অনুগ্রহ করে সাইন ইন করুন বা নতুন আইডি তৈরি করুন।`
          : `A Customer ID is mandatory to order "${service.titleEn}" or smart PVC cards. Please sign in or register to proceed.`
      );
      setIsCustomerPortalOpen(true);
      return;
    }
    setSelectedService(service);
  };

  const handleNewApplicationSubmit = (record: ApplicationRecord) => {
    saveOrderToFirestore(record);
    setApplications((prev) => {
      const next = [record, ...prev];
      try {
        localStorage.setItem('ezyseva_applications', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save failed', e);
      }
      return next;
    });

    // If customer is logged in, optionally update order count or balance
    if (customer && record.feePaid) {
      const updatedCust = {
        ...customer,
        totalOrders: (customer.totalOrders || 0) + 1,
      };
      handleCustomerUpdate(updatedCust);
    }
  };

  const handleGoToTrack = (trackingId: string) => {
    setSelectedService(null);
    setIsCustomerPortalOpen(false);
    setTrackTargetId(trackingId);
    setActiveNav('track');
    const elem = document.getElementById('track-section');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavSelect = (nav: 'services' | 'track' | 'kendras' | 'notices') => {
    setActiveNav(nav);
    if (nav === 'services') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (nav === 'track') {
      document.getElementById('track-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (nav === 'kendras') {
      document.getElementById('kendras-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1a] text-white font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Frosted Glass Ambient Lighting Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[130px]" />
        <div className="absolute top-[25%] right-[5%] w-[35%] h-[35%] bg-emerald-500/15 rounded-full blur-[110px]" />
        <div className="absolute top-[65%] left-[5%] w-[35%] h-[35%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Header Navigation */}
      <Header
        language={language}
        onToggleLanguage={setLanguage}
        onOpenAiSahayak={() => setIsAiSahayakOpen(true)}
        onOpenRateCard={() => setIsRateCardOpen(true)}
        onSelectNav={handleNavSelect}
        activeNav={activeNav}
        userRole={userRole}
        onToggleUserRole={() => setUserRole((prev) => (prev === 'citizen' ? 'vle' : 'citizen'))}
        siteSettings={siteSettings}
        onUpdateLogoStyle={(style) => handleUpdateSiteSettings({ ...siteSettings, logoStyle: style })}
        customer={customer}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* VLE Kiosk Partner Dashboard Banner (when VLE mode is active) */}
      {userRole === 'vle' && (
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 py-3 px-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center font-bold">
                VLE
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{isBn ? 'ভিএলই কিয়স্ক কন্ট্রোল প্যানেল (ক্যাম্পাস মোড)' : 'VLE Kiosk Operator Dashboard'}</span>
                  <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                    CSC-WB-KOL-1029
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  {isBn ? 'সক্রিয় অপারেটর: দেবাঞ্জন চ্যাটার্জি | কেন্দ্র: সল্টলেক সেক্টর ৫' : 'Active Operator: Debanjan Chatterjee | Salt Lake Sec V'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-white/80">
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isBn ? 'ওয়ালেট ব্যালেন্স:' : 'DigiPay Wallet:'}</span>
                <span className="font-mono font-bold text-white">₹4,850.00</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>{isBn ? 'আজকের কমিশন:' : "Today's Commission:"}</span>
                <span className="font-mono font-bold text-white">₹620.00</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-emerald-300">
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">{isBn ? 'বায়োমেট্রিক RD সার্ভিস রেডি' : 'Mantra/Morpho RD Ready'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Live Universal Search & Category Pills */}
      <HeroBanner
        language={language}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenAiSahayak={() => setIsAiSahayakOpen(true)}
        onSelectNav={handleNavSelect}
        siteSettings={siteSettings}
        onOrderPvcCard={() => {
          const pvcService = services.find((s) => s.id === 'pvc-smart-card') || services[0];
          handleApply(pvcService);
        }}
        onUpdateBannerTheme={(theme) => handleUpdateSiteSettings({ ...siteSettings, bannerTheme: theme })}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* Services Section */}
        <section id="services-section">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>{isBn ? 'অনলাইন সেবা পোর্টফোলিও' : 'Citizen Service Portfolio'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isBn ? 'উপলব্ধ ডিজিটাল নাগরিক পরিষেবাসমূহ' : 'Available Digital Citizen Services'}
              </h2>
            </div>

            <div className="text-xs text-white/70 font-semibold bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl shadow-xs">
              {isBn
                ? `মোট ${filteredServices.length} টি পরিষেবা প্রদর্শিত`
                : `Showing ${filteredServices.length} Services`}
            </div>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service, idx) => (
                <ServiceCard
                  key={service.id ? `${service.id}-${idx}` : `srv-${idx}`}
                  service={service}
                  language={language}
                  onApply={handleApply}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center max-w-lg mx-auto shadow-2xl">
              <AlertCircle className="w-10 h-10 text-white/40 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base mb-1">
                {isBn ? 'কোনো পরিষেবা মেলেনি' : 'No Matching Services Found'}
              </h3>
              <p className="text-xs text-white/60 mb-4">
                {isBn
                  ? `"${searchQuery}" এর সাথে কোনো পরিষেবা পাওয়া যায়নি। ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।`
                  : `No services found matching "${searchQuery}". Please clear your search or select "All Services".`}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30"
              >
                {isBn ? 'সমস্ত পরিষেবা দেখুন' : 'Show All Services'}
              </button>
            </div>
          )}
        </section>

        {/* Live Application Status Tracker Section */}
        <TrackApplication
          applications={applications}
          language={language}
          initialTrackingId={trackTargetId}
        />

        {/* Kendra Locator Section */}
        <KendraLocator
          kendras={kendras}
          language={language}
        />

        {/* Informative Citizen Notice Banner */}
        <section className="bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block">
              {isBn ? 'নাগরিক সচেতনতা ও নিরাপত্তা' : 'Citizen Safety & Integrity'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isBn ? (
                <>
                  দালাল চক্র এড়িয়ে চলুন — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">সমস্ত আবেদন সরাসরি ও স্বচ্ছভাবে সম্পন্ন করুন</span>
                </>
              ) : (
                <>
                  Zero Tolerance for Middlemen — <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">Backed by Official Government Receipt</span>
                </>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-bengali">
              {isBn
                ? `${siteSettings.portalNameBn || 'মা তারা সাইবার ক্যাফে'} (MTCC)-তে প্রতিটি পরিষেবার নির্ধারিত সরকারি ফি এবং সেবা চার্জ স্বচ্ছভাবে উল্লেখ করা রয়েছে। পিভিসি কার্ড, ছবি ও ফর্ম ফিলাপের যেকোনো সহায়তার জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন।`
                : `At ${siteSettings.portalName || 'Ma Tara Cyber Cafe'} (MTCC), all statutory government fees and cyber cafe services are transparently listed. For any assistance regarding smart PVC cards, online forms, or photo printing, contact our helpline directly.`}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={`tel:${(siteSettings.tollFreePhone || '+91 98320 00000').replace(/\D/g, '')}`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all font-mono"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{siteSettings.tollFreePhone || '+91 98320 00000'} ({isBn ? 'হেল্পলাইন' : 'Helpline'})</span>
              </a>
              <button
                onClick={() => setIsRateCardOpen(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-bold border border-white/20 backdrop-blur-md transition-all"
              >
                <Receipt className="w-4 h-4 text-blue-300" />
                <span>{isBn ? 'সরকারি ফি তালিকা দেখুন' : 'Verify Official Rate Card'}</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenRateCard={() => setIsRateCardOpen(true)}
        onSelectNav={handleNavSelect}
        siteSettings={siteSettings}
      />

      {/* Floating 24/7 AI Seva Sahayak Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="floating-ai-sahayak-btn"
          onClick={() => setIsAiSahayakOpen(true)}
          className="flex items-center gap-2.5 bg-blue-600/90 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-blue-600/40 backdrop-blur-xl font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 border border-blue-400/40 group"
        >
          <div className="relative flex">
            <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <span className="font-bengali tracking-wide">
            {isBn ? 'এআই সেবা সহায়ক (২৪/৭)' : 'AI Seva Sahayak (24/7)'}
          </span>
        </button>
      </div>

      {/* Interactive Application Modal */}
      <ServiceModal
        service={selectedService}
        language={language}
        onClose={() => setSelectedService(null)}
        onSubmitApplication={handleNewApplicationSubmit}
        onGoToTrack={handleGoToTrack}
        customer={customer}
        siteSettings={siteSettings}
        onOpenCustomerLogin={() => {
          setCustomerPortalAuthMode('login');
          setCustomerAuthPromptReason(
            selectedService
              ? (isBn ? `"${selectedService.titleBn}" এর জন্য লগইন করুন` : `Sign in to order ${selectedService.titleEn}`)
              : null
          );
          setIsCustomerPortalOpen(true);
        }}
        onOpenCustomerRegister={() => {
          setCustomerPortalAuthMode('register');
          setCustomerAuthPromptReason(
            selectedService
              ? (isBn ? `"${selectedService.titleBn}" এর জন্য নতুন গ্রাহক আইডি তৈরি করুন` : `Register Customer ID to order ${selectedService.titleEn}`)
              : null
          );
          setIsCustomerPortalOpen(true);
        }}
      />

      {/* Transparent Citizen Rate Card Modal */}
      <RateCardModal
        isOpen={isRateCardOpen}
        onClose={() => setIsRateCardOpen(false)}
        services={services}
        language={language}
      />

      {/* 24/7 AI Citizen Assistant Drawer */}
      <AiSahayakDrawer
        isOpen={isAiSahayakOpen}
        onClose={() => setIsAiSahayakOpen(false)}
        language={language}
      />

      {/* Admin Panel Modal (Whole Website Customization & Orders) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        language={language}
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        onResetSiteSettings={handleResetSiteSettings}
        services={services}
        onUpdateServices={handleUpdateServices}
        onUpdateService={handleUpdateService}
        onAddService={handleAddService}
        onDeleteService={handleDeleteService}
        applications={applications}
        onUpdateApplications={handleUpdateApplications}
        onUpdateApplicationStatus={handleUpdateApplicationStatus}
        kendras={kendras}
        onUpdateKendras={handleUpdateKendras}
      />

      {/* Customer Portal Modal (Login, Profile, Order History & Instant Apply) */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => {
          setIsCustomerPortalOpen(false);
          setCustomerAuthPromptReason(null);
        }}
        language={language}
        customer={customer}
        onLogin={handleCustomerLogin}
        onLogout={handleCustomerLogout}
        onUpdateCustomer={handleCustomerUpdate}
        applications={applications}
        services={services}
        onSelectService={(service) => {
          setIsCustomerPortalOpen(false);
          setSelectedService(service);
        }}
        onTrackApplication={handleGoToTrack}
        initialAuthMode={customerPortalAuthMode}
        authPromptReason={customerAuthPromptReason}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  FileText,
  CreditCard,
  Award,
  Zap,
  GraduationCap,
  Landmark,
  MapPin,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Palette,
  ArrowRight
} from 'lucide-react';
import { Language, ServiceCategory, SiteSettings, BannerThemeType } from '../types';

interface HeroBannerProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenAiSahayak: () => void;
  onSelectNav: (section: 'services' | 'track' | 'kendras') => void;
  siteSettings: SiteSettings;
  onOrderPvcCard?: () => void;
  onUpdateBannerTheme?: (theme: BannerThemeType) => void;
}

export const BANNER_THEMES: { id: BannerThemeType; nameEn: string; nameBn: string; bgClass: string; borderClass: string }[] = [
  {
    id: 'aurora_gradient',
    nameEn: 'Aurora Blue & Teal',
    nameBn: 'অরোরা ব্লু ও টিল',
    bgClass: 'from-blue-900/30 via-teal-900/20 to-transparent',
    borderClass: 'border-blue-500/30',
  },
  {
    id: 'digital_india_tricolor',
    nameEn: 'Digital India Tricolor',
    nameBn: 'ডিজিটাল ইন্ডিয়া তেরঙ্গা',
    bgClass: 'from-orange-900/25 via-blue-950/30 to-emerald-950/25',
    borderClass: 'border-amber-500/30',
  },
  {
    id: 'deep_cyber',
    nameEn: 'Cyber Indigo & Violet',
    nameBn: 'সাইবার ইন্ডিগো ও ভায়োলেট',
    bgClass: 'from-indigo-900/35 via-purple-950/30 to-cyan-950/25',
    borderClass: 'border-indigo-500/30',
  },
  {
    id: 'royal_midnight',
    nameEn: 'Royal Midnight Gold',
    nameBn: 'রয়্যাল মিডনাইট গোল্ড',
    bgClass: 'from-slate-900/40 via-amber-950/20 to-transparent',
    borderClass: 'border-amber-400/30',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAiSahayak,
  onSelectNav,
  siteSettings,
  onOrderPvcCard,
  onUpdateBannerTheme,
}) => {
  const isBn = language === 'bn';

  // Multi-Slide Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const bannerTheme = siteSettings.bannerTheme || 'aurora_gradient';
  const activeThemeConfig = BANNER_THEMES.find(t => t.id === bannerTheme) || BANNER_THEMES[0];

  const slides = [
    {
      id: 'pvc_card',
      tagEn: 'Special Service Delivery',
      tagBn: 'বিশেষ নাগরিক সেবা',
      headlinePreEn: 'Official Weather-proof ',
      headlineHighlightEn: 'Smart PVC Plastic Cards',
      headlinePostEn: ' at Your Doorstep',
      headlinePreBn: 'আধার, ভোটার ও প্যান ',
      headlineHighlightBn: 'স্মার্ট পিভিসি কার্ড',
      headlinePostBn: ' সরাসরি আপনার ঠিকানায়',
      subtitleEn: 'High-security micro-text, tamper-proof hologram & official India Post Speed Post parcel tracking straight to your home address.',
      subtitleBn: 'ওয়াটারপ্রুফ টেকসই প্লাস্টিক কার্ড, সিকিউরিটি হলোগ্রাম এবং ভারতীয় ডাক বিভাগের স্পিড পোস্ট ট্র্যাকিং নম্বর সহ দ্রুত হোম ডেলিভারি।',
      actionTextEn: 'Order PVC Smart Card (₹50)',
      actionTextBn: 'স্মার্ট পিভিসি কার্ড অর্ডার করুন (₹৫০)',
      actionType: 'pvc',
      badgeIcon: <Package className="w-4 h-4 text-amber-300" />,
      accentColor: 'from-amber-500 to-orange-400',
    },
    {
      id: 'digital_india',
      tagEn: 'E-Governance & DigiSeva',
      tagBn: 'ই-গভর্ন্যান্স ও ডিজিটাল সেবা',
      headlinePreEn: siteSettings.heroHeadlinePreEn,
      headlineHighlightEn: siteSettings.heroHeadlineHighlightEn,
      headlinePostEn: siteSettings.heroHeadlinePostEn,
      headlinePreBn: siteSettings.heroHeadlinePreBn,
      headlineHighlightBn: siteSettings.heroHeadlineHighlightBn,
      headlinePostBn: siteSettings.heroHeadlinePostBn,
      subtitleEn: siteSettings.heroSubtitleEn,
      subtitleBn: siteSettings.heroSubtitleBn,
      actionTextEn: 'Explore 200+ Services',
      actionTextBn: 'সমস্ত সরকারি সেবা দেখুন',
      actionType: 'services',
      badgeIcon: <ShieldCheck className="w-4 h-4 text-emerald-300" />,
      accentColor: 'from-blue-400 to-emerald-300',
    },
    {
      id: 'utility_bills',
      tagEn: 'Instant Bill Settlement',
      tagBn: 'তাৎক্ষণিক বিদ্যুৎ ও ইউটিলিটি বিল',
      headlinePreEn: 'Instant WBSEDCL Bill Payment & ',
      headlineHighlightEn: 'Aadhaar Ration e-KYC',
      headlinePostEn: ' with Zero Queues',
      headlinePreBn: 'বিদ্যুৎ বিল জমা ও ',
      headlineHighlightBn: 'রেশন কার্ড e-KYC',
      headlinePostBn: ' করুন কোনো লাইন ছাড়াই',
      subtitleEn: 'Pay electricity bills with instant rebate, link Aadhaar with Ration cards, and get digital receipts with official verification QR code.',
      subtitleBn: 'দেরি না করে বিদ্যুৎ বিল পরিশোধ করে পান বিশেষ ছাড় এবং সরকারি কিউআর কোড যুক্ত অফিসিয়াল ডিজিটাল রসিদ তৎক্ষণাৎ ডাউনলোড করুন।',
      actionTextEn: 'Pay Utility Bills',
      actionTextBn: 'বিল পেমেন্ট পরিষেবা',
      actionType: 'bills',
      badgeIcon: <Zap className="w-4 h-4 text-cyan-300" />,
      accentColor: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'ai_sahayak',
      tagEn: '24/7 AI Assistance',
      tagBn: '২৪/৭ কৃত্রিম বুদ্ধিমত্তা সহায়ক',
      headlinePreEn: 'Confused About Documents? Ask ',
      headlineHighlightEn: 'Ma Tara AI Sahayak',
      headlinePostEn: ' Anytime',
      headlinePreBn: 'সরকারি ফর্ম বা নথি নিয়ে দ্বিধা? ',
      headlineHighlightBn: 'এআই সহায়ক-কে জিজ্ঞাসা করুন',
      headlinePostBn: ' যেকোনো সময়',
      subtitleEn: 'Intelligent bilingual voice and text guidance for welfare schemes, required certificates, nearest Kendra timings, and step-by-step application advice.',
      subtitleBn: 'বাংলা ও ইংরেজিতে সরকারি প্রকল্পের যোগ্যতা, প্রয়োজনীয় কাগজপত্রের তালিকা ও নিকটবর্তী কেন্দ্রের সন্ধান জেনে নিন এক নিমেষেই।',
      actionTextEn: 'Start AI Consultation',
      actionTextBn: 'এআই সহায়ক চালু করুন',
      actionType: 'ai',
      badgeIcon: <Sparkles className="w-4 h-4 text-purple-300" />,
      accentColor: 'from-purple-400 to-pink-400',
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, slides.length]);

  const activeSlide = slides[currentSlide];

  const handleActionClick = (type: string) => {
    if (type === 'pvc') {
      onOrderPvcCard?.();
    } else if (type === 'bills') {
      onSelectCategory('bills');
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'ai') {
      onOpenAiSahayak();
    } else {
      onSelectNav('services');
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories: { id: ServiceCategory; labelEn: string; labelBn: string; icon: React.ReactNode }[] = [
    { id: 'all', labelEn: 'All Services', labelBn: 'সমস্ত পরিষেবা', icon: <FileText className="w-4 h-4" /> },
    { id: 'identity', labelEn: 'Identity & Cards', labelBn: 'পরিচয়পত্র ও কার্ড', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'certificates', labelEn: 'Certificates', labelBn: 'শংসাপত্র ও সার্টিফিকেট', icon: <Award className="w-4 h-4" /> },
    { id: 'bills', labelEn: 'Utility Bills', labelBn: 'বিল পেমেন্ট', icon: <Zap className="w-4 h-4" /> },
    { id: 'schemes', labelEn: 'Welfare Schemes', labelBn: 'সরকারি ভাতা ও অনুদান', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'land', labelEn: 'Land & Revenue', labelBn: 'জমি ও রাজস্ব', icon: <MapPin className="w-4 h-4" /> },
    { id: 'banking', labelEn: 'Banking & Cash', labelBn: 'ব্যাংকিং ও ক্যাশ', icon: <Landmark className="w-4 h-4" /> },
  ];

  return (
    <div className={`relative text-white pt-6 pb-12 px-4 sm:px-6 bg-gradient-to-b ${activeThemeConfig.bgClass} transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top Ticker & Banner Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Notice Alert Ticker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium backdrop-blur-md shadow-xs">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-[10px] text-blue-400 shrink-0">
              {isBn ? 'জরুরি বিজ্ঞপ্তি' : 'Official Notice'}:
            </span>
            <span className="text-white/80 truncate max-w-xs sm:max-w-md">
              {isBn ? siteSettings.noticeAlertBn : siteSettings.noticeAlertEn}
            </span>
          </div>

          {/* Banner Theme & Slide Options Pills */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Banner Theme Selector */}
            <div className="relative">
              <button
                id="banner-theme-toggle-btn"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-[11px] text-white/80 transition-all backdrop-blur-md"
                title={isBn ? 'ব্যানার থিম পরিবর্তন' : 'Change Banner Theme'}
              >
                <Palette className="w-3 h-3 text-amber-300" />
                <span className="hidden md:inline">{isBn ? 'ব্যানার থিম:' : 'Theme:'}</span>
                <span className="font-semibold text-white/90">
                  {isBn ? activeThemeConfig.nameBn : activeThemeConfig.nameEn}
                </span>
              </button>

              {/* Theme Menu Dropdown */}
              {isThemeMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-56 bg-[#0c1024]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 border-b border-white/10 text-[11px] font-bold text-white flex justify-between items-center">
                    <span>{isBn ? 'ব্যানার থিম অপশন' : 'Banner Theme Options'}</span>
                    <button onClick={() => setIsThemeMenuOpen(false)} className="text-white/40 hover:text-white text-[10px]">✕</button>
                  </div>
                  <div className="space-y-1 mt-1">
                    {BANNER_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onUpdateBannerTheme?.(theme.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                          bannerTheme === theme.id
                            ? 'bg-blue-600/30 border border-blue-400/50 text-white font-bold'
                            : 'hover:bg-white/10 text-white/70'
                        }`}
                      >
                        <span>{isBn ? theme.nameBn : theme.nameEn}</span>
                        {bannerTheme === theme.id && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5 backdrop-blur-md">
              <button
                id="banner-prev-slide-btn"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={isBn ? 'পূর্ববর্তী ব্যানার' : 'Previous Banner'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                id="banner-play-pause-btn"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={isAutoPlay ? (isBn ? 'পজ করুন' : 'Pause Auto-Play') : (isBn ? 'প্লে করুন' : 'Resume Auto-Play')}
              >
                {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              <button
                id="banner-next-slide-btn"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                title={isBn ? 'পরবর্তী ব্যানার' : 'Next Banner'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Carousel Slide Card */}
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl transition-all">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Slide Tag Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {activeSlide.badgeIcon}
              <span>{isBn ? activeSlide.tagBn : activeSlide.tagEn}</span>
            </span>

            {/* Slide Index indicator */}
            <span className="text-[11px] text-white/40 font-mono font-bold">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mb-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.18]">
              {isBn ? (
                <>
                  {activeSlide.headlinePreBn}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.accentColor}`}>
                    {activeSlide.headlineHighlightBn}
                  </span>
                  {activeSlide.headlinePostBn}
                </>
              ) : (
                <>
                  {activeSlide.headlinePreEn}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeSlide.accentColor}`}>
                    {activeSlide.headlineHighlightEn}
                  </span>
                  {activeSlide.headlinePostEn}
                </>
              )}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-white/70 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mb-6">
            {isBn ? activeSlide.subtitleBn : activeSlide.subtitleEn}
          </p>

          {/* Slide Action Button & Slide Dot Switchers */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-white/10">
            <button
              id={`banner-action-btn-${activeSlide.id}`}
              onClick={() => handleActionClick(activeSlide.actionType)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 border border-blue-400/30 flex items-center gap-2 transition-all group cursor-pointer"
            >
              <span>{isBn ? activeSlide.actionTextBn : activeSlide.actionTextEn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Slide Switcher Tabs */}
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    currentSlide === idx
                      ? 'bg-white/20 text-white border border-white/30 shadow-xs'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {idx === 0 && (isBn ? 'পিভিসি কার্ড' : 'PVC Card')}
                  {idx === 1 && (isBn ? 'নাগরিক সেবা' : 'All Services')}
                  {idx === 2 && (isBn ? 'বিল ও KYC' : 'Bills & KYC')}
                  {idx === 3 && (isBn ? 'এআই সহায়ক' : 'Ask AI')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-2 border border-white/20 focus-within:border-blue-400 focus-within:bg-white/10 transition-all">
            <Search className="w-5 h-5 text-white/50 ml-3 shrink-0" />
            <input
              id="hero-service-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isBn
                  ? 'কী পরিষেবা চান খুঁজুন? (যেমন: পিভিসি কার্ড, প্যান, বিদ্যুৎ বিল, জন্ম সনদ, ভোটার...)'
                  : 'Search any service (e.g. PVC Card, PAN card, Electricity bill, Birth certificate, Voter ID...)'
              }
              className="w-full px-3 py-2.5 text-white placeholder-white/40 text-sm sm:text-base focus:outline-hidden bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1.5 text-white/50 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              id="hero-ai-assist-shortcut"
              onClick={onOpenAiSahayak}
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isBn ? 'এআই সহায়ক' : 'Ask AI'}</span>
            </button>
          </div>

          {/* Popular Tag suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="font-medium text-white/40">{isBn ? 'জনপ্রিয়:' : 'Popular:'}</span>
            {['PVC Smart Card', 'PAN Card', 'WBSEDCL Bill', 'Birth Certificate', 'Voter Form 8', 'Ration e-KYC'].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className="bg-white/5 hover:bg-white/15 text-white/70 hover:text-white px-3 py-1 rounded-full transition-all border border-white/10 backdrop-blur-md cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-xs">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-white">{isBn ? '১০০% স্বচ্ছ সরকারি ফি' : 'Transparent Fees'}</div>
              <div className="text-white/50 text-[11px]">{isBn ? 'কোনো লুকানো খরচ নেই' : 'Govt regulated charges'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white">{isBn ? 'নির্দিষ্ট সময়সীমা (SLA)' : 'Guaranteed SLA'}</div>
              <div className="text-white/50 text-[11px]">{isBn ? 'স্পিড পোস্ট লাইভ ট্র্যাকিং' : 'India Post consignment tracking'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-white">{isBn ? 'ডিজিটাল প্রাপ্তিস্বীকার' : 'Instant Acknowledgment'}</div>
              <div className="text-white/50 text-[11px]">{isBn ? 'কিউআর কোড যুক্ত রসিদ' : 'Official slip with QR code'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 hover:bg-white/[0.08] transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-white">{isBn ? '২৪/৭ এআই নাগরিক গাইড' : '24/7 AI Seva Guide'}</div>
              <div className="text-white/50 text-[11px]">{isBn ? 'বাংলা ও ইংরেজিতে উত্তর' : 'Bengali & English answers'}</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-md cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border border-blue-400/50 shadow-lg shadow-blue-600/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.icon}
                <span>{isBn ? cat.labelBn : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

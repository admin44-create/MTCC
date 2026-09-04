import React from 'react';
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
  X
} from 'lucide-react';
import { Language, ServiceCategory, SiteSettings } from '../types';

interface HeroBannerProps {
  language: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenAiSahayak: () => void;
  onSelectNav: (section: 'services' | 'track' | 'kendras') => void;
  siteSettings: SiteSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAiSahayak,
  onSelectNav,
  siteSettings,
}) => {
  const isBn = language === 'bn';

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
    <div className="relative text-white pt-8 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Notice Alert Ticker */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium backdrop-blur-md shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-[10px] text-blue-400">
              {isBn ? 'জরুরি আপডেট' : 'Live Update'}:
            </span>
            <span className="text-white/80">
              {isBn ? siteSettings.noticeAlertBn : siteSettings.noticeAlertEn}
            </span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 leading-[1.15]">
            {isBn ? (
              <>
                {siteSettings.heroHeadlinePreBn}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
                  {siteSettings.heroHeadlineHighlightBn}
                </span>
                {siteSettings.heroHeadlinePostBn}
              </>
            ) : (
              <>
                {siteSettings.heroHeadlinePreEn}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
                  {siteSettings.heroHeadlineHighlightEn}
                </span>
                {siteSettings.heroHeadlinePostEn}
              </>
            )}
          </h1>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            {isBn ? siteSettings.heroSubtitleBn : siteSettings.heroSubtitleEn}
          </p>
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
                  ? 'কী পরিষেবা চান খুঁজুন? (যেমন: প্যান কার্ড, বিদ্যুৎ বিল, জন্ম সনদ, ভোটার...)'
                  : 'Search any service (e.g. PAN card, Electricity bill, Birth certificate, Voter ID...)'
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
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isBn ? 'এআই সহায়ক' : 'Ask AI'}</span>
            </button>
          </div>

          {/* Popular Tag suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="font-medium text-white/40">{isBn ? 'জনপ্রিয়:' : 'Popular:'}</span>
            {['PAN Card', 'WBSEDCL Bill', 'Birth Certificate', 'Voter Form 8', 'Ration e-KYC'].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearchChange(tag)}
                className="bg-white/5 hover:bg-white/15 text-white/70 hover:text-white px-3 py-1 rounded-full transition-all border border-white/10 backdrop-blur-md"
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
              <div className="text-white/50 text-[11px]">{isBn ? 'দ্রুত ডেলিভারি ও আপডেট' : 'Live tracking at each step'}</div>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all backdrop-blur-md ${
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

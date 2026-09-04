import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Languages, 
  ShieldCheck, 
  FileCheck2, 
  Receipt,
  UserCheck,
  User,
  ShoppingBag,
  Settings,
  ChevronDown,
  Palette
} from 'lucide-react';
import { Language, SiteSettings, CustomerUser, LogoStyleType } from '../types';
import { BrandLogo, LOGO_OPTIONS } from './BrandLogo';

interface HeaderProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenAiSahayak: () => void;
  onOpenRateCard: () => void;
  onSelectNav: (section: 'services' | 'track' | 'kendras' | 'notices') => void;
  activeNav: string;
  userRole: 'citizen' | 'vle';
  onToggleUserRole: () => void;
  siteSettings: SiteSettings;
  customer: CustomerUser | null;
  onOpenCustomerPortal: () => void;
  onOpenAdminPanel: () => void;
  onUpdateLogoStyle?: (style: LogoStyleType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenAiSahayak,
  onOpenRateCard,
  onSelectNav,
  activeNav,
  userRole,
  onToggleUserRole,
  siteSettings,
  customer,
  onOpenCustomerPortal,
  onOpenAdminPanel,
  onUpdateLogoStyle,
}) => {
  const isBn = language === 'bn';
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a1a]/85 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
      {/* Top Gov/Citizen Info Bar */}
      <div className="bg-white/[0.03] backdrop-blur-md border-b border-white/5 text-xs px-4 py-1.5 font-medium text-white/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? 'স্বীকৃত ডিজিটাল নাগরিক সেবা পোর্টাল' : 'Certified Citizen Digital Services Portal'}</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:flex items-center gap-1 text-white/60">
              <Clock className="w-3 h-3 text-white/40" />
              <span>{isBn ? siteSettings.helpdeskTimingsBn : siteSettings.helpdeskTimingsEn}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Quick Logo Style Switcher Pill */}
            <div className="relative">
              <button
                id="header-logo-options-btn"
                onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
                className="flex items-center gap-1 bg-white/5 hover:bg-white/15 border border-white/15 px-2.5 py-0.5 rounded-full text-[11px] text-white/90 transition-all backdrop-blur-md"
                title={isBn ? 'লোগো স্টাইল পরিবর্তন করুন' : 'Change Logo Style'}
              >
                <Palette className="w-3 h-3 text-blue-400" />
                <span className="hidden sm:inline">{isBn ? 'লোগো অপশন:' : 'Logo:'}</span>
                <span className="font-bold capitalize text-blue-300">
                  {siteSettings.logoStyle ? siteSettings.logoStyle.replace('_', ' ') : 'Shield'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {/* Logo Menu Dropdown */}
              {isLogoMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 bg-[#0d1226]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1.5 border-b border-white/10 text-[11px] font-bold text-white flex justify-between items-center">
                    <span>{isBn ? 'পছন্দের লোগো নির্বাচন করুন' : 'Select Official Logo Style'}</span>
                    <button 
                      onClick={() => setIsLogoMenuOpen(false)}
                      className="text-white/50 hover:text-white text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1 mt-1 max-h-60 overflow-y-auto">
                    {LOGO_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onUpdateLogoStyle?.(opt.id);
                          setIsLogoMenuOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                          (siteSettings.logoStyle || 'emblem_shield') === opt.id
                            ? 'bg-blue-600/30 border border-blue-400/50 text-white font-bold'
                            : 'hover:bg-white/10 text-white/80 border border-transparent'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {(siteSettings.logoStyle || 'emblem_shield') === opt.id ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-white/30 block" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-white">
                            {isBn ? opt.nameBn : opt.nameEn}
                          </div>
                          <div className="text-[9px] text-white/50 leading-tight">
                            {isBn ? opt.descBn : opt.descEn}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a 
              href={`tel:${siteSettings.tollFreePhone.replace(/\D/g, '')}`} 
              className="flex items-center gap-1 text-white/80 hover:text-blue-400 transition-colors mr-1"
            >
              <PhoneCall className="w-3 h-3 text-blue-400" />
              <span className="font-semibold tracking-wide font-mono">{siteSettings.tollFreePhone}</span>
              <span className="hidden md:inline text-white/40 text-[10px]">({isBn ? 'টোল-ফ্রি' : 'Toll-Free'})</span>
            </a>

            {/* Admin Panel Entry Button */}
            <button
              id="admin-panel-toggle-btn"
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 px-2.5 py-1 rounded-full text-[11px] text-purple-200 transition-all backdrop-blur-md shadow-xs"
              title={isBn ? 'ওয়েবসাইট ও পরিষেবা কাস্টমাইজেশন' : 'Website & Services Customization'}
            >
              <Settings className="w-3 h-3 text-purple-300" />
              <span className="font-bold">{isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
            </button>

            {/* VLE / Citizen Switcher */}
            <button
              id="vle-role-toggle-btn"
              onClick={onToggleUserRole}
              className="hidden md:flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] text-white/90 transition-all backdrop-blur-md"
            >
              <UserCheck className="w-3 h-3 text-blue-300" />
              <span>{userRole === 'citizen' ? (isBn ? 'নাগরিক' : 'Citizen') : (isBn ? 'ভিএলই কিয়স্ক' : 'VLE Kiosk')}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10 backdrop-blur-md">
              <button
                id="lang-btn-en"
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-white/50 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-bn"
                onClick={() => onToggleLanguage('bn')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all font-bengali ${
                  language === 'bn' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-white/50 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo with dynamic styles */}
        <div 
          onClick={() => onSelectNav('services')} 
          className="cursor-pointer"
        >
          <BrandLogo
            style={siteSettings.logoStyle || 'emblem_shield'}
            customLogoUrl={siteSettings.customLogoUrl}
            portalName={siteSettings.portalName}
            portalSubname={siteSettings.portalSubname}
            tagline={isBn ? siteSettings.taglineBn : siteSettings.taglineEn}
            language={language}
          />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
          <button
            id="nav-services-btn"
            onClick={() => onSelectNav('services')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
              activeNav === 'services'
                ? 'bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {isBn ? 'সমস্ত পরিষেবা' : 'All Services'}
          </button>
          <button
            id="nav-track-btn"
            onClick={() => onSelectNav('track')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeNav === 'track'
                ? 'bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-blue-400" />
            <span>{isBn ? 'আবেদন ট্র্যাক' : 'Track Status'}</span>
          </button>
          <button
            id="nav-kendras-btn"
            onClick={() => onSelectNav('kendras')}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeNav === 'kendras'
                ? 'bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isBn ? 'নিকটবর্তী কেন্দ্র' : 'Find Kendra'}</span>
          </button>
          <button
            id="nav-rate-btn"
            onClick={onOpenRateCard}
            className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4 text-amber-300" />
            <span>{isBn ? 'ফি তালিকা' : 'Rate Card'}</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Customer Portal / Account Button */}
          <button
            id="customer-portal-header-btn"
            onClick={onOpenCustomerPortal}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              customer
                ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-400/30 text-emerald-200'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
          >
            {customer ? (
              <>
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">
                  {customer.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block leading-tight">
                  <div className="text-xs text-white font-semibold truncate max-w-[110px]">
                    {customer.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    {isBn ? 'আমার অর্ডার' : 'My Orders'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-blue-300" />
                <span>{isBn ? 'কাস্টমার প্যানেল' : 'Customer Login'}</span>
              </>
            )}
          </button>

          {/* AI Seva Sahayak button */}
          <button
            id="ai-sahayak-top-btn"
            onClick={onOpenAiSahayak}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 border border-blue-400/30 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="font-bengali hidden sm:inline">
              {isBn ? 'এআই সহায়ক' : 'AI Assistant'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

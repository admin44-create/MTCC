import React, { useState, useEffect } from 'react';
import { LogoStyleType } from '../types';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';

interface BrandLogoProps {
  style?: LogoStyleType;
  customLogoUrl?: string;
  portalName: string;
  portalSubname: string;
  tagline: string;
  showSelector?: boolean;
  onSelectStyle?: (style: LogoStyleType) => void;
  language?: 'en' | 'bn';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  style = 'emblem_shield',
  customLogoUrl,
  portalName,
  portalSubname,
  tagline,
  showSelector = false,
  onSelectStyle,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [customLogoUrl]);

  // Render SVG Emblem based on selected style or custom URL
  const renderEmblem = () => {
    if (customLogoUrl && customLogoUrl.trim() !== '' && !imgError) {
      return (
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/50 via-indigo-500/40 to-emerald-500/40 p-[2px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
          <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center relative overflow-hidden p-1 shadow-inner">
            <img
              src={customLogoUrl}
              alt={portalName || 'Brand Logo'}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          </div>
        </div>
      );
    }

    switch (style) {
      case 'digital_india':
        return (
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#070b19] flex items-center justify-center relative overflow-hidden">
              {/* Ashoka Chakra 24-spoke vector */}
              <svg className="w-7 h-7 text-[#000080] dark:text-blue-400 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="10" fill="currentColor" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    transform={`rotate(${i * 15} 50 50)`}
                  />
                ))}
              </svg>
              <div className="absolute inset-0 bg-radial from-transparent via-blue-500/10 to-transparent pointer-events-none" />
            </div>
          </div>
        );

      case 'ashoka_chakra':
        return (
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-200 to-amber-600 p-[2px] shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#0b1026] flex items-center justify-center text-amber-300">
              <svg className="w-7 h-7" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="8" fill="currentColor" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2="50"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    transform={`rotate(${i * 15} 50 50)`}
                  />
                ))}
              </svg>
            </div>
          </div>
        );

      case 'csc_kendra':
        return (
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 p-[2px] shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#091124] flex flex-col items-center justify-center p-1">
              <span className="text-[10px] font-black tracking-tighter text-teal-300 font-mono leading-none">CSC</span>
              <div className="w-4 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 my-0.5" />
              <span className="text-[7px] font-black uppercase text-white/90 tracking-widest leading-none">SEVA</span>
            </div>
          </div>
        );

      case 'cyber_smart':
        return (
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-fuchsia-500 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#0a081e] flex items-center justify-center text-cyan-300 relative overflow-hidden">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent pointer-events-none" />
            </div>
          </div>
        );

      case 'emblem_shield':
      default:
        return (
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#090d21] flex items-center justify-center text-white relative overflow-hidden">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div className="absolute -bottom-1 text-[8px] font-black tracking-widest text-blue-300 uppercase">
                GOV
              </div>
            </div>
          </div>
        );
    }
  };

  const getStyleBadge = () => {
    switch (style) {
      case 'digital_india':
        return { label: 'Digital India', color: 'bg-orange-500/15 text-orange-300 border-orange-400/30' };
      case 'ashoka_chakra':
        return { label: 'Govt. Seal', color: 'bg-amber-500/15 text-amber-300 border-amber-400/30' };
      case 'csc_kendra':
        return { label: 'CSC Certified', color: 'bg-teal-500/15 text-teal-300 border-teal-400/30' };
      case 'cyber_smart':
        return { label: 'Cyber AI', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30' };
      case 'emblem_shield':
      default:
        return { label: 'Certified Seva', color: 'bg-blue-500/15 text-blue-300 border-blue-400/30' };
    }
  };

  const badge = getStyleBadge();

  return (
    <div className="flex items-center gap-3 group">
      {renderEmblem()}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg sm:text-xl font-black tracking-tight text-white">
            {portalName}
            <span className="text-blue-400">{portalSubname}</span>
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-full ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <p className="text-[11px] text-white/50 font-medium font-bengali leading-none mt-0.5 truncate max-w-[220px] sm:max-w-none">
          {tagline}
        </p>
      </div>
    </div>
  );
};

export const LOGO_OPTIONS: { id: LogoStyleType; nameEn: string; nameBn: string; descEn: string; descBn: string }[] = [
  {
    id: 'emblem_shield',
    nameEn: 'Government Shield & Seal',
    nameBn: 'সরকারি শিল্ড ও সিল',
    descEn: 'Classic official shield with government verified certification mark',
    descBn: 'ক্লাসিক সরকারি সুরক্ষা শিল্ড ও সার্টিফাইড সিল',
  },
  {
    id: 'digital_india',
    nameEn: 'Digital India Tricolor',
    nameBn: 'ডিজিটাল ইন্ডিয়া তেরঙ্গা',
    descEn: 'National saffron-white-green tricolor with 24-spoke Navy chakra',
    descBn: 'জাতীয় তেরঙ্গা ও অশোক চক্র যুক্ত ডিজিটাল ইন্ডিয়া লোগো',
  },
  {
    id: 'ashoka_chakra',
    nameEn: 'Ashoka Chakra Royal Crest',
    nameBn: 'অশোক চক্র রাজকীয় ক্রেস্ট',
    descEn: 'Prestigious navy & gold Dharmachakra emblem with laurel wreath',
    descBn: 'নীল ও সোনালী জাতীয় অশোক চক্র ও লরেল মালা',
  },
  {
    id: 'csc_kendra',
    nameEn: 'CSC Seva Kendra Kiosk',
    nameBn: 'সিএসসি সেবা কেন্দ্র কিয়স্ক',
    descEn: 'Official Common Service Centre VLE kiosk network badge',
    descBn: 'অফিসিয়াল কমন সার্ভিস সেন্টার ভিএলই নেটওয়ার্ক ব্যাজ',
  },
  {
    id: 'cyber_smart',
    nameEn: 'Cyber Smart AI Portal',
    nameBn: 'আধুনিক সাইবার স্মার্ট এআই',
    descEn: 'Modern futuristic cyber holographic emblem with glowing AI node',
    descBn: 'আধুনিক সাইবার গ্রাফিক্স ও স্মার্ট এআই প্রতীক',
  },
];

import React from 'react';
import { ShieldCheck, PhoneCall, Mail, MapPin, Heart, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenRateCard: () => void;
  onSelectNav: (nav: 'services' | 'track' | 'kendras') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenRateCard, onSelectNav }) => {
  const isBn = language === 'bn';

  return (
    <footer className="relative z-10 bg-white/[0.03] backdrop-blur-xl text-white/70 pt-12 pb-8 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/20">
                E
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                EzySeva<span className="text-blue-400">.AI</span>
              </span>
            </div>
            <p className="text-white/50 leading-relaxed">
              {isBn
                ? 'পশ্চিমবঙ্গ এবং ভারত সরকারের বিভিন্ন নাগরিক, ডিজিটাল ও কল্যাণমূলক পরিষেবা সহজ, দ্রুত এবং স্বচ্ছভাবে নাগরিকদের কাছে পৌঁছে দেওয়ার অনলাইন প্ল্যাটফর্ম।'
                : 'Empowering citizens with single-window access to government certifications, utility payments, and digital CSC services with transparent pricing.'}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? 'স্বীকৃত ডিজিটাল সিটিজেন প্ল্যাটফর্ম' : 'Certified Citizen Delivery'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'গুরুত্বপূর্ণ লিঙ্ক' : 'Important Portals'}
            </h4>
            <ul className="space-y-1.5 text-white/50">
              <li>
                <button onClick={() => onSelectNav('services')} className="hover:text-blue-400 transition-colors">
                  {isBn ? 'সমস্ত নাগরিক পরিষেবা' : 'All Citizen Services'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('track')} className="hover:text-blue-400 transition-colors">
                  {isBn ? 'আবেদন স্থিতি ট্র্যাকিং' : 'Application Tracking'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('kendras')} className="hover:text-blue-400 transition-colors">
                  {isBn ? 'নিকটবর্তী সেবা কেন্দ্র' : 'Kendra Locator'}
                </button>
              </li>
              <li>
                <button onClick={onOpenRateCard} className="hover:text-blue-400 transition-colors">
                  {isBn ? 'নাগরিক সনদ ও সরকারি ফি' : 'Citizen Charter & Rate Card'}
                </button>
              </li>
            </ul>
          </div>

          {/* Government Portals Integration */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'সরকারি পোর্টাল সংযোগ' : 'Govt Linkages'}
            </h4>
            <ul className="space-y-1.5 text-white/50">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-white/40" />
                <span>e-District West Bengal</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-white/40" />
                <span>BanglarBhumi Land Reforms</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-white/40" />
                <span>Khadya Sathi Food & Supplies</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-white/40" />
                <span>ECI National Voter Services (NVSP)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3 text-white/40" />
                <span>NSDL / UTIITSL PAN Portal</span>
              </li>
            </ul>
          </div>

          {/* Citizen Support & Helpline */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {isBn ? 'হেল্পলাইন ও সহায়তা' : 'Citizen Helpline'}
            </h4>
            <div className="space-y-2 text-white/70">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-sm">1800-399-7382</div>
                  <div className="text-[10px] text-white/40">{isBn ? 'টোল-ফ্রি (সকাল ৮:০০ - রাত ৮:০০)' : 'Toll-Free (8 AM - 8 PM)'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-white/70">support@ezyseva.gov.in</span>
              </div>
              <div className="flex items-start gap-2 text-white/50">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{isBn ? 'ডিজিটাল সেবা হাব, বিধাননগর, কলকাতা - ৭০০০৯১' : 'Digital Seva Central Hub, Bidhannagar, Kolkata 700091'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-white/40 text-[11px]">
          <div>
            © {new Date().getFullYear()} EzySeva Digital Citizen Portal. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">{isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">{isBn ? 'শর্তাবলী' : 'Terms of Service'}</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">{isBn ? 'নাগরিক সুরক্ষা' : 'Citizen Safety'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

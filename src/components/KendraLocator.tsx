import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2,
  Building,
  User
} from 'lucide-react';
import { KendraItem, Language } from '../types';

interface KendraLocatorProps {
  kendras: KendraItem[];
  language: Language;
}

export const KendraLocator: React.FC<KendraLocatorProps> = ({ kendras, language }) => {
  const isBn = language === 'bn';
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchPin, setSearchPin] = useState('');

  const districts = ['All', 'Kolkata', 'North 24 Parganas', 'Howrah', 'Purba Bardhaman', 'Darjeeling / Siliguri', 'Murshidabad'];

  const filteredKendras = kendras.filter((k) => {
    const matchesDistrict = selectedDistrict === 'All' || k.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchesPin = !searchPin || k.pincode.includes(searchPin) || k.addressEn.toLowerCase().includes(searchPin.toLowerCase()) || k.nameEn.toLowerCase().includes(searchPin.toLowerCase());
    return matchesDistrict && matchesPin;
  });

  return (
    <section id="kendras-section" className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3 backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5" />
          <span>{isBn ? 'স্বীকৃত সেবা কেন্দ্র' : 'Authorized Seva Kendras'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isBn ? 'আপনার নিকটবর্তী ইজি সেবা কেন্দ্র খুঁজুন' : 'Find Your Nearest EzySeva Kendra'}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-2">
          {isBn
            ? 'পশ্চিমবঙ্গের প্রতিটি ব্লকে ও পুর এলাকায় সরকারি স্বীকৃতিপ্রাপ্ত ডিজিটাল সেবা কেন্দ্র থেকে বায়োমেট্রিক ও অফলাইন সহায়তা পান।'
            : 'Locate certified CSC & EzySeva facilitation centers for biometric capture, instant e-KYC, and cash assisted services.'}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-1/3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-white bg-white/5 focus:outline-hidden focus:border-blue-400 focus:bg-white/10 backdrop-blur-md"
          >
            {districts.map((d) => (
              <option key={d} value={d} className="bg-[#0e0e24] text-white">
                {d === 'All' ? (isBn ? 'সমস্ত জেলা (All Districts)' : 'All Districts') : d}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-2/3 relative flex items-center">
          <Search className="w-4 h-4 text-white/40 absolute left-3" />
          <input
            type="text"
            value={searchPin}
            onChange={(e) => setSearchPin(e.target.value)}
            placeholder={isBn ? 'পিন কোড বা এলাকার নাম দিয়ে খুঁজুন (যেমন: 700091, বারাসাত...)' : 'Search by PIN code, locality or center name...'}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-hidden focus:border-blue-400 bg-white/5 text-white placeholder-white/40 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Kendra Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredKendras.map((kendra) => (
          <div
            key={kendra.id}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:border-white/20 hover:bg-white/[0.08] transition-all p-5 flex flex-col justify-between group"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md font-mono">
                  {kendra.cscId}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isBn ? 'বর্তমানে খোলা' : 'Open Today'}</span>
                </span>
              </div>

              {/* Title & Operator */}
              <h3 className="text-base font-bold text-white mb-1 leading-snug group-hover:text-blue-300 transition-colors">
                {isBn ? kendra.nameBn : kendra.nameEn}
              </h3>

              <div className="text-xs text-white/50 font-medium flex items-center gap-1.5 mb-3">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{isBn ? kendra.operatorBn : kendra.operatorEn}</span>
              </div>

              {/* Address */}
              <div className="text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/10 mb-3 space-y-1 backdrop-blur-md">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{isBn ? kendra.addressBn : kendra.addressEn} (PIN: {kendra.pincode})</span>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span>{isBn ? kendra.timingsBn : kendra.timingsEn}</span>
                </div>
              </div>

              {/* Services offered pills */}
              <div className="mb-4">
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider mb-1.5">
                  {isBn ? 'উপলব্ধ পরিষেবা:' : 'Available Counter Services:'}
                </div>
                <div className="flex flex-wrap gap-1">
                  {kendra.servicesOffered.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-md font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Call & Directions */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <a
                href={`tel:${kendra.phone.replace(/\s+/g, '')}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-2 rounded-xl transition-all backdrop-blur-md"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{kendra.phone}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  alert(isBn ? `গুগল ম্যাপে "${kendra.nameBn}" এর রুট দেখাচ্ছে।` : `Navigating route to "${kendra.nameEn}"...`);
                }}
                className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isBn ? 'রুট দেখুন' : 'Directions'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

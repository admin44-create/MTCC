import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  ShieldCheck, 
  Navigation, 
  CheckCircle2,
  Building,
  User,
  Globe2
} from 'lucide-react';
import { KendraItem, Language } from '../types';
import { ALL_INDIAN_STATES, getDistrictsForState } from '../data/locationsData';

interface KendraLocatorProps {
  kendras: KendraItem[];
  language: Language;
}

export const KendraLocator: React.FC<KendraLocatorProps> = ({ kendras, language }) => {
  const isBn = language === 'bn';
  const [selectedState, setSelectedState] = useState('WB');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchPin, setSearchPin] = useState('');

  // Available districts for the selected state
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  const filteredKendras = kendras.filter((k) => {
    const matchesDistrict = selectedDistrict === 'All' || k.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const query = searchPin.trim().toLowerCase();
    const matchesPin = !query || 
      k.pincode.includes(query) || 
      k.addressEn.toLowerCase().includes(query) || 
      k.addressBn.includes(query) || 
      k.nameEn.toLowerCase().includes(query) ||
      k.nameBn.includes(query) ||
      k.district.toLowerCase().includes(query);
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
          {isBn ? 'আপনার নিকটবর্তী মা তারা সাইবার ক্যাফে ও সেবা কেন্দ্র খুঁজুন' : 'Find Your Nearest Ma Tara Cyber Cafe & Digital Center'}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-2 font-bengali">
          {isBn
            ? 'মঙ্গলবাড়ি, মালদা সহ পশ্চিমবঙ্গ ও আশেপাশের এলাকা জুড়ে মা তারা সাইবার ক্যাফে (MTCC) ও অনুমোদিত কেন্দ্র থেকে অফলাইন প্রিন্টিং ও সহায়তা পান।'
            : 'Locate Ma Tara Cyber Cafe (MTCC) counters and partner centers across Malda and West Bengal for biometric capture, PVC printing, and assisted online services.'}
        </p>
      </div>

      {/* Filter & Search Bar: All States + All Districts + Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center gap-3">
        {/* All States Dropdown */}
        <div className="w-full sm:w-1/3">
          <label className="block text-[10px] text-white/50 uppercase font-bold mb-1 flex items-center gap-1">
            <Globe2 className="w-3 h-3 text-blue-400" />
            <span>{isBn ? 'রাজ্য নির্বাচন' : 'Select State'}</span>
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('All');
            }}
            className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-white bg-[#0e0e24] focus:outline-hidden focus:border-blue-400"
          >
            <option value="ALL" className="bg-[#0e0e24] text-white">
              {isBn ? 'সমস্ত রাজ্য (All States / UTs)' : 'All States & UTs (36)'}
            </option>
            {ALL_INDIAN_STATES.map((st) => (
              <option key={st.code} value={st.code} className="bg-[#0e0e24] text-white">
                {isBn ? `${st.nameBn} (${st.nameEn})` : `${st.nameEn} - ${st.code}`}
              </option>
            ))}
          </select>
        </div>

        {/* All Districts Dropdown */}
        <div className="w-full sm:w-1/3">
          <label className="block text-[10px] text-white/50 uppercase font-bold mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>{isBn ? 'জেলা নির্বাচন' : 'Select District'}</span>
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 text-xs sm:text-sm font-semibold text-white bg-[#0e0e24] focus:outline-hidden focus:border-blue-400"
          >
            <option value="All" className="bg-[#0e0e24] text-white">
              {isBn ? 'সমস্ত জেলা (All Districts)' : 'All Districts'}
            </option>
            {availableDistricts.map((d) => (
              <option key={d.nameEn} value={d.nameEn} className="bg-[#0e0e24] text-white">
                {isBn ? `${d.nameBn} (${d.nameEn})` : d.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Search by locality / PIN */}
        <div className="w-full sm:w-1/3">
          <label className="block text-[10px] text-white/50 uppercase font-bold mb-1 flex items-center gap-1">
            <Search className="w-3 h-3 text-amber-400" />
            <span>{isBn ? 'পিন বা এলাকা সার্চ' : 'Pincode / Center Search'}</span>
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-white/40 absolute left-3" />
            <input
              type="text"
              value={searchPin}
              onChange={(e) => setSearchPin(e.target.value)}
              placeholder={isBn ? 'পিন কোড, বারাসাত, সল্টলেক...' : 'Search 700091, Salt Lake...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-hidden focus:border-blue-400 bg-white/5 text-white placeholder-white/40"
            />
          </div>
        </div>
      </div>

      {/* Kendra Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredKendras.map((kendra, idx) => (
          <div
            key={kendra.id ? `${kendra.id}-${idx}` : `knd-${idx}`}
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

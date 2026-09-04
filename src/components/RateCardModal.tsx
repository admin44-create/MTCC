import React, { useState } from 'react';
import { X, Receipt, ShieldCheck, CheckCircle2, Clock, Search, HelpCircle } from 'lucide-react';
import { ServiceItem, Language } from '../types';

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  language: Language;
}

export const RateCardModal: React.FC<RateCardModalProps> = ({
  isOpen,
  onClose,
  services,
  language,
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = services.filter((s) => {
    const q = filterQuery.toLowerCase();
    return (
      s.titleEn.toLowerCase().includes(q) ||
      s.titleBn.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a1a]/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {isBn ? 'নাগরিক সনদ ও সরকারি ফি তালিকা (রেট চার্ট)' : 'Citizen Charter & Official Rate Card'}
              </h2>
              <p className="text-xs text-white/60">
                {isBn ? 'স্বচ্ছ নির্ধারিত মূল্য ও সরকারি সময়সীমা' : 'Transparent Government Fees & Authorized Kiosk Charges'}
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

        {/* Info Strip */}
        <div className="bg-blue-500/10 px-6 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-blue-300 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              {isBn
                ? 'ইজি সেবা কেন্দ্রে প্রতিটি লেনদেনের জন্য সরকারি কম্পিউটারাইজড রসিদ প্রদান বাধ্যতামূলক।'
                : 'Every rupee collected is backed by a computerized government acknowledgment receipt.'}
            </span>
          </div>
        </div>

        {/* Search inside Rate Card */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={isBn ? 'পরিষেবার নাম দিয়ে ফিল্টার করুন...' : 'Filter rate card by service name...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/15 text-xs focus:outline-hidden focus:border-blue-400 bg-white/5 text-white placeholder-white/40"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto p-4 flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/50 font-bold uppercase tracking-wider text-[10px] bg-white/[0.02]">
                <th className="py-2.5 px-3">{isBn ? 'পরিষেবা ও বিভাগ' : 'Service & Department'}</th>
                <th className="py-2.5 px-3">{isBn ? 'সরকারি ফি (Govt Fee)' : 'Govt Statutory Fee'}</th>
                <th className="py-2.5 px-3">{isBn ? 'কিয়স্ক সার্ভিস চার্জ' : 'Kiosk Service Fee'}</th>
                <th className="py-2.5 px-3">{isBn ? 'সর্বমোট' : 'Total Cost'}</th>
                <th className="py-2.5 px-3">{isBn ? 'নিষ্পত্তির সময় (SLA)' : 'Delivery SLA'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s) => {
                const total = s.govtFee + s.convenienceFee;
                return (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{isBn ? s.titleBn : s.titleEn}</div>
                      <div className="text-[11px] text-white/50">{isBn ? s.officialGovtBodyBn : s.officialGovtBodyEn}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-white/80">
                      {s.govtFee === 0 ? <span className="text-emerald-400 font-bold">₹0 (Free)</span> : `₹${s.govtFee}`}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-white/80">
                      ₹{s.convenienceFee}
                    </td>
                    <td className="py-3 px-3 font-mono font-extrabold text-blue-400 text-sm">
                      ₹{total}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 border border-white/10 px-2 py-0.5 rounded font-semibold text-[11px]">
                        <Clock className="w-3 h-3 text-white/50" />
                        <span>{isBn ? s.slaDaysBn : s.slaDays}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-white/50 shrink-0">
          <span>{isBn ? 'কোনো কর্মী অতিরিক্ত অর্থ দাবি করলে অভিযোগ জানান: 1800-399-7382' : 'Report overcharging to Vigilance Helpline: 1800-399-7382'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold transition-colors"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

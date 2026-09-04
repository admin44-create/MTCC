import React, { useState } from 'react';
import { 
  CreditCard, 
  Vote, 
  Wheat, 
  FileText, 
  Award, 
  FileCheck, 
  Zap, 
  MapPin, 
  GraduationCap, 
  HeartHandshake, 
  Car, 
  ShieldCheck, 
  Landmark, 
  Sprout, 
  Globe,
  Clock,
  ArrowRight,
  Info,
  CheckCircle,
  FileQuestion
} from 'lucide-react';
import { ServiceItem, Language } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
  language: Language;
  onApply: (service: ServiceItem) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, language, onApply }) => {
  const [showDocDetails, setShowDocDetails] = useState(false);
  const isBn = language === 'bn';

  const renderIcon = (name: string) => {
    const props = { className: 'w-6 h-6 text-blue-400' };
    switch (name) {
      case 'CreditCard': return <CreditCard {...props} />;
      case 'Vote': return <Vote {...props} />;
      case 'Wheat': return <Wheat {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Award': return <Award {...props} />;
      case 'FileCheck': return <FileCheck {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'MapPin': return <MapPin {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'HeartHandshake': return <HeartHandshake {...props} />;
      case 'Car': return <Car {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      case 'Sprout': return <Sprout {...props} />;
      case 'Globe': return <Globe {...props} />;
      default: return <FileText {...props} />;
    }
  };

  const totalFee = service.govtFee + service.convenienceFee;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {renderIcon(service.iconName)}
          </div>
          <div className="flex flex-col items-end gap-1">
            {service.isPopular && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-400/30 text-amber-300">
                {isBn ? '★ জনপ্রিয়' : '★ Popular'}
              </span>
            )}
            <span className="text-[11px] font-semibold text-white/70 flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg backdrop-blur-md">
              <Clock className="w-3 h-3 text-white/40" />
              <span>{isBn ? service.slaDaysBn : service.slaDays}</span>
            </span>
          </div>
        </div>

        {/* Title & Govt Department */}
        <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-300 transition-colors">
          {isBn ? service.titleBn : service.titleEn}
        </h3>
        <p className="text-xs font-semibold text-blue-400/90 mb-2.5">
          {isBn ? service.officialGovtBodyBn : service.officialGovtBodyEn}
        </p>

        {/* Short Description */}
        <p className="text-xs text-white/60 leading-relaxed mb-4 line-clamp-2">
          {isBn ? service.shortDescBn : service.shortDescEn}
        </p>

        {/* Required Documents Toggle */}
        <div className="border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={() => setShowDocDetails(!showDocDetails)}
            className="w-full flex items-center justify-between text-xs font-semibold text-white/70 hover:text-white transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <FileQuestion className="w-3.5 h-3.5 text-white/40" />
              <span>{isBn ? 'প্রয়োজনীয় কাগজপত্র' : 'Required Documents'} ({service.requiredDocsEn.length})</span>
            </span>
            <span className="text-[10px] text-blue-400 hover:underline">
              {showDocDetails ? (isBn ? 'লুকান' : 'Hide') : (isBn ? 'দেখুন' : 'View')}
            </span>
          </button>

          {showDocDetails && (
            <div className="mt-2 p-2.5 bg-white/5 backdrop-blur-md rounded-xl text-xs space-y-1.5 border border-white/10 animate-in fade-in duration-200">
              {(isBn ? service.requiredDocsBn : service.requiredDocsEn).map((doc, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-white/80">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{doc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer with Pricing & Action */}
      <div className="p-4 bg-white/[0.03] backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
            {isBn ? 'মোট খরচ (সরকারি + ফি)' : 'Total Fee'}
          </div>
          <div className="text-base font-extrabold text-white flex items-baseline gap-1">
            {totalFee === 0 ? (
              <span className="text-emerald-400">{isBn ? 'বিনামূল্যে (Free)' : 'FREE (₹0)'}</span>
            ) : (
              <>
                <span>₹{totalFee}</span>
                {service.govtFee > 0 && (
                  <span className="text-[10px] font-normal text-white/50">
                    ({isBn ? `সরকারি ₹${service.govtFee}` : `Govt ₹${service.govtFee}`})
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <button
          id={`apply-btn-${service.id}`}
          onClick={() => onApply(service)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{isBn ? 'আবেদন করুন' : 'Apply Now'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

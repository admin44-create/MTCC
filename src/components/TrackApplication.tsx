import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  Download, 
  ShieldCheck, 
  Calendar,
  User,
  Building2,
  Truck,
  CreditCard,
  Copy,
  Check,
  Package,
  MapPin
} from 'lucide-react';
import { ApplicationRecord, Language } from '../types';

interface TrackApplicationProps {
  applications: ApplicationRecord[];
  language: Language;
  initialTrackingId?: string;
}

export const TrackApplication: React.FC<TrackApplicationProps> = ({
  applications,
  language,
  initialTrackingId = '',
}) => {
  const isBn = language === 'bn';
  const defaultId = initialTrackingId || (applications.length > 0 ? applications[0].trackingId : 'PVC-2026-55410');
  const [searchInput, setSearchInput] = useState(defaultId);
  const [searchedRecord, setSearchedRecord] = useState<ApplicationRecord | null>(
    () => applications.find((a) => a.trackingId === defaultId) || applications[0] || null
  );
  const [hasSearched, setHasSearched] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const match = applications.find(
      (a) =>
        a.trackingId.toUpperCase() === query ||
        a.speedPostNumber?.toUpperCase() === query ||
        a.mobile.includes(query) ||
        (query.length >= 4 && a.trackingId.toUpperCase().includes(query))
    );
    setSearchedRecord(match || null);
    setHasSearched(true);
  };

  const handleSelectSample = (id: string) => {
    setSearchInput(id);
    const match = applications.find((a) => a.trackingId === id);
    setSearchedRecord(match || null);
    setHasSearched(true);
  };

  const copySpeedPost = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const isPvcCard = searchedRecord?.serviceId === 'pvc-smart-card' || !!searchedRecord?.speedPostNumber;

  const standardStages = [
    { num: 1, titleEn: 'Application Submitted', titleBn: 'আবেদন গৃহীত হয়েছে', descEn: 'Form & fees verified', descBn: 'ফর্ম ও ফি যাচাইকৃত' },
    { num: 2, titleEn: 'Document Scrutiny', titleBn: 'নথিপত্র নিরীক্ষণ', descEn: 'Kiosk & biometric verification', descBn: 'বায়োমেট্রিক ও নথি মিলকরণ' },
    { num: 3, titleEn: 'Department Processing', titleBn: 'দপ্তরে প্রক্রিয়াধীন', descEn: 'Under administrative approval', descBn: 'অফিসিয়াল অর্ডার প্রক্রিয়া' },
    { num: 4, titleEn: 'Dispatched / Ready', titleBn: 'প্রস্তুত / বিলি', descEn: 'Available for download / dispatch', descBn: 'ডেলিভারি বা প্রস্তুত' },
  ];

  const pvcStages = [
    { num: 1, titleEn: 'Order & Payment Verified', titleBn: 'অর্ডার ও পেমেন্ট গৃহীত', descEn: 'Gateway Txn Verified', descBn: 'অনলাইন পেমেন্ট সম্পন্ন' },
    { num: 2, titleEn: 'PVC Printing & Hologram', titleBn: 'পিভিসি প্রিন্টিং ও হলোগ্রাম', descEn: 'High-security plastic card embossed', descBn: 'ওয়াটারপ্রুফ স্মার্ট কার্ড প্রস্তুত' },
    { num: 3, titleEn: 'Speed Post Dispatched', titleBn: 'স্পিড পোস্টে প্রেরণ', descEn: 'Consignment booked with India Post', descBn: 'ডাক বিভাগ পার্সেল বুকিং' },
    { num: 4, titleEn: 'Delivered to Doorstep', titleBn: 'বাড়িতে পৌঁছে দেওয়া হয়েছে', descEn: 'Delivered by Postman', descBn: 'সরাসরি বাড়িতে ডেলিভারি' },
  ];

  const activeStages = isPvcCard ? pvcStages : standardStages;

  return (
    <section id="track-section" className="py-10 px-4 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3 backdrop-blur-md">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{isBn ? 'রিয়েল-টাইম ট্র্যাকিং' : 'Live Status Tracking'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isBn ? 'আবেদন ও পিভিসি কার্ড ট্র্যাকিং' : 'Track Application & PVC Card Status'}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-2">
          {isBn
            ? 'আপনার ট্র্যাকিং আইডি (যেমন: PVC-2026-55410, EZS-2026-89410), স্পিড পোস্ট কনসাইনমেন্ট নম্বর অথবা রেজিস্টার্ড মোবাইল নম্বর দিয়ে সার্চ করুন।'
            : 'Enter your official Tracking ID (e.g. PVC-2026-55410), Speed Post Consignment No., or registered mobile.'}
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
        <div className="flex items-center bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 focus-within:border-blue-400 focus-within:bg-white/10 p-1.5 transition-all">
          <Search className="w-5 h-5 text-white/40 ml-3 shrink-0" />
          <input
            id="track-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={isBn ? 'ট্র্যাকিং আইডি / স্পিড পোস্ট নম্বর (যেমন: PVC-2026-55410)' : 'Enter Tracking ID or Speed Post No. (e.g. PVC-2026-55410)'}
            className="w-full px-3 py-2.5 text-sm sm:text-base font-mono font-medium focus:outline-hidden text-white placeholder-white/40 bg-transparent"
          />
          <button
            type="submit"
            id="track-submit-btn"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md cursor-pointer"
          >
            {isBn ? 'অনুসন্ধান' : 'Track Now'}
          </button>
        </div>

        {/* Quick Sample Tracking ID Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
          <span className="font-semibold text-white/50">{isBn ? 'উদাহরণ ট্র্যাক আইডি:' : 'Try Samples:'}</span>
          {applications.slice(0, 5).map((app) => (
            <button
              key={app.trackingId}
              type="button"
              onClick={() => handleSelectSample(app.trackingId)}
              className={`font-mono px-2.5 py-1 rounded-lg border text-[11px] transition-all backdrop-blur-md cursor-pointer ${
                searchedRecord?.trackingId === app.trackingId
                  ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md shadow-blue-600/30'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {app.trackingId} {app.serviceId === 'pvc-smart-card' ? '(PVC)' : ''}
            </button>
          ))}
        </div>
      </form>

      {/* Result Card */}
      {hasSearched && searchedRecord ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in duration-200">
          {/* Top Banner */}
          <div className="bg-white/[0.04] backdrop-blur-md border-b border-white/10 text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {searchedRecord.trackingId}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  searchedRecord.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : searchedRecord.status === 'ready_for_dispatch'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                }`}>
                  {searchedRecord.status === 'approved' 
                    ? (isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered / Completed') 
                    : searchedRecord.status === 'ready_for_dispatch'
                    ? (isBn ? 'স্পিড পোস্টে প্রেরণকৃত' : 'In Transit / Dispatched')
                    : (isBn ? 'প্রক্রিয়াধীন' : 'In Progress')}
                </span>
                {isPvcCard && (
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full font-bold border border-orange-400/30 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>PVC Smart Card</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isBn ? searchedRecord.serviceNameBn : searchedRecord.serviceNameEn}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                {isBn ? 'প্রত্যাশিত ডেলিভারি / নিষ্পত্তি' : 'Target Resolution'}
              </div>
              <div className="text-sm font-bold text-blue-400 font-mono">
                {searchedRecord.expectedDate}
              </div>
            </div>
          </div>

          {/* Special Speed Post Live Tracking Box for PVC Cards */}
          {searchedRecord.speedPostNumber && (
            <div className="m-6 p-4 rounded-2xl bg-linear-to-r from-red-950/40 via-amber-950/30 to-blue-950/40 border border-red-500/30 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                        {isBn ? 'ভারতীয় ডাক বিভাগ (স্পিড পোস্ট)' : 'India Post Speed Post'}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {isBn ? 'পার্সেল ট্র্যাকিং সক্রিয়' : 'Parcel Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/60">{isBn ? 'কনসাইনমেন্ট নম্বর:' : 'Consignment No:'}</span>
                      <span className="font-mono font-bold text-white text-sm tracking-wider bg-black/40 px-2 py-0.5 rounded border border-white/10">
                        {searchedRecord.speedPostNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => copySpeedPost(searchedRecord.speedPostNumber!)}
                        className="text-white/60 hover:text-white p-1 rounded hover:bg-white/10 transition-all cursor-pointer"
                        title={isBn ? 'কপি করুন' : 'Copy'}
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {searchedRecord.formData?.deliveryAddress && (
                  <div className="text-xs text-white/70 max-w-xs bg-black/20 p-2.5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-white/40 font-semibold flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Destination'}</span>
                    </div>
                    <div className="text-white font-medium line-clamp-2 text-[11px]">
                      {searchedRecord.formData.deliveryAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stepper Timeline */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {activeStages.map((stage) => {
                const isCompleted = stage.num < searchedRecord.currentStageNumber;
                const isCurrent = stage.num === searchedRecord.currentStageNumber;
                return (
                  <div key={stage.num} className="flex flex-col sm:items-center text-left sm:text-center relative">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/30'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 border border-blue-400/50 shadow-lg shadow-blue-600/40'
                          : 'bg-white/10 text-white/40 border border-white/10'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stage.num}
                    </div>
                    <div className="font-bold text-xs text-white">
                      {isBn ? stage.titleBn : stage.titleEn}
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      {isBn ? stage.descBn : stage.descEn}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid & Remarks */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="text-white/40 font-semibold flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isBn ? 'আবেদনকারী / প্রাপক' : 'Applicant / Recipient'}</span>
                </div>
                <div className="font-bold text-white text-sm">{searchedRecord.applicantName}</div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  {isBn ? `মোবাইল: ******${searchedRecord.mobile.slice(-4)}` : `Mobile: ******${searchedRecord.mobile.slice(-4)}`}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="text-white/40 font-semibold flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isBn ? 'জমা দেওয়ার তারিখ' : 'Submission Date'}</span>
                </div>
                <div className="font-bold text-white text-sm">{searchedRecord.appliedDate}</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>
                    {isBn ? `ফি: ₹${searchedRecord.feePaid} (পরিশোধিত)` : `Fee: ₹${searchedRecord.feePaid} (Paid)`}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <div className="text-white/40 font-semibold flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isBn ? 'বরাদ্দকৃত হাব / সেবা কেন্দ্র' : 'Handling Kendra / Hub'}</span>
                </div>
                <div className="font-bold text-white text-sm line-clamp-1">
                  {isBn ? searchedRecord.kendraAssignedBn : searchedRecord.kendraAssignedEn}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{searchedRecord.paymentMethod ? `Verified (${searchedRecord.paymentMethod})` : 'Verified VLE'}</span>
                </div>
              </div>
            </div>

            {/* Payment Gateway Settlement Info */}
            {searchedRecord.paymentTransactionId && (
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">
                      {isBn ? 'পেমেন্ট গেটওয়ে সফল লেনদেন' : 'Payment Gateway Settled'}
                    </div>
                    <div className="text-white/50 text-[11px]">
                      {isBn ? `পদ্ধতি: ${searchedRecord.paymentMethod || 'UPI/Card'} | লেনদেন আইডি: ` : `Method: ${searchedRecord.paymentMethod || 'UPI/Card'} | Txn ID: `}
                      <span className="font-mono text-emerald-300">{searchedRecord.paymentTransactionId}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                  {isBn ? '১০০% নিশ্চিত পেমেন্ট' : '100% Confirmed'}
                </span>
              </div>
            )}

            {/* Official Remarks Note */}
            <div className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-4 text-xs">
              <div className="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{isBn ? 'বর্তমান স্ট্যাটাস নোট ও আপডেট' : 'Official Action & Status Update:'}</span>
              </div>
              <p className="text-white/80 leading-relaxed">
                {isBn ? searchedRecord.remarksBn : searchedRecord.remarksEn}
              </p>
            </div>

            {/* Download Output Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-white/50">
                {isBn ? 'প্রশ্ন বা সহযোগিতার জন্য হেল্পলাইন: 1800-399-7382' : 'For any query or delay, contact Helpline: 1800-399-7382'}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(isBn ? 'ডিজিটাল আবেদনপত্র ও পেমেন্ট রসিদ ডাউনলোড সফল হয়েছে।' : 'Digital application slip and payment receipt downloaded.')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30 backdrop-blur-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'রসিদ ও একনলেজমেন্ট ডাউনলোড' : 'Download Receipt / Slip'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center max-w-md mx-auto shadow-2xl">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-white text-base mb-1">
            {isBn ? 'কোনো রেকর্ড পাওয়া যায়নি' : 'No Record Found'}
          </h4>
          <p className="text-xs text-white/60 mb-4">
            {isBn
              ? 'অনুগ্রহ করে সঠিক ট্র্যাকিং নম্বর (যেমন: PVC-2026-55410) অথবা সঠিক মোবাইল নম্বর প্রদান করুন।'
              : 'Please check your tracking reference ID or select one of the sample tracking IDs above.'}
          </p>
          <button
            onClick={() => handleSelectSample('PVC-2026-55410')}
            className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
          >
            {isBn ? 'নমুনা পিভিসি কার্ড ট্র্যাক আইডি দেখুন (PVC-2026-55410)' : 'Load sample PVC record (PVC-2026-55410)'}
          </button>
        </div>
      ) : null}
    </section>
  );
};

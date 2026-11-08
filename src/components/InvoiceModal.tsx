import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  QrCode, 
  Package, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { ApplicationRecord, Language } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ApplicationRecord | null;
  language: Language;
  onTrack?: (trackingId: string) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  record,
  language,
  onTrack
}) => {
  const isBn = language === 'bn';
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !record) return null;

  const invoiceNo = record.invoiceNumber || `INV-2026-${record.trackingId.replace(/[^0-9]/g, '').slice(-5) || '84912'}`;
  const utrNo = record.utrNumber || record.paymentTransactionId || `UTR-IN-${Date.now().toString().slice(-10)}`;
  const paymentTime = record.paymentTimestamp || `${record.appliedDate}, 11:30 AM IST`;
  
  // Calculate breakdown if not provided
  const totalFee = record.feePaid || 115;
  const govtFee = record.govtFee !== undefined ? record.govtFee : Math.max(0, Math.floor(totalFee * 0.65));
  const convenienceFee = record.convenienceFee !== undefined ? record.convenienceFee : Math.max(0, Math.floor((totalFee - govtFee) / 1.18));
  const gstAmount = record.gstAmount !== undefined ? record.gstAmount : (totalFee - govtFee - convenienceFee);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        ref={printRef}
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto text-xs"
        id="printable-invoice-container"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">
              {isBn ? 'অফিসিয়াল ডিজিটাল ইনভয়েস ও মানি রসিদ' : 'Official Digital Tax Invoice & Money Receipt'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow transition-all cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট / PDF ডাউনলোড' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-800">
          
          {/* Government / Kiosk Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  🇮🇳
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-blue-700">
                    {isBn ? 'ডিজিটাল ভারত • পশ্চিমবঙ্গ ই-ডিস্ট্রিক্ট সহায়ক পোর্টাল' : 'Digital India • e-District Citizen Services Portal'}
                  </div>
                  <h2 className="text-lg font-black text-slate-900 leading-tight">
                    {isBn ? 'মা তারা সাইবার ক্যাফে (MTCC)' : 'Ma Tara Cyber Cafe (MTCC)'}
                  </h2>
                  <div className="text-[11px] text-slate-500">
                    Mangalbari, Malda, West Bengal • Official Digital & Printing Center
                  </div>
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="text-right sm:border-l sm:pl-4 border-slate-200">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 border border-emerald-300">
                  ✓ {isBn ? 'পেমেন্ট সম্পন্ন (PAID)' : 'PAID & VERIFIED'}
                </span>
                <div className="font-mono font-bold text-slate-800 text-xs">
                  {isBn ? 'ইনভয়েস নং:' : 'Invoice No:'} <span className="text-blue-700 font-extrabold">{invoiceNo}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {isBn ? 'তারিখ ও সময়:' : 'Date & Time:'} {paymentTime}
                </div>
              </div>
            </div>
          </div>

          {/* Key Reference Callout (UTR & Tracking ID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-blue-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'ব্যাংক পেমেন্ট ইউটিআর / ট্রানজাকশন নম্বর' : 'Bank Payment UTR / Transaction Ref'}</span>
              </div>
              <div className="font-mono font-black text-sm text-slate-900 tracking-wide select-all bg-white px-2 py-1 rounded border border-blue-200 inline-block">
                {utrNo}
              </div>
              <div className="text-[10px] text-slate-600">
                {isBn ? 'পদ্ধতি:' : 'Mode:'} <strong>{record.paymentMethod || 'UPI (PhonePe / BharatPe)'}</strong>
              </div>
            </div>

            <div className="space-y-1 sm:text-right">
              <div className="text-[10px] font-bold uppercase text-blue-800">
                {isBn ? 'সরকারি ট্র্যাকিং অ্যাপ্লিকেশন আইডি' : 'Official Application Tracking ID'}
              </div>
              <div className="font-mono font-black text-sm text-blue-800 tracking-wide select-all bg-white px-2 py-1 rounded border border-blue-200 inline-block">
                {record.trackingId}
              </div>
              <div className="text-[10px] text-slate-600">
                {isBn ? 'বর্তমান স্ট্যাটাস:' : 'Status:'} <strong className="text-emerald-700 capitalize">{record.status.replace(/_/g, ' ')}</strong>
              </div>
            </div>
          </div>

          {/* Customer (Billed To) and Kendra Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            {/* Customer Details */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600" />
                <span>{isBn ? 'গ্রাহক / আবেদনকারীর বিবরণ (Billed To)' : 'Citizen / Applicant Details (Billed To)'}</span>
              </div>
              <div className="font-black text-sm text-slate-900">
                {record.applicantName}
              </div>
              <div className="text-slate-600 font-mono text-[11px] flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>+91 {record.mobile}</span>
                {record.aadhaarLast4 && (
                  <span className="ml-2 bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                    Aadhaar: •••• {record.aadhaarLast4}
                  </span>
                )}
              </div>
              <div className="text-slate-600 text-[11px] flex items-start gap-1 pt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  {record.applicantAddress || record.formData?.deliveryAddress || 'Kolkata, West Bengal'}
                  {record.applicantDistrict ? `, ${record.applicantDistrict}` : ''}
                  {record.applicantState ? `, ${record.applicantState}` : ', West Bengal'}
                  {record.applicantPincode ? ` - ${record.applicantPincode}` : (record.formData?.deliveryPincode ? ` - ${record.formData.deliveryPincode}` : '')}
                </span>
              </div>
            </div>

            {/* Service & Kendra Center */}
            <div className="space-y-1.5 sm:border-l sm:pl-4 border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-indigo-600" />
                <span>{isBn ? 'আবেদিত পরিষেবা ও কেন্দ্র' : 'Service & Facilitation Kendra'}</span>
              </div>
              <div className="font-bold text-slate-900">
                {isBn ? record.serviceNameBn : record.serviceNameEn}
              </div>
              <div className="text-[11px] text-slate-600">
                {isBn ? 'বরাদ্দ কেন্দ্র:' : 'Assigned Kendra:'} <span className="font-medium text-slate-800">{isBn ? record.kendraAssignedBn : record.kendraAssignedEn}</span>
              </div>
              {record.speedPostNumber && (
                <div className="flex items-center gap-1.5 pt-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded text-[11px] font-mono">
                  <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Speed Post: <strong>{record.speedPostNumber}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Custom Submitted Form Fields (if any) */}
          {record.formData && Object.keys(record.formData).length > 0 && (
            <div className="border border-slate-200 rounded-xl p-3 bg-white">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {isBn ? 'আবেদনে প্রদত্ত অতিরিক্ত তথ্যসমূহ' : 'Application Parameters & Customer Inputs'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {Object.entries(record.formData).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="text-slate-400 capitalize block text-[10px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <strong className="text-slate-800 font-mono break-all">{val}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Itemized Financial Fee Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">{isBn ? 'বিবরণ' : 'Item Description'}</th>
                  <th className="py-2.5 px-4 text-center">{isBn ? 'এইচএসএন / স্যাক' : 'SAC Code'}</th>
                  <th className="py-2.5 px-4 text-right">{isBn ? 'পরিমাণ (₹)' : 'Amount (₹)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-slate-900">{isBn ? record.serviceNameBn : record.serviceNameEn}</div>
                    <div className="text-[10px] text-slate-500">{isBn ? 'অফিসিয়াল সরকারি ফি (শুল্কমুক্ত)' : 'Official Government Statutory Filing Fee (Exempt)'}</div>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500">9983</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold">₹{govtFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">
                    <div className="font-bold text-slate-900">{isBn ? 'ডিজিটাল সহায়তা ও কিয়স্ক পোর্টাল চার্জ' : 'Portal Facilitation & Assisted Processing Fee'}</div>
                    <div className="text-[10px] text-slate-500">Kiosk convenience, e-KYC validation & digital processing</div>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500">9984</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold">₹{convenienceFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4">
                    <div className="text-slate-800">{isBn ? 'জিএসটি (১৮% সিজিএসটি ৯% + এসজিএসটি ৯%)' : 'GST (18% on convenience fee)'}</div>
                  </td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500">-</td>
                  <td className="py-2.5 px-4 text-right font-mono">₹{gstAmount.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-sm">
                    {isBn ? 'মোট পরিশোধিত অর্থ (TOTAL AMOUNT PAID):' : 'TOTAL AMOUNT PAID & SETTLED:'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-base text-emerald-400 font-extrabold">
                    ₹{totalFee.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Security QR, Digital Sign & IT Act Disclaimer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <div className="font-bold text-slate-800">{isBn ? 'ডিজিটাল নিরাপত্তা সিলমোহর' : 'Digital Security Seal'}</div>
                <div>Scan QR to verify authentic govt record</div>
                <div className="font-mono text-[9px] text-slate-400">NPCI-REF: {utrNo.slice(-8)}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 mb-1">
                <div className="font-serif italic font-bold text-slate-700 text-xs">Ma Tara Cyber Cafe (MTCC)</div>
              </div>
              <div className="text-[10px] font-bold text-slate-800">
                {isBn ? 'কর্তৃপক্ষের অনুমোদিত ডিজিটাল স্বাক্ষর' : 'Authorized Digital Signatory'}
              </div>
              <div className="text-[9px] text-slate-500">
                Govt of India e-Sign Framework
              </div>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="text-[10px] text-slate-400 text-center leading-tight pt-2">
            This is an electronically generated Tax Invoice & Payment Acknowledgment issued under Section 65B of the Indian Evidence Act, 1872 & IT Act 2000. No physical signature is required.
          </div>

        </div>

        {/* Bottom Actions (Hidden during print) */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          {onTrack && (
            <button
              onClick={() => {
                onClose();
                onTrack(record.trackingId);
              }}
              className="flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? 'এই আবেদনের লাইভ ট্র্যাকিং দেখুন' : 'View Live Tracking Details'}</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isBn ? 'রসিদ ডাউনলোড / প্রিন্ট' : 'Download / Print Receipt'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

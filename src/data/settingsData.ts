import { SiteSettings, CustomerUser, AdminCredentials } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  portalName: 'EzySeva',
  portalSubname: '.AI',
  taglineEn: 'Digital Citizen & Kiosk Services Portal',
  taglineBn: 'ডিজিটাল নাগরিক ও সেবা কেন্দ্র পোর্টাল',
  noticeAlertEn: 'Aadhaar-Ration e-KYC & Form 6 Voter registrations are currently live',
  noticeAlertBn: 'আধার-রেশন কার্ড e-KYC ও নতুন ভোটার আবেদন ফর্ম চালু রয়েছে',
  heroHeadlinePreBn: 'আপনার হাতের মুঠোয় ',
  heroHeadlineHighlightBn: 'সরকারি ও ডিজিটাল',
  heroHeadlinePostBn: ' নাগরিক পরিষেবা',
  heroHeadlinePreEn: 'Empowering Citizens with ',
  heroHeadlineHighlightEn: 'Intelligent Digital Services',
  heroHeadlinePostEn: ' Across Bengal',
  heroSubtitleBn: 'প্যান কার্ড, ভোটার কার্ড, জন্ম সনদ, রেশন ই-কেওয়াইসি, বিদ্যুৎ বিল ও জমি সংক্রান্ত আবেদন ঘরে বসেই অথবা আপনার নিকটবর্তী ইজি সেবা কেন্দ্র থেকে সম্পূর্ণ করুন।',
  heroSubtitleEn: 'EzySeva bridges administrative hurdles with instant document generation, transparent fees, and live tracking across West Bengal & India.',
  tollFreePhone: '1800-399-7382',
  helpdeskTimingsEn: 'Helpdesk: 8:00 AM - 8:00 PM',
  helpdeskTimingsBn: 'সহায়তা সময়: সকাল ৮:০০ - রাত ৮:০০',
  supportEmail: 'support@ezyseva.gov.in',
  officeAddressEn: 'EzySeva State HQ, Webel Bhavan, Salt Lake Sector V, Kolkata 700091',
  officeAddressBn: 'ইজি সেবা রাজ্য কার্যালয়, ওয়েবেল ভবন, সল্টলেক সেক্টর ৫, কলকাতা ৭০০০৯১',
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  adminId: 'admin',
  password: 'admin',
  lastUpdated: '2026-01-01',
};

export const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'CUST-98301',
    name: 'সুবীর কুমার দাস',
    mobile: '9830149210',
    password: '1234',
    email: 'citizen.subir@ezyseva.in',
    aadhaar: '541278904921',
    district: 'North 24 Parganas',
    pincode: '700124',
    address: 'বাড়ি নং ১৪/বি, স্টেশন রোড, বারাসাত, উত্তর ২৪ পরগনা',
    walletBalance: 1250,
    createdAt: '2026-01-15',
  },
];

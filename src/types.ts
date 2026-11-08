export type Language = 'en' | 'bn';

export type ServiceCategory =
  | 'all'
  | 'identity'
  | 'certificates'
  | 'bills'
  | 'schemes'
  | 'land'
  | 'banking';

export interface FormFieldDef {
  id: string;
  labelEn: string;
  labelBn: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  options?: { value: string; labelEn: string; labelBn: string }[];
  placeholderEn?: string;
  placeholderBn?: string;
  required?: boolean;
}

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  titleEn: string;
  titleBn: string;
  shortDescEn: string;
  shortDescBn: string;
  officialGovtBodyEn: string;
  officialGovtBodyBn: string;
  govtFee: number;
  convenienceFee: number;
  slaDays: string;
  slaDaysBn: string;
  iconName: string;
  isPopular?: boolean;
  isActive?: boolean;
  requiredDocsEn: string[];
  requiredDocsBn: string[];
  stepsEn: string[];
  stepsBn: string[];
  fields: FormFieldDef[];
}

export interface KendraItem {
  id: string;
  nameEn: string;
  nameBn: string;
  operatorEn: string;
  operatorBn: string;
  cscId: string;
  district: string;
  districtBn: string;
  addressEn: string;
  addressBn: string;
  pincode: string;
  phone: string;
  timingsEn: string;
  timingsBn: string;
  distanceKm: number;
  isOpenNow: boolean;
  servicesOffered: string[];
}

export interface ApplicationRecord {
  trackingId: string;
  serviceId: string;
  serviceNameEn: string;
  serviceNameBn: string;
  applicantName: string;
  mobile: string;
  aadhaarLast4: string;
  appliedDate: string;
  expectedDate: string;
  status: 'submitted' | 'verification' | 'department_processing' | 'approved' | 'ready_for_dispatch';
  currentStageNumber: number; // 1 to 4
  kendraAssignedEn: string;
  kendraAssignedBn: string;
  remarksEn: string;
  remarksBn: string;
  formData: Record<string, string>;
  feePaid: number;
  customerId?: string;
  deliveryMode?: 'speed_post' | 'digital_only' | 'kendra_pickup';
  speedPostNumber?: string;
  paymentMethod?: string;
  paymentTransactionId?: string;
  utrNumber?: string; // e.g. UTR / URN / UPI Reference number
  invoiceNumber?: string; // e.g. INV-2026-XXXXX
  paymentTimestamp?: string;
  paymentStatus?: 'paid' | 'pending';
  govtFee?: number;
  convenienceFee?: number;
  gstAmount?: number;
  applicantState?: string;
  applicantDistrict?: string;
  applicantAddress?: string;
  applicantPincode?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  mobile: string;
  password?: string;
  email?: string;
  aadhaar: string;
  state?: string;
  district: string;
  pincode: string;
  address: string;
  walletBalance: number;
  createdAt: string;
}

export interface AdminCredentials {
  adminId: string;
  password: string;
  lastUpdated?: string;
}

export interface PaymentGatewaySettings {
  upi: boolean;
  card: boolean;
  netbanking: boolean;
  wallet: boolean;
  paylater: boolean;
  kendraCash: boolean;
  merchantUpiId: string;
  gatewayMode: 'production' | 'simulator';
  activeProvider?: 'razorpay' | 'cashfree' | 'payu' | 'ccavenue' | 'billdesk' | 'npci_bhim';
  merchantName?: string;
  merchantKey?: string;
  autoVerify?: boolean;
  zeroConvenienceFee?: boolean;
  supportPhone?: string;
}

export type LogoStyleType = 'emblem_shield' | 'digital_india' | 'ashoka_chakra' | 'csc_kendra' | 'cyber_smart';
export type BannerThemeType = 'aurora_gradient' | 'digital_india_tricolor' | 'deep_cyber' | 'royal_midnight';

export interface SiteSettings {
  portalName: string;
  portalSubname: string;
  portalNameBn?: string;
  portalSubnameBn?: string;
  taglineEn: string;
  taglineBn: string;
  noticeAlertEn: string;
  noticeAlertBn: string;
  heroHeadlinePreBn: string;
  heroHeadlineHighlightBn: string;
  heroHeadlinePostBn: string;
  heroHeadlinePreEn: string;
  heroHeadlineHighlightEn: string;
  heroHeadlinePostEn: string;
  heroSubtitleBn: string;
  heroSubtitleEn: string;
  tollFreePhone: string;
  helpdeskTimingsEn: string;
  helpdeskTimingsBn: string;
  supportEmail: string;
  officeAddressEn: string;
  officeAddressBn: string;
  logoStyle?: LogoStyleType;
  customLogoUrl?: string;
  bannerTheme?: BannerThemeType;
  gatewayConfig?: PaymentGatewaySettings;
}

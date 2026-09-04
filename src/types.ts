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
  paymentStatus?: 'paid' | 'pending';
}

export interface CustomerUser {
  id: string;
  name: string;
  mobile: string;
  password?: string;
  email?: string;
  aadhaar: string;
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

export interface SiteSettings {
  portalName: string;
  portalSubname: string;
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
}

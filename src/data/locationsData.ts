export interface StateItem {
  code: string;
  nameEn: string;
  nameBn: string;
  type: 'state' | 'ut';
}

export interface DistrictItem {
  stateCode: string;
  nameEn: string;
  nameBn: string;
  isPopular?: boolean;
}

// All 28 States and 8 Union Territories of India
export const ALL_INDIAN_STATES: StateItem[] = [
  { code: 'WB', nameEn: 'West Bengal', nameBn: 'পশ্চিমবঙ্গ', type: 'state' },
  { code: 'MH', nameEn: 'Maharashtra', nameBn: 'মহারাষ্ট্র', type: 'state' },
  { code: 'DL', nameEn: 'Delhi (NCT)', nameBn: 'দিল্লি (এনসিটি)', type: 'ut' },
  { code: 'UP', nameEn: 'Uttar Pradesh', nameBn: 'উত্তর প্রদেশ', type: 'state' },
  { code: 'BR', nameEn: 'Bihar', nameBn: 'বিহার', type: 'state' },
  { code: 'JH', nameEn: 'Jharkhand', nameBn: 'ঝাড়খণ্ড', type: 'state' },
  { code: 'OD', nameEn: 'Odisha', nameBn: 'ওড়িশা', type: 'state' },
  { code: 'AS', nameEn: 'Assam', nameBn: 'আসাম', type: 'state' },
  { code: 'TR', nameEn: 'Tripura', nameBn: 'ত্রিপুরা', type: 'state' },
  { code: 'KA', nameEn: 'Karnataka', nameBn: 'কর্ণাটক', type: 'state' },
  { code: 'TN', nameEn: 'Tamil Nadu', nameBn: 'তামিলনাড়ু', type: 'state' },
  { code: 'GJ', nameEn: 'Gujarat', nameBn: 'গুজরাট', type: 'state' },
  { code: 'RJ', nameEn: 'Rajasthan', nameBn: 'রাজস্থান', type: 'state' },
  { code: 'MP', nameEn: 'Madhya Pradesh', nameBn: 'মধ্যপ্রদেশ', type: 'state' },
  { code: 'AP', nameEn: 'Andhra Pradesh', nameBn: 'অন্ধ্রপ্রদেশ', type: 'state' },
  { code: 'TG', nameEn: 'Telangana', nameBn: 'তেলেঙ্গানা', type: 'state' },
  { code: 'KL', nameEn: 'Kerala', nameBn: 'কেরালা', type: 'state' },
  { code: 'PB', nameEn: 'Punjab', nameBn: 'পাঞ্জাব', type: 'state' },
  { code: 'HR', nameEn: 'Haryana', nameBn: 'হরিয়ানা', type: 'state' },
  { code: 'CG', nameEn: 'Chhattisgarh', nameBn: 'ছত্তিশগড়', type: 'state' },
  { code: 'UK', nameEn: 'Uttarakhand', nameBn: 'উত্তরাখণ্ড', type: 'state' },
  { code: 'HP', nameEn: 'Himachal Pradesh', nameBn: 'হিমাচল প্রদেশ', type: 'state' },
  { code: 'GA', nameEn: 'Goa', nameBn: 'গোয়া', type: 'state' },
  { code: 'SK', nameEn: 'Sikkim', nameBn: 'সিকিম', type: 'state' },
  { code: 'ML', nameEn: 'Meghalaya', nameBn: 'মেঘালয়', type: 'state' },
  { code: 'MN', nameEn: 'Manipur', nameBn: 'মণিপুর', type: 'state' },
  { code: 'NL', nameEn: 'Nagaland', nameBn: 'নাগাল্যান্ড', type: 'state' },
  { code: 'MZ', nameEn: 'Mizoram', nameBn: 'মিজোরাম', type: 'state' },
  { code: 'AR', nameEn: 'Arunachal Pradesh', nameBn: 'অরুণাচল প্রদেশ', type: 'state' },
  { code: 'JK', nameEn: 'Jammu and Kashmir', nameBn: 'জম্মু ও কাশ্মীর', type: 'ut' },
  { code: 'LA', nameEn: 'Ladakh', nameBn: 'লাদাখ', type: 'ut' },
  { code: 'CH', nameEn: 'Chandigarh', nameBn: 'চণ্ডীগড়', type: 'ut' },
  { code: 'PY', nameEn: 'Puducherry', nameBn: 'পুদুচেরি', type: 'ut' },
  { code: 'AN', nameEn: 'Andaman and Nicobar', nameBn: 'আন্দামান ও নিকোবর', type: 'ut' },
  { code: 'DN', nameEn: 'Dadra & Nagar Haveli and Daman & Diu', nameBn: 'দাদরা ও নগর হাভেলি এবং দমন ও দিউ', type: 'ut' },
  { code: 'LD', nameEn: 'Lakshadweep', nameBn: 'লাক্ষাদ্বীপ', type: 'ut' },
];

// All 23 Districts of West Bengal + Key Districts across other States
export const ALL_DISTRICTS_DATA: DistrictItem[] = [
  // West Bengal (All 23 administrative districts)
  { stateCode: 'WB', nameEn: 'Kolkata', nameBn: 'কলকাতা', isPopular: true },
  { stateCode: 'WB', nameEn: 'North 24 Parganas', nameBn: 'উত্তর ২৪ পরগনা', isPopular: true },
  { stateCode: 'WB', nameEn: 'South 24 Parganas', nameBn: 'দক্ষিণ ২৪ পরগনা', isPopular: true },
  { stateCode: 'WB', nameEn: 'Howrah', nameBn: 'হাওড়া', isPopular: true },
  { stateCode: 'WB', nameEn: 'Hooghly', nameBn: 'হুগলি', isPopular: true },
  { stateCode: 'WB', nameEn: 'Purba Bardhaman', nameBn: 'পূর্ব বর্ধমান', isPopular: true },
  { stateCode: 'WB', nameEn: 'Paschim Bardhaman', nameBn: 'পশ্চিম বর্ধমান' },
  { stateCode: 'WB', nameEn: 'Nadia', nameBn: 'নদিয়া', isPopular: true },
  { stateCode: 'WB', nameEn: 'Murshidabad', nameBn: 'মুর্শিদাবাদ', isPopular: true },
  { stateCode: 'WB', nameEn: 'Birbhum', nameBn: 'বীরভূম' },
  { stateCode: 'WB', nameEn: 'Bankura', nameBn: 'বাঁকুড়া' },
  { stateCode: 'WB', nameEn: 'Purulia', nameBn: 'পুরুলিয়া' },
  { stateCode: 'WB', nameEn: 'Purba Medinipur', nameBn: 'পূর্ব মেদিনীপুর' },
  { stateCode: 'WB', nameEn: 'Paschim Medinipur', nameBn: 'পশ্চিম মেদিনীপুর' },
  { stateCode: 'WB', nameEn: 'Jhargram', nameBn: 'ঝাড়গ্রাম' },
  { stateCode: 'WB', nameEn: 'Malda', nameBn: 'মালদা' },
  { stateCode: 'WB', nameEn: 'Uttar Dinajpur', nameBn: 'উত্তর দিনাজপুর' },
  { stateCode: 'WB', nameEn: 'Dakshin Dinajpur', nameBn: 'দক্ষিণ দিনাজপুর' },
  { stateCode: 'WB', nameEn: 'Jalpaiguri', nameBn: 'জলপাইগুড়ি' },
  { stateCode: 'WB', nameEn: 'Alipurduar', nameBn: 'আলিপুরদুয়ার' },
  { stateCode: 'WB', nameEn: 'Cooch Behar', nameBn: 'কোচবিহার' },
  { stateCode: 'WB', nameEn: 'Darjeeling', nameBn: 'দার্জিলিং', isPopular: true },
  { stateCode: 'WB', nameEn: 'Kalimpong', nameBn: 'কালিম্পং' },

  // Delhi (NCT)
  { stateCode: 'DL', nameEn: 'Central Delhi', nameBn: 'সেন্ট্রাল দিল্লি' },
  { stateCode: 'DL', nameEn: 'New Delhi', nameBn: 'নতুন দিল্লি', isPopular: true },
  { stateCode: 'DL', nameEn: 'North Delhi', nameBn: 'উত্তর দিল্লি' },
  { stateCode: 'DL', nameEn: 'South Delhi', nameBn: 'দক্ষিণ দিল্লি' },
  { stateCode: 'DL', nameEn: 'East Delhi', nameBn: 'পূর্ব দিল্লি' },
  { stateCode: 'DL', nameEn: 'West Delhi', nameBn: 'পশ্চিম দিল্লি' },

  // Bihar
  { stateCode: 'BR', nameEn: 'Patna', nameBn: 'পাটনা', isPopular: true },
  { stateCode: 'BR', nameEn: 'Gaya', nameBn: 'গয়া' },
  { stateCode: 'BR', nameEn: 'Muzaffarpur', nameBn: 'মুজাফফরপুর' },
  { stateCode: 'BR', nameEn: 'Bhagalpur', nameBn: 'ভাগলপুর' },
  { stateCode: 'BR', nameEn: 'Purnia', nameBn: 'পূর্ণিয়া' },
  { stateCode: 'BR', nameEn: 'Katihar', nameBn: 'কাটিহার' },

  // Jharkhand
  { stateCode: 'JH', nameEn: 'Ranchi', nameBn: 'রাঁচি', isPopular: true },
  { stateCode: 'JH', nameEn: 'Dhanbad', nameBn: 'ধানবাদ' },
  { stateCode: 'JH', nameEn: 'East Singhbhum (Jamshedpur)', nameBn: 'পূর্ব সিংভূম (জামশেদপুর)' },
  { stateCode: 'JH', nameEn: 'Bokaro', nameBn: 'বোকারো' },
  { stateCode: 'JH', nameEn: 'Deoghar', nameBn: 'দেওঘর' },

  // Odisha
  { stateCode: 'OD', nameEn: 'Khordha (Bhubaneswar)', nameBn: 'খুরদা (ভুবনেশ্বর)', isPopular: true },
  { stateCode: 'OD', nameEn: 'Cuttack', nameBn: 'কটক' },
  { stateCode: 'OD', nameEn: 'Puri', nameBn: 'পুরী' },
  { stateCode: 'OD', nameEn: 'Balasore', nameBn: 'বালেশ্বর' },
  { stateCode: 'OD', nameEn: 'Sambalpur', nameBn: 'সম্বলপুর' },

  // Assam & Northeast
  { stateCode: 'AS', nameEn: 'Kamrup Metropolitan (Guwahati)', nameBn: 'কামরূপ মহানগর (গুয়াহাটি)', isPopular: true },
  { stateCode: 'AS', nameEn: 'Cachar (Silchar)', nameBn: 'কাছাড় (শিলচর)' },
  { stateCode: 'AS', nameEn: 'Dibrugarh', nameBn: 'ডিব্রুগড়' },
  { stateCode: 'TR', nameEn: 'West Tripura (Agartala)', nameBn: 'পশ্চিম ত্রিপুরা (আগরতলা)', isPopular: true },
  { stateCode: 'SK', nameEn: 'East Sikkim (Gangtok)', nameBn: 'পূর্ব সিকিম (গ্যাংটক)' },

  // Maharashtra
  { stateCode: 'MH', nameEn: 'Mumbai City', nameBn: 'মুম্বাই সিটি', isPopular: true },
  { stateCode: 'MH', nameEn: 'Mumbai Suburban', nameBn: 'মুম্বাই শহরতলি' },
  { stateCode: 'MH', nameEn: 'Pune', nameBn: 'পুনে', isPopular: true },
  { stateCode: 'MH', nameEn: 'Thane', nameBn: 'থানে' },
  { stateCode: 'MH', nameEn: 'Nagpur', nameBn: 'নাগপুর' },

  // Uttar Pradesh
  { stateCode: 'UP', nameEn: 'Lucknow', nameBn: 'লখনউ', isPopular: true },
  { stateCode: 'UP', nameEn: 'Kanpur Nagar', nameBn: 'কানপুর নগর' },
  { stateCode: 'UP', nameEn: 'Varanasi', nameBn: 'বারাণসী' },
  { stateCode: 'UP', nameEn: 'Gautam Buddha Nagar (Noida)', nameBn: 'নয়ডা' },
  { stateCode: 'UP', nameEn: 'Prayagraj', nameBn: 'প্রয়াগরাজ' },

  // Karnataka & South
  { stateCode: 'KA', nameEn: 'Bengaluru Urban', nameBn: 'বেঙ্গালুরু নগর', isPopular: true },
  { stateCode: 'TN', nameEn: 'Chennai', nameBn: 'চেন্নাই', isPopular: true },
  { stateCode: 'TG', nameEn: 'Hyderabad', nameBn: 'হায়দরাবাদ', isPopular: true },
  { stateCode: 'KL', nameEn: 'Thiruvananthapuram', nameBn: 'তিরুবনন্তপুরম' },
  { stateCode: 'GJ', nameEn: 'Ahmedabad', nameBn: 'আহমেদাবাদ', isPopular: true },
  { stateCode: 'RJ', nameEn: 'Jaipur', nameBn: 'জয়পুর', isPopular: true },
];

/**
 * Get districts for a given state code or name
 */
export function getDistrictsForState(stateCodeOrName: string): DistrictItem[] {
  if (!stateCodeOrName || stateCodeOrName === 'ALL' || stateCodeOrName === 'All') {
    return ALL_DISTRICTS_DATA;
  }

  const foundState = ALL_INDIAN_STATES.find(
    (s) =>
      s.code.toLowerCase() === stateCodeOrName.toLowerCase() ||
      s.nameEn.toLowerCase() === stateCodeOrName.toLowerCase() ||
      s.nameBn === stateCodeOrName
  );

  const code = foundState ? foundState.code : stateCodeOrName;
  const filtered = ALL_DISTRICTS_DATA.filter((d) => d.stateCode.toLowerCase() === code.toLowerCase());

  if (filtered.length === 0) {
    // Return standard list with state's headquarter
    return [
      { stateCode: code, nameEn: `${stateCodeOrName} Central`, nameBn: `${stateCodeOrName} সদর` },
      { stateCode: code, nameEn: `${stateCodeOrName} North`, nameBn: `${stateCodeOrName} উত্তর` },
      { stateCode: code, nameEn: `${stateCodeOrName} South`, nameBn: `${stateCodeOrName} দক্ষিণ` },
    ];
  }

  return filtered;
}

import { createContext, useState, useEffect, ReactNode } from 'react';

// Translation definitions
const translations = {
  en: {
    // Navigation
    home: 'Home',
    policies: 'Policies',
    claims: 'Claims',
    dashboard: 'Dashboard',
    login: 'Login',
    
    // Hero Section
    instant_crop_insurance: 'Instant Crop Insurance Claims',
    hero_description: 'Get your drought claims processed in minutes, not months. Powered by AI, blockchain, and real-time weather data.',
    register_farmer: 'Register as Farmer',
    insurer_dashboard: 'Insurer Dashboard',
    farmer_working_field: 'Farmer working in agricultural field',
    
    // Features
    how_it_works: 'How It Works',
    simple_transparent_instant: 'Simple, transparent, and instant crop insurance',
    quick_registration: 'Quick Registration',
    quick_registration_desc: 'Register with your mobile number and link your land documents through blockchain verification',
    ai_powered_claims: 'AI-Powered Claims',
    ai_powered_claims_desc: 'File claims through our AI assistant in your native language - Hindi, English, or Marathi',
    instant_settlement: 'Instant Settlement',
    instant_settlement_desc: 'Get approved claims settled within 24 hours using automated weather data verification',
    
    // Dashboard
    welcome_back: 'Welcome back',
    manage_policies_claims: 'Manage your policies and track your claims',
    next_premium_due: 'Next Premium Due',
    new_claim: 'New Claim',
    active_policies: 'Active Policies',
    total_coverage: 'Total Coverage',
    claims_settled: 'Claims Settled',
    avg_settlement: 'Avg Settlement',
    recent_claims: 'Recent Claims',
    no_active_policies: 'No active policies found',
    buy_policy: 'Buy Policy',
    no_claims_yet: 'No claims filed yet',
    file_first_claim: 'File Your First Claim',
    
    // Claims
    claim: 'Claim',
    filed: 'Filed',
    amount: 'Amount',
    actual_rainfall: 'Actual rainfall',
    settled: 'Settled',
    view_payment: 'View Payment',
    
    // Status
    active: 'Active',
    approved: 'Approved',
    processing: 'Processing',
    rejected: 'Rejected',
    submitted: 'Submitted',
    
    // Policy Details
    coverage: 'Coverage',
    rainfall_threshold: 'Rainfall threshold',
    valid_until: 'Valid until',
    
    // Insurer Dashboard
    insurer_analytics_dashboard: 'Insurer Analytics Dashboard',
    real_time_insights: 'Real-time insights and risk management',
    last_30_days: 'Last 30 Days',
    last_90_days: 'Last 90 Days',
    this_season: 'This Season',
    export_report: 'Export Report',
    total_policies: 'Total Policies',
    from_last_month: 'from last month',
    auto_approval_rate: 'Auto-Approval Rate',
    avg_settlement_time: 'Avg Settlement Time',
    claims_processing_overview: 'Claims Processing Overview',
    interactive_claims_chart: 'Interactive Claims Chart',
    chart_implementation_note: 'Chart.js or similar library implementation needed',
    risk_distribution_region: 'Risk Distribution by Region',
    risk_heat_map: 'Risk Heat Map',
    map_implementation_note: 'Interactive map with risk zones needed',
    claim_id: 'Claim ID',
    farmer: 'Farmer',
    location: 'Location',
    status: 'Status',
    processing_time: 'Processing Time',
    actions: 'Actions',
    view: 'View',
    audit: 'Audit',
    no_recent_claims: 'No recent claims found',
    
    // Payment Tracking
    payment_tracking: 'Payment Tracking',
    track_payments_settlements: 'Track your insurance payments and claim settlements',
    latest_payment_status: 'Latest Payment Status',
    claim_approved: 'Claim Approved',
    ai_verified_conditions: 'AI system verified claim conditions',
    payment_initiated: 'Payment Initiated',
    transfer_started_bank: 'Transfer started to bank account',
    payment_processing: 'Payment Processing',
    bank_processing_transfer: 'Bank is processing the transfer',
    payment_completed: 'Payment Completed',
    amount_credited_account: 'Amount credited to your account',
    bank_account_details: 'Bank Account Details',
    account_number: 'Account Number',
    bank_name: 'Bank Name',
    ifsc_code: 'IFSC Code',
    transaction_id: 'Transaction ID',
    download_receipt: 'Download Receipt',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  
  hi: {
    // Navigation
    home: 'होम',
    policies: 'नीतियां',
    claims: 'दावे',
    dashboard: 'डैशबोर्ड',
    login: 'लॉगिन',
    
    // Hero Section
    instant_crop_insurance: 'तत्काल फसल बीमा दावे',
    hero_description: 'अपने सूखे के दावे महीनों के बजाय मिनटों में संसाधित करवाएं। AI, ब्लॉकचेन और रियल-टाइम मौसम डेटा द्वारा संचालित।',
    register_farmer: 'किसान के रूप में पंजीकरण',
    insurer_dashboard: 'बीमाकर्ता डैशबोर्ड',
    farmer_working_field: 'कृषि क्षेत्र में काम करने वाला किसान',
    
    // Features
    how_it_works: 'यह कैसे काम करता है',
    simple_transparent_instant: 'सरल, पारदर्शी और तत्काल फसल बीमा',
    quick_registration: 'त्वरित पंजीकरण',
    quick_registration_desc: 'अपने मोबाइल नंबर के साथ पंजीकरण करें और ब्लॉकचेन सत्यापन के माध्यम से अपने भूमि दस्तावेज लिंक करें',
    ai_powered_claims: 'AI-संचालित दावे',
    ai_powered_claims_desc: 'अपनी मूल भाषा में हमारे AI सहायक के माध्यम से दावे दर्ज करें - हिंदी, अंग्रेजी या मराठी',
    instant_settlement: 'तत्काल निपटान',
    instant_settlement_desc: 'स्वचालित मौसम डेटा सत्यापन का उपयोग करके 24 घंटों के भीतर अनुमोदित दावों का निपटान करवाएं',
    
    // Dashboard
    welcome_back: 'वापसी पर स्वागत',
    manage_policies_claims: 'अपनी नीतियों का प्रबंधन करें और दावों को ट्रैक करें',
    next_premium_due: 'अगला प्रीमियम देय',
    new_claim: 'नया दावा',
    active_policies: 'सक्रिय नीतियां',
    total_coverage: 'कुल कवरेज',
    claims_settled: 'दावे निपटे',
    avg_settlement: 'औसत निपटान',
    recent_claims: 'हाल के दावे',
    no_active_policies: 'कोई सक्रिय नीति नहीं मिली',
    buy_policy: 'नीति खरीदें',
    no_claims_yet: 'अभी तक कोई दावा दर्ज नहीं',
    file_first_claim: 'अपना पहला दावा दर्ज करें',
    
    // Claims
    claim: 'दावा',
    filed: 'दर्ज',
    amount: 'राशि',
    actual_rainfall: 'वास्तविक वर्षा',
    settled: 'निपटा',
    view_payment: 'भुगतान देखें',
    
    // Status
    active: 'सक्रिय',
    approved: 'अनुमोदित',
    processing: 'संसाधित हो रहा',
    rejected: 'अस्वीकृत',
    submitted: 'प्रस्तुत',
    
    // Policy Details
    coverage: 'कवरेज',
    rainfall_threshold: 'वर्षा सीमा',
    valid_until: 'तक वैध',
    
    // Payment Tracking
    payment_tracking: 'भुगतान ट्रैकिंग',
    track_payments_settlements: 'अपने बीमा भुगतान और दावा निपटान को ट्रैक करें',
    latest_payment_status: 'नवीनतम भुगतान स्थिति',
    claim_approved: 'दावा अनुमोदित',
    ai_verified_conditions: 'AI सिस्टम ने दावा शर्तों को सत्यापित किया',
    payment_initiated: 'भुगतान शुरू',
    transfer_started_bank: 'बैंक खाते में स्थानांतरण शुरू',
    payment_processing: 'भुगतान संसाधन',
    bank_processing_transfer: 'बैंक स्थानांतरण संसाधित कर रहा है',
    payment_completed: 'भुगतान पूर्ण',
    amount_credited_account: 'राशि आपके खाते में जमा',
    bank_account_details: 'बैंक खाता विवरण',
    account_number: 'खाता संख्या',
    bank_name: 'बैंक का नाम',
    ifsc_code: 'IFSC कोड',
    transaction_id: 'लेनदेन ID',
    download_receipt: 'रसीद डाउनलोड करें',
  },
  
  mr: {
    // Navigation
    home: 'मुख्यपृष्ठ',
    policies: 'धोरणे',
    claims: 'दावे',
    dashboard: 'डॅशबोर्ड',
    login: 'लॉगिन',
    
    // Hero Section
    instant_crop_insurance: 'तत्काल पीक विमा दावे',
    hero_description: 'तुमचे दुष्काळ दावे महिन्यांऐवजी मिनिटांत संसाधित करवा. AI, ब्लॉकचेन आणि रियल-टाइम हवामान डेटाद्वारे चालित.',
    register_farmer: 'शेतकरी म्हणून नोंदणी',
    insurer_dashboard: 'विमाकर्ता डॅशबोर्ड',
    farmer_working_field: 'कृषी क्षेत्रात काम करणारा शेतकरी',
    
    // Features
    how_it_works: 'हे कसे कार्य करते',
    simple_transparent_instant: 'सोपे, पारदर्शक आणि तत्काल पीक विमा',
    quick_registration: 'त्वरित नोंदणी',
    quick_registration_desc: 'तुमच्या मोबाइल नंबरसह नोंदणी करा आणि ब्लॉकचेन सत्यापनाद्वारे तुमचे जमीन दस्तऐवज लिंक करा',
    ai_powered_claims: 'AI-चालित दावे',
    ai_powered_claims_desc: 'तुमच्या मूळ भाषेत आमच्या AI सहाय्यकाद्वारे दावे दाखल करा - हिंदी, इंग्रजी किंवा मराठी',
    instant_settlement: 'तत्काल तोडगा',
    instant_settlement_desc: 'स्वयंचलित हवामान डेटा सत्यापन वापरून 24 तासांत मंजूर दावे निकाली काढा',
    
    // Dashboard
    welcome_back: 'परत स्वागत',
    manage_policies_claims: 'तुमच्या धोरणांचे व्यवस्थापन करा आणि दावे ट्रॅक करा',
    next_premium_due: 'पुढील प्रीमियम देय',
    new_claim: 'नवा दावा',
    active_policies: 'सक्रिय धोरणे',
    total_coverage: 'एकूण कव्हरेज',
    claims_settled: 'दावे निकाली',
    avg_settlement: 'सरासरी तोडगा',
    recent_claims: 'अलीकडील दावे',
    no_active_policies: 'कोणती सक्रिय धोरण सापडली नाही',
    buy_policy: 'धोरण खरेदी करा',
    no_claims_yet: 'अजून कोणता दावा दाखल केला नाही',
    file_first_claim: 'तुमचा पहिला दावा दाखल करा',
    
    // Claims
    claim: 'दावा',
    filed: 'दाखल',
    amount: 'रक्कम',
    actual_rainfall: 'वास्तविक पाऊस',
    settled: 'निकाली',
    view_payment: 'पेमेंट पहा',
    
    // Status
    active: 'सक्रिय',
    approved: 'मंजूर',
    processing: 'प्रक्रिया करत आहे',
    rejected: 'नाकारले',
    submitted: 'सादर',
    
    // Policy Details
    coverage: 'कव्हरेज',
    rainfall_threshold: 'पावसाची मर्यादा',
    valid_until: 'पर्यंत वैध',
    
    // Payment Tracking
    payment_tracking: 'पेमेंट ट्रॅकिंग',
    track_payments_settlements: 'तुमचे विमा पेमेंट आणि दावा तोडगा ट्रॅक करा',
    latest_payment_status: 'नवीनतम पेमेंट स्थिती',
    claim_approved: 'दावा मंजूर',
    ai_verified_conditions: 'AI सिस्टमने दावा शर्ती सत्यापित केल्या',
    payment_initiated: 'पेमेंट सुरू',
    transfer_started_bank: 'बँक खात्यात हस्तांतरण सुरू',
    payment_processing: 'पेमेंट प्रक्रिया',
    bank_processing_transfer: 'बँक हस्तांतरण प्रक्रिया करत आहे',
    payment_completed: 'पेमेंट पूर्ण',
    amount_credited_account: 'रक्कम तुमच्या खात्यात जमा',
    bank_account_details: 'बँक खाते तपशील',
    account_number: 'खाते क्रमांक',
    bank_name: 'बँकेचे नाव',
    ifsc_code: 'IFSC कोड',
    transaction_id: 'व्यवहार ID',
    download_receipt: 'पावती डाउनलोड करा',
  },
};

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English if translation not found
    if (!value && language !== 'en') {
      value = translations.en[key as keyof typeof translations.en];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

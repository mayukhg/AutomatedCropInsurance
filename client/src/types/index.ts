// Re-export types from shared schema
export type {
  User,
  InsertUser,
  LandHolding,
  InsertLandHolding,
  Policy,
  InsertPolicy,
  Claim,
  InsertClaim,
  Payment,
  InsertPayment,
  WeatherData,
  InsertWeatherData,
  ChatConversation,
  InsertChatConversation,
  Notification,
  InsertNotification,
  OtpVerification,
  InsertOtpVerification,
} from "@shared/schema";

// Additional frontend-specific types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DashboardStats {
  activePolicies: number;
  totalClaims: number;
  settledClaims: number;
  totalCoverage: number;
  totalSettlementAmount: number;
  autoApprovalRate: number;
  avgSettlementTime: number;
}

export interface ClaimStatusUpdate {
  claimId: number;
  status: string;
  message: string;
  timestamp: string;
}

export interface WeatherAlert {
  id: string;
  type: 'drought' | 'flood' | 'storm';
  severity: 'low' | 'medium' | 'high';
  message: string;
  affectedDistricts: string[];
  validUntil: string;
}

export interface PolicyType {
  id: string;
  name: string;
  premiumPerHectare: number;
  coveragePerHectare: number;
  rainfallThreshold: number;
  settlementTime: number;
  features: string[];
  recommended?: boolean;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  message: string;
  timestamp: string;
  metadata?: {
    step?: string;
    claimId?: number;
    amount?: number;
    error?: boolean;
  };
}

export interface FormErrors {
  [key: string]: string | string[] | undefined;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  current?: boolean;
}

export interface NotificationSettings {
  sms: boolean;
  email: boolean;
  push: boolean;
  whatsapp: boolean;
}

export interface PaymentDetails {
  bankAccount: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountHolderName: string;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  factors: string[];
  confidence: number;
  recommendations: string[];
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  district?: string;
  state?: string;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  darkMode: boolean;
}

export interface LocalStorageKeys {
  currentUser: 'currentUser';
  language: 'language';
  theme: 'theme';
  notifications: 'notifications';
}

// Event types for analytics
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: number;
  timestamp: string;
}

// API endpoints enum
export enum ApiEndpoints {
  // Auth
  SEND_OTP = '/api/auth/send-otp',
  VERIFY_OTP = '/api/auth/verify-otp',
  LOGIN = '/api/users/login',
  REGISTER = '/api/users/register',
  
  // Users
  GET_USER = '/api/users',
  UPDATE_USER = '/api/users',
  
  // Policies
  GET_POLICY_TYPES = '/api/policy-types',
  CREATE_POLICY = '/api/policies',
  GET_FARMER_POLICIES = '/api/policies/farmer',
  
  // Claims
  CREATE_CLAIM = '/api/claims',
  GET_FARMER_CLAIMS = '/api/claims/farmer',
  GET_CLAIM = '/api/claims',
  
  // Chat
  CREATE_CONVERSATION = '/api/chat/conversations',
  SEND_MESSAGE = '/api/chat/conversations',
  GET_CONVERSATION = '/api/chat/conversations',
  
  // Payments
  GET_CLAIM_PAYMENTS = '/api/payments/claim',
  
  // Dashboard
  GET_FARMER_DASHBOARD = '/api/dashboard/farmer',
  GET_INSURER_DASHBOARD = '/api/dashboard/insurer',
  
  // Notifications
  GET_USER_NOTIFICATIONS = '/api/notifications/user',
  MARK_NOTIFICATION_READ = '/api/notifications',
  
  // Weather
  CREATE_WEATHER_DATA = '/api/weather-data',
}

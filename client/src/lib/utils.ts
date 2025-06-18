import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeAgo(date: string | Date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}

export function generateClaimNumber() {
  return `CR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}

export function maskBankAccount(accountNumber: string) {
  if (accountNumber.length <= 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
}

export function validateMobileNumber(mobile: string) {
  const pattern = /^\+?[1-9]\d{9,14}$/;
  return pattern.test(mobile);
}

export function validateAadhaar(aadhaar: string) {
  const pattern = /^\d{12}$/;
  return pattern.test(aadhaar);
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'approved':
    case 'settled':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'initiated':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
    case 'failed':
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'pending':
    case 'submitted':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function calculateClaimAmount(
  coverageAmount: number,
  actualRainfall: number,
  thresholdRainfall: number
) {
  if (actualRainfall >= thresholdRainfall) return 0;
  
  const shortfall = (thresholdRainfall - actualRainfall) / thresholdRainfall;
  return Math.round(coverageAmount * shortfall);
}

export function getWeatherIcon(rainfall: number) {
  if (rainfall === 0) return '☀️';
  if (rainfall < 5) return '🌤️';
  if (rainfall < 15) return '🌦️';
  if (rainfall < 30) return '🌧️';
  return '⛈️';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

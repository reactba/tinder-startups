import { Startup, FundingStage, ContactFormData } from '../../types/startup';

/**
 * Validates if a startup object has all required fields
 */
export function validateStartup(startup: any): startup is Startup {
  const requiredFields = [
    'id',
    'name',
    'description',
    'industry',
    'fundingStage',
    'teamSize',
    'location',
    'videoUrl',
    'contactEmail',
  ];

  return requiredFields.every(
    (field) => startup[field] !== undefined && startup[field] !== null && startup[field] !== ''
  );
}

/**
 * Validates if a funding stage is valid
 */
export function isValidFundingStage(stage: string): stage is FundingStage {
  const validStages: FundingStage[] = [
    'Pre-seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D',
    'IPO',
    'Acquired',
    'Bootstrapped',
  ];

  return validStages.includes(stage as FundingStage);
}

/**
 * Validates contact form data
 */
export function validateContactForm(data: ContactFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.investorName || data.investorName.trim().length < 2) {
    errors.push('Investor name must be at least 2 characters long');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long');
  }

  if (!data.startupId) {
    errors.push('Startup ID is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats team size for display
 */
export function formatTeamSize(size: number): string {
  if (size < 10) return `${size} people`;
  if (size < 100) return `${size}+ people`;
  return `${size}+ employees`;
}

/**
 * Formats funding stage with color coding
 */
export function getFundingStageColor(stage: FundingStage): string {
  const colorMap: Record<FundingStage, string> = {
    'Pre-seed': 'bg-yellow-100 text-yellow-800',
    Seed: 'bg-green-100 text-green-800',
    'Series A': 'bg-blue-100 text-blue-800',
    'Series B': 'bg-purple-100 text-purple-800',
    'Series C': 'bg-indigo-100 text-indigo-800',
    'Series D': 'bg-pink-100 text-pink-800',
    IPO: 'bg-emerald-100 text-emerald-800',
    Acquired: 'bg-gray-100 text-gray-800',
    Bootstrapped: 'bg-orange-100 text-orange-800',
  };

  return colorMap[stage] || 'bg-gray-100 text-gray-800';
}

/**
 * Formats revenue for display
 */
export function formatRevenue(revenue: string): string {
  if (!revenue) return 'Not disclosed';
  return revenue;
}

/**
 * Formats market cap for display
 */
export function formatMarketCap(marketCap: string): string {
  if (!marketCap) return 'Not disclosed';
  return marketCap;
}

/**
 * Truncates text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Formats startup description for card display
 */
export function formatDescription(description: string, maxLength: number = 150): string {
  return truncateText(description, maxLength);
}

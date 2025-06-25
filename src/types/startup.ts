export interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  fundingStage: FundingStage;
  teamSize: number;
  location: string;
  videoUrl: string;
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  foundedYear?: number;
  revenue?: string;
  marketCap?: string;
}

export type FundingStage =
  | 'Pre-seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series D'
  | 'IPO'
  | 'Acquired'
  | 'Bootstrapped';

export interface ContactFormData {
  investorName: string;
  email: string;
  message: string;
  startupId: string;
}

export interface SwipeAction {
  type: 'left' | 'right';
  startupId: string;
  timestamp: Date;
}

export interface StartupCardProps {
  startup: Startup;
  onSwipeLeft: (startupId: string) => void;
  onSwipeRight: (startupId: string) => void;
  isActive: boolean;
}

export interface ContactFormProps {
  startup: Startup;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
}

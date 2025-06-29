import {
  validateStartup,
  isValidFundingStage,
  validateContactForm,
  isValidEmail,
  formatTeamSize,
  getFundingStageColor,
  formatDescription,
} from '../dataValidation';
import { Startup, FundingStage, ContactFormData } from '../../../types/startup';

describe('Data Validation Utils', () => {
  describe('validateStartup', () => {
    it('should return true for valid startup data', () => {
      const validStartup: Startup = {
        id: 'test-1',
        name: 'Test Startup',
        description: 'A test startup',
        industry: 'Technology',
        fundingStage: 'Seed',
        teamSize: 10,
        location: 'San Francisco, CA',
        videoUrl: '/videos/test.mp4',
        contactEmail: 'test@startup.com',
      };

      expect(validateStartup(validStartup)).toBe(true);
    });

    it('should return false for invalid startup data', () => {
      const invalidStartup = {
        id: 'test-1',
        name: 'Test Startup',
        // Missing required fields
      };

      expect(validateStartup(invalidStartup)).toBe(false);
    });
  });

  describe('isValidFundingStage', () => {
    it('should return true for valid funding stages', () => {
      const validStages: FundingStage[] = ['Pre-seed', 'Seed', 'Series A', 'Series B'];

      validStages.forEach((stage) => {
        expect(isValidFundingStage(stage)).toBe(true);
      });
    });

    it('should return false for invalid funding stages', () => {
      const invalidStages = ['Invalid', 'Test', 'Random'];

      invalidStages.forEach((stage) => {
        expect(isValidFundingStage(stage)).toBe(false);
      });
    });
  });

  describe('validateContactForm', () => {
    it('should return valid for correct contact form data', () => {
      const validData: ContactFormData = {
        investorName: 'John Doe',
        email: 'john@example.com',
        message: 'I am interested in investing in your startup',
        startupId: 'startup-1',
      };

      const result = validateContactForm(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid contact form data', () => {
      const invalidData: ContactFormData = {
        investorName: 'J', // Too short
        email: 'invalid-email', // Invalid email
        message: 'Hi', // Too short
        startupId: 'startup-1',
      };

      const result = validateContactForm(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org'];

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid emails', () => {
      const invalidEmails = ['invalid-email', '@example.com', 'test@', 'test.example.com'];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('formatTeamSize', () => {
    it('should format small team sizes correctly', () => {
      expect(formatTeamSize(5)).toBe('5 people');
      expect(formatTeamSize(9)).toBe('9 people');
    });

    it('should format medium team sizes correctly', () => {
      expect(formatTeamSize(15)).toBe('15+ people');
      expect(formatTeamSize(50)).toBe('50+ people');
    });

    it('should format large team sizes correctly', () => {
      expect(formatTeamSize(100)).toBe('100+ employees');
      expect(formatTeamSize(500)).toBe('500+ employees');
    });
  });

  describe('getFundingStageColor', () => {
    it('should return appropriate color classes for funding stages', () => {
      expect(getFundingStageColor('Pre-seed')).toContain('yellow');
      expect(getFundingStageColor('Seed')).toContain('green');
      expect(getFundingStageColor('Series A')).toContain('blue');
    });
  });

  describe('formatDescription', () => {
    it('should truncate long descriptions', () => {
      const longDescription =
        'This is a very long description that should be truncated when it exceeds the maximum length allowed for display purposes';
      const result = formatDescription(longDescription, 50);

      expect(result.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short descriptions', () => {
      const shortDescription = 'Short description';
      const result = formatDescription(shortDescription, 50);

      expect(result).toBe(shortDescription);
    });
  });
});

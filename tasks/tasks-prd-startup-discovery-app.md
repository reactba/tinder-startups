# Task List: Startup Discovery App

Based on PRD: `prd-startup-discovery-app.md`

## Relevant Files

- `src/app/page.tsx` - Main page component containing the swipe interface
- `src/components/SwipeCard.tsx` - Main card component with video and information overlay
- `src/components/ContactForm.tsx` - Modal form component for investor contact
- `src/components/SwipeCard.test.tsx` - Unit tests for SwipeCard component
- `src/components/ContactForm.test.tsx` - Unit tests for ContactForm component
- `src/data/startups.json` - Static data file containing startup information and video URLs
- `src/lib/utils/swipeHelpers.ts` - Utility functions for swipe gesture handling
- `src/lib/utils/swipeHelpers.test.ts` - Unit tests for swipe helper functions
- `src/lib/utils/emailService.ts` - Service for handling email form submissions
- `src/lib/utils/emailService.test.ts` - Unit tests for email service
- `src/types/startup.ts` - TypeScript interfaces for startup data structure
- `public/videos/` - Directory containing startup pitch videos
- `src/app/globals.css` - Global styles including Tailwind CSS imports

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `SwipeCard.tsx` and `SwipeCard.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Video files should be optimized for web delivery (compressed MP4 format recommended).
- The app should be mobile-first with responsive design considerations.

## Tasks

- [x] 1.0 Setup Project Structure and Dependencies
  - [x] 1.1 Initialize Next.js project with TypeScript and Tailwind CSS
  - [x] 1.2 Install required dependencies (react-swipeable, framer-motion, etc.)
  - [x] 1.3 Configure Jest and React Testing Library for testing
  - [x] 1.4 Set up ESLint and Prettier configuration
  - [x] 1.5 Create directory structure (components, lib, types, data)
  - [x] 1.6 Configure Tailwind CSS with custom theme for business context

- [x] 2.0 Create Startup Data Structure and Sample Data
  - [x] 2.1 Define TypeScript interfaces for startup data structure
  - [x] 2.2 Create sample startup data with realistic information
  - [x] 2.3 Add placeholder video URLs for pitch videos
  - [x] 2.4 Validate data structure with TypeScript compilation
  - [x] 2.5 Create utility functions for data validation and formatting

- [x] 3.0 Implement Core SwipeCard Component
  - [x] 3.1 Create basic SwipeCard component structure with video element
  - [x] 3.2 Implement video autoplay and controls functionality
  - [x] 3.3 Add startup information overlay with proper styling
  - [x] 3.4 Implement video loading states and error handling
  - [x] 3.5 Add responsive design for mobile and desktop
  - [x] 3.6 Create smooth animations for card transitions
  - [x] 3.7 Add accessibility features (ARIA labels, keyboard navigation)

- [ ] 4.0 Build Contact Form Modal Component
  - [ ] 4.1 Create modal component with backdrop and close functionality
  - [ ] 4.2 Implement form fields (name, email, message) with validation
  - [ ] 4.3 Add form submission handling and loading states
  - [ ] 4.4 Implement form validation with error messages
  - [ ] 4.5 Add success/error feedback after submission
  - [ ] 4.6 Style modal with professional business design
  - [ ] 4.7 Add keyboard navigation and accessibility features

- [ ] 5.0 Integrate Components and Implement Main Page
  - [ ] 5.1 Create main page layout with proper structure
  - [ ] 5.2 Integrate SwipeCard component into main page
  - [ ] 5.3 Add navigation buttons (left/right) for desktop users
  - [ ] 5.4 Implement card stacking and infinite scrolling logic
  - [ ] 5.5 Add loading states and error boundaries
  - [ ] 5.6 Integrate ContactForm modal with main page
  - [ ] 5.7 Add page title and meta tags for SEO

- [ ] 6.0 Add Swipe Gesture Handling and Navigation
  - [ ] 6.1 Implement touch/swipe gesture detection using react-swipeable
  - [ ] 6.2 Add mouse drag support for desktop users
  - [ ] 6.3 Implement left swipe logic (pass on startup)
  - [ ] 6.4 Implement right swipe logic (open contact form)
  - [ ] 6.5 Add visual feedback during swipe gestures
  - [ ] 6.6 Implement smooth card transitions and animations
  - [ ] 6.7 Add gesture threshold and velocity detection
  - [ ] 6.8 Handle edge cases (no more cards, gesture conflicts)

- [ ] 7.0 Implement Email Service and Form Submission
  - [ ] 7.1 Create email service utility functions
  - [ ] 7.2 Implement form data collection and validation
  - [ ] 7.3 Add email template for startup contact notifications
  - [ ] 7.4 Implement email sending functionality (using EmailJS or similar)
  - [ ] 7.5 Add error handling for email delivery failures
  - [ ] 7.6 Implement rate limiting to prevent spam
  - [ ] 7.7 Add email delivery confirmation and logging

- [ ] 8.0 Add Responsive Design and Mobile Optimization
  - [ ] 8.1 Optimize video loading for mobile devices
  - [ ] 8.2 Implement touch-friendly button sizes and spacing
  - [ ] 8.3 Add mobile-specific gesture handling improvements
  - [ ] 8.4 Optimize typography and spacing for mobile screens
  - [ ] 8.5 Add mobile-specific loading states and animations
  - [ ] 8.6 Implement proper viewport meta tags
  - [ ] 8.7 Test and optimize for various mobile devices and browsers

- [ ] 9.0 Testing and Quality Assurance
  - [ ] 9.1 Write unit tests for SwipeCard component
  - [ ] 9.2 Write unit tests for ContactForm component
  - [ ] 9.3 Write unit tests for utility functions
  - [ ] 9.4 Write integration tests for main page functionality
  - [ ] 9.5 Test swipe gestures on various devices and browsers
  - [ ] 9.6 Test video playback across different browsers
  - [ ] 9.7 Test form submission and email delivery
  - [ ] 9.8 Perform accessibility testing (screen readers, keyboard navigation)
  - [ ] 9.9 Conduct performance testing and optimization
  - [ ] 9.10 Test responsive design on various screen sizes

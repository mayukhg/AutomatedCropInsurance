# CropGuard - Automated Crop Insurance Platform

A revolutionary crop insurance platform that provides instant, transparent, and data-driven insurance settlements using AI, blockchain, and real-time weather data.

## 🌟 Features

- **AI-Powered Claim Processing**: Chat with multilingual AI assistant (English, Hindi, Marathi) to file claims instantly
- **Blockchain Land Verification**: Secure and immutable land ownership verification
- **Real-time Weather Integration**: Automated weather data verification for claim processing
- **Instant Settlements**: Claims processed and settled within 24 hours
- **Mobile-First Design**: Optimized for smartphone users (farmers)
- **Comprehensive Dashboards**: Separate interfaces for farmers and insurers
- **Multilingual Support**: Available in English, Hindi, and Marathi
- **Payment Tracking**: Real-time payment status and tracking
- **Notification System**: SMS and in-app notifications for claim updates

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Query for state management
- Wouter for routing
- i18next for internationalization

**Backend:**
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Real-time notifications
- RESTful API design

**Services:**
- AI Service for natural language processing
- Weather Service for rainfall data
- Blockchain Service for land verification
- Payment Service for automated settlements
- Notification Service for alerts

### Key Components

1. **Farmer Registration & Onboarding**
   - OTP-based mobile verification
   - Aadhaar integration
   - Blockchain land verification

2. **Policy Management**
   - Three tier system: Basic, Premium, Comprehensive
   - Parametric insurance based on rainfall thresholds
   - Flexible coverage options

3. **AI Claim Filing**
   - Conversational interface in native languages
   - Automated verification processes
   - Instant decision making

4. **Payment Processing**
   - Automated claim settlements
   - Bank account integration
   - Payment tracking with timeline

5. **Analytics & Reporting**
   - Real-time insurer dashboard
   - Risk assessment and analytics
   - Audit trails for all transactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crop-insurance-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/cropguard
   
   # Session secret
   SESSION_SECRET=your-secure-session-secret
   
   # API Keys (if needed)
   WEATHER_API_KEY=your-weather-api-key
   SMS_API_KEY=your-sms-api-key
   
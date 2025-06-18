# CropGuard - Automated Crop Insurance Platform

## Overview

CropGuard is a comprehensive automated crop insurance platform that leverages AI, blockchain technology, and real-time weather data to provide instant claim processing and settlements for farmers. The platform supports multilingual interactions and provides both farmer and insurer dashboards for complete insurance lifecycle management.

## Key Features

### Core Functionality
- **Farmer Registration**: Mobile-based OTP verification system
- **AI-Powered Claims**: Multilingual AI assistant (English, Hindi, Marathi) for claim filing
- **Automated Processing**: Real-time weather data integration for claim verification
- **Blockchain Verification**: Land ownership verification through blockchain
- **Instant Settlements**: 24-hour claim settlement with payment tracking
- **Multi-Dashboard**: Separate interfaces for farmers and insurers

### Technical Features
- **Real-time Weather API**: Integration with meteorological services
- **Blockchain Integration**: Land registry verification and transaction recording
- **Payment Gateway**: Secure payment processing with status tracking
- **Notification System**: SMS, email, and in-app notifications
- **Analytics Dashboard**: Claims analytics and performance metrics
- **Mobile Responsive**: Optimized for mobile and desktop usage

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** with shadcn/ui components
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Passport.js** for authentication
- **Express Sessions** with PostgreSQL store
- **WebSocket** support for real-time updates

### Database
- **PostgreSQL** for primary data storage
- **Drizzle Schema** for type-safe database operations
- **Connection pooling** with Neon serverless

### External Services
- **Weather API** integration for rainfall data
- **Blockchain API** for land verification
- **Payment Gateway** integration
- **SMS/Email** services for notifications

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── AIChat.tsx          # AI chat interface
│   │   │   ├── FeaturesSection.tsx # Landing page features
│   │   │   ├── HeroSection.tsx     # Landing page hero
│   │   │   ├── NavigationHeader.tsx # Main navigation
│   │   │   └── NotificationSystem.tsx # Notification center
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   ├── useTranslation.ts   # Internationalization hook
│   │   │   ├── use-toast.ts        # Toast notification hook
│   │   │   └── use-mobile.tsx      # Mobile detection hook
│   │   ├── lib/            # Utility libraries
│   │   │   ├── queryClient.ts      # TanStack Query configuration
│   │   │   ├── i18n.tsx           # Internationalization setup
│   │   │   └── utils.ts           # Common utility functions
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Registration.tsx    # Farmer registration
│   │   │   ├── PolicySelection.tsx # Insurance policy selection
│   │   │   ├── ClaimFiling.tsx    # Claim filing interface
│   │   │   ├── FarmerDashboard.tsx # Farmer dashboard
│   │   │   ├── InsurerDashboard.tsx # Insurer dashboard
│   │   │   ├── PaymentTracking.tsx # Payment status tracking
│   │   │   └── not-found.tsx      # 404 error page
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── services/           # Business logic services
│   │   ├── aiService.ts           # AI chat and processing
│   │   ├── blockchainService.ts   # Blockchain integration
│   │   ├── weatherService.ts      # Weather data handling
│   │   ├── paymentService.ts      # Payment processing
│   │   └── notificationService.ts # Notification management
│   ├── db.ts              # Database connection setup
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API route definitions
│   ├── index.ts           # Server entry point
│   └── vite.ts            # Vite development server setup
├── shared/                 # Shared code between client and server
│   └── schema.ts          # Database schema and types
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## Database Schema

### Core Tables
- **users**: Farmer and insurer account information
- **land_holdings**: Farm land details and ownership records
- **policies**: Insurance policy information and coverage
- **claims**: Insurance claim records and processing status
- **payments**: Payment transactions and settlement records
- **weather_data**: Historical and real-time weather information
- **chat_conversations**: AI chat interaction history
- **notifications**: User notification records
- **otp_verification**: Mobile number verification records
- **audit_log**: System audit trail for compliance

### Key Relationships
- Users have multiple land holdings
- Land holdings can have multiple policies
- Policies can have multiple claims
- Claims have associated payments
- Weather data is linked to geographic locations
- Chat conversations are tied to specific farmers

## API Endpoints

### Authentication
- `POST /api/register` - Register new farmer account
- `POST /api/verify-otp` - Verify mobile number with OTP
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Farmer Operations
- `GET /api/farmers/:id` - Get farmer profile
- `PUT /api/farmers/:id` - Update farmer profile
- `GET /api/farmers/:id/policies` - Get farmer's policies
- `GET /api/farmers/:id/claims` - Get farmer's claims
- `GET /api/farmers/:id/dashboard` - Get dashboard data

### Policy Management
- `GET /api/policies` - List available policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/:id` - Get policy details
- `PUT /api/policies/:id` - Update policy

### Claim Processing
- `POST /api/claims` - File new claim
- `GET /api/claims/:id` - Get claim details
- `PUT /api/claims/:id/process` - Process claim automatically
- `GET /api/claims` - List all claims (insurer)

### AI and Weather
- `POST /api/ai/chat` - AI chat interaction
- `GET /api/weather/data` - Get weather data
- `POST /api/weather/update` - Update weather information

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/:id/status` - Check payment status
- `POST /api/payments/webhook` - Payment gateway webhook

## Environment Variables

### Required
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=localhost
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name

# Session
SESSION_SECRET=your-session-secret-key

# External APIs (Optional - uses mock data if not provided)
WEATHER_API_KEY=your-weather-api-key
BLOCKCHAIN_API_KEY=your-blockchain-api-key
PAYMENT_GATEWAY_KEY=your-payment-gateway-key
SMS_API_KEY=your-sms-api-key
EMAIL_API_KEY=your-email-api-key
```

### Development
```env
NODE_ENV=development
PORT=5000
```

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cropguard-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:5000 in your browser
   - The backend API runs on the same port

## Development Workflow

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Consistent naming conventions
- Comprehensive error handling
- Type-safe database operations

### Testing Strategy
- Component testing with React Testing Library
- API endpoint testing with Supertest
- Database testing with test database
- Integration testing for complete workflows

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database
- Set up SSL certificates
- Configure external API keys
- Set up monitoring and logging

### Scaling Considerations
- Database connection pooling
- Caching layer for frequent queries
- Load balancing for multiple instances
- CDN for static assets
- Background job processing

## Features Deep Dive

### AI-Powered Claim Filing
The AI service processes farmer queries in multiple languages and automatically:
- Extracts claim information from natural language
- Validates claim eligibility
- Initiates weather data verification
- Provides confidence scores for automated approval

### Blockchain Land Verification
The blockchain service handles:
- Land ownership verification against government records
- Smart contract execution for automated payouts
- Immutable transaction recording
- Fraud prevention through cryptographic validation

### Weather Data Integration
Real-time weather processing:
- Meteorological data from multiple sources
- Historical rainfall pattern analysis
- Drought risk assessment
- Automated claim trigger conditions

### Payment Processing
Comprehensive payment system:
- Multiple payment gateway support
- Instant settlement capabilities
- Transaction status tracking
- Refund and dispute handling

## Security Features

### Data Protection
- Encrypted database connections
- Secure session management
- API rate limiting
- Input validation and sanitization

### Authentication
- Mobile OTP verification
- Session-based authentication
- Role-based access control
- Audit logging for compliance

### Privacy
- GDPR compliant data handling
- Minimal data collection
- Secure data transmission
- Regular security audits

## Monitoring and Analytics

### Application Metrics
- Response time monitoring
- Error rate tracking
- Database performance
- API usage statistics

### Business Metrics
- Claim processing times
- Settlement success rates
- Farmer satisfaction scores
- Fraud detection rates

## Support and Maintenance

### Regular Tasks
- Database backup and maintenance
- Security patch updates
- Performance optimization
- Feature updates based on user feedback

### Troubleshooting
- Comprehensive logging system
- Error tracking and alerting
- Performance monitoring
- User support ticketing

## Contributing

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Document new features
- Follow git commit conventions

### Code Review Process
- Feature branch workflow
- Peer code review required
- Automated testing pipeline
- Security review for sensitive changes

## License

This project is proprietary software developed for crop insurance automation. All rights reserved.

## Contact

For technical support or business inquiries, please contact the development team.

---

**Note**: This platform uses mock data for external services when API keys are not provided. For production deployment, ensure all external service integrations are properly configured with valid credentials.
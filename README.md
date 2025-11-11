# 🌾 Farmer Advisory App

A comprehensive web-based platform designed to empower farmers and agricultural communities with AI-driven insights, personalized recommendations, and essential resources to optimize farming practices.


[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Overview

The Farmer Advisory App addresses critical challenges faced by farmers including lack of personalized farming advice, limited access to weather information, difficulty in pest identification, and poor awareness of government agricultural schemes. Our platform leverages AI technology and real-time data to provide actionable guidance directly to farming communities.

### 🎯 Target Audience
- Small to medium-scale farmers
- Agricultural extension workers
- Rural farming communities

## ✨ Key Features

### 🌱 Core Functionality
- **AI-Powered Crop Recommendations** - Personalized suggestions based on soil conditions, weather patterns, and regional data
- **Weather Alerts & Forecasting** - Real-time weather updates with location-specific agricultural alerts
- **Pest & Disease Diagnosis** - Image-based identification system with treatment recommendations
- **Government Schemes Directory** - Comprehensive database of agricultural subsidies and programs
- **Community Forum** - Interactive platform for farmers to share experiences and seek advice
- **Multilingual Support** - Content available in Hindi, Marathi, Tamil, and other regional languages
- **AI Chatbot** - Intelligent assistant for instant farm-related queries and guidance
- **Farm Analytics Dashboard** - Visual insights on farm data, weather trends, and recommendation history
- **Resource Library** - Educational content including best practices and tutorials

### 🔐 Security Features
- Row-Level Security (RLS) policies on all sensitive data
- Secure authentication system with email verification
- Protected personal information (email, phone, location data)
- Encrypted GPS coordinates for farm locations
- Password leak protection enabled

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### Backend & Cloud
- **Lovable Cloud** - Full-stack backend platform powered by Supabase
- **PostgreSQL** - Robust relational database
- **Edge Functions** - Serverless backend logic
- **Storage Buckets** - Secure file storage for pest diagnosis images

### AI & APIs
- **OpenAI GPT-4** - Crop recommendations and chatbot
- **Google Gemini** - Image analysis for pest diagnosis
- **OpenWeather API** - Real-time weather data
- **Google Translate API** - Multilingual content translation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

The project uses Lovable Cloud which automatically provides:
- Database connection
- Authentication setup
- Storage buckets
- Edge functions deployment

Environment variables are managed automatically via `.env` (auto-generated):
```bash
VITE_SUPABASE_URL=<auto-provided>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-provided>
VITE_SUPABASE_PROJECT_ID=<auto-provided>
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── landing/        # Landing page sections
│   └── ui/             # Reusable UI components (shadcn)
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── ChatbotContext.tsx # Chatbot state
│   └── LanguageContext.tsx # i18n support
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
│   └── supabase/       # Database client & types
├── lib/                # Utility functions
├── pages/              # Route pages
├── services/           # API service layers
└── main.tsx           # Application entry point

supabase/
├── functions/          # Edge functions
│   ├── chat/          # AI chatbot endpoint
│   ├── crop-recommendation/ # Crop advice AI
│   ├── pest-diagnosis/ # Image analysis AI
│   └── weather/       # Weather data API
└── migrations/        # Database migrations
```

## 🎨 Development

### Code Style
- Uses ESLint for code quality
- Tailwind CSS with semantic design tokens
- TypeScript strict mode enabled
- Component-based architecture

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Deploy via Lovable (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/caf03530-ce64-42fa-9dfd-80c249d1dfa3)
2. Click **Share** → **Publish**
3. Click **Update** to deploy frontend changes

**Note:** Backend changes (Edge Functions, database migrations) deploy automatically.

### Custom Domain
Connect your own domain via Project → Settings → Domains in Lovable.

[Learn more about custom domains](https://docs.lovable.dev/features/custom-domain)

## 🔧 Configuration

### Authentication Settings
- Email/password authentication enabled
- Auto-confirm email signups: Enabled (for development)
- Password leak protection: Enabled

### Database
- Row-Level Security (RLS) enabled on all tables
- Automated profile creation on user signup
- Secure storage policies for pest diagnosis images

### API Keys Required
The following secrets are configured in Lovable Cloud:
- `OPENWEATHER_API_KEY` - Weather data
- `LOVABLE_API_KEY` - AI features (automatic)

## 📱 Features by Page

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | App overview and features |
| Dashboard | `/dashboard` | User home with weather, activities, and quick actions |
| Recommendations | `/recommendations` | AI crop recommendations |
| Weather | `/weather` | Weather forecasts and alerts |
| Pest Diagnosis | `/pest-diagnosis` | Image-based pest identification |
| Government Schemes | `/schemes` | Browse and bookmark schemes |
| Community | `/community` | Discussion forums |
| Analytics | `/analytics` | Farm performance metrics |
| Profile | `/profile` | User settings and preferences |

## 🤝 Contributing

This project uses bidirectional GitHub sync with Lovable:

1. **Via Lovable Editor**
   - Visit the [Lovable Project](https://lovable.dev/projects/caf03530-ce64-42fa-9dfd-80c249d1dfa3)
   - Changes automatically commit to GitHub

2. **Via Local Development**
   - Make changes in your IDE
   - Commit and push to GitHub
   - Changes automatically sync to Lovable

3. **Via GitHub UI**
   - Edit files directly on GitHub
   - Changes sync to Lovable automatically

## 🐛 Debugging

The app includes comprehensive error handling:
- Error boundaries for React components
- Console logging available in browser DevTools
- Network request monitoring
- Real-time database query logging

## 📚 Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)
- [Lovable AI Features](https://docs.lovable.dev/features/ai)
- [Project Settings](https://lovable.dev/projects/caf03530-ce64-42fa-9dfd-80c249d1dfa3)

## 📄 License

This project is built with [Lovable](https://lovable.dev) - the world's first AI full-stack engineer.

## 🙋 Support

- [Lovable Community Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- [YouTube Tutorial Playlist](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)
- [Lovable Documentation](https://docs.lovable.dev/)

---

**Built with ❤️ using Lovable - Empowering farmers with AI-driven agricultural insights**

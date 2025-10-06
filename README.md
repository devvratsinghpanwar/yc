# YC Startup Platform 🚀

A modern startup pitch platform inspired by Y Combinator, where entrepreneurs can submit ideas, connect with other founders, and get noticed through virtual competitions. Built with Next.js 15, Supabase authentication, and Sanity CMS for content management.

## 🌟 Project Overview

The YC Startup Platform is a comprehensive web application that enables entrepreneurs to:
- **Submit startup pitches** with rich markdown descriptions
- **Browse and discover** innovative startups across various categories
- **Connect with entrepreneurs** and view their profiles
- **Engage with content** through an intelligent recommendation system
- **Secure authentication** using email/password via Supabase

## 🎯 Key Features

### Core Functionality
- **📝 Startup Pitch Submission**: Rich markdown editor with image support
- **🔍 Advanced Search**: Search across titles, categories, and authors
- **👤 User Profiles**: Comprehensive author pages with their startup portfolio
- **📊 Smart Recommendations**: Category-based content discovery
- **🔐 Secure Authentication**: Email/password with proper session management
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS

### Content Management
- **🏢 Sanity CMS Integration**: Headless CMS for content management
- **🖼️ Image Handling**: Support for both URL and uploaded images
- **📈 View Tracking**: Automatic view counting for startups
- **👍 Upvoting System**: Community-driven content rating
- **🏷️ Category System**: Organized content discovery

## 🔧 Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Lucide React** - Modern icon library

### Backend & Data
- **Supabase** - Authentication, real-time database
- **Sanity CMS** - Headless content management
- **GROQ** - Graph-oriented query language for Sanity

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Supabase account
- Sanity account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration (from Supabase Dashboard > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Sanity Configuration (from Sanity Dashboard > Settings)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-13
SANITY_API_WRITE_TOKEN=your_sanity_write_token
```

#### Where to Get Environment Variables:

**Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

**Sanity:**
1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project
3. Get Project ID from Settings > General
4. Generate API token from Settings > API Tokens

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/devvratsinghpanwar/yc.git
cd yc
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up Supabase**
   - Create a new Supabase project
   - The authentication schema will be automatically handled by Supabase Auth
   - User profiles are synced to Sanity CMS automatically upon registration

4. **Set up Sanity CMS**
```bash
# Generate TypeScript types from Sanity schemas
npm run typegen

# Start Sanity Studio (optional, for content management)
cd studio-yc && npm run dev
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Architecture

### High-Level Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Authentication │    │   Content       │
│   (Next.js)     │◄──►│   (Supabase)     │    │   (Sanity CMS)  │
│                 │    │                  │    │                 │
│ • User Interface│    │ • User Sessions  │    │ • Startup Data  │
│ • Search/Filter │    │ • Email/Password │    │ • Author Profiles│
│ • Recommendations│   │ • Registration   │    │ • Categories    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Low-Level Architecture

#### Frontend Layer (`app/` directory)
```
app/
├── (root)/                 # Main application routes
│   ├── page.tsx           # Homepage with search and recommendations
│   ├── startup/[id]/      # Individual startup pages
│   └── user/[id]/         # User profile pages
├── login/                 # Authentication pages
├── api/                   # API routes (currently minimal)
└── globals.css           # Global styles
```

#### Component Layer (`components/` directory)
```
components/
├── ui/                    # Reusable UI components (buttons, inputs, etc.)
├── StartupCard.tsx        # Startup display component
├── StartupForm.tsx        # Pitch submission form
├── Navbar.tsx             # Navigation component
├── SearchForms.tsx        # Search functionality
└── TopStartupsByCategory.tsx # Recommendation component
```

#### Data Layer
```
├── lib/
│   ├── actions.ts         # Server actions for CRUD operations
│   ├── validation.ts      # Form validation schemas
│   └── utils.ts          # Utility functions
├── sanity/
│   ├── schemaTypes/      # Content type definitions
│   ├── lib/              # Sanity client configuration
│   └── queries.ts        # GROQ queries
└── utils/supabase/       # Supabase client configuration
```

## 🧠 Recommendation System

### Algorithm Overview

The platform implements a **category-based content discovery system** with the following components:

#### 1. **Top Picks by Category**
```typescript
// Algorithm: Multi-factor ranking
const rankingFactors = {
  upvotes: 0.5,        // 50% weight - community engagement
  views: 0.3,          // 30% weight - popularity
  recency: 0.2         // 20% weight - freshness
}

// Implementation in TopStartupsByCategory.tsx
categoryStartups.sort((a, b) => {
  if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
  if (b.views !== a.views) return b.views - a.views;
  return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
});
```

#### 2. **Category Discovery Process**
1. **Data Aggregation**: System scans all startups and groups by category
2. **Popularity Calculation**: Counts startups per category to identify trending sectors
3. **Top Selection**: Selects top 3 categories by startup volume
4. **Quality Filtering**: Within each category, ranks by engagement metrics

#### 3. **Query Implementation**
```groq
// GROQ query for recommendation data
{
  "categories": *[_type == "startup" && defined(category)] | {
    "category": category,
    "count": count(*[_type == "startup" && category == ^.category])
  } | order(count desc) [0...3],
  
  "startups": *[_type == "startup"] | order(upvotes desc, views desc, _createdAt desc) {
    // ... startup fields
  }
}
```

#### 4. **Recommendation Features**
- **Trend Detection**: Identifies emerging categories
- **Quality Assurance**: Promotes highly-rated content
- **Diversity**: Ensures representation across different sectors
- **Freshness**: Balances popular content with recent submissions

#### 5. **Future Enhancements**
The current system is designed to be extensible for:
- **User-based Collaborative Filtering**: Recommendations based on user behavior
- **Content-based Filtering**: Similar startup suggestions
- **Machine Learning Integration**: AI-powered personalization
- **A/B Testing Framework**: Optimization of recommendation algorithms

## 📊 Data Models

### Supabase (Authentication)
```typescript
// User Profile (automatically managed)
interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    username: string;
  };
}
```

### Sanity CMS Schemas

#### Startup Schema
```typescript
interface Startup {
  _id: string;
  title: string;
  slug: { current: string };
  author: Reference<Author>;
  description: string;
  category: string;
  image?: string;           // URL image
  imageAsset?: ImageAsset;  // Uploaded image
  pitch: string;            // Markdown content
  views: number;
  upvotes: number;
  upvotedBy: Reference<Author>[];
  _createdAt: string;
}
```

#### Author Schema
```typescript
interface Author {
  _id: string;              // Matches Supabase User ID
  name: string;
  username: string;
  email: string;
  image?: ImageAsset;
  bio?: string;
}
```

## 🔐 Authentication Flow

### Registration Process
1. **User submits** registration form with name, username, email, password
2. **Supabase creates** user account with metadata
3. **System automatically** creates corresponding Author document in Sanity
4. **Email verification** sent (optional, based on Supabase settings)
5. **User can immediately** start creating pitches

### Session Management
- **Server-side sessions** using Supabase SSR
- **Automatic token refresh** 
- **Secure cookie handling**
- **Route protection** via middleware

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Pink primary, complementary neutral tones
- **Typography**: Work Sans font family with semantic sizing
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, reusable component library

### Responsive Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🧪 Development

### Code Structure
- **TypeScript**: Strict type checking enabled
- **Server Actions**: Modern Next.js data mutations
- **Client Components**: Minimal client-side JavaScript
- **Error Boundaries**: Graceful error handling

### Build Process
```bash
# Type generation from Sanity schemas
npm run typegen

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Setup for Production
- Ensure all environment variables are set
- Configure Supabase production settings
- Set up Sanity production dataset
- Configure custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Roadmap

- [ ] **AI-Powered Recommendations**: Machine learning-based content suggestions
- [ ] **Real-time Collaboration**: Live editing and commenting
- [ ] **Advanced Analytics**: Detailed startup performance metrics
- [ ] **Mobile App**: React Native mobile application
- [ ] **Integration APIs**: Third-party service integrations
- [ ] **Monetization Features**: Premium features and subscriptions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/devvratsinghpanwar/yc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/devvratsinghpanwar/yc/discussions)
- **Email**: [your-email@example.com]

---

**Built with ❤️ by [Devvrat Singh Panwar](https://github.com/devvratsinghpanwar)**

# Fire Homes 🏠

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.x-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Overview

**Fire Homes** is a **full-stack real estate property listing platform** that allows **users to search, favorite, and manage property listings**. It solves the problem of **connecting property seekers with available listings** through a **modern, responsive web application** with robust authentication and admin capabilities.

This project demonstrates **production-ready patterns** including JWT-based authentication with automatic token refresh, role-based access control, server-side rendering, and clean separation between client and server concerns.

**[Live Demo →](https://firebase-nextjs-course.vercel.app)**

## 🛠 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Core** | TypeScript 5, React 19, Next.js 16 (App Router) |
| **Backend** | Firebase Admin SDK, Next.js Server Actions, Edge Middleware |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth, JWT (jose), HTTP-only Cookies |
| **UI Framework** | Tailwind CSS 4, shadcn/ui, Radix UI Primitives |
| **Forms** | React Hook Form, Zod validation |
| **Infrastructure** | Vercel (deployment), Firebase (BaaS) |

## ✨ Key Features

### Authentication & Security
- **JWT-based stateless authentication** with HTTP-only cookies for XSS protection
- **Automatic token refresh** via middleware when tokens approach expiration
- **Role-based access control** separating admin and regular user permissions
- **Protected routes** using Next.js middleware on Edge runtime

### Property Management (Admin)
- **Full CRUD operations** for property listings with server actions
- **Multi-image upload** with drag-and-drop reordering
- **Property status management** (draft, for-sale, withdrawn, sold)
- **Admin dashboard** with property table and quick actions

### User Features
- **Advanced property search** with filters (price range, bedrooms, bathrooms, status)
- **Pagination** for scalable listing browsing
- **Favorites system** allowing users to save and manage preferred properties
- **Account management** with password updates and account deletion

### Developer Experience
- **Type-safe** end-to-end with TypeScript and Zod schemas
- **Server Components** for optimal performance and SEO
- **Intercepting routes** for modal-based login flow
- **Loading states** with Suspense boundaries

## 🏗 Architecture & Design Decisions

### Why Next.js 16 App Router over Pages Router?
The App Router provides **React Server Components** by default, enabling data fetching at the component level without client-side waterfalls. This results in faster initial page loads and better SEO. Server Actions eliminate the need for API routes for mutations, reducing boilerplate.

### Why Firebase over a traditional backend?
Firebase provides **serverless infrastructure** that scales automatically without DevOps overhead. The combination of Firestore (NoSQL) and Firebase Auth offers:
- Real-time sync capabilities (ready for future features)
- Built-in user management and security rules
- Generous free tier for development and small-scale production

### Why JWT in cookies over Firebase session cookies?
While Firebase offers session cookies, managing JWTs directly provides:
- **Fine-grained control** over token lifecycle
- **Custom claims** for role-based access (admin flag)
- **Middleware compatibility** with Edge runtime (Firebase Admin SDK doesn't work on Edge)

### Authentication Flow
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Client    │────▶│  Middleware  │────▶│  Server Action  │
│  (Browser)  │     │   (Edge)     │     │  (Node.js)      │
└─────────────┘     └──────────────┘     └─────────────────┘
       │                   │                      │
       │ JWT Cookie        │ Decode & Check       │ Verify with
       │                   │ Expiration           │ Firebase Admin
       │                   │                      │
       ▼                   ▼                      ▼
  ┌─────────┐        ┌──────────┐         ┌─────────────┐
  │ Storage │        │ Redirect │         │  Firestore  │
  │ (Cookie)│        │ if needed│         │   Access    │
  └─────────┘        └──────────┘         └─────────────┘
```

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Auth pages (login, register, forgot-password)
│   ├── account/             # User account & favorites
│   ├── admin-dashboard/     # Admin property management
│   ├── api/                 # API routes (token refresh)
│   ├── property/            # Individual property pages
│   └── property-search/     # Search with filters & pagination
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── *.tsx                # Feature components
├── firebase/
│   ├── client.ts            # Client-side Firebase initialization
│   └── server.ts            # Server-side Firebase Admin
├── context/                 # React Context providers
├── validation/              # Zod schemas
└── middleware.ts            # Auth & route protection
```

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- Firebase project with Firestore and Authentication enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/lubmir2k/firebase-nextjs-course.git
cd firebase-nextjs-course

# Install dependencies
npm install

# Setup environment variables
cp env.local.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Client-side Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server-side Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

## 🧪 Development

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🚀 Deployment

This project is configured for deployment on **Vercel**. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions including:

- Environment variable configuration
- Firebase authorized domains setup
- Troubleshooting common issues

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lubmir2k/firebase-nextjs-course)

## 🗺 Roadmap

- [x] Email/password authentication with JWT
- [x] Property CRUD with multi-image upload
- [x] Advanced search with filters and pagination
- [x] User favorites system
- [x] Admin dashboard with role-based access
- [x] Account management (password update, deletion)
- [x] Vercel deployment with environment configuration
- [x] Google OAuth authentication
- [ ] Property image optimization with next/image
- [ ] Real-time property updates with Firestore listeners
- [ ] Email notifications for favorites
- [ ] Map integration for property locations

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using [Next.js](https://nextjs.org), [Firebase](https://firebase.google.com), and [Tailwind CSS](https://tailwindcss.com)

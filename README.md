# Band of Bakers

A modern, full-stack bakery e-commerce platform built with Next.js, TypeScript, and Cloudflare infrastructure.

## 🌟 Features

- **Product Management**: Full CRUD operations for bakery products with variants
- **Bake Sale Events**: Schedule and manage bake sale events with location support
- **Order System**: Support for both delivery and collection fulfillment methods
- **Customer Reviews & Testimonials**: Moderated user-generated content
- **Admin Dashboard**: Comprehensive admin panel for managing all aspects
- **Type-Safe Forms**: React Hook Form + Zod validation across all forms
- **Responsive Design**: Mobile-first UI with design tokens and theming

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
  -Cloudflare account (for deployment)
- Wrangler CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bandofbakers-v2

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Database Setup

```bash
# Run database migrations (local D1)
pnpm wrangler d1 migrations apply band-of-bakers-db --local

# Seed database (optional)
npx tsx scripts/seed.ts
```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (admin)/      # Admin dashboard routes
│   ├── (shop)/       # Customer-facing routes
│   └── api/          # API routes (future)
├── components/       # Reusable React components
│   ├── ui/           # Shadcn UI primitives
│   ├── admin/        # Admin-specific components
│   └── state/        # State-related components
├── lib/              # Business logic and utilities
│   ├── validators/   # Zod validation schemas
│   ├── constants/    # Application constants
│   ├── mocks/        # Mock data for development
│   └── utils/        # Helper functions
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── db/               # Database configuration
└── types/            # TypeScript type definitions
```

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Forms**: React Hook Form + Zod
- **State**: React Context + Local State

### Infrastructure (Phase 4)

- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Auth**: Cloudflare Access
- **Deployment**: Cloudflare Pages

### Development

- **Linting**: ESLint + Next.js rules
- **Formatting**: Prettier
- **Package Manager**: pnpm
- **Dev Tools**: Wrangler CLI

## 📝 Development Workflow

### Running Locally

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Working with Database

```bash
# Create migration
pnpm wrangler d1 migrations create band-of-bakers-db <migration-name>

# Apply migrations (local)
pnpm wrangler d1 migrations apply band-of-bakers-db --local

# Apply migrations (remote)
pnpm wrangler d1 migrations apply band-of-bakers-db --remote

# Query database
pnpm wrangler d1 execute band-of-bakers-db --local --command "SELECT * FROM products"
```

## 🎨 Design System

The application uses a custom design system with:

- Design tokens in `lib/design-tokens.ts`
- Shadcn UI components in `components/ui/`
- Responsive breakpoints and spacing scales
- Color palette optimized for bakery aesthetic

## 📐 Architecture

### Validation Layer

All forms use Zod schemas for type-safe validation:

- Client-side validation with React Hook Form
- Server-side validation ready (Phase 4)
- Shared schemas between client and server
- Type inference from schemas

### Form Patterns

- Standard inputs: `register()` from useForm
- Custom components: `Controller` for WYSIWYG, Select, etc.
- Reusable submission logic: `useFormSubmission` hook
- Consistent error display patterns

### Data Flow (Current - Phase 3)

```
Components → Mock Data → UI
```

### Data Flow (Future - Phase 4)

```
Components → Server Actions → D1 Database
           → API Routes    → R2 Storage
```

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## 🚢 Deployment

### Cloudflare Pages

```bash
# Build and deploy
pnpm wrangler pages deploy

# Deploy with environment
pnpm wrangler pages deploy --branch=production
```

### Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - D1 database connection
- `R2_BUCKET` - R2 storage bucket
- `NEXT_PUBLIC_*` - Public environment variables

## validation Coverage

- ✅ Authentication (login, signup)
- ✅ News posts (create, update)
- ✅ Testimonials (create, approve)
- ✅ Reviews (create, approve)
- ✅ Products (create with variants)
- ✅ Bake Sales (schedule events)
- ✅ Orders (checkout, collection)
- ✅ User profiles (settings)

All major entities have comprehensive Zod schemas with type exports.

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Detailed architecture documentation
- [Validation Guide](./docs/FORM_VALIDATION_INTEGRATION_GUIDE.md) - Form validation patterns
- [Spec](./SPEC.md) - Product specification and requirements
- [Phase Planning](./project-phases.md) - Development phases

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure linting and type-checking pass
4. Submit a pull request

### Code Standards

- TypeScript strict mode enforced
- ESLint + Prettier for code quality
- Component files: PascalCase or kebab-case
- Utility files: kebab-case
- No magic values - use constants
- Comprehensive JSDoc for complex functions

## 📄 License

[License information]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Cloudflare](https://www.cloudflare.com/)

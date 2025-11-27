# Explanation

Conceptual documentation that explains the "why" behind Band of Bakers v2. These documents help you understand the reasoning, architecture, and design decisions.

## Project Overview

- **[Project Overview](project-overview.md)** - Comprehensive review of the Band of Bakers v2 planning and development approach

## Architecture & Design

Located in the `architecture-and-design/` subdirectory:

### Technical Architecture

- **[Architecture Overview](architecture-and-design/architecture-overview.md)** - Complete technical architecture and infrastructure decisions
- **[Deployment Strategy](architecture-and-design/deployment-strategy.md)** - Multi-environment deployment approach and procedures

### User Experience Design

- **[Customer UX Journey](architecture-and-design/CUSTOMER_UX_JOURNEY.md)** - Complete customer experience flows and user journeys
- **[Admin UX Guide](architecture-and-design/ADMIN_UX_GUIDE.md)** - Admin dashboard and operations user experience

### Features & Functionality

- **[Features Guide](architecture-and-design/FEATURES_GUIDE.md)** - Advanced feature specifications and capabilities
- **[SEO Optimization Guide](architecture-and-design/SEO_OPTIMIZATION_GUIDE.md)** - SEO strategy and implementation approach
- **[WCAG Accessibility Guide](architecture-and-design/WCAG_ACCESSIBILITY_GUIDE.md)** - WCAG 2.1 AA compliance guide and standards

### Business Logic

- **[Bake Sale Date Requirement](architecture-and-design/BAKE_SALE_DATE_REQUIREMENT.md)** - Core business logic for the bake sale model

## Understanding the "Why"

### Development Philosophy

- **Mock-First Development**: Why we build UI with mocks before backend integration
- **10-Phase Methodology**: The reasoning behind our structured development approach
- **Cloudflare-First Architecture**: Why we chose Cloudflare D1, Workers, and Pages

### Business Model

- **Bake Sale Model**: Understanding the unique pre-order, date-specific bakery model
- **Local-First Approach**: Why we prioritize local ingredients and community
- **Sustainability Focus**: Environmental considerations in bakery operations

### Technical Decisions

- **Next.js 15.5**: Why this specific version and webpack over turbopack
- **Drizzle ORM**: Database abstraction and type safety benefits
- **Zod Validation**: Runtime type checking and validation strategy
- **Tailwind + Shadcn**: Component library and styling approach

## Key Concepts

### Bake Sale Business Model

The core differentiator of Band of Bakers is the **bake sale date requirement**:

- Customers must select a specific bake sale date before adding items to cart
- Each order can only contain items from one bake sale date
- Cutoff times prevent last-minute changes
- Location assignment ensures proper fulfillment

### Development Methodology

- **Phase 0-2**: Planning, foundation, and data layer setup
- **Phase 3-4**: UI development with mock data (parallel frontend/backend work)
- **Phase 5-6**: Authentication and backend integration
- **Phase 7-10**: Testing, performance, deployment, and launch

### Architecture Principles

- **Edge Computing**: Cloudflare Workers for global performance
- **Type Safety**: TypeScript + Zod for runtime validation
- **Mock-Driven Development**: Frontend/backend parallel development
- **Security First**: Built-in authentication, CSRF protection, and rate limiting

## Learning Objectives

After reading these documents, you should understand:

- The business model and unique value proposition
- Technical architecture decisions and trade-offs
- Development methodology and project structure
- User experience philosophy and design principles
- Performance and scalability considerations

Each explanation document includes:

- Background and context
- Design decisions and alternatives considered
- Implementation approach
- Future considerations
- Related documentation links

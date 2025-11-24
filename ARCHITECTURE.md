# Architecture Overview

## System Architecture

Band of Bakers is built on a modern, cloud-native architecture that leverages Cloudflare's edge computing platform to deliver high-performance e-commerce functionality. The system follows a hybrid approach combining traditional web application patterns with serverless edge computing.

## Core Components

### Frontend Layer (Next.js)

**Technology Stack:**

- **Framework:** Next.js 15.5+ with App Router (webpack only, NOT turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI (Radix primitives)
- **Validation:** Zod
- **Logging:** Logflare (structured logs)
- **Image Optimization:** Cloudflare Images (custom variants)
- **Constants:** Single source of truth (`src/lib/constants/frontend.ts`)

**Architecture Patterns:**

- **Server Components:** For initial page loads and SEO
- **Client Components:** For interactive features
- **API Routes:** Serverless API endpoints
- **Middleware:** Request preprocessing and authentication

**Key Features:**

- Unified storefront and admin interface
- Responsive design with mobile-first approach
- Real-time updates via React state management
- Form validation with React Hook Form and Zod

### Backend Layer (Cloudflare Pages + Workers)

**Technology Stack:**

- **Pages Runtime:** Cloudflare Pages (Next.js deployment)
- **Server Actions:** Next.js Server Actions (not API routes)
- **Database:** Cloudflare D1 (SQLite at edge) - Direct writes, serialized reads
- **Cache:** Cloudflare KV
- **Storage:** Cloudflare R2
- **Images:** Cloudflare Images with custom variants
- **Error Tracking:** Rollbar (production errors)
- **Logging:** Logflare (structured logs + analytics)
- **Authentication:** Google Identity Platform (email/password + OAuth)
- **Email:** Resend (transactional emails)
- **Payments:** Stripe (payment processing)
- **Constants:** Single source of truth (`src/lib/constants/backend.ts`)

**Architecture Patterns:**

- **Edge Computing:** Code runs at 200+ global locations via Cloudflare Pages
- **Server Actions:** Serverless mutations via `"use server"` directives
- **Combined Pages + Workers:** Pages handles HTTP, Workers handle background tasks
- **Serverless Functions:** Auto-scaling based on demand

**Key Features:**

- Sub-millisecond response times via edge computing
- Global distribution across 200+ Cloudflare locations
- Automatic scaling (Pages + Workers combined)
- Built-in security (WAF, DDoS protection)
- Server Actions for type-safe mutations
- Direct D1 writes for consistency
- Serialized D1 reads for performance
- Cloudflare Images with custom variants
- Google Identity Platform for secure auth
- Resend for reliable email delivery
- Stripe integration for payments
- Unified logging via Logflare
- Production error tracking via Rollbar

### Data Layer

**Primary Database (D1):**

- **Type:** SQLite at edge
- **Purpose:** Transactional data storage
- **Features:** ACID compliance, SQL queries, migrations
- **Limitations:** 10GB storage, eventual consistency for reads
- **Concurrent Writes:** Single writer (SQLite limitation); all writes serialized
- **Concurrent Reads:** Unlimited but serialized for consistency
- **Row Limit:** ~100M rows (SQLite dependent on schema)
- **Max Connection Pool:** 32 concurrent connections via Cloudflare
- **Query Timeout:** 30 seconds per query
- **Scaling Path:** D1 sufficient until 500+ MAU; plan Postgres migration (Neon/Workers) at 1000+ MAU

**Cache Layer (KV):**

- **Type:** Key-value store
- **Purpose:** Session management, temporary data, query caching
- **Features:** Global replication, TTL support, atomic operations
- **Capacity:** Unlimited, but plan for key lifecycle management
- **TTL Strategy:**
  - Sessions: 24 hours
  - Auth tokens: 1 hour
  - Query cache: 5-15 minutes (entity-dependent)
  - Temporary data: 1 hour
- **Use Cases:** User sessions, OAuth tokens, API responses, read cache layer
- **Hit Rate Target:** > 80% for optimal performance
- **Key Naming Convention:** `{namespace}:{entity}:{id}:{version}` (prevents collision at scale)

**Object Storage (R2):**

- **Type:** S3-compatible storage
- **Purpose:** File uploads, images, backups
- **Features:** CDN integration, unlimited storage
- **Use Cases:** Product images, user uploads, exports

**Image Delivery (Cloudflare Images):**

- **Type:** Optimized image serving with edge caching
- **Purpose:** Product images, user avatars, marketing assets
- **Features:** Custom variants (thumbnail, card, hero), automatic optimization
- **Custom Variants:** Defined in application configuration (responsive, format optimization)
- **Use Cases:** Fast image delivery, responsive images, WebP fallback

## Third-Party Integrations

### Authentication (Google Identity Platform)

- **Email/Password:** Native sign-up and login
- **Social Login:** Google OAuth 2.0 integration
- **Session Management:** Secure cookies with KV store
- **MFA Support:** Optional multi-factor authentication
- **NOT Firebase:** Direct Google Identity Platform REST APIs

### Email (Resend)

- **Transactional Emails:** Order confirmations, shipping updates
- **Marketing:** Promotional and notification emails
- **Templates:** HTML-based email templates
- **Webhook Support:** Bounce and delivery tracking

### Payments (Stripe)

- **Payment Processing:** Credit/debit cards, digital wallets
- **Webhooks:** Real-time payment status updates
- **PCI Compliance:** Stripe handles sensitive payment data
- **Testing Mode:** Separate test/live API keys

### Constants Management

**Frontend Constants (`src/lib/constants/frontend.ts`):**

- UI dimensions, colors, animations
- Form validation rules
- API endpoints
- Feature flags
- User-facing messages

**Backend Constants (`src/lib/constants/backend.ts`):**

- Database constraints
- Stripe product IDs
- Email templates
- Rate limiting thresholds
- Payment terms
- Business logic rules

**Single Source of Truth:** All constants defined once, exported for use across codebase. No hardcoded values in components or Server Actions.

## Scaling & Growth Strategy

### MAU-Based Architecture Timeline

**100-500 MAU (Current - Recommended):**

- D1 fully adequate (single instance)
- KV for sessions + light query caching
- Direct D1 reads from Server Actions
- Workers for background tasks only
- Single Cloudflare region sufficient

**500-1000 MAU (Phase 8-9 Planning):**

- Implement Workers read cache layer (KV in front of D1)
- Monitor D1 write latency (target < 500ms p95)
- Expand KV caching strategy
- Implement query result caching in KV
- Cost monitoring: ~$50-100/month

**1000-5000 MAU (Future - Migration Phase):**

- **CRITICAL:** Migrate D1 → PostgreSQL (Neon + Workers)
- Implement read replicas for scaling
- Advanced KV sharding strategy
- Connection pooling via Cloudflare Workers
- Cost monitoring: ~$200-500/month
- Expected timeline: 12-18 months from launch

**5000+ MAU (Enterprise):**

- Multi-region PostgreSQL deployment
- Geospatial data replication
- Advanced rate limiting via Queues
- Cost optimization: ~$500-2000/month
- Consider dedicated Cloudflare account

### Cost Analysis

**Monthly Estimates (100 MAU, ~10,000 requests/day):**

| Service                  | Cost           | Notes                               |
| ------------------------ | -------------- | ----------------------------------- |
| Cloudflare Pages         | Free           | Included with pro plan              |
| D1 Database              | $0             | Included (10GB limit sufficient)    |
| KV                       | ~$0.50         | Sessions + light caching            |
| Workers                  | ~$5            | Background tasks, ~100K invocations |
| Cloudflare Images        | ~$15           | Assumes 500-1000 transforms/day     |
| R2 Storage               | ~$5            | ~100GB bandwidth included           |
| Logflare                 | ~$30           | Production logging                  |
| Rollbar                  | ~$25           | Error tracking                      |
| Stripe                   | 2.9% + $0.30   | Per transaction                     |
| Resend                   | ~$10           | ~1000 emails/month                  |
| Google Identity Platform | Free           | Auth service                        |
| **Total**                | **~$90/month** | Scalable to 1000 MAU                |

**Projected Costs at 1000 MAU:**

- D1 → Postgres migration: +$100/month
- Increased Workers usage: +$20/month
- Higher image transforms: +$50/month
- **New total: ~$260/month**

### Performance Targets

**Core Web Vitals (Cloudflare Best Practices):**

| Metric                         | Target  | Current Path      | Action                           |
| ------------------------------ | ------- | ----------------- | -------------------------------- |
| LCP (Largest Contentful Paint) | < 1.5s  | Edge computing    | ✅ On track                      |
| FID (First Input Delay)        | < 100ms | Server Actions    | ✅ On track                      |
| CLS (Cumulative Layout Shift)  | < 0.1   | Client components | Monitor                          |
| TTFB (Time to First Byte)      | < 200ms | D1 queries        | May need cache at 1000+ MAU      |
| D1 Query Latency p95           | < 100ms | Direct reads      | Monitor; add KV cache if > 150ms |

**Observability Metrics:**

| Metric                   | Target  | Threshold Alert |
| ------------------------ | ------- | --------------- |
| KV Hit Rate              | > 80%   | Alert if < 70%  |
| D1 Write Latency p95     | < 500ms | Alert if > 1s   |
| D1 Connection Pool Usage | < 70%   | Alert if > 80%  |
| Error Rate               | < 0.5%  | Alert if > 1%   |
| Stripe Success Rate      | > 99%   | Alert if < 98%  |
| Email Bounce Rate        | < 2%    | Alert if > 5%   |

### Workers CPU Time Strategy

**CPU Budget Planning:**

- **Default Limit:** 50ms CPU time per request
- **Available:** 400ms for Bundled Plan users
- **Per-Worker Strategy:**
  - Read cache lookup: ~1-2ms (KV read)
  - Query validation: ~5-10ms (Zod parse)
  - D1 operation: ~20-50ms (query execution)
  - Logging: ~2-5ms (Logflare send)
  - **Total budget: ~30-70ms per request** ✅ Within limits

**Growth Optimization:**

- At 1000+ MAU: Monitor CPU usage; move heavy computation to Durable Objects (if needed)
- Cache compiled Zod schemas
- Batch D1 operations where possible

### Rate Limiting Implementation

**Cloudflare Queues + Workers Approach:**

Request → Cloudflare Rate Limiter → Pass/Reject → Workers Middleware → Check KV for user rate limit → Increment counter + Queue task → Respond (rate limit headers)

**Rate Limits by Endpoint:**

- Authentication: 5 attempts/minute per IP
- API Read: 100 requests/minute per user
- API Write: 10 requests/minute per user
- Payment: 1 request/second per user
- Image Upload: 10 uploads/day per user

**KV Counter Strategy:**

- Key: `rate-limit:{endpoint}:{identifier}:{hour}`
- TTL: 1 hour
- Atomic increment on each request

## Development & Deployment Strategy

### Mock-Driven Development (Phases 3-4)

The architecture supports a **mock-first development approach** aligned with the 10-phase development methodology:

**Phase 2 (Data Layer):**

- Zod schemas define data contracts
- Flat mock files (`src/lib/mocks/*.ts`) created simultaneously
- Mocks typed to Zod schemas for consistency

**Phases 3-4 (UI & Features):**

- 100% mock-driven development (zero backend calls)
- Components use flat mocks exclusively
- Server Actions not called until Phase 6
- Frontend team independent from backend implementation

**Phase 6 (Integration):**

- Systematic mock-to-Server Action replacement
- Grep verification: `grep -r "from.*mocks" src/components/` must return 0
- All data flows from D1 via Server Actions

**Reference:** See `project-phases.md` for complete 10-phase development methodology.

## Application Architecture

### Request Flow

```
User Request
    ↓
Cloudflare Edge (DNS, WAF, DDoS Protection)
    ↓
Cloudflare Pages (Next.js 15.5 + webpack)
    ↓
Server Components / Server Actions / Client Logic
    ↓
D1 Database / KV Cache / R2 Storage
    ↓
Logflare (structured logging)
    ↓
Rollbar (error tracking)
    ↓
Response to User
```

**Note:** Background tasks and scheduled jobs use Cloudflare Workers in parallel.

### Data Flow Architecture

**Read Operations (Serialized D1 Reads):**

```
Client → Server Component / Server Action
    ↓
D1 Query (with read serialization for consistency)
    ↓
KV Cache (optional, for hot data)
    ↓
Response to Client
```

**Write Operations (Direct D1 Writes):**

```
Client → Server Action (Zod validated)
    ↓
Direct D1 Transaction (ACID guaranteed)
    ↓
KV Invalidation (if cached)
    ↓
Logflare (log write event)
    ↓
Success Response to Client
```

**Image Flow (Cloudflare Images):**

```
Client Request
    ↓
Cloudflare Images with custom variants
    ↓
Cached at edge (automatic CDN)
    ↓
Response to Client
```

### Security Architecture

**Authentication & Authorization:**

- **Auth Provider:** Google Identity Platform (email/password + Google OAuth)
- **Session Management:** Secure cookies with KV TTL
- **Role-Based Access Control:** Customer/Admin/Staff roles
- **Protected Routes:** Middleware-based auth checks
- **Protected Actions:** Server Action-level auth verification

**Authorization:**

- Middleware-based route protection
- Server Action authorization checks
- Stripe webhook verification
- API key validation for external services
- CORS configuration per environment
- Rate limiting and abuse prevention

**Data Protection:**

- Encryption at rest (Cloudflare managed)
- TLS 1.2+ for all connections
- Input validation and sanitization (Zod schemas)
- SQL injection prevention via prepared statements
- Google Identity Platform for credential security

## Environment Architecture

### Local Development

**Purpose:** Isolated development environment
**Components:**

- Local Next.js server (port 3000)
- Cloudflare Workers emulation
- Local D1 preview database
- Local KV namespace
- Local R2 bucket

**Network:** `localhost` only
**Data:** Ephemeral, reset on demand
**Secrets:** Local environment variables

### Staging Environment

**Purpose:** Pre-production testing and validation
**Components:**

- Cloudflare Pages deployment
- Cloudflare Workers (staging)
- Separate D1 database instance
- Separate KV namespace
- Separate R2 bucket

**Network:** `https://staging.bandofbakers.com`
**Data:** Persistent, mirrors production schema
**Secrets:** Shared with production

### Production Environment

**Purpose:** Live customer-facing application
**Components:**

- Cloudflare Pages (production)
- Cloudflare Workers (production)
- Production D1 database
- Production KV namespace
- Production R2 bucket

**Network:** `https://bandofbakers.co.uk`
**Data:** Live customer data
**Secrets:** Shared with staging

## Performance Architecture

### Caching Strategy

**Multi-Layer Caching:**

1. **Browser Cache:** Static assets, images
2. **CDN Cache:** Page responses, API responses
3. **KV Cache:** Application data, sessions
4. **Database Cache:** Query result caching

**Cache Invalidation:**

- Time-based expiration (TTL)
- Manual invalidation on data changes
- Cache warming for critical data

### Database Optimization

**Indexing Strategy:**

- Primary keys on all tables
- Foreign key indexes
- Query-specific indexes for common patterns
- Composite indexes for complex queries

**Query Optimization:**

- Prepared statements for all queries (Zod validation prevents injection)
- Connection pooling via Cloudflare (32 max concurrent)
- KV query result caching (5-15 min TTL based on entity)
- Indexed queries on: user_id, product_id, order_id, created_at
- Avoid full table scans (add LIMIT 1000 safety)
- Monitor query latency; alert if > 150ms
- Future: Read replicas (D1 → Postgres migration at 1000+ MAU)

### Edge Computing Benefits

**Performance Improvements:**

- Reduced latency (50-100ms vs 250ms+)
- Global distribution (200+ locations)
- Automatic scaling
- DDoS protection included

**Cost Benefits:**

- Pay-per-request pricing
- No server management
- Automatic scaling
- Reduced infrastructure costs

## Scalability Architecture

### Horizontal Scaling

**Automatic Scaling:**

- Workers scale based on request volume
- Pages scale automatically
- Database handles increased load
- CDN absorbs traffic spikes

**Load Distribution:**

- Global CDN network
- Edge computing at user location
- Regional database replicas (future)
- Multi-region deployment (future)

### Vertical Scaling

**Resource Allocation:**

- D1: Automatic scaling within limits
- KV: Global replication
- R2: Unlimited storage scaling
- Workers: CPU time optimization

**Performance Monitoring:**

- Response time tracking
- Error rate monitoring
- Resource utilization metrics
- User experience monitoring

## Reliability Architecture

### Fault Tolerance

**Redundancy:**

- Multiple edge locations
- Automatic failover
- Data replication across regions
- Backup systems

**Error Handling:**

- Circuit breaker patterns
- Graceful degradation
- Retry mechanisms
- Fallback responses

### Disaster Recovery

**Backup Strategy:**

- **D1 Automated Backups:** Via Cloudflare console (daily snapshots)
- **R2 Versioning:** Enable object versioning for all uploads
- **Point-in-Time Recovery:** 30-day snapshot retention
- **Cross-Region Replication:** R2 replication to secondary region
- **Manual Backup Procedure:**
  1. Export D1 SQL dump daily (automated via Worker)
  2. Store backup in R2 with timestamp
  3. Test restore monthly
  4. Alert if backup fails

**Backup Verification:**

- Weekly: Test D1 restore from backup
- Monthly: Full data integrity check
- Quarterly: Disaster recovery drill (restore to staging)

**Business Continuity:**

- **Multiple Availability Zones:** Cloudflare automatically replicates across regions
- **R2 Failover:** Enable cross-region replication (automatic failover)
- **KV Failover:** Global replication automatic (no action needed)
- **Workers Failover:** Geographic load balancing via Cloudflare
- **Communication Plan:** Alert to Slack/email if backup fails
- **RTO (Recovery Time Objective):** < 1 hour for database
- **RPO (Recovery Point Objective):** < 24 hours (daily backups)

## Security Architecture

### Defense in Depth

**Network Security:**

- Cloudflare WAF (Web Application Firewall)
- DDoS protection
- Rate limiting
- IP reputation checking

**Application Security:**

- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure headers

**Data Security:**

- Encryption at rest and in transit
- Secure credential management
- Audit logging
- Access control

### Compliance Considerations

**Data Protection:**

- GDPR compliance for EU users
- CCPA compliance for California users
- PCI DSS for payment data (Stripe handles)
- SOC 2 compliance (Cloudflare certified)

## Monitoring and Observability

### Application Monitoring

**Metrics Collection:**

- Response times and error rates
- Database query performance (D1 reads/writes)
- Cache hit/miss ratios (KV)
- User session tracking
- Stripe payment processing metrics
- Resend email delivery status
- Google Identity Platform auth metrics

**Logging Strategy:**

- Structured logging via Logflare
- Error tracking via Rollbar
- Stripe webhook logging
- Resend delivery tracking
- Google Identity Platform audit logs
- Performance monitoring
- Security event logging

### Integration Monitoring

**Stripe Webhooks:**

- Payment intent events
- Dispute notifications
- Automatic retry logic

**Resend Email:**

- Bounce and complaint tracking
- Delivery status
- Template rendering errors

**Google Identity Platform:**

- Sign-up/sign-in attempts
- Failed authentications
- Session timeout events

### Infrastructure Monitoring

**Cloudflare Analytics:**

- Real-time traffic analysis
- Performance metrics
- Security events
- Custom dashboards

**Custom Monitoring:**

- API health checks
- Database connection monitoring
- Background job status
- Alerting and notifications

## Future Architecture Considerations

### Planned Improvements

**Phase 8+ (1000+ MAU): Database Migration**

- **Current:** Cloudflare D1 (SQLite)
- **Target:** Neon PostgreSQL + Cloudflare Workers
- **Timeline:** 12-18 months post-launch
- **Migration Steps:**
  1. Parallel write to both D1 + Postgres
  2. Migrate read traffic to Postgres (via Workers)
  3. Validation period (2-4 weeks)
  4. Cutover; D1 archived
  5. Deprecate D1; full Postgres
- **Benefits:** Unlimited scaling, native read replicas, better performance
- **Cost:** +$100-200/month for managed Postgres

**KV Evolution (1000+ MAU):**

- KV to Redis (optional, if KV performance degrades)
- Currently: KV is sufficient; upgrade only if metrics show degradation
- Durable Objects for stateful caching (if needed)
- Namespace isolation for multi-tenant data

**Advanced Caching (500+ MAU):**

- Query result caching in KV (5-15 min TTL)
- Cache warming for frequently accessed data
- Stale-while-revalidate patterns
- Predictive preloading for commerce (bestsellers, new arrivals)

**Email Evolution (500+ MAU):**

- Currently: Resend (sufficient)
- Future: SendGrid if higher volume needed
- Email template management system
- A/B testing for promotional campaigns

**Global Expansion (2000+ MAU):**

- Multi-region Postgres deployment
- Data residency for EU (GDPR compliance)
- Regional payment processing
- Localized content delivery
- Multi-currency support

### Technology Evolution

**Framework Updates:**

- Next.js advancements (15.x → 16+ when Cloudflare compatible)
- React Server Components optimization
- Edge runtime improvements
- Cloudflare Workers platform enhancements

**Performance Enhancements:**

- Bundle optimization (monitor JavaScript size)
- Image optimization (custom Cloudflare Image variants)
- Core Web Vitals optimization (LCP, FID, CLS)
- Database query profiling and optimization

## Cloudflare Best Practices Compliance

### Current Alignment (100 MAU)

| Best Practice           | Status | Notes                                |
| ----------------------- | ------ | ------------------------------------ |
| Edge-first architecture | ✅     | Full utilization of Cloudflare edge  |
| Serverless functions    | ✅     | Server Actions + Workers for compute |
| Global CDN              | ✅     | 200+ edge locations                  |
| Security at edge        | ✅     | WAF, DDoS, rate limiting             |
| Performance monitoring  | ✅     | Logflare + Rollbar                   |
| Database optimization   | ✅     | D1 suitable for current scale        |
| Caching strategy        | ✅     | Multi-layer caching implemented      |
| Type safety             | ✅     | TypeScript + Zod throughout          |

### Scaling Risks & Mitigations

| Risk                | Threshold           | Mitigation                                  |
| ------------------- | ------------------- | ------------------------------------------- |
| D1 write latency    | 500ms+ p95          | Migrate to Postgres; implement write queue  |
| D1 storage capacity | > 8GB               | Vacuum unused data; archive old orders      |
| KV key explosion    | > 1M keys           | Implement namespace sharding                |
| Worker CPU time     | > 200ms per request | Profile; move heavy work to Durable Objects |
| Cost overrun        | > $500/month        | Monitor per-request costs; optimize images  |
| Read latency        | > 200ms p95         | Implement KV read cache layer               |

### Observability Checklist

**Production Monitoring (Phase 7+):**

- [ ] D1 query latency tracking
- [ ] KV hit rate monitoring
- [ ] Workers CPU time profiling
- [ ] Error rate alerts (> 1%)
- [ ] Cost tracking per service
- [ ] Stripe webhook success rate
- [ ] Email delivery rate (bounce tracking)
- [ ] Auth success/failure rates
- [ ] Image transform error rate
- [ ] R2 bandwidth monitoring

**Alert Configuration:**

- Email errors → Slack #errors
- High latency (> 200ms p95) → Slack #performance
- Cost spike (> 20% variance) → Slack #finance
- Auth failures (> 5%) → Slack #security
- D1 write timeout → Page on-call engineer

This architecture provides a solid foundation for scalable, secure, and performant e-commerce operations at 100-500 MAU, with clear migration paths for growth to 5000+ MAU.

# Deployment Strategy

## Overview

Band of Bakers employs a sophisticated multi-environment deployment strategy designed to ensure reliability, security, and developer productivity. The strategy emphasizes environment isolation, shared secrets between remote environments, and automated deployment pipelines aligned with the 10-phase development methodology (see `project-phases.md`).

## Environment Strategy

### Three-Environment Architecture

Band of Bakers operates across three distinct environments, each serving a specific purpose in the development and deployment lifecycle and mapped to development phases:

#### 1. Local Development Environment

**Purpose:**

- Active development and testing (Phases 1-4)
- Isolated experimentation with mock data
- Fast iteration cycles
- Phase 2: Create Zod schemas + flat mock files
- Phases 3-4: 100% mock-driven UI development

**Characteristics:**

- **Isolation:** Completely separate from production systems
- **Ephemeral:** Data can be reset without consequences
- **Full Control:** Developers have complete access and control
- **Fast Feedback:** Hot reload, instant error visibility
- **Mock-First:** All data from `src/lib/mocks/` files (no database calls)

**Infrastructure:**

- Local Next.js development server (`--webpack` flag, NOT turbopack)
- Next.js 15.5+ required (NOT 16.x)
- Cloudflare Workers emulation
- Local D1 preview database
- Local KV and R2 resources
- Logflare integration (local logs)

**Data Strategy:**

- Test data only
- Frequent resets encouraged
- No production data access
- Sample data seeding available

#### 2. Staging Environment

**Purpose:**

- Pre-production validation (Phase 5-6 completion)
- Integration testing with real Server Actions
- Performance verification
- Stakeholder demonstrations
- Phase 6 exit criteria validation before production

**Characteristics:**

- **Production-like:** Mirrors production infrastructure exactly
- **Isolated Resources:** Separate databases and storage
- **Shared Secrets:** Uses identical secrets to production (except OAuth apps)
- **Monitoring:** Full observability with Logflare and Rollbar
- **Mock Verification:** Grep checks for Phase 6 compliance

**Infrastructure:**

- Cloudflare Pages deployment (Next.js 15.5+ with webpack)
- Dedicated Cloudflare Workers for background tasks
- Separate D1 database instance (mirrors production schema)
- Isolated KV and R2 resources
- Full WAF and security rules
- Logflare integration (production-level logging)
- Rollbar integration (error tracking)

**Data Strategy:**

- Realistic test data
- Persistent across deployments
- Regular cleanup procedures
- No real customer data

#### 3. Production Environment

**Purpose:**

- Live customer-facing application (Phases 7-10)
- Revenue-generating operations
- Real user interactions
- Post-Phase 6 integration complete

**Characteristics:**

- **Optimized:** Performance and security maximized
- **Monitored:** Comprehensive observability via Logflare + Rollbar
- **Secure:** Restricted access controls
- **Stable:** Changes deployed through validation gates
- **No Mocks:** All data flows from D1 via Server Actions

**Infrastructure:**

- Cloudflare Pages (production) - Next.js 15.5+ with webpack
- Cloudflare Workers (production) for background tasks
- Production D1 database
- Production KV and R2 resources
- Maximum security configuration (WAF, rate limiting)
- Logflare integration (all production logs)
- Rollbar integration (all production errors)

**Data Strategy:**

- Live customer data
- Automated backups
- Point-in-time recovery
- Data retention compliance

## Secrets Management Strategy

### Shared Secrets Principle

**Core Principle:** Staging and production environments use identical secret values to ensure behavioral consistency.

**Rationale:**

- **Validation Accuracy:** Features tested in staging behave identically in production
- **Configuration Parity:** No environment-specific logic required
- **Simplified Management:** Single source of truth for production secrets
- **Reduced Risk:** Fewer opportunities for configuration drift

### Secret Categories

#### Shared Secrets (Staging ↔ Production)

These secrets have identical values across both remote environments:

| Secret                                       | Purpose                      | Management                                |
| -------------------------------------------- | ---------------------------- | ----------------------------------------- |
| `BANDOFBAKERS_RESEND_API_KEY`                | Email service authentication | Same key for both environments            |
| `BANDOFBAKERS_STRIPE_SECRET_KEY`             | Payment processing           | Live keys in both environments            |
| `BANDOFBAKERS_GCP_IDENTITY_PLATFORM_API_KEY` | User authentication          | Production GCP project                    |
| Database credentials                         | D1 access                    | Environment-specific (separate databases) |

**Benefits:**

- Consistent payment processing behavior
- Identical email delivery capabilities
- Same authentication flows
- Reliable third-party integrations

#### Environment-Specific Secrets

These differ by environment for security and functionality:

| Secret                         | Local            | Staging                      | Production           |
| ------------------------------ | ---------------- | ---------------------------- | -------------------- |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Dev OAuth app    | Staging OAuth app            | Production OAuth app |
| `GOOGLE_CLIENT_SECRET`         | Dev secret       | Staging secret               | Production secret    |
| `NEXT_PUBLIC_APP_URL`          | `localhost:3000` | `staging.bandofbakers.co.uk` | `bandofbakers.co.uk` |

**Benefits:**

- Isolated OAuth applications
- Environment-appropriate URLs
- Granular access controls

### Secret Rotation Strategy

#### Quarterly Rotation Schedule

```bash
# Month 1: Plan rotation
# - Identify secrets requiring rotation
# - Generate new credentials
# - Update staging first

# Month 2: Staging validation
# - Deploy new secrets to staging
# - Validate functionality
# - Monitor for issues

# Month 3: Production deployment
# - Deploy to production during maintenance window
# - Monitor closely for 24 hours
# - Rollback plan ready

# Month 4: Cleanup
# - Revoke old credentials
# - Update documentation
# - Security review
```

#### Emergency Rotation

For compromised credentials:

1. **Immediate Assessment:** Confirm compromise scope
2. **Generate New Credentials:** Create replacement secrets
3. **Staging First:** Deploy to staging for validation
4. **Production Deployment:** Update production with monitoring
5. **Old Credential Revocation:** Disable compromised credentials
6. **Communication:** Notify team and stakeholders

## Deployment Pipeline

### Git-Flow Based Deployment

```
feature-branch
    ↓ (PR)
main branch
    ↓ (automatic)
staging deployment
    ↓ (manual approval)
production deployment
```

### Automated Staging Deployment

**Trigger:** Push to `main` branch

**Process:**

1. **Build Validation:**

   - Next.js 15.5+ compilation check
   - Webpack configuration verification (NOT turbopack)
   - TypeScript compilation
   - ESLint checks
   - Unit test execution
   - E2E test suite

2. **Phase 6 Compliance Checks (Pre-Production Gate):**

   - Grep verification: `grep -r "from.*mocks" src/components/` returns 0
   - Verify all mocks removed from components (Phase 6 exit criteria)
   - Confirm all Server Actions deployed
   - Validate D1 database migrations applied
   - Test data flow from D1 via Server Actions

3. **Staging Deployment:**

   - Cloudflare Pages deployment (Next.js 15.5 + webpack)
   - Cloudflare Workers deployment (background tasks)
   - Database migration application
   - Environment variable validation
   - Health check verification
   - Logflare integration active
   - Rollbar integration active

4. **Automated Testing:**
   - API endpoint validation (via Server Actions)
   - Critical user journey testing (with real data)
   - Performance baseline checks
   - Error tracking via Rollbar
   - Logging via Logflare

### Manual Production Deployment

**Trigger:** Successful staging deployment + Phase 6 approval + 24h staging validation

**Pre-Deployment Checklist:**

- [ ] All Phases 0-6 complete (see `project-phases.md`)
- [ ] Phase 6 exit criteria verified (no mocks in components)
- [ ] Staging performance validated (24h minimum)
- [ ] Error rate < 1% for 24h
- [ ] Logflare logs healthy
- [ ] Rollbar tracking active
- [ ] Stakeholder approval confirmed

**Process:**

1. **Pre-Deployment Checks:**

   - Staging performance validation (24h minimum)
   - Error rate monitoring (< 1%)
   - Logflare log analysis (no critical errors)
   - Rollbar error tracking review
   - Stakeholder approval confirmation
   - Database backup creation

2. **Production Deployment:**

   - Zero-downtime Cloudflare Pages deployment (Next.js 15.5 + webpack)
   - Cloudflare Workers production deployment
   - Health check validation
   - Logflare integration verification
   - Rollbar integration verification
   - Traffic monitoring active

3. **Post-Deployment Validation:**
   - Real user monitoring (1 hour)
   - Error rate monitoring via Rollbar (24 hours)
   - Logflare log analysis (24 hours)
   - Performance comparison (baseline vs current)
   - Rollback readiness confirmed (24 hours)

## Rollback Strategy

### Immediate Rollback (< 1 hour)

**Criteria:**

- Critical functionality broken
- Security vulnerability introduced
- Performance degradation (> 50% increase)

**Process:**

```bash
# Immediate rollback command
wrangler rollback --env production

# Verification
curl https://bandofbakers.co.uk/api/health

# Monitoring for 1 hour
wrangler tail --env production
```

### Gradual Rollback (1-24 hours)

**Criteria:**

- Non-critical issues discovered
- Minor performance impact
- User experience degradation

**Process:**

1. **Assessment:** Quantify impact and user affect
2. **Communication:** Notify stakeholders
3. **Rollback Window:** Schedule during low-traffic
4. **Execution:** Rollback with monitoring
5. **Validation:** Confirm issue resolution

### Extended Rollback (> 24 hours)

**Criteria:**

- Data migration issues
- Complex state problems
- External service dependencies

**Process:**

1. **Root Cause Analysis:** Full investigation
2. **Data Recovery:** Backup restoration if needed
3. **Gradual Rollback:** Feature flag deactivation
4. **Complete Rollback:** Full system restoration

## Monitoring and Alerting

### Logging & Error Tracking Infrastructure

**Logflare (Structured Logging):**

- Centralized logging for all environments
- Real-time log streaming and analysis
- Integration with Next.js 15.5 Server Actions
- Metadata tagging (environment, version, user context)
- Custom dashboard for debugging

**Rollbar (Error Tracking):**

- Production error tracking and alerts
- Stack trace analysis and grouping
- Source map support for Next.js
- Integration with Logflare for context
- Automatic error deduplication

### Environment-Specific Monitoring

#### Local Development

- **Focus:** Development productivity
- **Logging:** Logflare integration (local logs)
- **Monitoring:** Build times, test results, error messages
- **Alerts:** Build failures, test failures

#### Staging

- **Focus:** Pre-production validation
- **Logging:** Logflare (production-level detail)
- **Error Tracking:** Rollbar (staging environment)
- **Monitoring:** Performance, errors, user journeys
- **Alerts:** Logflare errors, error rate > 2%, response time > 5s

#### Production

- **Focus:** Customer experience and business metrics
- **Logging:** Logflare (all production logs, 30-day retention)
- **Error Tracking:** Rollbar (all production errors, real-time alerts)
- **Monitoring:** Uptime, performance, revenue impact, user experience
- **Alerts:** Error rate > 1%, response time > 3s, downtime, critical exceptions

### Alert Escalation

**Level 1 (Development Team):**

- Build failures
- Test failures
- Staging deployment issues
- Logflare staging errors

**Level 2 (DevOps Team):**

- Production performance degradation
- Error rate increases (Rollbar)
- Logflare critical errors
- Infrastructure issues

**Level 3 (Management):**

- Customer-impacting outages
- Security incidents (Rollbar security alerts)
- Revenue-affecting issues
- Sustained high error rates

## Performance and Reliability

### Performance Targets

| Metric              | Local   | Staging | Production |
| ------------------- | ------- | ------- | ---------- |
| Response Time (p95) | < 500ms | < 500ms | < 300ms    |
| Error Rate          | N/A     | < 2%    | < 1%       |
| Uptime              | N/A     | 99%     | 99.9%      |
| Build Time          | < 2min  | < 3min  | < 5min     |

### Reliability Patterns

#### Circuit Breakers

- Automatic failure detection
- Graceful degradation
- Recovery mechanisms

#### Health Checks

- Application health endpoints
- Database connectivity checks
- External service availability

#### Load Testing

- Staging environment stress testing
- Production capacity planning
- Performance regression detection

## Security Considerations

### Environment Isolation

**Network Security:**

- Local: Firewall restrictions
- Staging: IP allowlists, restricted access
- Production: Full security hardening

**Access Control:**

- Local: Developer discretion
- Staging: Team access with monitoring
- Production: Minimal access, audited changes

### Secret Security

**Storage:**

- Local: `.env.local` files (gitignored)
- Remote: Cloudflare Wrangler secrets (encrypted)

**Access:**

- Local: Individual developer management
- Staging: CI/CD system access
- Production: Restricted to authorized personnel

**Rotation:**

- Automated quarterly rotation
- Emergency rotation procedures
- Audit logging of access

## Cost Optimization

### Environment-Specific Costs

**Local Development:**

- Minimal costs (primarily development time)
- Free Cloudflare resources for development

**Staging:**

- Pro-rated production costs
- Used for validation, not serving customers
- Regular cleanup to control costs

**Production:**

- Full production costs
- Optimized for cost-efficiency
- Regular cost analysis and optimization

### Resource Optimization

**D1 Database:**

- Query optimization
- Appropriate indexing
- Connection pooling

**KV Cache:**

- TTL optimization
- Cache hit rate monitoring
- Size management

**R2 Storage:**

- Compression optimization
- Lifecycle policies
- Access pattern analysis

## Future Evolution

### Planned Improvements

**CI/CD Enhancements:**

- Multi-branch deployment support
- Feature flag integration
- Canary deployment strategies
- Automated rollback systems

**Environment Expansion:**

- Additional staging environments
- Geographic region expansion
- Multi-cloud failover capabilities

**Monitoring Evolution:**

- Advanced analytics integration
- Predictive alerting
- Automated remediation

### Scaling Considerations

**Traffic Growth:**

- Automatic scaling capabilities
- Performance monitoring expansion
- Infrastructure cost optimization

**Team Growth:**

- Environment access controls
- Deployment process documentation
- Training and onboarding procedures

This deployment strategy provides a robust foundation for reliable, secure, and efficient application delivery while maintaining developer productivity and operational excellence.

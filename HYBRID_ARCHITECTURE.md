# NekoStack Hybrid Architecture Decision

**Date**: October 5, 2025  
**Status**: ✅ Approved  
**Decision**: Hybrid approach using Supabase + Cloudflare + Oracle

---

## 🎯 Executive Summary

We've decided to use a **hybrid architecture** for NekoStack that combines:
- **Supabase** for authentication and user data
- **Cloudflare Workers + D1** for application data and light processing
- **Oracle Container Instances** for heavy compute tasks

This approach prioritizes **speed to market** while maintaining **cost efficiency** and **scalability**.

---

## 📊 Architecture Comparison

### Option A: Pure Cloudflare (Original Plan)
```
Auth: Cloudflare Workers + D1 (custom built)
Database: Cloudflare D1
Processing: Workers + Oracle Containers
```

**Pros:**
- Fully edge-distributed
- Lowest cost at scale ($270/month at 500k users)
- No external dependencies

**Cons:**
- 2-3 weeks to build custom auth
- Security responsibility on us
- More complex to maintain

### Option B: Supabase Hybrid (Selected) ✅
```
Auth: Supabase Auth + NextAuth.js
User Data: Supabase PostgreSQL
App Data: Cloudflare D1
Processing: Workers + Oracle Containers
```

**Pros:**
- 2-3 days to implement auth
- FREE for MVP (Supabase free tier)
- Battle-tested security
- Built-in OAuth, email verification, RLS

**Cons:**
- Slightly higher cost at scale ($345/month at 500k users)
- Additional dependency (Supabase)
- Not edge-distributed (but still fast)

### Option C: Full Supabase
```
Auth: Supabase Auth
Database: Supabase PostgreSQL (all data)
Processing: Supabase Edge Functions + Oracle
```

**Pros:**
- Simplest architecture
- Fastest to implement

**Cons:**
- Most expensive at scale
- Less control over data distribution
- Doesn't leverage Cloudflare edge benefits

---

## 💰 Cost Analysis

### Phase 1: MVP (0-50k users)
| Service | Cost |
|---------|------|
| Cloudflare Pages | FREE |
| Cloudflare Workers | FREE |
| Cloudflare D1 | FREE |
| Cloudflare KV | FREE |
| Cloudflare Images | $5/mo |
| **Supabase** | **FREE** |
| Oracle Containers | $10/mo |
| Oracle Storage | $3/mo |
| **Total** | **$18/month** |

### Phase 2: Growth (50k-500k users)
| Service | Cost |
|---------|------|
| Cloudflare Pages | $20/mo |
| Cloudflare Workers | $5/mo |
| Cloudflare D1 | $5/mo |
| Cloudflare KV | $5/mo |
| Cloudflare Images | $10/mo |
| **Supabase Pro** | **$25/mo** |
| Oracle Containers | $50/mo |
| Oracle Storage | $10/mo |
| **Total** | **$130/month** |

**vs Pure Cloudflare: $105/month**  
**Difference: +$25/month** (worth it for faster development)

### Phase 3: Scale (500k+ users)
| Service | Cost |
|---------|------|
| Cloudflare | $95/mo |
| **Supabase** | **$75/mo** (with usage) |
| Oracle | $175/mo |
| **Total** | **$345/month** |

**vs Pure Cloudflare: $270/month**  
**Difference: +$75/month** (can migrate to Workers if needed)

---

## 🏗️ Data Architecture

### Supabase PostgreSQL (User-Centric)
**Purpose**: User identity, authentication, and personal data

**Tables:**
- `users` - User profiles and authentication
- `user_profiles` - Extended user information
- `user_preferences` - Settings, theme, language
- `subscriptions` - Billing and plan information
- `favorites` - User's favorited tools
- `user_files` - Uploaded file metadata

**Features:**
- Row-level security (RLS)
- Real-time subscriptions
- Built-in auth flows
- OAuth integrations
- Email verification

### Cloudflare D1 (Application Data)
**Purpose**: Tool metadata, analytics, and public data

**Tables:**
- `tools` - Tool configurations and metadata
- `tool_categories` - Category definitions
- `analytics_events` - Usage tracking
- `tool_ratings` - Public ratings and reviews
- `system_config` - Application settings
- `cache_metadata` - Cache management

**Features:**
- Edge-distributed reads
- Low latency globally
- SQL compatibility
- Free tier generous

### Supabase Storage (User Files)
**Purpose**: Persistent user-uploaded files

**Buckets:**
- `avatars` - User profile pictures
- `documents` - User documents (resumes, etc.)
- `exports` - Generated exports

**Features:**
- CDN-backed
- Access control via RLS
- Automatic image optimization

### Oracle Object Storage (Processing)
**Purpose**: Temporary file storage during processing

**Buckets:**
- `processing-temp` - Temporary processing files
- `processing-results` - Processing outputs (TTL: 24h)

**Features:**
- High throughput
- Always Free tier (20GB)
- Low cost at scale

---

## 🔄 Request Flow

### Authentication Flow
```
User → Next.js Frontend
  ↓
Next.js API Routes (/api/auth/*)
  ↓
Supabase Auth
  ↓
JWT Token (HTTP-only cookie)
  ↓
Protected Routes (middleware check)
```

### User Data Flow
```
User → Next.js Frontend
  ↓
Next.js API Routes (/api/users/*)
  ↓
Supabase PostgreSQL (with RLS)
  ↓
Response
```

### Tool Usage Flow
```
User → Next.js Frontend
  ↓
Decision: Light or Heavy?
  ↓
Light Task → Cloudflare Worker → D1 → Response
  ↓
Heavy Task → Oracle Queue → Container → Storage → Response
```

### Analytics Flow
```
User Action → Next.js Frontend
  ↓
Cloudflare Worker (/api/analytics)
  ↓
Cloudflare D1 (analytics_events)
  ↓
Background: Aggregate to Supabase (for user dashboard)
```

---

## 🚀 Implementation Phases

### Phase 1: Supabase Setup (Week 1)
- [ ] Create Supabase project
- [ ] Design user schema
- [ ] Set up row-level security policies
- [ ] Configure OAuth providers
- [ ] Set up storage buckets

### Phase 2: NextAuth.js Integration (Week 1)
- [ ] Install NextAuth.js and Supabase adapter
- [ ] Create `/api/auth/[...nextauth]` route
- [ ] Configure session strategy (JWT)
- [ ] Set up middleware for protected routes
- [ ] Create sign-in/sign-up UI

### Phase 3: User Management (Week 2)
- [ ] Create user profile API routes
- [ ] Implement user preferences
- [ ] Add favorites functionality
- [ ] Set up file upload
- [ ] Create user dashboard

### Phase 4: Cloudflare D1 Setup (Week 2)
- [ ] Create D1 database
- [ ] Design app schema
- [ ] Create migration files
- [ ] Set up Workers for tool data
- [ ] Implement analytics collection

### Phase 5: Integration (Week 3)
- [ ] Connect frontend to Supabase
- [ ] Connect frontend to Workers
- [ ] Implement data synchronization
- [ ] Add error handling
- [ ] Performance optimization

---

## 🔐 Security Considerations

### Supabase Security
- ✅ Row-level security (RLS) policies
- ✅ JWT-based authentication
- ✅ HTTP-only cookies (no localStorage)
- ✅ CSRF protection via NextAuth.js
- ✅ OAuth 2.0 for social logins
- ✅ Email verification required

### API Security
- ✅ Middleware authentication check
- ✅ Rate limiting on Workers
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)

### Data Security
- ✅ Encrypted at rest (Supabase + Cloudflare)
- ✅ TLS in transit
- ✅ Separate user data from app data
- ✅ File access control via RLS
- ✅ Audit logging

---

## 📈 Scalability Plan

### Current Capacity (Free Tier)
- **Users**: 50,000
- **Database**: 500MB (Supabase) + Unlimited (D1)
- **Storage**: 1GB (Supabase) + 20GB (Oracle)
- **Bandwidth**: 2GB/month (Supabase) + Unlimited (Cloudflare)

### Growth Strategy
1. **0-50k users**: Free tier, monitor usage
2. **50k-100k users**: Upgrade Supabase to Pro ($25/mo)
3. **100k-500k users**: Optimize queries, add caching
4. **500k+ users**: Consider migration to Workers + D1 auth

### Migration Path (Optional)
If Supabase becomes a bottleneck or too expensive:

**Step 1**: Build auth in Workers + D1
```typescript
// Implement custom auth with Workers
// Use D1 for user storage
// Implement JWT generation/validation
```

**Step 2**: Run parallel systems
```typescript
// Keep Supabase for existing users
// New users go to Workers + D1
// Gradual migration over 3-6 months
```

**Step 3**: Deprecate Supabase
```typescript
// All users on Workers + D1
// Export data from Supabase
// Cancel Supabase subscription
```

**Cost Savings**: $75/month at 500k+ users  
**Development Time**: 3-4 weeks  
**Risk**: Medium (requires careful migration)

**Recommendation**: Only migrate if Supabase costs exceed $200/month or performance issues arise.

---

## 🎓 Technology Stack Summary

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Hosting**: Cloudflare Pages
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query

### Backend - Authentication
- **Auth Provider**: Supabase Auth
- **Auth Library**: NextAuth.js
- **Session**: JWT (HTTP-only cookies)
- **Database**: Supabase PostgreSQL

### Backend - Application
- **API**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Cache**: Cloudflare KV
- **Processing**: Oracle Container Instances

### Storage
- **User Files**: Supabase Storage
- **Processing**: Oracle Object Storage
- **CDN**: Cloudflare Images

### Monitoring
- **Analytics**: Cloudflare Analytics
- **Errors**: Sentry (planned)
- **Logs**: Cloudflare Logs + Oracle Logging

---

## ✅ Decision Rationale

### Why Supabase for Auth?
1. **Speed**: 2-3 days vs 2-3 weeks custom
2. **Security**: Battle-tested, SOC 2 compliant
3. **Features**: OAuth, email verification, RLS built-in
4. **Cost**: FREE for MVP, predictable scaling
5. **DX**: Excellent documentation and tooling

### Why Cloudflare for App Data?
1. **Performance**: Edge-distributed, sub-50ms latency
2. **Cost**: FREE tier is very generous
3. **Scalability**: Auto-scales to millions of requests
4. **Integration**: Works seamlessly with Workers

### Why Oracle for Processing?
1. **Cost**: Always Free tier (2 instances forever)
2. **Power**: Unlimited processing time
3. **Flexibility**: Can run any code/language
4. **Price**: 47% cheaper than AWS at scale

---

## 📝 Next Steps

1. ✅ Update architecture documentation
2. ✅ Update NEXT_STEPS.md with implementation tasks
3. ⏳ Create Supabase project
4. ⏳ Set up NextAuth.js
5. ⏳ Implement authentication flow
6. ⏳ Build user management features
7. ⏳ Set up Cloudflare D1
8. ⏳ Integrate all systems

---

## 📚 References

- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
- [Tech Stack Discussion](./product/landing-page/tech-stack-discussion.md)
- [Project Structure](./product/landing-page/main-project-structure.md)

---

**Status**: Ready for implementation 🚀  
**Estimated Timeline**: 3 weeks for full backend integration  
**Risk Level**: Low (using proven technologies)

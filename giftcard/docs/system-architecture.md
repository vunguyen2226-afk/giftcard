# System Architecture - New Year Greeting Card App

**Last Updated**: 2026-02-16
**Version**: 1.0.0
**Status**: Production Ready - All Phases Implemented

## Architecture Overview

New Year Greeting Card App is a full-featured web application using Next.js 16 as a full-stack framework with React 19, TypeScript 5, and PostgreSQL. The system implements a modern client-server architecture with server components for data fetching and client components for interactivity.

```
┌──────────────────────────────────────────────────────────┐
│                   Browser / Client Layer                 │
├──────────────────────────────────────────────────────────┤
│  React 19 Components (Server & Client)                   │
│  - Landing page (/)                                      │
│  - Auth pages (/login)                                   │
│  - Card editor (/create) - 4-step wizard               │
│  - Public card viewer (/card/[slug])                    │
│  - User dashboard (/dashboard)                           │
│  - Animations (Motion v11)                               │
│  - Styling (Tailwind CSS v4)                             │
└──────────────────────────────────────────────────────────┘
                    ↕ HTTP/JSON REST
┌──────────────────────────────────────────────────────────┐
│          Next.js 16 Server (Node.js 18+)                 │
├──────────────────────────────────────────────────────────┤
│  API Routes (15+ endpoints)                              │
│  - POST   /api/cards (create)                            │
│  - GET    /api/cards (list user's cards)                 │
│  - GET    /api/cards/[id] (get card)                     │
│  - PATCH  /api/cards/[id] (update)                       │
│  - DELETE /api/cards/[id] (delete)                       │
│  - POST   /api/cards/[id]/send (email)                   │
│  - POST   /api/upload (S3 presigned URL)                 │
│  - GET    /api/templates (template data)                 │
│  - POST   /api/recipients (manage)                       │
│  - GET    /api/auth/[nextauth] (Auth endpoints)          │
│  - GET    /api/health (health check)                     │
│                                                           │
│  Server Components (Data Fetching)                        │
│  - Prisma queries from server components                 │
│  - Direct database access                                │
│  - Zero client-side JS for fetching                      │
│                                                           │
│  Middleware                                               │
│  - Authentication checks                                 │
│  - Route protection                                      │
│  - Session validation                                    │
└──────────────────────────────────────────────────────────┘
             ↕                  ↕                  ↕
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │  PostgreSQL  │    │   AWS S3     │    │  Resend API  │
  │  Database    │    │  Image Store │    │  Email Svc   │
  └──────────────┘    └──────────────┘    └──────────────┘
  (Prisma ORM)     (Presigned URLs)    (SMTP Integration)
```

## Internationalization Architecture

### i18n System Design
```
┌──────────────────────────────────────────────────────┐
│         LanguageProvider (Context)                    │
├──────────────────────────────────────────────────────┤
│  - Current locale (EN/VI)                            │
│  - setLocale function                                │
│  - localStorage persistence                          │
│  - Default: English (EN)                             │
└──────────────────────────────────────────────────────┘
                    ↕
┌──────────────────────────────────────────────────────┐
│         useTranslation Hook                          │
├──────────────────────────────────────────────────────┤
│  - Returns: { t: TranslationFunction, locale }       │
│  - Usage: const { t } = useTranslation()            │
│  - Access: t('section.key') returns translated text  │
└──────────────────────────────────────────────────────┘
                    ↕
┌──────────────────────────────────────────────────────┐
│    Translation Files (Type-Checked)                  │
├──────────────────────────────────────────────────────┤
│  src/lib/i18n/en.ts  (English - 247 keys)           │
│  src/lib/i18n/vi.ts  (Vietnamese - 100% parity)    │
│  - Organized in 20 semantic sections                │
│  - Full TypeScript interface parity                 │
│  - Automatic type inference in components           │
└──────────────────────────────────────────────────────┘
```

### Translation Structure
```typescript
// 20 Sections with semantic grouping:
- common (basics)
- home (landing page)
- auth (login/auth)
- dashboard (user area)
- editor (card creation)
- customization (styling)
- cards (card display)
- sharing (social features)
- errors (error messages)
- validation (form validation)
- buttons (CTA labels)
- labels (field names)
- placeholders (input hints)
- messages (notifications)
- templates (design names)
- effects (animation names)
- decorations (festive elements)
- lunar (Vietnamese Lunar New Year)
- music (audio labels)
- metadata (SEO/meta tags)
```

### Language Switcher Component
- Location: `src/components/shared/language-switcher.tsx`
- Features: EN/VI toggle with flag emoji (🇬🇧/🇻🇳)
- Updates locale context and localStorage
- Instant re-render on language change

## Implementation Status (All 8 Phases Complete)

### Phase 1: Foundation (Complete)
**Database & Infrastructure**
- PostgreSQL with Prisma ORM
- 6 database models: User, Card, Recipient, Template, View, Feedback
- Auth.js v5 with Google OAuth
- PrismaClient singleton pattern
- Middleware for route protection
- Environment configuration

### Phase 2: Authentication & Layout (Complete)
**Auth System & UI Framework**
- Login page with OAuth
- Navbar with user state
- Protected dashboard layout
- Landing page with features
- Session management
- User context provision

### Phase 3: Templates & Types (Complete)
**Card Design System**
- 5 premium templates (Traditional, Modern, Animated, Minimal, Elegant)
- Color palettes (12+ colors per template)
- Font definitions and hierarchy
- Greeting suggestions
- TypeScript types for templates
- Template registry system

### Phase 4: Card Editor (Complete)
**4-Step Card Creation Wizard**
- Template selection component
- Customizer panel (text, colors, fonts)
- Recipient management interface
- Preview/send interface
- useReducer state management
- S3 presigned URL uploads
- 10 sub-components

### Phase 5: Card Viewer (Complete)
**Public Card Experience**
- Public /card/[slug] route
- Envelope animation on load
- 4 visual effects (Motion v11):
  - Fireworks effect
  - Snow particles
  - Cherry blossom animation
  - Confetti burst
- Music player with controls
- Social sharing (Twitter, Facebook, LinkedIn)
- QR code generation
- Dynamic OG images for social cards

### Phase 6: Dashboard (Complete)
**User Management**
- Card list view with pagination
- Statistics modal (created, viewed, sent)
- Delete functionality with confirmation
- Recipient management
- Email distribution (Resend API)
- Share modal
- Real-time status updates

### Phase 7: Optimization (Complete)
**Polish & Production Ready**
- Input validation utilities
- Rate limiting on API endpoints
- Loading states
- Error boundaries
- 404 error page
- SEO metadata
- robots.txt and sitemap
- Dark mode support

### Phase 8: Internationalization & Vietnamese Features (Complete)
**Multi-language Support & Culturally-Relevant Design**
- Lightweight Context-based i18n (zero external dependencies)
- English & Vietnamese translations (247 keys, type-checked)
- Language switcher component with flag emoji
- Vietnamese Lunar New Year SVG decorations (6 components):
  - MaiFlower (apricot blossoms)
  - Lantern (red lanterns)
  - DragonMotif (dragon imagery)
  - BanhChung (traditional cake)
  - CherryBlossomBranch (cherry blooms)
  - MaiPetals (falling petals)
- Traditional template redesign with layered Vietnamese decorations
- Vietnamese music presets (3 new songs):
  - Xuân Đã Về (Spring Has Come)
  - Mùa Xuân Ơi (Oh Spring)
  - Lý Ngựa Ô (traditional folk song)
- Music selector reorganized into categorized groups
- Providers moved to root layout for global coverage
- Server/client component split for landing & login pages

## Production Architecture (Implemented)

```
┌──────────────────────────────────────────────────────┐
│         New Year Greeting Card App (Next.js 16)      │
├──────────────────────────────────────────────────────┤
│  Presentation Layer (React 19 Components)             │
│  ┌────────────────────────────────────────────────┐  │
│  │ Pages: Home, Login, Create, Dashboard, Viewer │  │
│  │ Components: Editor Wizard, Card Display,      │  │
│  │ Dashboard Grid, Animations (Motion v11)       │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  Business Logic Layer (API Routes)                    │
│  ┌────────────────────────────────────────────────┐  │
│  │ Card Service: create, read, update, delete    │  │
│  │ Auth Service: OAuth, sessions, protection     │  │
│  │ Email Service: distribution, tracking         │  │
│  │ Upload Service: S3 presigned URLs              │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  Data Access Layer (Prisma ORM)                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ User model: authentication, profile data       │  │
│  │ Card model: greeting content, templates       │  │
│  │ Recipient model: email, delivery status       │  │
│  │ View model: analytics, engagement tracking    │  │
│  │ Template model: designs, colors, fonts        │  │
│  └────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────┤
│  Integration Layer                                    │
│  ┌────────────────────────────────────────────────┐  │
│  │ Google OAuth (authentication)                  │  │
│  │ AWS S3 (image storage)                         │  │
│  │ Resend API (email distribution)                │  │
│  │ PostgreSQL (persistent data)                   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
                     ↕
        ┌──────────────────────────┐
        │   PostgreSQL Database    │
        ├──────────────────────────┤
        │ Models:                  │
        │ - users (auth, profile)  │
        │ - cards (content)        │
        │ - recipients (delivery)  │
        │ - templates (designs)    │
        │ - views (analytics)      │
        │ - feedback (ratings)     │
        └──────────────────────────┘
```

### Scaling Strategy (For Future)

**Phase 8 Potential Additions:**
- Caching layer (Redis) for card lookups
- CDN (CloudFront) for image delivery
- Background jobs (Bull queue) for email
- Analytics dashboard (PostHog/Plausible)
- Admin panel for content management
- A/B testing framework

**Phase 9 Potential Additions:**
- Multi-region deployment
- Database replication
- Message queues for async processing
- Real-time notifications (WebSockets)
- Advanced analytics
- Machine learning recommendations

## Data Model (Prisma Schema)

```typescript
// User Model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  cards         Card[]
  recipients    Recipient[]
  views         View[]
  feedback      Feedback[]
}

// Card Model
model Card {
  id          String    @id @default(cuid())
  slug        String    @unique          // URL-safe identifier
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  title       String
  message     String?
  templateId  String
  template    Template  @relation(fields: [templateId], references: [id])

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  expiresAt   DateTime?

  recipients  Recipient[]
  views       View[]
  feedback    Feedback[]
}

// Recipient Model
model Recipient {
  id        String   @id @default(cuid())
  cardId    String
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)

  email     String
  name      String?
  sentAt    DateTime?
  status    String   @default("pending")  // pending, sent, opened

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  views     View[]
}

// Template Model
model Template {
  id            String   @id @default(cuid())
  name          String   @unique
  description   String?
  config        Json     // { colors: [], fonts: [], effects: [] }

  cards         Card[]
}

// View Model
model View {
  id          String   @id @default(cuid())
  cardId      String
  card        Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)

  recipientId String
  recipient   Recipient @relation(fields: [recipientId], references: [id], onDelete: Cascade)

  viewedAt    DateTime @default(now())
  ip          String?
}

// Feedback Model
model Feedback {
  id        String   @id @default(cuid())
  cardId    String
  card      Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  rating    Int?     // 1-5
  comment   String?

  createdAt DateTime @default(now())
}
```

### Type Definitions

```typescript
// Card Types
export type CardStatus = 'draft' | 'sent' | 'expired' | 'archived'

export interface CardWithRelations extends Card {
  user: User
  recipients: Recipient[]
  views: View[]
  template: Template
}

// Template Types
export interface Template {
  id: string
  name: string
  colors: Color[]
  fonts: Font[]
  effects: string[]
}

export interface Color {
  name: string
  value: string
  hex: string
}

export interface Font {
  name: string
  family: string
  sizes: number[]
  weights: number[]
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
```

## API Route Structure (15+ Endpoints)

### Card Endpoints
```
GET    /api/cards                   - List user's cards (paginated)
POST   /api/cards                   - Create new greeting card
GET    /api/cards/[id]              - Get card details
PATCH  /api/cards/[id]              - Update card
DELETE /api/cards/[id]              - Delete card
POST   /api/cards/[id]/send         - Send card via email
```

### Template Endpoints
```
GET    /api/templates               - Get all available templates
GET    /api/templates/[id]          - Get template details
```

### Recipient Endpoints
```
POST   /api/recipients              - Add recipient to card
DELETE /api/recipients/[id]         - Remove recipient
GET    /api/recipients/[id]/status  - Check delivery status
```

### Upload Endpoints
```
POST   /api/upload                  - Get S3 presigned URL for images
```

### Auth Endpoints
```
POST   /api/auth/signin             - OAuth signin (Google)
GET    /api/auth/callback           - OAuth callback handler
POST   /api/auth/signout            - Sign out user
GET    /api/auth/session            - Get current session
```

### Health & Utility
```
GET    /api/health                  - Health check endpoint
GET    /api/og-image/[slug]         - Generate dynamic OG images
```

### Rate Limiting Applied To:
- Card creation (10 per minute)
- Email sending (20 per minute)
- Image uploads (5 per minute)
- Auth endpoints (5 failed attempts = 15 min block)

## Component Architecture (50+ Components)

### Page Components (in src/app/)

```
src/app/
├── page.tsx                              # Landing page (/)
├── (auth)/
│   ├── login/page.tsx                   # Login page (/login)
│   └── layout.tsx                       # Auth layout
├── (protected)/
│   ├── dashboard/page.tsx               # Dashboard (/dashboard)
│   ├── create/page.tsx                  # Card editor (/create)
│   └── layout.tsx                       # Protected layout
├── card/[slug]/page.tsx                 # Public card (/card/[slug])
└── layout.tsx                           # Root layout
```

### Card Editor Components (10 sub-components)
```
CardWizard.tsx                  # Main wizard container
TemplateSelector.tsx            # Step 1: Template selection
Customizer.tsx                  # Step 2: Customize (text, colors)
RecipientForm.tsx               # Step 3: Add recipients
PreviewAndSend.tsx              # Step 4: Preview & send

# Supporting components
ColorPicker.tsx                 # Color selection UI
FontSelector.tsx                # Font selection UI
TextInput.tsx                   # Message input
ImageUpload.tsx                 # Image upload with S3
RecipientList.tsx               # Recipient management
```

### Card Viewer Components
```
CardDisplay.tsx                 # Main card viewer
EnvelopeAnimation.tsx           # Opening animation
Effects.tsx                     # Visual effects (fireworks, snow, etc.)
MusicPlayer.tsx                 # Audio player
ShareModal.tsx                  # Social sharing
QRCodeDisplay.tsx               # QR code viewer
```

### Dashboard Components
```
CardGrid.tsx                    # Card list grid
CardListItem.tsx                # Individual card item
StatsModal.tsx                  # Statistics display
DeleteDialog.tsx                # Delete confirmation
ShareModal.tsx                  # Share dialog
FilterBar.tsx                   # Search & filter
Pagination.tsx                  # Pagination controls
```

### Common Components
```
Navbar.tsx                      # Navigation header
Button.tsx                      # Base button
Modal.tsx                       # Modal dialog
LoadingSpinner.tsx              # Loading indicator
ErrorMessage.tsx                # Error display
SuccessMessage.tsx              # Success toast
Form.tsx                        # Form wrapper
Input.tsx                       # Text input field
Select.tsx                      # Select dropdown
Badge.tsx                       # Status badge
```

### Error Handling
```
ErrorBoundary.tsx               # React error boundary
NotFound.tsx                    # 404 page
ErrorFallback.tsx               # Error UI
```

### Custom Hooks (10+)
```
useAuth.ts                      # Authentication & session
useCardEditor.ts                # Multi-step form state (useReducer)
useCards.ts                     # Cards data fetching
useTemplate.ts                  # Template loading
useForm.ts                      # Generic form state
usePagination.ts                # Pagination logic
useLocalStorage.ts              # Local storage persistence
useDarkMode.ts                  # Dark mode toggle
useAsync.ts                     # Async operation handling
useDebounce.ts                  # Debounce hook
```

## Authentication Flow (Implemented - Auth.js v5)

### OAuth Login Flow
```
1. User clicks "Sign in with Google"
   ↓
2. Redirects to /api/auth/signin?callbackUrl=/dashboard
   ↓
3. Auth.js redirects to Google OAuth consent screen
   ↓
4. User grants permissions
   ↓
5. Google redirects to /api/auth/callback?code=XXX
   ↓
6. Auth.js exchanges code for tokens
   ↓
7. Creates/updates user in database
   ↓
8. Sets secure session cookie (httpOnly)
   ↓
9. Redirects to /dashboard with session
```

### Session Management
```
- JWT tokens in secure httpOnly cookies
- Server-side session validation via middleware
- Auto-refresh on token expiry
- Session data available in server components
- useAuth hook for client components

Middleware Protection:
- src/middleware.ts checks session on protected routes
- Route groups: (auth) and (protected)
- Redirects to /login if no session
```

### Token Security
```
- NEXTAUTH_SECRET for signing
- httpOnly cookies (not accessible from JS)
- SameSite=Lax for CSRF protection
- Secure flag enabled in production
- Token expiry: 30 days
```

## Security Considerations

### Authentication & Authorization
- JWT tokens for stateless auth
- httpOnly cookies for refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt (min 12 rounds)
- Email verification for signup

### Data Protection
- End-to-end encryption for sensitive data
- PCI DSS compliance for payment data
- HTTPS/TLS for all communication
- Rate limiting on auth endpoints
- Input validation and sanitization

### API Security
- CORS configuration (restrict origins)
- CSRF protection via tokens
- Request size limits
- API key rotation policy
- Audit logging for sensitive operations

## Performance Strategy

### Frontend Optimization
- Code splitting by route
- Image optimization with next/image
- CSS tree-shaking with Tailwind
- Component memoization where needed
- Lazy loading of heavy components

### Backend Optimization
- Database query optimization (indexes)
- Connection pooling
- Caching layer (Redis)
- Pagination for large datasets
- Async job processing for heavy tasks

### Monitoring & Observability
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Logging (Winston, Pino)
- Analytics (Google Analytics, Mixpanel)
- Health checks and status pages

## Scaling Strategy

### Horizontal Scaling
- Stateless API design
- Load balancer (Vercel/AWS)
- Read replicas for database
- Message queues for background jobs

### Vertical Scaling
- Database indexing
- Query optimization
- Caching strategies
- Asset optimization

## Deployment Architecture

### Development Environment
```
- Local machine with Node.js 18+
- PostgreSQL database (local or cloud dev)
- Environment variables in .env.local
- npm run dev for hot reload
- Full feature testing locally
```

### Staging Deployment (Optional)
```
- Vercel deployment (auto-deploy from branch)
- Staging database (separate PostgreSQL)
- Environment variables in .env.staging
- Google OAuth staging credentials
- S3 bucket for staging uploads
```

### Production Deployment
```
- Vercel (serverless Next.js hosting)
- Production PostgreSQL database
- AWS S3 for image storage
- Google OAuth production credentials
- Resend for email distribution
- CloudFront CDN for static assets (optional)

Zero-downtime deployment:
- Automatic blue-green deployment via Vercel
- Database migrations run before deploy
- Rollback capability built-in
```

### Environment Configuration
```
.env.local (development)
.env.staging (staging)
.env.production (production)

Critical variables:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- GOOGLE_ID / GOOGLE_SECRET
- AWS_REGION / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
- RESEND_API_KEY
- S3_BUCKET_NAME
```

### Monitoring & Logging
```
- Error tracking: Sentry (optional)
- Analytics: Google Analytics, PostHog
- Logs: CloudWatch, Vercel logs
- Health checks: /api/health endpoint
- Uptime monitoring: StatusPage.io (optional)
```

## Technology Stack (Final Decisions)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Framework | Next.js 16 | Full-stack, SSR/SSG, excellent DX |
| Language | TypeScript 5 | Type safety, fewer runtime errors |
| Runtime | Node.js 18+ | Industry standard, excellent performance |
| UI Library | React 19 | Server components, reduced JS |
| Styling | Tailwind CSS v4 | Utility-first, Lightning CSS compilation |
| Database | PostgreSQL | Reliable, powerful, great Prisma support |
| ORM | Prisma | Type-safe, great DX, migrations |
| Auth | Auth.js v5 | Modern, supports OAuth, secure by default |
| Storage | AWS S3 | Reliable, cost-effective, presigned URLs |
| Email | Resend API | Modern, great deliverability, TypeScript |
| Animation | Motion v11 | Smooth animations, React integration |
| Icons | Lucide React | Consistent, well-designed icons |
| Utilities | nanoid, date-fns, zod | Lightweight, focused, type-safe |

### Optional Future Additions
- **Cache**: Redis for card lookups
- **CDN**: CloudFront for image delivery
- **Queue**: Bull for background jobs
- **Monitoring**: Sentry for error tracking
- **Analytics**: PostHog for usage analytics
- **Admin**: Custom admin panel (Phase 8)

## Error Handling Strategy

```typescript
// Custom error classes
class ValidationError extends Error {}
class AuthenticationError extends Error {}
class AuthorizationError extends Error {}
class NotFoundError extends Error {}
class ExternalServiceError extends Error {}

// Error response format
interface ErrorResponse {
  error: {
    code: string          // e.g., 'VALIDATION_ERROR'
    message: string       // User-friendly message
    details?: Record<string, any>
    timestamp: string
    requestId: string     // For debugging
  }
}
```

## Monitoring & Logging

### Log Levels
- **ERROR**: Failed operations, exceptions
- **WARN**: Unusual conditions, deprecations
- **INFO**: Important events (login, payment)
- **DEBUG**: Detailed flow information (dev only)

### Metrics to Track
- Request latency (p50, p95, p99)
- Error rate
- Database query performance
- External API response times
- User acquisition and retention
- Payment success rate
- Redemption rate

## Integration Points

### Third-Party Services

1. **Payment Processing**
   - Webhook handling for payment confirmations
   - PCI compliance through tokenization
   - Refund handling

2. **Email Service**
   - Transactional emails (verification, receipts)
   - Marketing emails (TBD)
   - Bounce/complaint handling

3. **SMS Service** (Phase 2)
   - Gift card distribution via SMS
   - Redemption reminders

4. **Analytics**
   - User behavior tracking
   - Business metrics
   - Funnel analysis

## Disaster Recovery

### Backup Strategy
- Daily automated database backups
- 30-day retention period
- Regular restore testing
- Off-site backup storage

### High Availability
- Database replication
- Load balancing
- Health checks
- Failover mechanisms
- Status monitoring dashboard

## Performance Optimization Strategies

### Frontend Optimization
- Server components reduce client-side JavaScript
- Code splitting per route (automatic)
- Image optimization via next/image
- CSS tree-shaking via Tailwind
- Lazy loading for heavy components
- Memoization for expensive computations

### Backend Optimization
- Database connection pooling (Prisma)
- Query optimization with proper indexes
- Caching for template data
- Pagination for large datasets
- Efficient S3 uploads with presigned URLs

### Monitoring Metrics
- Page load time: Target < 2 seconds
- API response time: Target < 500ms
- Database query time: Target < 100ms
- Build time: ~30-45 seconds
- Bundle size: ~400-500 KB gzipped

## Security Implementation

### Authentication & Authorization
- Auth.js v5 with OAuth 2.0
- JWT tokens in secure httpOnly cookies
- Session validation via middleware
- CORS configuration for API
- Rate limiting on sensitive endpoints

### Data Protection
- Database encryption in transit (SSL/TLS)
- Password hashing via bcrypt (Auth.js)
- Input validation with Zod schemas
- SQL injection prevention (Prisma)
- CSRF protection (SameSite cookies)

### API Security
- Rate limiting (10-20 requests/min per user)
- Input size limits
- Error message obfuscation
- Request validation
- Security headers (Helmet)

## Disaster Recovery

### Backup Strategy
- Daily automated PostgreSQL backups
- 30-day retention period
- Regular restore testing
- Off-site backup storage (AWS)

### High Availability
- Database connection redundancy
- Health check endpoint (/api/health)
- Error monitoring with Sentry
- Status page for incidents

## Related Documentation

- **codebase-summary.md** - Implementation details
- **code-standards.md** - Development guidelines
- **project-overview-pdr.md** - Requirements
- **project-roadmap.md** - Phase completion status

## Architecture Review Schedule

- **Monthly**: Performance monitoring
- **Quarterly**: Security audit
- **Yearly**: Major architecture assessment

## Version History

| Version | Date | Status | Phases |
|---------|------|--------|--------|
| 1.0.0 | 2026-02-16 | Production Ready | All 7 complete |
| 0.7.0 | 2026-02-16 | Phase 7 | Polish & Optimization |
| 0.1.0 | 2026-02-15 | Design | Initial planning |

---

*Last updated by Docs Manager on 2026-02-16. All 7 development phases completed and documented. Production ready.*

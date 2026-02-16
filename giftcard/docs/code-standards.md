# Code Standards - Gift Card App

**Last Updated**: 2026-02-15
**Version**: 0.1.0
**Framework**: Next.js 16.1.6 + TypeScript 5

## Core Principles

1. **YAGNI (You Aren't Gonna Need It)**: Don't add code that isn't needed now
2. **KISS (Keep It Simple, Stupid)**: Choose clarity over cleverness
3. **DRY (Don't Repeat Yourself)**: Extract repeated code to reusable functions
4. **Type Safety**: Leverage TypeScript fully - no `any` without justification

## File Organization

### Directory Structure

```
src/
├── app/                         # App Router pages and layouts
│   ├── (auth)/                 # Auth route group
│   ├── (protected)/            # Protected route group
│   ├── card/                   # Public card routes
│   ├── api/                    # API routes
│   ├── components/             # Reusable components
│   │   ├── auth/              # Auth components
│   │   ├── card-editor/       # Editor components
│   │   ├── card-viewer/       # Viewer components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── common/            # Shared components
│   │   └── error-boundaries/  # Error handling
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Core library code
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   ├── styles/                # Global & component styles
│   ├── middleware.ts          # Auth middleware
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Schema versions
├── public/                    # Static assets
├── next.config.ts            # Next.js config
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── postcss.config.mjs        # PostCSS config
├── .env.example              # Environment template
└── package.json              # Dependencies
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| React Components | PascalCase | `GiftCardForm.tsx` |
| Pages | PascalCase | `CreateCard.tsx` |
| Utilities | camelCase | `formatCurrency.ts` |
| Hooks | camelCase, prefix with `use` | `useGiftCard.ts` |
| Types | PascalCase | `GiftCard.ts` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL` |
| CSS/Tailwind | kebab-case | `card-header.css` |

### File Size Guidelines

- **Components**: Keep under 200 lines (split if exceeds)
- **Utilities**: Keep under 150 lines (extract if larger)
- **Type Files**: Keep under 100 lines
- **API Routes**: Keep under 100 lines per handler

If approaching limits, split into modules:
```
src/app/components/
├── GiftCardForm/
│   ├── index.tsx          # Main component
│   ├── FormFields.tsx     # Subcomponent
│   ├── Validation.ts      # Helper functions
│   └── types.ts           # Local types
```

## TypeScript Standards

### Type Declarations

```typescript
// Good: Explicit types
interface GiftCard {
  id: string
  amount: number
  recipientEmail: string
  createdAt: Date
  expiresAt?: Date
}

// Bad: Implicit any
const createCard = (data) => { /* ... */ }

// Good: Explicit parameters
const createCard = (data: CreateCardInput): Promise<GiftCard> => {
  // ...
}
```

### Strict Mode (Required)

All TypeScript files use strict mode:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Type Definition Location

```typescript
// utils/types.ts - Central location
export interface GiftCard { /* ... */ }
export type CardStatus = 'active' | 'redeemed' | 'expired'
export enum RedemptionMethod { EMAIL, SMS, QR }

// ❌ Avoid: Types scattered in components
// ✅ Do: Import from central types.ts
```

## React & Next.js Patterns

### Server vs Client Components

```typescript
// Server Component (default) - Reduces JS sent to browser
// src/app/dashboard/page.tsx
import { CardList } from '@/components/dashboard/CardList'
import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const cards = await prisma.card.findMany({
    where: { userId: session.user.id }
  })
  return <CardList cards={cards} />
}

// Client Component - Only for interactivity
// src/app/components/card-editor/CardWizard.tsx
'use client'

import { useReducer } from 'react'
import { cardEditorReducer } from './reducer'

export function CardWizard() {
  const [state, dispatch] = useReducer(cardEditorReducer, initialState)

  return (
    <div>
      <TemplateSelector onSelect={(t) => dispatch({ type: 'SELECT_TEMPLATE', payload: t })} />
      {/* other steps */}
    </div>
  )
}
```

**Rule**: Use server components by default for data fetching. Add `'use client'` only for interactivity (useState, useEffect, event handlers). This reduces client-side JavaScript.

### Component Structure

```typescript
interface CardGridProps {
  cards: GiftCard[]
  onSelect: (id: string) => void
}

export function CardGrid({ cards, onSelect }: CardGridProps) {
  return (
    <div className="grid gap-4">
      {cards.map(card => (
        <Card key={card.id} card={card} onClick={() => onSelect(card.id)} />
      ))}
    </div>
  )
}
```

### Props Pattern

```typescript
// ✅ Good: Typed props interface
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}

// ❌ Avoid: Any types
export function Button(props: any) { /* ... */ }
```

### Hooks Usage

```typescript
// ✅ Good: Custom hook for state logic
export function useCardEditor() {
  const [state, dispatch] = useReducer(cardEditorReducer, initialState)

  const selectTemplate = (templateId: string) => {
    dispatch({ type: 'SELECT_TEMPLATE', payload: templateId })
  }

  const customize = (options: CustomizeOptions) => {
    dispatch({ type: 'CUSTOMIZE', payload: options })
  }

  return { state, selectTemplate, customize }
}

// ✅ Good: Use in client component
'use client'

export function CardWizard() {
  const { state, selectTemplate, customize } = useCardEditor()

  return (
    <>
      <TemplateSelector onSelect={selectTemplate} />
      <Customizer onApply={customize} />
    </>
  )
}

// ❌ Avoid: Complex API calls in hooks (use Server Components)
export function useCards() {
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(setCards)
  }, [])

  return cards
}
// Instead: Fetch in server component, pass cards as props
```

## Internationalization (i18n) Standards

### Translation Key Naming Conventions

```typescript
// Pattern: section.key
// Sections: common, home, auth, dashboard, editor, etc.

// Good examples:
t('common.loading')           // Common UI elements
t('auth.login-button')        // Auth-specific text
t('editor.title-input')       // Editor section
t('validation.email-invalid') // Validation messages
t('errors.network-error')     // Error messages
t('lunar.mai-flower')         // Vietnamese elements

// Avoid:
t('button_click_me')          // Unclear section
t('messageForUser')           // Mixed case, no section
t('HEADING_1')                // All caps, no context
```

### Adding New Translations

1. **Update both files simultaneously** (maintain parity):
   - `src/lib/i18n/en.ts`
   - `src/lib/i18n/vi.ts`

2. **Type safety check**:
   ```typescript
   // In en.ts:
   export const en = {
     newSection: {
       newKey: 'English text'
     }
   }

   // In vi.ts - must have identical structure:
   export const vi = {
     newSection: {
       newKey: 'Tiếng Việt'
     }
   }
   ```

3. **Use in components**:
   ```typescript
   'use client'

   import { useTranslation } from '@/lib/i18n'

   export function MyComponent() {
     const { t } = useTranslation()

     return (
       <div>
         <h1>{t('newSection.newKey')}</h1>
       </div>
     )
   }
   ```

### Language Switching

```typescript
'use client'

import { useLanguageContext } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageContext()

  return (
    <button onClick={() => setLocale(locale === 'en' ? 'vi' : 'en')}>
      {locale === 'en' ? '🇬🇧 EN' : '🇻🇳 VI'}
    </button>
  )
}
```

### Locale Persistence

- Locale preference saved to `localStorage` with key `preferred-locale`
- Default: `en` (English)
- Persists across sessions and browser tabs
- Loaded on app initialization in root layout

## Styling with Tailwind CSS v4

### Utility-First Approach

```typescript
// ✅ Good: Compose with Tailwind utilities
export function CardGrid() {
  return (
    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-4
      p-6
    ">
      <button className="
        bg-blue-600
        hover:bg-blue-700
        dark:bg-blue-800
        dark:hover:bg-blue-900
        text-white
        px-4 py-2
        rounded-lg
        transition-colors
      ">
        Create Card
      </button>
    </div>
  )
}

// ✅ Good: Extract repeated patterns to components
export function CardButton({ children, ...props }) {
  return (
    <button
      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 text-white px-4 py-2 rounded-lg"
      {...props}
    >
      {children}
    </button>
  )
}

// ❌ Avoid: Inline styles for things Tailwind handles
<div style={{ display: 'grid', gap: '1rem' }}>
  // Use: className="grid gap-4" instead
</div>
```

### Responsive Design

```typescript
// Mobile-first (default xs)
<div className="
  px-4 py-2              // Default (mobile)
  sm:px-6                // Small screens
  md:px-8 md:py-4        // Medium screens
  lg:px-12 lg:py-6       // Large screens
">
  Content
</div>
```

### Dark Mode Support

```typescript
// Tailwind v4 handles prefers-color-scheme automatically
// No additional setup needed - dark: prefix works globally

export function CardViewer() {
  return (
    <div className="
      bg-white text-gray-900
      dark:bg-gray-900 dark:text-white
      transition-colors duration-200
    ">
      <h1 className="
        text-3xl font-bold
        text-blue-600
        dark:text-blue-400
      ">
        Greeting Card
      </h1>
      <p className="
        text-gray-600
        dark:text-gray-300
        mt-2
      ">
        A message for you
      </p>
    </div>
  )
}

// Dark mode is automatic based on:
// - system preference (prefers-color-scheme)
// - Manual toggle (localStorage)
// - No class management needed
```

### Component Classes

For complex components, extract to reusable class utilities:

```typescript
// utils/classNames.ts
export const buttonClasses = {
  base: 'inline-flex items-center justify-center font-medium rounded',
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  sizes: {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
}

// Use in components
import { buttonClasses } from '@/utils/classNames'

<button className={`${buttonClasses.base} ${buttonClasses.primary} ${buttonClasses.sizes.md}`}>
  Click me
</button>
```

## API Routes & Server Actions

### API Route Structure

```typescript
// src/app/api/cards/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateCardInput } from '@/lib/validation'
import { rateLimit } from '@/lib/rate-limit'

// GET - Fetch user's cards
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(session.user.id, 'read-cards')
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const cards = await prisma.card.findMany({
      where: { userId: session.user.id },
      include: { recipients: true }
    })

    return NextResponse.json({ cards })
  } catch (error) {
    console.error('GET /api/cards:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST - Create new card
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = validateCardInput(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.errors }, { status: 400 })
    }

    const card = await prisma.card.create({
      data: {
        userId: session.user.id,
        ...body,
        slug: nanoid()
      }
    })

    return NextResponse.json({ card }, { status: 201 })
  } catch (error) {
    console.error('POST /api/cards:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
```

### Key Patterns Used
1. **Authentication**: Check session before processing
2. **Rate Limiting**: Prevent abuse on critical endpoints
3. **Input Validation**: Use zod schemas for validation
4. **Error Handling**: Consistent error responses
5. **Database**: Use Prisma for type-safe queries
6. **Logging**: Log errors for debugging

### Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await processPayment(cardData)
  return result
} catch (error) {
  if (error instanceof ValidationError) {
    return { error: error.message, code: 'VALIDATION_FAILED' }
  }
  if (error instanceof DatabaseError) {
    return { error: 'Database operation failed', code: 'DB_ERROR' }
  }
  // Log unexpected errors
  console.error('Unexpected error:', error)
  return { error: 'Internal server error', code: 'UNKNOWN' }
}

// ❌ Avoid: Bare catch-all
try {
  // ...
} catch (e) {
  console.log('Error')
}
```

## Naming Conventions

### Variables & Functions

```typescript
// ✅ Clear, descriptive names
const giftCardAmount = 50
const isCardExpired = false
const fetchGiftCardById = (id: string) => { /* ... */ }

// ❌ Ambiguous abbreviations
const amt = 50
const expired = false
const getCard = (id) => { /* ... */ }
```

### Constants

```typescript
// ✅ Semantic naming
const MAX_GIFT_CARD_AMOUNT = 1000
const MIN_GIFT_CARD_AMOUNT = 1
const CARD_EXPIRATION_DAYS = 365
const API_TIMEOUT_MS = 5000

// ❌ Generic names
const MAX = 1000
const TIMEOUT = 5000
```

### Boolean Variables

```typescript
// ✅ Use is/has prefix for booleans
const isLoading = true
const hasErrors = false
const isCardExpired = true
const hasValidation = true

// ❌ Unclear naming
const loading = true
const errors = false
const expired = true
```

## Comments & Documentation

### When to Comment

```typescript
// ✅ Good: Explain WHY, not WHAT
const GRACE_PERIOD_MS = 5000 // Allow 5 seconds for payment webhook callback

// ✅ Good: Document complex logic
// Calculate expiry using business rule: annual + 30 day grace period
const expiryDate = new Date(createdAt.getFullYear() + 1, createdAt.getMonth(), createdAt.getDate())

// ❌ Poor: Obvious comments
const name = 'John' // Set name to John
const card = getCard() // Get the card

// ❌ Outdated comments
const deprecated_function = () => { /* ... */ } // This might be removed
```

### JSDoc for Public APIs

```typescript
/**
 * Create a new gift card with the provided configuration.
 *
 * @param config - Gift card configuration
 * @param config.amount - Card amount in cents
 * @param config.recipientEmail - Email of card recipient
 * @param config.expiresAt - Optional expiration date
 * @returns Promise resolving to created gift card
 * @throws {ValidationError} If config is invalid
 *
 * @example
 * const card = await createGiftCard({
 *   amount: 5000,
 *   recipientEmail: 'user@example.com'
 * })
 */
export async function createGiftCard(config: CreateCardConfig): Promise<GiftCard> {
  // ...
}
```

## Testing Standards

### Test File Organization

```
src/
├── app/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.test.ts
│   └── utils/
│       ├── formatCurrency.ts
│       └── formatCurrency.test.ts
```

### Test Naming

```typescript
describe('formatCurrency', () => {
  test('formats whole dollars correctly', () => {
    expect(formatCurrency(1000)).toBe('$10.00')
  })

  test('handles cents', () => {
    expect(formatCurrency(1050)).toBe('$10.50')
  })

  test('throws error for negative amounts', () => {
    expect(() => formatCurrency(-100)).toThrow()
  })
})
```

### Coverage Targets

- Minimum: 80% overall coverage
- Critical paths (auth, payments): 100%
- Utils & helpers: 90%+

## Git & Commits

### Conventional Commits

```
feat: add gift card creation form
fix: resolve card expiry date calculation
docs: update installation instructions
refactor: extract button styles to utility
test: add payment validation tests
chore: update dependencies
```

**Format**: `<type>(<scope>): <message>`

### Commit Message Guidelines

- Use present tense: "add feature" not "added feature"
- Keep first line under 50 characters
- Reference issues when applicable: "Fix #123"
- Explain WHY, not WHAT (commit shows what changed)

```
feat(auth): implement email verification

This change adds email verification during signup to prevent
spam accounts and ensure valid contact information.

Implements:
- Email verification link generation
- Token expiration after 24 hours
- Resend verification email endpoint

Fixes #456
```

## Code Review Checklist

- [ ] Types are explicit (no implicit `any`)
- [ ] Error handling is comprehensive
- [ ] No console.log statements in production code
- [ ] Performance optimizations (memoization, lazy loading) where needed
- [ ] Accessibility standards met
- [ ] Tests cover critical paths
- [ ] Documentation is updated
- [ ] No secrets in code (use env vars)

## Security Best Practices

### Environment Variables

```typescript
// ✅ Good: Use environment variables for all secrets
const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET // Public
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY // Private
const DATABASE_URL = process.env.DATABASE_URL // Private
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET // Private

// ✅ Create .env.local from .env.example
// DATABASE_URL=postgresql://user:pass@localhost:5432/db
// AWS_REGION=us-east-1
// AWS_SECRET_ACCESS_KEY=sk_...
// NEXTAUTH_SECRET=xxx

// ❌ Bad: Hardcoded secrets
const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE'
const DB_PASSWORD = 'mypassword123'
```

### Input Validation with Zod

```typescript
// ✅ Good: Validate all inputs with Zod
import { z } from 'zod'

const createCardSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().max(500).optional(),
  templateId: z.string(),
  recipientEmail: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createCardSchema.parse(body)
    // Safe to use data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
  }
}

// ❌ Bad: Trust user input without validation
const card = { title: userInput.title, message: userInput.message }
```

### Rate Limiting

```typescript
// ✅ Implement rate limiting on API routes
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  const limit = await rateLimit(userId, 'create-card', {
    interval: 60, // seconds
    maxRequests: 10
  })

  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Process request
}
```

### Error Messages

```typescript
// ✅ Good: Secure, generic error messages
const error = 'Failed to create card. Please try again.'

// ✅ Log detailed errors server-side
console.error('Database error:', error)

// ❌ Bad: Expose internal details to users
const error = 'Database connection failed: ECONNREFUSED 127.0.0.1:5432'
```

### Authentication & Middleware

```typescript
// ✅ Protect routes with middleware
// src/middleware.ts
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()

  // Redirect to login if accessing protected routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/create/:path*', '/api/protected/:path*']
}
```

## Performance Guidelines

### Image Optimization

```typescript
// ✅ Good: Use Next.js Image
import Image from 'next/image'

<Image src="/card.jpg" width={400} height={300} alt="Gift card" />

// ❌ Bad: HTML img tag
<img src="/card.jpg" alt="Gift card" />
```

### Code Splitting

```typescript
// ✅ Good: Dynamic imports for heavy components
const HeavyForm = dynamic(() => import('@/components/HeavyForm'), {
  loading: () => <Skeleton />,
})

// ❌ Bad: Import everything at top
import HeavyForm from '@/components/HeavyForm'
```

### Memoization

```typescript
// ✅ Good: Memoize expensive computations
const MemoizedCardList = React.memo(CardList)

// ✅ Good: Use useMemo for complex data
const filteredCards = useMemo(() => {
  return cards.filter(card => card.status === 'active')
}, [cards])
```

## Related Documentation

- **codebase-summary.md** - Current structure
- **project-roadmap.md** - Planned features
- **system-architecture.md** - Architecture decisions

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2026-02-15 | Initial standards created |

---

*Last updated by Docs Manager on 2026-02-15*

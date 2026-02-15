# Gift Card App

A modern gift card management platform built with Next.js, React, and Tailwind CSS.

## Project Overview

Gift Card App is a web application for managing, creating, and redeeming digital gift cards. Currently in bootstrap phase with foundational infrastructure in place.

**Status**: Active Development (Phase 0: Setup Complete)
**Version**: 0.1.0
**Last Updated**: 2026-02-15

## Getting Started

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Installation

```bash
# Clone repository
git clone <repository-url>
cd "Gift card"

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (auto-reload on file changes) |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.1.6 |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS | v4 |
| Language | TypeScript | 5 |
| Linting | ESLint | 9 |

### Key Features
- App Router for file-based routing
- TypeScript for type safety
- Tailwind CSS v4 with @tailwindcss/postcss
- Geist font family (optimized via next/font)
- Dark mode support via CSS prefers-color-scheme
- ESLint + core-web-vitals configuration

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Home page (landing)
│   ├── layout.tsx       # Root layout wrapper
│   ├── globals.css      # Global styles + Tailwind
│   └── favicon.ico
public/               # Static assets
.env.example          # Environment variables template
next.config.ts        # Next.js configuration
tsconfig.json         # TypeScript configuration
eslint.config.mjs     # ESLint rules
postcss.config.mjs    # PostCSS configuration
```

## Documentation

Full documentation is maintained in `/docs`:
- **project-overview-pdr.md** - Vision, requirements, and feature roadmap
- **code-standards.md** - Code style, naming conventions, architecture patterns
- **system-architecture.md** - System design and component interactions
- **codebase-summary.md** - Detailed codebase structure and entry points
- **project-roadmap.md** - Development phases and milestones

## Development Workflow

1. Create feature branch from `main`
2. Implement changes following [code standards](./docs/code-standards.md)
3. Run lint checks: `npm run lint`
4. Write/update tests
5. Create pull request with conventional commit messages
6. Code review → merge to main

## Key Configuration

### Path Aliases
Use `@/*` to import from `src/`:
```typescript
import { Component } from '@/app/components/Button'
```

### Tailwind CSS v4
Uses new `@tailwindcss/postcss` package with inline @theme directive.

### Environment Variables
Copy `.env.example` to `.env.local` for local development.

## Roadmap

**Phase 0: Bootstrap** (Complete)
- Setup Next.js project with TypeScript + Tailwind
- Configure ESLint and development tools
- Establish project structure

**Phase 1+**: TBD - See [project-roadmap.md](./docs/project-roadmap.md)

## Contributing

See [code-standards.md](./docs/code-standards.md) for development guidelines.

## Support

For questions or issues, check the documentation or open an issue in the repository.

## License

Private project. See LICENSE file for details.

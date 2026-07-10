# Project Directory Mapping

This document provides a high-level overview of the directory structure for the **online-shop** repository (Next.js App Router + Supabase).

## 1. Root Directory

```text
online-shop/
├── .agents/            # AI Agent skills, architectural guardrails, and memory logs
├── .claude/            # Claude specific configurations and agents
├── .git/               # Git repository configuration
├── src/                # The Next.js web application source code
├── supabase/           # Supabase backend configurations and migrations
└── README.md           # Project overview and setup instructions
```

## 2. Frontend Application (`src/`)

The core of the application resides entirely within the `src/` directory. There is no separate backend directory; backend operations (API, database communication) are handled via Next.js Server Components, Route Handlers, Server Actions, and Supabase.

### 2.1 Configuration Files
- **`package.json`**: NPM dependencies and project scripts.
- **`tsconfig.json`**: TypeScript compiler configuration.
- **`next.config.ts`**: Next.js framework configuration.
- **`.env.local`**: Local environment variables (ignored by Git; must contain Supabase URLs and Keys).

### 2.2 Source Code (`src/`)

```text
src/
└── app/               # Next.js App Router directory
    ├── layout.tsx     # Root application layout
    ├── page.tsx       # Root landing page
    └── api/           # Next.js Route Handlers (HTTP endpoints)
```

## 3. Database Layer (Supabase)
While the database itself is hosted externally (or via local Supabase Docker container), interaction with the database occurs strictly via:
1. **Server Actions** or **Route Handlers** for secure data mutation.
2. **Server Components** for secure data fetching.
3. **Supabase Client** configured for SSR.

## 4. Agent Guidelines
- When navigating the codebase, agents must assume that the Next.js `app/` directory paradigm is in use (Server Components by default).

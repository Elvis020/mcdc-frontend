# Contributing to eMCOD

Thanks for your interest in contributing! Here's how to get started.

## Prerequisites

- Node.js 20+
- A Supabase project

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/Elvis020/mcdc-frontend.git
   cd mcdc-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
  (auth)/           # Login & registration pages
  (dashboard)/      # Protected dashboard pages
components/
  ui/               # shadcn/ui components
  forms/            # Multi-step certificate form
  layout/           # Sidebar, header
lib/
  supabase/         # Supabase client utilities
  validations/      # Zod schemas
types/              # TypeScript type definitions
```

## Branch Strategy

- `main` - Production branch, deployed to Vercel
- Feature branches - Create from `main`, named `feature/your-feature`
- Bug fix branches - Named `fix/description`

## Making Changes

1. Create a new branch from `main`
2. Make your changes
3. Run `npm run build` to verify the build passes
4. Run `npm run lint` to check for linting issues
5. Commit with a clear message describing the change
6. Open a pull request against `main`

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add certificate search functionality
fix: resolve date formatting on certificate view
refactor: simplify form validation logic
```

## Code Style

- TypeScript for all files
- Tailwind CSS for styling (no inline styles or CSS modules)
- Use existing shadcn/ui components from `components/ui/`
- Follow the existing project patterns for new pages and components

## Reporting Issues

Open an issue on GitHub with:
- A clear title and description
- Steps to reproduce (if applicable)
- Expected vs actual behavior

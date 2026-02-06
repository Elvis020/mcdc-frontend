# Contributing to eMCOD

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
4. Run `npm run dev` to start the development server

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

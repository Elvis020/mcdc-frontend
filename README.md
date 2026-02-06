# eMCOD - Electronic Medical Cause of Death Certificate System

A web application for digitizing Ghana's Medical Cause of Death Certificate (Medical Form L, Section 30). Enables doctors to create, manage, and submit death certificates electronically.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Auth & Database**: Supabase
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project

### Setup

1. Clone the repository:
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

## License

Private - All rights reserved.

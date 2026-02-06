# eMCOD - Electronic Medical Cause of Death Certificate System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://mcdc-frontend.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)

A web application for digitizing Ghana's Medical Cause of Death Certificate (Medical Form L, Section 30). Enables doctors to create, manage, and submit death certificates electronically.

## Screenshots

### Authentication

<p align="center">
  <img src="docs/screenshots/sign_in_page.png" alt="Sign In Page" width="400" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/sign_up_page.png" alt="Sign Up Page" width="400" />
</p>

### Desktop

<p align="center">
  <img src="docs/screenshots/dashboard_desktop.png" alt="Dashboard - Desktop" width="400" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/cert_creation_desktop.png" alt="Certificate Creation - Desktop" width="400" />
</p>

### Mobile

<p align="center">
  <img src="docs/screenshots/dashboard_mobile.png" alt="Dashboard - Mobile" width="250" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="docs/screenshots/cert_creation_mobile.png" alt="Certificate Creation - Mobile" width="250" />
</p>

## Features

- Multi-step death certificate form (8 steps with validation)
- Role-based access control (Doctor, Registry, Health Department)
- Draft saving and 5-day edit window after submission
- Responsive design for mobile and desktop
- Supabase authentication with protected routes

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **UI** | React 19, Tailwind CSS v4, shadcn/ui |
| **Auth & Database** | Supabase |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, branch strategy, and code style guidelines.

## License

Private - All rights reserved.

# Next.js 15 Boilerplate with Supabase

A modern, feature-rich boilerplate for SaaS applications built with Next.js 15, TypeScript, Supabase, and Prisma. This project includes authentication, blog functionality, and subscription management out of the box.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Prisma** for type-safe database queries
- **Tailwind CSS** for styling
- **Role-Based Access Control**
- **Subscription Management**
- **Blog System**

## Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account
- Git

## Quick Start

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd [your-project-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials.

4. Set up Supabase:
   - Create a new project in Supabase
   - Enable database access
   - Configure authentication providers
   - Add your IP to the allowlist if using IPv4

5. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/src
  /app             # Next.js 13+ app directory
  /components      # React components
  /lib            # Utility functions and types
  /utils          # Helper functions
  /prisma         # Database schema and migrations
```

## Authentication

This boilerplate uses Supabase Authentication with:
- Email/Password sign-in
- Magic link authentication
- OAuth providers (configurable)
- Session management

## Database Schema

The project includes a basic schema with:
- User management
- Blog posts
- Subscription tiers
- Role-based access control

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Deployment

1. Configure production environment variables
2. Deploy to Vercel:
   ```bash
   vercel
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or open an issue in the repository.

## Acknowledgments

- Next.js team
- Supabase team
- Prisma team
- Open source community

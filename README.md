# Next.js 15 Boilerplate

A modern, feature-rich boilerplate for SaaS applications built with Next.js 15, TypeScript, Supabase, and a dual UI strategy using shadcn/ui and Aceternity UI.

## Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Supabase** for authentication and database
- **Prisma** for type-safe database queries
- **Tailwind CSS** for styling
- **Dual UI Strategy**:
  - shadcn/ui for core application components
  - Aceternity UI for marketing pages (Phase 2)

## UI Implementation Strategy

### Phase 1: Core Application UI
- **shadcn/ui Components**: Primary component library
- **Implementation Areas**: Dashboard, Auth, Blog, Admin sections
- **Integration**: Deep integration with Tailwind CSS
- **Focus**: Functionality and consistency

### Phase 2: Marketing UI Enhancement
- **Aceternity UI**: Enhanced marketing components
- **Implementation Areas**: Landing pages, public sections
- **Focus**: Animated interactions and visual appeal
- **Performance**: Lazy-loaded for optimal bundle size

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Initialize Supabase and update environment variables:
- Create a Supabase project
- Add credentials to .env.local

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

## Component Organization

```
/src
  /components
    /ui          # shadcn/ui core components
    /marketing   # Aceternity UI components (Phase 2)
    /layout      # Shared layouts
```

## Best Practices

### Component Usage
- Use shadcn/ui components for all core application features
- Reserve Aceternity UI components for marketing pages
- Maintain clear separation between application and marketing components

### Performance Considerations
- Marketing components are lazy-loaded
- Bundle size optimization through component separation
- Careful management of animation libraries

## Development Workflow

1. **TypeScript-First Development**
   - Strict type checking enabled
   - Component props fully typed
   - Utility functions type-safe

2. **Component Development**
   - Follow shadcn/ui patterns for core components
   - Document component usage and props
   - Include accessibility considerations

3. **Testing**
   - Unit tests for components
   - Integration tests for features
   - Performance monitoring

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Aceternity UI Documentation](https://ui.aceternity.com)
- [Supabase Documentation](https://supabase.com/docs)

## Deployment

Deploy your application using Vercel:

```bash
npm run build
npm run start
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

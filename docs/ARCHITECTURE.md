# Architecture Decision Records

This document contains important architectural decisions and technical notes for the project.

## Database & ORM

- Using Prisma with Supabase PostgreSQL for type-safe database access
- Supabase Auth for user authentication and session management
- Keeping Prisma schema as source of truth for database structure

### Notes:
- Always run migrations in production using proper deployment procedures
- Keep Prisma Client generation in sync with schema changes
- Consider implementing database pooling for production

### Implementation Details:
```typescript
// Prisma Client Singleton Pattern
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Authentication & Authorization

- Supabase Auth for user authentication
- Custom RBAC implementation for fine-grained access control
- JWT-based session management

### Notes:
- Implement proper token refresh mechanism
- Consider implementing rate limiting for auth endpoints
- Plan for social auth integration in future

### Implementation Details:
```typescript
// Repository Pattern Example
export class UserRepository {
  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
```

## API Design

- REST-based API with Next.js App Router
- Type-safe API routes using Zod for validation
- Proper error handling and status codes

### Notes:
- Consider implementing API versioning strategy
- Plan for proper API documentation
- Implement proper request validation and sanitization

### Implementation Details:
```typescript
// Stripe Webhook Handler Example
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  const signature = req.headers['stripe-signature'];
  const buf = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      buf,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // Handle event...
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
```

## Payment Integration

### Notes:
- Implement idempotency for all payment operations
- Support multiple currencies and locales
- Handle webhooks securely

### Implementation Details:
```typescript
// Idempotent Payment Operation Example
const createCharge = async (customerId: string, amount: number) => {
  const idempotencyKey = `charge_${customerId}_${Date.now()}`;
  try {
    return await stripe.charges.create(
      {
        amount,
        currency: 'usd',
        customer: customerId,
      },
      { idempotencyKey }
    );
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
};
```

## Testing Strategy

### Notes:
- Use MSW for API mocking
- Implement snapshot testing for UI
- Mock external services effectively

### Implementation Details:
```typescript
// MSW Setup Example
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '123',
        name: 'John Doe',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Frontend Architecture

- Next.js 15 with App Router for routing and server components
- Tailwind CSS for styling
- Shadcn UI for component library

### Notes:
- Keep component structure modular and reusable
- Implement proper loading states and error boundaries
- Consider implementing proper state management solution

## Performance Considerations

- Implement proper caching strategies
- Use proper image optimization
- Consider implementing proper bundling strategies

### Notes:
- Monitor bundle sizes
- Implement proper lazy loading
- Consider implementing proper CDN strategy

## Security Considerations

- Implement proper CORS policies
- Use proper CSP headers
- Implement proper input validation

### Notes:
- Regular security audits
- Keep dependencies updated
- Implement proper logging for security events
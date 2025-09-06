# edu.turkish Server Implementation

This document describes the complete server infrastructure implementation for the edu.turkish project, replacing mock data with a full MySQL database backend.

## Architecture Overview

The server implementation includes:

- **MySQL Database** with Docker containerization
- **Prisma ORM** for database operations and migrations
- **Repository Pattern** for data access layer
- **Multilingual Support** with translation tables
- **Seeding System** to migrate existing mock data

## Prerequisites

- Node.js 18+ (compatible with Nuxt 4)
- Docker and Docker Compose
- npm/pnpm/yarn

## Getting Started

### 1. Environment Setup

Copy the environment file and configure your database settings:

```bash
cp .env.example .env
```

Edit `.env` and adjust database settings if needed:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=edu_turkish
DB_USER=edu_turkish_user
DB_PASSWORD=secure_password_123
DB_ROOT_PASSWORD=root_password_123
DATABASE_URL="mysql://edu_turkish_user:secure_password_123@localhost:3306/edu_turkish"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Database

Start the MySQL database with Docker:

```bash
npm run docker:up
```

This will start:
- MySQL 8.0 server on port 3306
- Adminer (database admin) on port 8080

### 4. Initialize Database

Push the database schema and seed with data:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with data
npm run db:seed
```

Or use the convenience script:

```bash
npm run setup:dev
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Management Scripts

### Development Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply new migration
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Docker Scripts

- `npm run docker:up` - Start database containers
- `npm run docker:down` - Stop database containers
- `npm run docker:logs` - View MySQL logs

### Production Scripts

- `npm run db:deploy` - Deploy migrations to production
- `npm run db:migrate:reset` - Reset database (development only)

## Database Schema

The database implements a comprehensive schema with multilingual support:

### Core Tables

- `universities` - University information
- `university_translations` - Multilingual university data
- `university_languages` - Supported languages per university
- `academic_programs` - University programs
- `reviews` - Student/parent testimonials
- `faq_items` - FAQ entries
- `applications` - Application submissions

### Translation Tables

All content supports 4 languages (en, ru, kk, tr) through dedicated translation tables:

- `university_translations`
- `review_translations`
- `faq_translations`
- `program_translations`
- And more...

## API Endpoints

All existing API endpoints have been refactored to use the database:

### Universities
- `GET /api/v1/universities` - List universities with filtering/search
- `GET /api/v1/universities/[id]` - Get university details

### Reviews
- `GET /api/v1/reviews` - List reviews with filtering
- `GET /api/v1/reviews/statistics` - Get review statistics

### FAQ
- `GET /api/v1/content/faq` - Get FAQ items with search

### Applications
- `POST /api/v1/applications` - Submit new application

## Repository Pattern

The implementation uses a repository pattern for data access:

```typescript
// Example usage
import { prisma } from '~/lib/prisma'
import { UniversityRepository } from '~/server/repositories'

const universityRepo = new UniversityRepository(prisma)
const universities = await universityRepo.findAll(filters, locale)
```

### Available Repositories

- `UniversityRepository` - University data operations
- `ReviewRepository` - Review and testimonial operations
- `FAQRepository` - FAQ management
- `ApplicationRepository` - Application processing

## Database Connection

The database connection is managed through a singleton pattern:

```typescript
import { prisma } from '~/lib/prisma'

// Use in any server-side code
const universities = await prisma.university.findMany()
```

## Seeding Data

The seeding system migrates all existing mock data to the database:

```bash
# Run seeders
npm run db:seed
```

Seeder files are located in `prisma/seed/`:
- `universities.ts` - University data with translations
- `reviews.ts` - Review data with translations
- `faqs.ts` - FAQ data with translations

## Development Tools

### Adminer (Database Admin)

Access the database admin interface at `http://localhost:8080` when Docker is running:

- **Server**: mysql
- **Username**: edu_turkish_user
- **Password**: secure_password_123
- **Database**: edu_turkish

### Prisma Studio

Launch Prisma Studio for an enhanced database GUI:

```bash
npm run db:studio
```

## Environment Variables

### Required Variables

```bash
DATABASE_URL="mysql://user:password@host:port/database"
```

### Optional Variables

```bash
NODE_ENV=development
LOG_LEVEL=info
API_RATE_LIMIT=100
JWT_SECRET=your_jwt_secret
```

## Production Deployment

### 1. Database Migration

```bash
npm run db:deploy
```

### 2. Environment Configuration

Ensure production environment variables are set:

```bash
DATABASE_URL="mysql://prod_user:prod_password@prod_host:3306/prod_database"
NODE_ENV=production
```

### 3. Build Application

```bash
npm run build
```

## Testing

Run tests to verify the implementation:

```bash
npm test
```

## Troubleshooting

### Database Connection Issues

1. Ensure Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. Check database logs:
   ```bash
   npm run docker:logs
   ```

3. Verify environment variables in `.env`

### Migration Issues

1. Reset database (development only):
   ```bash
   npm run db:migrate:reset
   ```

2. Regenerate Prisma client:
   ```bash
   npm run db:generate
   ```

### Seeding Issues

1. Check database connection
2. Ensure schema is up to date:
   ```bash
   npm run db:push
   ```

## API Documentation

### Response Formats

All API responses follow consistent formats:

```typescript
// List responses
{
  data: T[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  },
  filters?: FilterOptions
}

// Single resource responses
{
  data: T
}
```

### Error Handling

Errors are returned in a standardized format:

```typescript
{
  statusCode: number,
  statusMessage: string,
  data?: {
    errors?: ValidationError[]
  }
}
```

## Performance Considerations

- Database queries are optimized with proper indexing
- Prisma provides query optimization and connection pooling
- Repository pattern enables caching layer implementation
- Multilingual support is handled efficiently through joins

## Security

- Database credentials are environment-based
- Input validation using Zod schemas
- SQL injection protection through Prisma ORM
- Error handling prevents information leakage

## Future Enhancements

- Authentication and authorization system
- Redis caching layer
- Database connection pooling optimization
- GraphQL API layer
- Real-time features with WebSockets
- Advanced search with Elasticsearch

## Support

For issues or questions regarding the server implementation, please refer to:

1. Check the troubleshooting section above
2. Review Prisma documentation
3. Check Docker container logs
4. Verify environment configuration
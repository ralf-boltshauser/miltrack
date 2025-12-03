# Data Flow Architecture

## Core Principles

### Prisma Schema as Single Source of Truth

The `prisma/schema.prisma` file defines all data models, relationships, and constraints. All database operations must align with this schema. Generated Prisma types in `src/generated/prisma/` provide type safety throughout the application.

### Server Actions for All Data Operations

All data fetching and mutations go through **server actions** (files marked with `"use server"`). This ensures:
- Type safety from Prisma to the client
- Server-side validation and error handling
- No direct database access from client components

## Example: AddPersonDialog Flow

### 1. Server Action (`company-actions.ts`)

```typescript
"use server";

export async function createPerson(name: string, platoonId: string) {
  const person = await prisma.person.create({
    data: { name, platoonId },
  });
  return { success: true, person };
}
```

- Uses Prisma client to create records
- Returns typed results or errors
- All database operations happen server-side

### 2. Client Component (`add-person-dialog.tsx`)

```typescript
"use client";

const result = await createPerson(name.trim(), platoonId);
```

- Client components call server actions directly
- No API routes needed
- Type-safe with Prisma-generated types

### 3. Data Fetching Pattern

Server components fetch data using server actions:

```typescript
// page.tsx (Server Component)
const company = await getCompanyById(id);
```

Client components receive data as props and call mutations via server actions.

## Benefits

- **Type Safety**: Prisma types flow from schema → server actions → components
- **Security**: Database access only on server
- **Simplicity**: No REST API layer needed
- **Consistency**: Single pattern for all data operations


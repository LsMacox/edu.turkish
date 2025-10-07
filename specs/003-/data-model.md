# Data Model: Import Alias Standardization

**Feature**: Import Alias Standardization  
**Date**: 2025-10-03

## Overview

This feature is a **code refactoring** and does not introduce new data entities or database changes. The "data model" for this feature consists of configuration structures and import pattern definitions.

## Configuration Entities

### AliasConfiguration

Represents the canonical import alias mapping used across the project.

**Attributes**:

- `alias` (string): The alias symbol (e.g., `~`, `~~`)
- `target` (string): The resolved path (e.g., `./app/*`, `./*`)
- `context` (enum): Where the alias is used (`tsconfig`, `vitest`, `nuxt`)
- `status` (enum): `active` | `deprecated`
- `purpose` (string): Description of when to use this alias

**Standard Aliases** (Active):

```typescript
{
  alias: '~/*',
  target: './app/*',
  context: ['tsconfig', 'vitest', 'nuxt'],
  status: 'active',
  purpose: 'Import from app directory (components, stores, composables, etc.)'
}

{
  alias: '~~/*',
  target: './*',
  context: ['tsconfig', 'vitest', 'nuxt'],
  status: 'active',
  purpose: 'Import from project root (lib/, prisma/, server/, etc.)'
}
```

**Deprecated Aliases** (To be removed):

```typescript
{
  alias: '@/*',
  target: './app/*',
  context: ['tsconfig'],
  status: 'deprecated',
  purpose: 'DEPRECATED: Use ~/* instead'
}

{
  alias: '@@/*',
  target: './*',
  context: ['tsconfig'],
  status: 'deprecated',
  purpose: 'DEPRECATED: Use ~~/* instead'
}

{
  alias: '^/*',
  target: './*',
  context: ['tsconfig'],
  status: 'deprecated',
  purpose: 'DEPRECATED: Use ~~/* instead'
}
```

### ImportPattern

Represents valid import patterns for different file contexts.

**Attributes**:

- `fileContext` (enum): `app` | `server` | `test` | `script` | `seed`
- `importType` (enum): `internal` | `cross-boundary` | `root`
- `allowedAliases` (string[]): List of permitted aliases
- `allowedRelative` (boolean): Whether relative imports are allowed
- `maxRelativeDepth` (number): Maximum `../` depth allowed

**Validation Rules**:

```typescript
// App files (app/**)
{
  fileContext: 'app',
  importType: 'internal',      // app → app
  allowedAliases: ['~'],
  allowedRelative: true,
  maxRelativeDepth: 1          // Only ../ allowed, not ../../
}

{
  fileContext: 'app',
  importType: 'root',          // app → lib, prisma
  allowedAliases: ['~~'],
  allowedRelative: false,
  maxRelativeDepth: 0
}

// Server files (server/**)
{
  fileContext: 'server',
  importType: 'internal',      // server → server
  allowedAliases: [],
  allowedRelative: true,
  maxRelativeDepth: 3          // Relative imports OK within server/
}

{
  fileContext: 'server',
  importType: 'cross-boundary', // server → app (types only)
  allowedAliases: ['~'],
  allowedRelative: false,
  maxRelativeDepth: 0
}

{
  fileContext: 'server',
  importType: 'root',          // server → lib, prisma
  allowedAliases: ['~~'],
  allowedRelative: false,
  maxRelativeDepth: 0
}

// Test files (tests/**)
{
  fileContext: 'test',
  importType: 'internal',      // test → test
  allowedAliases: [],
  allowedRelative: true,
  maxRelativeDepth: 1
}

{
  fileContext: 'test',
  importType: 'cross-boundary', // test → app, server
  allowedAliases: ['~', '~~'],
  allowedRelative: false,
  maxRelativeDepth: 0
}

// Scripts & Seeds (scripts/**, prisma/seed/**)
{
  fileContext: 'script',
  importType: 'root',          // script → lib, prisma, app
  allowedAliases: ['~', '~~'],
  allowedRelative: false,
  maxRelativeDepth: 0
}
```

## State Transitions

### Migration State Machine

The codebase transitions through these states during migration:

```
[Initial State: Inconsistent]
  - Multiple aliases in use
  - Relative imports in tests
  - Misaligned configs

    ↓ (Config Alignment)

[State: Config Aligned]
  - vitest.config.ts matches tsconfig.json
  - All aliases available in all contexts
  - Tests can resolve imports

    ↓ (Code Migration)

[State: Code Migrated]
  - All imports use standard aliases
  - No deprecated aliases in use
  - All tests pass

    ↓ (Enforcement)

[Final State: Enforced]
  - ESLint rules prevent violations
  - Deprecated aliases removed from config
  - Documentation updated
```

### File Migration States

Each file transitions through:

1. **Unmigrated**: Uses old patterns (relative imports, deprecated aliases)
2. **Migrated**: Uses standard aliases (`~`, `~~`)
3. **Validated**: Passes ESLint rules, TypeScript checks, tests

## Relationships

### Configuration Synchronization

```
tsconfig.json (source of truth)
    ↓ (must match)
vitest.config.ts
    ↓ (must match)
nuxt.config.ts (auto-configured by Nuxt)
```

### Import Dependencies

```
app/components/*.vue
    → (imports via ~) → app/stores/*.ts
    → (imports via ~) → app/composables/*.ts
    → (imports via ~~) → lib/*.ts

server/api/**/*.ts
    → (relative) → server/repositories/*.ts
    → (imports via ~) → app/types/*.ts (types only)
    → (imports via ~~) → lib/*.ts

tests/**/*.test.ts
    → (imports via ~) → app/**/*
    → (imports via ~~) → server/**/*
    → (imports via ~~) → prisma/seed/*
```

## Validation Rules

### Configuration Validation

1. **Alias Completeness**: All aliases in `tsconfig.json` must exist in `vitest.config.ts`
2. **Path Consistency**: Alias targets must resolve to same directories across configs
3. **No Conflicts**: No two aliases should point to same target (except during migration)

### Import Validation

1. **No Deep Relative**: Imports must not use `../../` or deeper
2. **No Deprecated Aliases**: Imports must not use `@`, `@@`, or `^`
3. **Context Appropriate**: Imports must use correct alias for file context
4. **Type Safety**: All imports must resolve correctly in TypeScript

### Test Validation

1. **Import Resolution**: All test imports must resolve without errors
2. **Runtime Execution**: All tests must pass with new import patterns
3. **Build Success**: Production build must succeed with new patterns

## Migration Tracking

### Metrics

Track migration progress with these metrics:

```typescript
interface MigrationMetrics {
  totalFiles: number
  migratedFiles: number
  filesWithDeprecatedAliases: number
  filesWithDeepRelativeImports: number
  configsAligned: boolean
  testsPass: boolean
  buildSucceeds: boolean
}
```

### File Categories

Files are categorized by migration priority:

1. **Critical** (tests/): Highest pain point, migrate first
2. **High** (server/): Many relative imports, standardize next
3. **Medium** (app/): Some deprecated aliases, migrate after server
4. **Low** (scripts/, prisma/seed/): Few issues, migrate last

## No Database Changes

**Important**: This feature involves **zero database changes**. No Prisma schema modifications, no migrations, no data model changes. All changes are to TypeScript/JavaScript configuration and import statements.

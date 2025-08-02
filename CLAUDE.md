# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite and hot reload
- `npm run build` - TypeScript compilation and production build
- `npm run serve:preview` - Preview production build locally

### Code Quality
- `npm run biome:fix` - Run Biome formatter and linter with auto-fix
- `npm run biome:fix-staged` - Run Biome on staged files only
- `npm run types:validate` - TypeScript type checking without compilation
- `npm run validate:all` - Complete validation: type check, build, and format

### API Client Generation
- `npm run generate:orval-client` - Generate API client from OpenAPI schema
- `npm run generate:client-and-validate` - Generate client and validate types

### Testing
- `npm run test:unit` - Run unit tests with Vitest

## Project Architecture

### Tech Stack
- **React 19** with TypeScript
- **TanStack Router** for file-based routing with auto-generated route tree
- **TanStack Query** for server state management
- **Zustand** for client state management with persistence
- **Mantine** UI component library
- **Vite** for build tooling
- **Biome** for formatting and linting

### Key Architecture Patterns

#### API Integration
- Uses **Orval** to auto-generate TypeScript API client from OpenAPI schema at `http://localhost:8000/api/schema`
- Generated API files are in `src/api/` directory and excluded from Biome linting
- Custom Axios instance with JWT authentication interceptor in `src/api/mutator/custom-instance.ts`
- All API calls use TanStack Query for caching and state management

#### State Management
- **Authentication**: Zustand store with localStorage persistence (`src/stores/auth-store.ts`)
  - Handles JWT token management and user data
  - Automatic token injection via Axios interceptor
- **Server State**: TanStack Query for API data caching
- **UI State**: React state and Mantine components

#### Routing
- File-based routing with TanStack Router
- Auto-generated route tree in `src/routeTree.gen.ts`
- Route components in `src/routes/` directory

### Code Organization
```
src/
├── api/          # Auto-generated API client (excluded from linting)
├── stores/       # Zustand state stores
├── routes/       # TanStack Router route components
└── main.tsx      # App entry point with providers
```

## Important Notes

### API Client Generation
Always run `npm run generate:orval-client` after backend API schema changes. The generated files in `src/api/` should not be manually edited.

### Authentication Flow
The app uses JWT tokens stored in Zustand with localStorage persistence. The custom Axios instance automatically adds Authorization headers for authenticated requests.

### Code Quality
Biome configuration excludes `src/api/**` from linting since these are auto-generated files. Always run `npm run biome:fix` before committing.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `typed-transform`, a TypeScript library for type-safe pipe transformations. The library provides a single `transform` function that takes input data and transformation rules to produce type-safe nested objects.

## Commands

- **Build**: `npm run build` (uses tsup to bundle ESM + types)
- **Development**: `npm run dev` (watch mode build)
- **Test**: `npm test` (uses vitest)
- **Lint & Format**: `npm run check` (uses biome)
- **Fix Lint Issues**: `npm run check:fix` 
- **Type Check**: `npm run typecheck` (tsc --noEmit)
- **Pre-publish**: `npm run prepublishOnly` (runs build, test, check, typecheck)

## Architecture

### Core Function (`src/index.ts`)
The `transform` function is the heart of the library:
- Takes input data and transformation tuples `[key, computeFn]`
- Supports flat keys, dot notation strings (`"deep.nested"`), and path arrays (`["deep", "nested"]`)
- **Root path transformation**: When passed a single function (not a tuple), sets the value directly at the root level
- **Mixed transformations**: Supports combining root transform function with additional tuple transformations (root object gets merged with additional properties)
- Uses advanced TypeScript type manipulation for compile-time type safety
- Key type utilities: `UnionToIntersection`, `Flatten`, `SplitPath`, `CreateNested`

### Type System Design
- Heavy use of template literal types and conditional types for path parsing
- Runtime implementation builds nested objects while maintaining type safety
- Tests include both runtime assertions and compile-time type tests using `Expect<Equal<...>>`

### Testing Strategy (`tests/index.test.ts`)
- Uses vitest for runtime testing
- Includes compile-time type tests to verify type inference correctness
- Tests cover flat properties, nested properties (array and dot notation), root path transformations, mixed root+tuple transformations, and various combinations

## Development Notes

- Uses Biome for linting/formatting (double quotes, space indentation)
- TypeScript config is strict with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- ESM-only package (`"type": "module"`)
- Requires Node.js >=22
- Uses husky for git hooks and lint-staged
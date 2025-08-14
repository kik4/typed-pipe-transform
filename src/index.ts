// Union to intersection utility
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

// Flatten intersections into clean object types
type Flatten<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

// Split dot notation string into path array
type SplitPath<S extends string> = S extends `${infer First}.${infer Rest}`
  ? [First, ...SplitPath<Rest>]
  : [S];

// Helper to build nested object from path array
type CreateNested<
  Path extends readonly string[],
  Value,
> = Path extends readonly [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends readonly string[]
      ? Rest["length"] extends 0
        ? { [K in First]: Value }
        : { [K in First]: CreateNested<Rest, Value> }
      : never
    : never
  : never;

export function transform<
  T extends Record<string, unknown>,
  const Transforms extends readonly (readonly [
    string | readonly string[],
    (data: T) => any,
  ])[],
>(
  data: T,
  ...transforms: Transforms
): Flatten<
  UnionToIntersection<
    {
      [K in keyof Transforms]: Transforms[K] extends readonly [
        infer Key,
        infer Fn,
      ]
        ? Fn extends (data: T) => infer R
          ? Key extends string
            ? Key extends `${string}.${string}`
              ? CreateNested<SplitPath<Key>, R>
              : { [P in Key]: R }
            : Key extends readonly string[]
              ? CreateNested<Key, R>
              : never
          : never
        : never;
    }[number]
  >
> {
  const result: Record<string, unknown> = {};

  for (const [key, computeFn] of transforms) {
    const value = computeFn(data);

    if (Array.isArray(key)) {
      // Handle nested keys as array
      let current = result;
      for (let i = 0; i < key.length - 1; i++) {
        const keyPart = key[i];
        if (keyPart !== undefined && !(keyPart in current)) {
          current[keyPart] = {};
        }
        if (keyPart !== undefined) {
          current = current[keyPart] as Record<string, unknown>;
        }
      }
      const lastKey = key[key.length - 1];
      if (lastKey !== undefined) {
        current[lastKey] = value;
      }
    } else if (typeof key === "string" && key.includes(".")) {
      // Handle dot notation strings
      const pathParts = key.split(".");
      let current = result;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const keyPart = pathParts[i];
        if (keyPart !== undefined && !(keyPart in current)) {
          current[keyPart] = {};
        }
        if (keyPart !== undefined) {
          current = current[keyPart] as Record<string, unknown>;
        }
      }
      const lastKey = pathParts[pathParts.length - 1];
      if (lastKey !== undefined) {
        current[lastKey] = value;
      }
    } else {
      // Handle flat keys
      (result as any)[key as string] = value;
    }
  }

  return result as any;
}

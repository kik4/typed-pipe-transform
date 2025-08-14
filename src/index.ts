export function transform<T extends Record<string, unknown>>(
  data: T,
  ...transforms: Array<[string, (data: T) => unknown]>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, computeFn] of transforms) {
    result[key] = computeFn(data);
  }
  
  return result;
}
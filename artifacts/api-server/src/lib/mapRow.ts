/**
 * Converts all Date values in a DB row to ISO strings,
 * so they pass Zod string-typed fields from the OpenAPI spec.
 */
export function mapRow<T extends Record<string, unknown>>(row: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result as T;
}

export function mapRows<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map(mapRow);
}

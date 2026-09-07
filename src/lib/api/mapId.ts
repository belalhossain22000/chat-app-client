// Backend returns MongoDB `_id`; the app uses `id` everywhere.
// Normalise at the API boundary so no `_id` leaks into components.

type WithMongoId = { _id: string } & Record<string, unknown>;

function hasMongoId(value: unknown): value is WithMongoId {
  return typeof value === "object" && value !== null && "_id" in value;
}

export function mapId<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => mapId(item)) as T;
  }
  if (hasMongoId(value)) {
    const { _id, ...rest } = value;
    const mapped: Record<string, unknown> = { id: _id };
    for (const [key, val] of Object.entries(rest)) {
      mapped[key] = typeof val === "object" && val !== null ? mapId(val) : val;
    }
    return mapped as T;
  }
  return value;
}

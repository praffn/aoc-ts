export function getOr<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  map.set(key, defaultValue);
  return defaultValue;
}

export function getOrRun<K, V>(map: Map<K, V>, key: K, fn: () => V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const value = fn();
  map.set(key, value);
  return value;
}

export function getOrSet<K, V>(map: Map<K, V>, key: K, value: () => V): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const newValue = value();
  map.set(key, newValue);
  return newValue;
}

export function mapIncrement<T>(map: Map<T, number>, key: T): Map<T, number>;
export function mapIncrement<T>(
  map: Map<T, number>,
  key: T,
  amount: number
): Map<T, number>;
export function mapIncrement<T>(
  map: Map<T, number>,
  key: T,
  amount = 1
): Map<T, number> {
  return map.set(key, (map.get(key) ?? 0) + amount);
}

export function mapDecrement<T>(map: Map<T, number>, key: T): Map<T, number>;
export function mapDecrement<T>(
  map: Map<T, number>,
  key: T,
  amount: number
): Map<T, number>;
export function mapDecrement<T>(
  map: Map<T, number>,
  key: T,
  amount = 1
): Map<T, number> {
  return mapIncrement(map, key, -amount);
}

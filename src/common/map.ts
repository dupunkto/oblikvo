// Defines the .map method for maps.
// From https://stackoverflow.com/a/70877028

export {};

declare global {
  interface Map<K, V> {
    map<T>(predicate: (value: V, key: K) => T): Map<K, T>;
    filter(predicate: (value: V, key: K) => boolean): Map<K, V>;
    map_filter(predicate: (value: V, key: K) => V | undefined): Map<K, V>;
    reduce<T>(
      acc: T,
      predicate: (acc: T, value: V, key: K) => T | undefined,
    ): T;
  }
}

Map.prototype.map = function <K, V, T>(
  predicate: (value: V, key: K) => T,
): Map<K, T> {
  let map: Map<K, T> = new Map();

  this.forEach((value: V, key: K) => {
    map.set(key, predicate(value, key));
  });

  return map;
};

Map.prototype.map_filter = function <K, V>(
  predicate: (value: V, key: K) => V | undefined,
): Map<K, V> {
  let map: Map<K, V> = new Map();

  this.forEach((value: V, key: K) => {
    const next = predicate(value, key);

    if (next) {
      map.set(key, next);
    } else {
      map.delete(key);
    }
  });

  return map;
};

Map.prototype.reduce = function <K, V, T>(
  acc: T,
  predicate: (acc: T, value: V, key: K) => T,
): T {
  this.forEach((value: V, key: K) => {
    const next = predicate(acc, value, key);
    if (next != undefined) {
      acc = next;
    }
  });

  return acc;
};

Map.prototype.filter = function <K, V>(
  predicate: (value: V, key: K) => boolean,
): Map<K, V> {
  let map: Map<K, V> = new Map();

  this.forEach((value: V, key: K) => {
    if (predicate(value, key)) {
      map.set(key, value);
    } else {
      map.delete(key);
    }
  });

  return map;
};

// Defines the .map and other handy methods for maps.
// From https://stackoverflow.com/a/70877028

export {};

declare global {
  interface Map<K, V> {
    map<T>(predicate: (value: V, key: K) => T): Map<K, T>;
    filter(predicate: (value: V, key: K) => boolean): Map<K, V>;
    toArray(): V[];
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

Map.prototype.toArray = function <V>(): V[] {
  return Array.from(this, ([_, value]) => value);
};

// Defines the .map method for maps.
// From https://stackoverflow.com/a/70877028

export {};

declare global {
  interface Map<K, V> {
    map<T>(predicate: (value: V, key: K) => T): Map<K, T>;
  }
}

Map.prototype.map = function <K, V, T>(
  predicate: (value: V, key: K) => T
): Map<K, T> {
  let map: Map<K, T> = new Map();

  this.forEach((value: V, key: K) => {
    map.set(key, predicate(value, key));
  });

  return map;
};

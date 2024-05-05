// Defines the .camelize and .pascalize methods for strings.
// From https://stackoverflow.com/a/57927739
// From https://stackoverflow.com/a/53952925

export {};

declare global {
  interface String {
    camelize(): string;
    pascalize(): string;
  }
}

String.prototype.camelize = function (): string {
  const a = this.toUpperCase().replace(/[-_\s.]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : "",
  );

  return a.substring(0, 1).toLowerCase() + a.substring(1);
};

String.prototype.pascalize = function (): string {
  return this.toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      (_, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

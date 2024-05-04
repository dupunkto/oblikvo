// Defines the .camelize method for maps.
// From https://stackoverflow.com/a/57927739

export {};

declare global {
  interface String {
    camelize(): string;
  }
}

String.prototype.camelize = function (): string {
  this.toLowerCase().replace(/[-_\s.]+(.)?/g, (_, c) =>
    c ? c.toUpperCase() : "",
  );
  return this.substring(0, 1).toLowerCase() + this.substring(1);
};

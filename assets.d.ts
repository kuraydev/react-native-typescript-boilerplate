/**
 * Ambient declarations for static asset imports (e.g. `import logo from
 * "@assets/logo.png"`). This file intentionally has no top-level import/export
 * so it stays a *global* script — pattern ambient modules like `*.png` are only
 * treated as global when declared outside a module.
 */

declare module "*.png" {
  const value: number;
  export default value;
}

declare module "*.jpg" {
  const value: number;
  export default value;
}

declare module "*.jpeg" {
  const value: number;
  export default value;
}

declare module "*.gif" {
  const value: number;
  export default value;
}

declare module "*.webp" {
  const value: number;
  export default value;
}

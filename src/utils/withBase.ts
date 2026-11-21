/**
 * Prefix an in-site path with Astro's base.
 * Astro's `BASE_URL` is `/`, or the repository path with or without a trailing slash.
 * Absolute http(s) URLs and paths that already include the base are unchanged.
 */
export function withBase(path = "/"): string {
  const rawBase = import.meta.env.BASE_URL || "/";
  const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

  if (!path || path === "/") return base;
  if (/^https?:\/\//.test(path)) return path;

  const prefix = base === "/" ? "" : base.slice(0, -1);
  if (prefix && (path === prefix || path.startsWith(`${prefix}/`))) {
    return path;
  }

  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${normalized}`;
}

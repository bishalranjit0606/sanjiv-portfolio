type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * Prefix root-absolute href and src values in Markdown HTML.
 * Component links use `withBase()` instead. A base of `/` leaves URLs unchanged.
 */
export function rehypePrefixBase(base: string) {
  const prefix = !base || base === "/" ? "" : base.replace(/\/$/, "");

  return () => (tree: HastNode) => {
    if (!prefix) return;

    const prefixPath = (value: string) => {
      if (
        value.startsWith("/") &&
        !value.startsWith("//") &&
        value !== prefix &&
        !value.startsWith(`${prefix}/`)
      ) {
        return `${prefix}${value}`;
      }
      return value;
    };

    const walk = (node: HastNode & { value?: string }) => {
      if (node.type === "element" && node.properties) {
        for (const attr of ["href", "src"]) {
          const value = node.properties[attr];
          if (typeof value === "string") {
            node.properties[attr] = prefixPath(value);
          }
        }
      }

      // Markdown raw HTML is not an element until after rehype-raw.
      if (node.type === "raw" && typeof node.value === "string") {
        node.value = node.value.replace(
          /\b(href|src)="(\/[^"]*)"/g,
          (_match, attr: string, url: string) => `${attr}="${prefixPath(url)}"`
        );
      }

      node.children?.forEach(walk);
    };

    walk(tree);
  };
}

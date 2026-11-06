// Preserve the editor's type sizes while giving screen readers a consecutive
// outline below the template's h1. Do not mutate the stored Portable Text.
export function normalizeProseHeadings<
  T extends { _type?: string; style?: string },
>(blocks: T[]): T[] {
  const ancestors: number[] = [];
  return blocks.map((block) => {
    if (block._type !== "block" || !/^h[1-6]$/.test(block.style || ""))
      return block;
    const level = Number(block.style!.slice(1));
    while (ancestors.length && ancestors[ancestors.length - 1] >= level)
      ancestors.pop();
    ancestors.push(level);
    return {
      ...block,
      style: `h${Math.min(ancestors.length + 1, 6)}`,
      originalHeadingStyle: block.style,
    };
  });
}

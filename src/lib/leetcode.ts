const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Pull a problem slug out of whatever the user pasted: a full URL (with or without protocol,
 * trailing path, query or hash), a bare path, or just the slug itself. Returns null if none found.
 */
export function parseProblemSlug(raw: string): string | null {
  const text = raw.trim().toLowerCase();
  if (!text) return null;
  const m = /leetcode\.(?:com|cn)\/(?:[a-z-]+\/)?problems\/([a-z0-9-]+)/.exec(text);
  if (m) return SLUG.test(m[1]) ? m[1] : null;
  const bare = text.replace(/^\/?problems\//, '').replace(/[/?#].*$/, '');
  return SLUG.test(bare) && bare.length <= 100 ? bare : null;
}

export const leetcodeUrl = (slug: string) => `https://leetcode.com/problems/${slug}/`;

/** "two-sum" -> "Two Sum" */
export function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

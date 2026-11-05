import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'category'; id: string }
  | { name: 'problem'; id: string }
  | { name: 'generate'; slug: string }
  | { name: 'shared'; token: string }
  | { name: 'mine' }
  | { name: 'review' }
  | { name: 'data' }
  | { name: 'anki' };

/** Parse a location hash such as "#/p/two-sum". Unknown hashes fall back to home. */
export function parseRoute(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (h.startsWith('s=')) return { name: 'shared', token: h.slice(2) };
  const [head, ...rest] = h.split('/');
  const arg = decodeURIComponent(rest.join('/'));
  switch (head) {
    case 'c':
      return arg ? { name: 'category', id: arg } : { name: 'home' };
    case 'p':
      return arg ? { name: 'problem', id: arg } : { name: 'home' };
    case 'gen':
      return arg ? { name: 'generate', slug: arg } : { name: 'home' };
    case 'mine':
    case 'review':
    case 'data':
    case 'anki':
      return { name: head };
    default:
      return { name: 'home' };
  }
}

export const href = {
  home: '#/',
  category: (id: string) => `#/c/${encodeURIComponent(id)}`,
  problem: (id: string) => `#/p/${encodeURIComponent(id)}`,
  generate: (slug: string) => `#/gen/${encodeURIComponent(slug)}`,
  mine: '#/mine',
  review: '#/review',
  data: '#/data',
  anki: '#/anki',
};

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseRoute(location.hash));
      window.scrollTo?.(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, PROBLEMS, byLcSlug } from './problems';
import { decodeShare } from './lib/share';
import { href, useRoute, type Route } from './lib/router';
import { loadSession, saveSession } from './lib/store';
import { AppProvider, useApp } from './state';
import { Home } from './components/Home';
import { CategoryView } from './components/CategoryView';
import { ProblemView } from './components/ProblemView';
import { Generate } from './components/Generate';
import { Review } from './components/Review';
import { DataView } from './components/DataView';
import { AnkiGuide } from './components/AnkiGuide';
import { SettingsDialog } from './components/Settings';
import { IconCoffee, IconMoon, IconSun, Logo } from './components/icons';
import { SUPPORT_URL } from './config';

const NAV: { label: string; to: string; match: Route['name'][] }[] = [
  { label: 'Topics', to: href.home, match: ['home', 'category', 'problem', 'generate', 'shared'] },
  { label: 'Review', to: href.review, match: ['review'] },
  { label: 'Mine', to: href.mine, match: ['mine'] },
  { label: 'Data', to: href.data, match: ['data', 'anki'] },
];

function pageLabel(route: Route, title?: string): string {
  switch (route.name) {
    case 'problem':
      return title ?? 'a problem';
    case 'category':
      return CATEGORIES.find((c) => c.id === route.id)?.label ?? 'topic';
    case 'shared':
      return 'shared code';
    default:
      return route.name;
  }
}

function Page({ route }: { route: Route }) {
  const { find, mine } = useApp();
  const shared = useMemo(
    () => (route.name === 'shared' ? decodeShare(route.token) : null),
    [route],
  );

  switch (route.name) {
    case 'home':
      return <Home />;
    case 'category': {
      const cat = CATEGORIES.find((c) => c.id === route.id);
      if (!cat) return <NotFound what="topic" />;
      return (
        <CategoryView
          key={cat.id}
          title={cat.label}
          blurb={cat.blurb}
          problems={PROBLEMS.filter((p) => p.category === cat.id)}
        />
      );
    }
    case 'problem': {
      const p = find(route.id) ?? byLcSlug(route.id);
      return p ? <ProblemView key={p.id} problem={p} /> : <NotFound what="problem" />;
    }
    case 'shared':
      return shared ? (
        <ProblemView key={route.token} initial={shared} />
      ) : (
        <NotFound what="shared link" />
      );
    case 'generate':
      return <Generate key={route.slug} slug={route.slug} />;
    case 'mine':
      return (
        <CategoryView
          title="Your problems"
          blurb="Pages you generated from LeetCode links. They live only in this browser."
          problems={Object.values(mine)}
          deletable
          empty="Nothing yet. Paste a LeetCode link on the home page for a problem outside the library."
        />
      );
    case 'review':
      return <Review />;
    case 'data':
      return <DataView />;
    case 'anki':
      return <AnkiGuide />;
  }
}

function NotFound({ what }: { what: string }) {
  return (
    <div className="card">
      <h2>That {what} was not found</h2>
      <p>
        <a href={href.home}>Back to topics</a>
      </p>
    </div>
  );
}

function Shell() {
  const route = useRoute();
  const { find } = useApp();
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () =>
      (localStorage.getItem('veyra:theme') as 'dark' | 'light' | null) ??
      (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('veyra:theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Remember the last page so the home page can offer "continue".
  useEffect(() => {
    const s = loadSession();
    const title = route.name === 'problem' ? find(route.id)?.title : undefined;
    saveSession({
      visits: s.visits + 1,
      last:
        route.name === 'home' || route.name === 'shared'
          ? s.last
          : { hash: location.hash, label: pageLabel(route, title), at: Date.now() },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <a className="brand" href={href.home} aria-label="Veyra home">
          <Logo />
          <span>
            veyra<span className="blink">_</span>
          </span>
        </a>
        <nav aria-label="Sections">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.to}
              aria-current={n.match.includes(route.name) ? 'page' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          className="support"
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buy me a coffee (opens in a new tab)"
        >
          <IconCoffee />
          <span>Support</span>
        </a>
        <button className="ghostbtn" onClick={() => setSettings(true)} aria-label="AI settings">
          AI
        </button>
        <button
          className="icon theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      <main id="main" tabIndex={-1}>
        <Page route={route} />
      </main>

      <footer>
        <p>
          Veyra runs your code locally in a Web Worker. Nothing is uploaded. Not affiliated with
          LeetCode; problem titles belong to their owners. Explanations, code and visuals here are
          original.{' '}
          <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
            Enjoying Veyra? Buy me a coffee ↗
          </a>
        </p>
      </footer>
      <SettingsDialog open={settings} onClose={() => setSettings(false)} />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

import { expect, test, type Page } from '@playwright/test';

const problemHeading = (page: Page, name: string) => page.getByRole('heading', { name, level: 2 });

test.describe('landing and paste-a-link', () => {
  test('shows topics with counts and a command-line input', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Paste a problem/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Arrays & Hashing/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Graphs/ })).toBeVisible();
    await expect(page.getByText(/0\/\d+ done/)).toBeVisible();
  });

  test('a pasted LeetCode URL for a library problem opens its page', async ({ page }) => {
    await page.goto('/');
    await page
      .getByPlaceholder('https://leetcode.com/problems/two-sum/')
      .fill('https://leetcode.com/problems/two-sum/description/?envType=study-plan');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(problemHeading(page, 'Pair With Target Sum')).toBeVisible();
    await expect(page.getByText('Returned')).toBeVisible();
  });

  test('junk input is rejected with a readable message', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('https://leetcode.com/problems/two-sum/').fill('hello world!!');
    await page.getByRole('button', { name: 'Run' }).click();
    await expect(page.getByRole('alert')).toContainText('does not look like a LeetCode link');
  });

  test('example chips fill the box', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'climbing-stairs' }).click();
    await expect(page.getByPlaceholder('https://leetcode.com/problems/two-sum/')).toHaveValue(
      'climbing-stairs',
    );
  });
});

test.describe('unknown problems: verified AI generation', () => {
  const page1 = {
    title: 'Sum Pair Demo',
    difficulty: 'Easy',
    category: 'arrays',
    pattern: 'Hash map',
    summary: 'Find two numbers that add to a target.',
    hook: 'Remember what you have seen.',
    real: 'Join keys.',
    input: '[[2,7,11,15], 9]',
    cases: ['[[3,2,4], 6]', '[[1], 5]'],
    solutions: [
      {
        label: 'Brute force',
        complexity: 'O(n²)',
        code: 'function f(a, t) { for (let i = 0; i < a.length; i++) { for (let j = i + 1; j < a.length; j++) { if (a[i] + a[j] === t) return [i, j]; } } return []; }',
      },
      {
        label: 'Hash map',
        complexity: 'O(n)',
        code: 'function f(a, t) { const m = new Map(); for (let i = 0; i < a.length; i++) { if (m.has(t - a[i])) return [m.get(t - a[i]), i]; m.set(a[i], i); } return []; }',
      },
    ],
  };

  const mockProvider = async (page: Page, payload: unknown) => {
    await page.route('https://api.groq.com/**', async (route) => {
      const cors = {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
      };
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: cors });
        return;
      }
      await route.fulfill({
        status: 200,
        headers: cors,
        contentType: 'application/json',
        body: JSON.stringify({ choices: [{ message: { content: JSON.stringify(payload) } }] }),
      });
    });
  };

  test('needs a key first, then builds, verifies and stores a page', async ({ page }) => {
    await mockProvider(page, page1);
    await page.goto('/');
    await page
      .getByPlaceholder('https://leetcode.com/problems/two-sum/')
      .fill('https://leetcode.com/problems/some-brand-new-problem/');
    await page.getByRole('button', { name: 'Run' }).click();

    await expect(page.getByRole('heading', { name: 'Some Brand New Problem' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate page' })).toBeDisabled();

    await page.getByLabel(/API key/).fill('test-key-not-real');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('button', { name: 'Generate page' })).toBeEnabled();
    await page.getByRole('button', { name: 'Generate page' }).click();

    await expect(page.getByText('AI generated · verified by running')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('Returned')).toBeVisible();

    // It is listed under "Mine" and survives a reload.
    await page.reload();
    await page.getByRole('navigation').getByRole('link', { name: 'Mine' }).click();
    await expect(page.getByRole('link', { name: 'Sum Pair Demo' })).toBeVisible();
  });

  test('rejects a model reply whose solutions disagree', async ({ page }) => {
    const bad = structuredClone(page1);
    bad.solutions[1].code = 'function f(a, t) { return [9, 9]; }';
    await mockProvider(page, bad);
    await page.goto('/#/gen/another-new-problem');
    await page.getByLabel(/API key/).fill('test-key-not-real');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Generate page' }).click();
    await expect(page.getByRole('alert')).toContainText('verified page', { timeout: 15_000 });
    await page.getByRole('navigation').getByRole('link', { name: 'Mine' }).click();
    await expect(page.getByText('Nothing yet')).toBeVisible();
  });

  test('the API key is not written to local storage by default', async ({ page }) => {
    await page.goto('/#/gen/x-y-z');
    await page.getByLabel(/API key/).fill('super-secret-key');
    await page.getByRole('button', { name: 'Save' }).click();
    const leaked = await page.evaluate(() =>
      Object.keys(localStorage).some((k) =>
        (localStorage.getItem(k) ?? '').includes('super-secret-key'),
      ),
    );
    expect(leaked).toBe(false);
  });
});

test.describe('topics', () => {
  test('filters, searches and persists done marks', async ({ page }) => {
    await page.goto('/#/c/arrays');
    await expect(page.getByRole('heading', { name: 'Arrays & Hashing', level: 2 })).toBeVisible();
    const rows = page.locator('tbody tr');
    const total = await rows.count();
    expect(total).toBeGreaterThan(20);

    await page
      .getByRole('group', { name: 'Difficulty' })
      .getByRole('button', { name: 'Hard' })
      .click();
    expect(await rows.count()).toBeLessThan(total);
    await page
      .getByRole('group', { name: 'Difficulty' })
      .getByRole('button', { name: 'All' })
      .click();

    await page.getByRole('searchbox').fill('valid anagram');
    await expect(page.getByRole('link', { name: 'Anagram Check' })).toBeVisible();
    expect(await rows.count()).toBeLessThan(total);
    await page.getByRole('searchbox').fill('');

    await page.getByRole('checkbox', { name: /Mark Pair With Target Sum as done/ }).check();
    await expect(page.getByText(/^1\/\d+ done$/)).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('checkbox', { name: /Mark Pair With Target Sum as done/ }),
    ).toBeChecked();
  });

  test('every topic page loads and lists problems', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('.card-link')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')));
    expect(hrefs.length).toBe(13);
    for (const h of hrefs) {
      await page.goto('/' + h);
      expect(await page.locator('tbody tr').count(), h ?? '').toBeGreaterThan(5);
    }
  });
});

test.describe('problem page', () => {
  test('traces, steps and shows colour-coded pointers over cells', async ({ page }) => {
    await page.goto('/#/p/sorted-pair');
    await page
      .getByRole('group', { name: 'Solution' })
      .getByRole('button', { name: /Two pointers/ })
      .click();
    await expect(page.getByText('Returned')).toBeVisible();
    await expect(page.getByText(/^1 \/ \d+$/)).toBeVisible();
    await page.getByRole('button', { name: 'Next step' }).click();
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.locator('.ptrs', { hasText: 'lo' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Last step' }).click();
    await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled();
    await page.getByRole('button', { name: 'First step' }).click();
    await expect(page.getByRole('button', { name: 'Previous step' })).toBeDisabled();
  });

  test('has LeetCode link, done toggle and neighbours', async ({ page }) => {
    await page.goto('/#/p/sorted-pair');
    const link = page.getByRole('link', { name: /LeetCode/ });
    await expect(link).toHaveAttribute('href', /leetcode\.com\/problems\/two-sum-ii/);
    await expect(link).toHaveAttribute('rel', /noopener/);
    await page.getByRole('button', { name: 'Mark done' }).click();
    await expect(page.getByRole('button', { name: 'Done' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('navigation', { name: 'Neighbouring problems' })).toBeVisible();
  });

  test('reports errors and stops infinite loops instead of hanging', async ({ page }) => {
    await page.goto('/#/p/pair-sum');
    const editor = page.getByLabel('Code editor');
    await editor.fill('function f( {');
    await expect(page.getByRole('alert')).toContainText('Line 1');

    await editor.fill('function f() { while (true) {} }');
    await page.getByLabel(/Input/).fill('[]');
    await expect(page.getByRole('alert')).toContainText(/Timed out|infinite loop/, {
      timeout: 10_000,
    });

    await editor.fill('function f(a) { return a * 2; }');
    await page.getByLabel(/Input/).fill('[21]');
    await expect(page.getByText('Returned')).toBeVisible();
  });

  test('rejects malformed input with a readable message', async ({ page }) => {
    await page.goto('/#/p/pair-sum');
    await page.getByLabel(/Input/).fill('not json');
    await expect(page.getByRole('alert')).toContainText('JSON array');
  });

  test('compare tab charts both solutions and the race slider responds', async ({ page }) => {
    await page.goto('/#/p/pair-sum');
    await page.getByRole('tab', { name: 'Compare' }).click();
    await expect(
      page.getByRole('img', { name: /Statements executed versus input size/ }),
    ).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('table')).toBeVisible();
    const slider = page.getByRole('slider', { name: 'Input size' });
    await slider.fill('4');
    await expect(page.getByText(/does about .* less work/)).toBeVisible();
  });

  test('diff tab shows removed and added lines', async ({ page }) => {
    await page.goto('/#/p/pair-sum');
    await page.getByRole('tab', { name: 'Diff' }).click();
    await expect(page.getByLabel('Unified diff')).toContainText('seen');
    await expect(page.getByText(/lines removed, \d+ lines added/)).toBeVisible();
  });

  test('share link restores code and input', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => undefined);
    await page.goto('/#/p/pair-sum');
    await page.getByLabel('Code editor').fill('function triple(n) { return n * 3; }');
    await page.getByLabel(/Input/).fill('[14]');
    await page.getByRole('button', { name: 'Share link' }).click();
    await expect(page.getByRole('status').filter({ hasText: /Link/ })).toBeVisible();
    const url = page.url().includes('#/s=')
      ? page.url()
      : await page.evaluate(() => navigator.clipboard.readText());
    await page.goto('about:blank');
    await page.goto(url);
    await page.reload();
    await expect(page.getByLabel('Code editor')).toHaveValue(
      'function triple(n) { return n * 3; }',
    );
    await expect(page.getByLabel(/Input/)).toHaveValue('[14]');
    await expect(page.getByText('42').first()).toBeVisible();
  });

  test('unknown problem shows a not-found message', async ({ page }) => {
    await page.goto('/#/p/does-not-exist');
    await expect(page.getByText(/problem was not found/)).toBeVisible();
  });
});

test.describe('review and data', () => {
  test('review flow grades a card and persists', async ({ page }) => {
    await page.goto('/#/review');
    await expect(page.getByText(/0 of \d+ learned/)).toBeVisible();
    await page.getByRole('button', { name: 'Show answer' }).click();
    await page.getByRole('button', { name: /^Good/ }).click();
    await expect(page.getByText(/1 of \d+ learned/)).toBeVisible();
    await page.reload();
    await expect(page.getByText(/1 of \d+ learned/)).toBeVisible();
  });

  test('exports Anki cards and a backup, then imports it back', async ({ page }) => {
    await page.goto('/#/p/pair-sum');
    await page.getByRole('button', { name: 'Mark done' }).click();
    await page.goto('/#/data');

    const anki = page.waitForEvent('download');
    await page.getByRole('button', { name: /Download all cards/ }).click();
    expect((await anki).suggestedFilename()).toBe('veyra-anki.txt');

    const backup = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export backup/ }).click();
    const dl = await backup;
    expect(dl.suggestedFilename()).toMatch(/^veyra-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const path = await dl.path();
    expect(path).toBeTruthy();

    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Erase everything' }).click();
    await expect(page.getByText('Everything was erased.')).toBeVisible();

    await page.getByLabel('Backup file').setInputFiles(path!);
    await expect(page.getByText(/Imported 1 done marks/)).toBeVisible();
  });

  test('a bad backup file is rejected', async ({ page }) => {
    await page.goto('/#/data');
    await page.getByLabel('Backup file').setInputFiles({
      name: 'bad.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"hello":"world"}'),
    });
    await expect(page.getByRole('alert')).toContainText('does not look like a Veyra backup');
  });

  test('anki guide explains the CORS step', async ({ page }) => {
    await page.goto('/#/anki');
    await expect(page.getByText('webCorsOriginList').first()).toBeVisible();
  });
});

test.describe('layout and accessibility', () => {
  for (const [name, route] of [
    ['home', '/'],
    ['topic', '/#/c/graphs'],
    ['problem', '/#/p/sorted-pair'],
    ['data', '/#/data'],
  ] as const) {
    test(`${name} does not overflow horizontally`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(500);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('navigation links are named and the skip link works', async ({ page }) => {
    await page.goto('/');
    for (const n of ['Topics', 'Review', 'Mine', 'Data']) {
      await expect(
        page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: n }),
      ).toBeVisible();
    }
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  });

  test('support links point at Buy Me a Coffee and open safely', async ({ page }) => {
    await page.goto('/');
    const links = page.getByRole('link', { name: /Buy me a coffee/i });
    await expect(links).toHaveCount(2); // navbar + footer
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('href', 'https://www.buymeacoffee.com/Aayushx1');
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('no third-party scripts are loaded', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (u.hostname !== 'localhost') external.push(r.url());
    });
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(external).toEqual([]);
  });

  test('theme toggle switches and persists', async ({ page }) => {
    await page.goto('/');
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.getByRole('button', { name: /Switch to/ }).click();
    const after = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(after).not.toBe(before);
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after);
  });
});

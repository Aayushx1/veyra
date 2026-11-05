import { expect, test } from '@playwright/test';

test('traces the default problem and steps through it', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Pair With Target Sum' })).toBeVisible();
  await expect(page.getByText(/^1 \/ \d+$/)).toBeVisible();
  await expect(page.getByText('Returned')).toBeVisible();

  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByText(/^2 \/ \d+$/)).toBeVisible();
  await page.getByRole('button', { name: 'Last step' }).click();
  await expect(page.getByRole('button', { name: 'Next step' })).toBeDisabled();
  await page.getByRole('button', { name: 'First step' }).click();
  await expect(page.getByRole('button', { name: 'Previous step' })).toBeDisabled();
});

test('shows pointers over array cells for two-pointer problems', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Pair In Sorted Array/ }).click();
  await page
    .getByRole('group', { name: 'Solution' })
    .getByRole('button', { name: /Two pointers/ })
    .click();
  await expect(page.getByText(/^1 \/ \d+$/)).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.locator('.ptrs', { hasText: 'lo' }).first()).toBeVisible();
});

test('reports errors and stops infinite loops instead of hanging', async ({ page }) => {
  await page.goto('/');
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
  await page.goto('/');
  await page.getByLabel(/Input/).fill('not json');
  await expect(page.getByRole('alert')).toContainText('JSON array');
});

test('compare mode charts both solutions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: 'Compare' }).click();
  await expect(
    page.getByRole('img', { name: /Statements executed versus input size/ }),
  ).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole('table')).toBeVisible();
});

test('share link restores code and input', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => undefined);
  await page.goto('/');
  await page.getByLabel('Code editor').fill('function triple(n) { return n * 3; }');
  await page.getByLabel(/Input/).fill('[14]');
  await page.getByRole('button', { name: 'Share link' }).click();
  await expect(page.getByRole('status').filter({ hasText: /Link/ })).toBeVisible();
  const url = page.url().includes('#s=')
    ? page.url()
    : await page.evaluate(() => navigator.clipboard.readText());
  await page.goto('about:blank');
  await page.goto(url);
  await page.reload();
  await expect(page.getByLabel('Code editor')).toHaveValue('function triple(n) { return n * 3; }');
  await expect(page.getByLabel(/Input/)).toHaveValue('[14]');
  await expect(page.getByText('42').first()).toBeVisible();
});

test('review flow grades a card and exports Anki cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('button', { name: 'Review' }).click();
  await expect(page.getByText(/8 of 8 due/)).toBeVisible();
  await page.getByRole('button', { name: 'Show answer' }).click();
  await page.getByRole('button', { name: 'Good' }).click();
  await expect(page.getByText(/7 of 8 due/)).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Anki cards' }).click();
  expect((await download).suggestedFilename()).toBe('veyra-anki.txt');
  await page.reload();
  await page.getByRole('navigation').getByRole('button', { name: 'Review' }).click();
  await expect(page.getByText(/7 of 8 due/)).toBeVisible();
});

test('layout does not overflow horizontally', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Returned')).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

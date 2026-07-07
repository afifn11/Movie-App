import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('homepage loads with navbar and no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page).toHaveTitle(/Netfif Cinema/i);
    await expect(page.locator('header').getByRole('link', { name: /Netfif Cinema/i })).toBeVisible();

    expect(errors, `Console errors found: ${errors.join(', ')}`).toEqual([]);
  });

  test('can open and close the login modal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: /Continue with Google/i })).not.toBeVisible();
  });

  test('unknown route shows a 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByText(/Page Not Found/i)).toBeVisible();
  });

  test('navigating into a movie detail page does not crash (regression guard)', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/movie/popular');
    const firstCard = page.locator('a[href^="/movie/"]').first();
    await firstCard.waitFor({ state: 'visible', timeout: 15000 });
    await firstCard.click();

    await expect(page.getByText(/Oops! Something went wrong/i)).not.toBeVisible();
    expect(errors, `Uncaught errors on movie detail page: ${errors.join(', ')}`).toEqual([]);
  });
});
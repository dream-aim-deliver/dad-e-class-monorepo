import { test, expect } from '@playwright/test';

test('try again button works', async ({ page }) => {
  await page.goto('http://localhost:3000/en/auth/error');
  await page.getByRole('button', { name: 'Try Again' }).click();
  await expect(page).toHaveURL('http://localhost:3000/en/auth/login');

  await page.goto('http://localhost:3000/de/auth/error');
  await page.getByRole('button', { name: 'Nochmal versuchen' }).click();
  await expect(page).toHaveURL('http://localhost:3000/de/auth/login');
});
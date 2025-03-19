import { test, expect } from '@playwright/test';

test('has Welcome Message', async ({ page }) => {
  await page.goto('http://localhost:3000/en/auth/login');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill('Conny');
  await page.getByText('Password').click();
  await page.getByLabel('Password').fill('test');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('Welcome Conny')).toBeTruthy();
  await expect(page.getByText('Welcome Conny')).toContainText('Welcome Conny');
});
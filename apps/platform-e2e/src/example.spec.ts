import { test, expect } from '@playwright/test';
import { login, logout } from './mocks/actions/auth';

test('has Welcome Message', async ({ page }) => {
  await login(page, "admin");
  await expect(page.getByText('Welcome Conny')).toContainText('Welcome Conny');
  await logout(page);
});

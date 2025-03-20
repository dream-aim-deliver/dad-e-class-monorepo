import { Page, expect } from "@playwright/test";
import { role } from "@maany_shr/e-class-models";
import { getTestAccount } from "@maany_shr/e-class-auth";

export async function login(page: Page, role: role.TRole) {
  const user = getTestAccount(role);
  await page.goto('http://localhost:3000/en/auth/login');
  await page.getByLabel('Username').click()
  await page.getByLabel('Username').fill(user.name);
  await page.getByText('Password').click();
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('Welcome Conny')).toBeTruthy();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.context().clearCookies();
  expect(page.getByText('Sign In')).toBeTruthy();
}

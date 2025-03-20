import { Page, expect } from "@playwright/test";
import { role, auth } from "@maany_shr/e-class-models";

// The code below has to be copied from packages/auth/src/infrastructure/utils.ts
// The reason is that we cannot establish a direct dependency between the e2e package and the auth package.
// This is because the auth package depends on next-auth and nextjs, which does not support package exports
// See https://github.com/vercel/next.js/pull/64529
// See https://github.com/nextauthjs/next-auth/discussions/9385
// Once the issue is resolved, we can import the function directly from the auth package
// import { getTestAccount } from "@maany_shr/e-class-auth";

export const TEST_ACCOUNTS: (auth.TSessionUser & { password: string })[] = [
    {
        id: '1',
        name: 'Conny',
        email: 'conny@e-class-dev.com',
        roles: ['visitor', 'student', 'coach', 'admin'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
        
    },
    {
        id: '2',
        name: 'Wim',
        email: '',
        roles: ['visitor', 'student', 'coach'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
    },
    {
        id: '3',
        name: 'Divyanshu',
        email: '',
        roles: ['visitor', 'student'],
        password: 'test',
        accessToken: 'test-123',
        idToken: 'test-123',
    },
    {
        id: '4',
        name: 'Alice',
        email: '',
        roles: ['visitor'],
        password: 'test',
    },
]

export const getTestAccount = (role: role.TRole): auth.TSessionUser & { password: string } => {
    const conny = TEST_ACCOUNTS[0];
    const wim = TEST_ACCOUNTS[1];
    const divyanshu = TEST_ACCOUNTS[2];
    const alice = TEST_ACCOUNTS[3];
    switch (role) {
        case 'admin':
            return conny;
        case 'coach':
            return wim;
        case 'student':
            return divyanshu;
        default:
            return alice;
    }
}

export async function login(page: Page, role: role.TRole) {
  const user = getTestAccount(role);
  await page.goto('http://localhost:3000/en/auth/login');
  await page.getByLabel('Username').click()
  await page.getByLabel('Username').fill(user.name);
  await page.getByText('Password').click();
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  expect(page.getByText('Welcome Conny')).toBeTruthy();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.context().clearCookies();
  expect(page.getByText('Sign In')).toBeTruthy();
}

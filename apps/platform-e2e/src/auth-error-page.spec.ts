import { test, expect } from '@playwright/test';
import { locales, getDictionary } from "@maany_shr/e-class-translations";


test('try again button works', async ({ page }) => {

  for (const locale of locales) {
    const dictionary = getDictionary(locale);
    const tryAgainText = dictionary.components.errorPage.tryAgain;

  await page.goto(`http://localhost:3000/${locale}/auth/error`);
  await page.getByRole('button', { name: tryAgainText }).click();
  await expect(page).toHaveURL(`http://localhost:3000/${locale}/auth/login`);
  
}

});
import { test, expect } from '@playwright/test';


test('homepage has title and links to intro page', async ({ page }) => {
  const siteId = '8778079';
  await page.goto('http://localhost:3000/');
  page.on('console', msg => console.log(msg.text()))
  // page.on('console', msg => {
  //   if (msg.type() === 'error')
  //     console.log(`Error text: "${msg.text()}"`);
  // });
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Welcome to Api-Assembly Scripts Loaders Tester/);

  await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(`8778079_1670848814006_full.js`);
  await page.locator('text=Click to load file').click();
  
  await page.locator('[placeholder="Insert SiteId"]').fill(siteId);
  await page.locator('text=Click to load prod file').click();

  await page.locator('select[name="dyObject"]').selectOption({ label: 'otags' });
  await page.locator('text=Run to Compare').click();

  console.log('Done');
  //await page.locator('input:right-of(:text("Username"))').fill('value');
  // var siteIdEl = await page.evaluate(
  //   // () => document?.getElementById('siteId')?.innerText
  //   () => document?.getElementById('siteId').value
  // );
  // var loadProdFileEl = await page.evaluate(
  //   // () => document?.getElementById('siteId')?.innerText
  //   () => document?.getElementById('loadProdFile').value
  // );

  // loadProdFileEl.click();
  // await expect(siteIdEl).toBeDefined();

  // // create a locator
  // const getStarted = page.getByRole('link', { name: 'Get started' });

  // // Expect an attribute "to be strictly equal" to the value.
  // await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // // Click the get started link.
  // await getStarted.click();

  // // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
});

import { test, expect } from '@playwright/test';

function isObject(object: any) {
  return object != null && typeof object === "object";
}

function isDeepEqual(object1: any, object2: any) {

  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    console.log('Comparing Strings . . .');
    console.log(`window.DYExps    value: ${object1}`);
    console.log(`window.DYExpsApi value: ${object2}`);
    expect(object1).toEqual(object1);
    return false;
  }

  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 === object1)) {
    return true;
  }

  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) {
    return false;
  }

  for (let key of objKeys1) {
    let value1 = object1[key];
    let value2 = object2[key];
    const isObjects = isObject(value1) && isObject(value2);
    if ((isObjects && !isDeepEqual(value1, value2))) {
        return false;
    }
    if (!isObjects && value1 !== value2) {
      let value1DecodeURI;
      let value2DecodeURI;
      value1DecodeURI = decodeURIComponent(value1);
      value2DecodeURI = decodeURIComponent(value2);
      if(key == 'id') {
        return true;
      }
      if (key === 'cssCode' ||
          key === 'jsCode' ||
          key === 'htmlCode' ||
          key === 'name'
      ) {
        value1DecodeURI = value1DecodeURI.replace(/'/g, '"');
      }
      if (key !== 'jsCode' && value2DecodeURI !== value1DecodeURI) {
      // if (key !== 'jsCode' && key !== 'selectParameter') {
        console.log(`Not equal Key: ${key}`);
        console.log(`\n DYExps: ${value1DecodeURI}`);
        console.log(`\n DYExpsApi: ${value2DecodeURI}`);
        expect(value2DecodeURI).toEqual(value1DecodeURI);
      }
      return false;
    }
  }
  return true;
}


// test('Run Full Flow', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   page.on('console', msg => console.log(msg.text()));
//   await page.locator('[placeholder="Insert Path file Api-Assembly Result"]').fill(`8767964_1671356854487_full.js`);
//   await page.locator('text=Click to run Full Flow').click();
//   const t = await page.evaluate('window.DYExps.section');
//   console.log(t)
// });

test('DYExps vs DYExpsApi', async ({ page }) => {
  const siteId = '8767964';
  await page.goto('http://localhost:3000/');
  page.on('console', msg => console.log(msg.text()));
  // await expect(page).toHaveTitle(/Welcome to Api-Assembly Scripts Loaders Tester/);

  await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(`8767964_1671356854487_full.js`);
  await page.locator('text=Click to load file').click();

  await page.locator('[placeholder="Insert SiteId"]').fill(siteId);
  await page.locator('text=Click to load prod file').click();

  await page.locator('select[name="dyObject"]').selectOption({ label: 'otags' });
  //await page.locator('text=Run to Compare').click();

  const DYExps = await page.evaluate('window.DYExps');
  const DYExpsApi = await page.evaluate('window.DYExpsApi');
  const otagsKeys = Object.keys(DYExps['otags']);
  for (let cKey of otagsKeys) {
    console.log('================================================================================');
    console.log(`Smart Tag key: ${cKey}`);
    isDeepEqual(DYExps['otags'][cKey], DYExpsApi['otags'][cKey]);
  }
  //isDeepEqual(DYExps, DYExpsApi);
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

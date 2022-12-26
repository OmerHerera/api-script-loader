import { test, expect } from '@playwright/test';

function isObject(object: any) {
  return object != null && typeof object === "object";
}

function isDeepEqual(object1: any, object2: any) {
  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    // console.log(`\nValues are Strings
    //                window.DYExps    value: ${object1}
    //                window.DYExpsApi value: ${object2}`);
    expect(object2).toBe(object1);
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
      let value1DecodeURI;
      let value2DecodeURI;
      try {
        value1DecodeURI = decodeURIComponent(value1)
        value2DecodeURI = decodeURIComponent(value2)
        if (key === 'cssCode' || key === 'jsCode' || key === 'htmlCode') {
          value1DecodeURI = value1DecodeURI.replace(/'/g, "'");
        }

        if (value1DecodeURI !== value2DecodeURI) {
          console.log(`\nValues not Equals when comparing Objects in key: ${key}`);
          expect(value2DecodeURI).toContain(value1DecodeURI);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e} \n*window.DYExps value\n: ${JSON.stringify(value1)} \n*window.DYExpsApi value\n: ${JSON.stringify(value2)}`)
      }
    }
    if (!isObjects && value1 !== value2) {
      let value1DecodeURI;
      let value2DecodeURI;
      try {
        value1DecodeURI = decodeURIComponent(value1)
        value2DecodeURI = decodeURIComponent(value2)
        if(key == 'id') {
          return true;
        }
        if (key === 'cssCode' || key === 'jsCode' || key === 'htmlCode' || key === 'name') {
          value1DecodeURI = value1DecodeURI.replace(/'/g, '"');
        }
        if (value1DecodeURI !== value2DecodeURI) {
          console.log(`\nValues not Equals when comparing Values in key: ${key}`);
          expect(value2DecodeURI).toBe(value1DecodeURI);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e}`)
      }
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
  const URL = process.env.URL || 'https://api-script-loader.vercel.app/';
  const CDN = process.env.CDN || 'https://cdn-dev.dynamicyield.com/api-dev/'
  const FILE_NAME = process.env.FILE_NAME || 'api_dynamic_full.js'
  const siteId = process.env.SITE_ID || '';
  const apiAssemblyFilePath = `${CDN}${siteId}/${FILE_NAME}`
  console.log('================================================================================================');
  console.log(`Running Test for SiteId: ${siteId} in server: ${URL} and file created by Api-Assembly: ${apiAssemblyFilePath}`);
  await page.goto(URL);
  page.on('console', msg => console.log(msg.text()));
  await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(apiAssemblyFilePath);
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
});
// test.skip('DYExps vs DYExpsApi Hosts', async ({ page }) => {
//   const keyToCheck = 'hosts';
//   const siteId = '8767964';
//   await page.goto('https://api-script-loader-j19klf5vw-omher.vercel.app/');
//   page.on('console', msg => console.log(msg.text()));
//
//   await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(`8767964_1671356854487_full.js`);
//   await page.locator('text=Click to load file').click();
//
//   await page.locator('[placeholder="Insert SiteId"]').fill(siteId);
//   await page.locator('text=Click to load prod file').click();
//
//   await page.locator('select[name="dyObject"]').selectOption({ label: keyToCheck });
//
//   const DYExps = await page.evaluate('window.DYExps');
//   const DYExpsApi = await page.evaluate('window.DYExpsApi');
//   const otagsKeys = Object.keys(DYExps[keyToCheck]);
//   for (let cKey of otagsKeys) {
//     console.log('================================================================================');
//     console.log(`Checking Key: ${cKey}`);
//     isDeepEqual(DYExps[keyToCheck][cKey], DYExpsApi[keyToCheck][cKey]);
//   }
//
// });

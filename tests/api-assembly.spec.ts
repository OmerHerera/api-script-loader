import { test, expect } from '@playwright/test';

function isObject(object: any) {
  return object != null && typeof object === "object";
}

function isDeepEqual(object1: any, object2: any) {
  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    try {
      expect(object2).toBe(object1);
      return false;
    } catch (e) {
      console.log(`e: ${e} \nDYExps value: ${object1} \nDYExpsApi value: ${object2}`)
    }
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
          console.log(`\n🔴 Values not Equals when comparing Objects in key: ${key}`);
          console.log(`\n🔴 window.DYExpsApi: ${JSON.stringify(value2)}`);
          console.log(`\n🔴 window.DYExps:    ${JSON.stringify(value1)}`);
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
          console.log(`\n🔴 Values not Equals when comparing Values in key: ${key}`);
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
//   console.log('Run Full Flow')
//   await page.goto('http://localhost:3000/');
//    page.on('console', msg => console.log(msg.text()));
//   await page.locator('[placeholder="Cloned"]').fill('🧬');
// //   await page.locator('text=Click to run Full Flow').click();
// //   const t = await page.evaluate('window.DYExps.section');
// //   console.log(t)
//  });

test('DYExps vs DYExpsApi', async ({ page }) => {
  const URL = process.env.URL || 'https://api-script-loader.vercel.app/';
  const CDN = process.env.CDN || 'https://cdn-dev.dynamicyield.com/api-dev/'
  const FILE_NAME = process.env.FILE_NAME || 'api_dynamic_full.js'
  const siteId = process.env.SITE_ID || '8778079';
  const comparingKey = process.env.COMPARING_KEY || 'otags';
  const smartTagId = process.env.SMART_TAG_ID || '';
  const apiAssemblyFilePath = `${CDN}${siteId}/${FILE_NAME}`
  console.log('⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ');
  console.log(`Running Test for SiteId: ${siteId} in server: ${URL}\nfile created by Api-Assembly: ${apiAssemblyFilePath} and comparingKey: ${comparingKey}`);
  console.log('⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ');
  await page.goto(URL);
  page.on('console', msg => console.log(msg.text()));
  await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(apiAssemblyFilePath);
  await page.locator('text=Click to load file').click();
  // This is trick for waiting to th clone action
  console.log('⏳ Waiting for cloning to be finish')
  await page.locator('[placeholder="Cloned"]').fill('🧬');

  await page.locator('[placeholder="Insert SiteId"]').fill(siteId);
  await page.locator('text=Click to load prod file').click();

  await page.locator('select[name="dyObject"]').selectOption({ label: comparingKey });
  //await page.locator('text=Run to Compare').click();

  const DYExps = await page.evaluate('window.DYExps');
  const DYExpsApi = await page.evaluate('window.DYExpsApi');

  if (comparingKey === 'all') {
    const keys = Object.keys(DYExps);
    console.log(`🚧 Checking ${comparingKey} key with length: ${Object.keys(DYExps).length}`);
    for (let key of keys) {
      console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
      console.log(`🚀 Checking key: ${key}`);
      // smartTags
      if (key === 'otags') {
        const otagsKeys = Object.keys(DYExps['otags']);
        for (let cKey of otagsKeys) {
          console.log(`🚀 Smart Tag key: ${cKey}`);
          isDeepEqual(DYExps['otags'][cKey], DYExpsApi['otags'][cKey]);
        }
      } else {
        isDeepEqual(DYExps[key], DYExpsApi[key]);
      }
    }
    console.log(`✅  Done Checking ${Object.keys(DYExps).length} keys`);
  } else {
    if(smartTagId) {
      console.log(`🚧 Checking otags key with smartTagId: ${smartTagId}`);
      if (DYExpsApi['otags'] && DYExpsApi['otags'][smartTagId]) {
        isDeepEqual(DYExps['otags'][smartTagId], DYExpsApi['otags'][smartTagId]);
      } else {
        console.log(`🔴 SmartTag: ${smartTagId}, doesn't  exist in DYExpsApi`);
      }
    } else {
      console.log(`🚧 Checking ${comparingKey} key with length: ${Object.keys(DYExps[comparingKey]).length}`);
      const otherKeys = Object.keys(DYExps[comparingKey]);
      for (let oKey of otherKeys) {
        console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
        console.log(`🚀 Checking key: ${oKey}`);
        if (DYExpsApi[comparingKey] && DYExpsApi[comparingKey][oKey]) {
          isDeepEqual(DYExps[comparingKey][oKey], DYExpsApi[comparingKey][oKey]);
        } else {
          console.log(`🔴 Key: ${oKey}, doesn't  exist in DYExpsApi`);
        }
      }
      console.log(`✅  Done Checking ${Object.keys(DYExps[comparingKey]).length} keys`);
    }
  }
});

import { test, expect } from '@playwright/test';

function isObject(object: any) {
  return object != null && typeof object === "object";
}

async function isDeepEqual(object1: any, object2: any, ignoreKeys: string [] | undefined) {
  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    // try {
      expect(object2).toBe(object1);
      return false;
    // } catch (e) {
    //   console.log(`e: ${e} \nDYExps value: ${object1} \nDYExpsApi value: ${object2}`)
    // }
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
    if ((isObjects && !isDeepEqual(value1, value2, ignoreKeys))) {
      let value1DecodeURI: any;
      let value2DecodeURI: any;
      // try {
      value1DecodeURI = decodeURIComponent(value1)
      value2DecodeURI = decodeURIComponent(value2)
      
      if(ignoreKeys && ignoreKeys.indexOf(key) >=0 ) {
        console.log(`Ignoring key: ${key}`);
        return true;
      }

      // seems that in production we have duplicates of the same touchPointsDisjs under conds array
      // wso we check if the values are the same but not considering the duplicates
      if (key === 'touchPointsDisjs') {
        // console.log(`Checking: ${key}`);
        isDeepEqual(value1, value2, ignoreKeys);
        return;
      }
      
      if (key === 'ttw' && value2DecodeURI === '0' && value1DecodeURI === 'null') {
        return true;
      }
      if (key === 'data_event_name' && (value1 === 'null' && value2 === '')) {
        return true;
      }

      if (value1DecodeURI !== value2DecodeURI) {
        console.log(`\n🔴 Values not Equals when comparing Objects in key: ${key}`);
        console.log(`Expected: \x1B[32m${JSON.stringify(value1)}\x1b[0m`);
        console.log(`Received: \x1B[31m${JSON.stringify(value2)}\x1b[0m`);
        expect(value2DecodeURI).toContain(value1DecodeURI);
        return false;
      }
    }
    if (!isObjects && value1 !== value2) {
      let value1DecodeURI: any;
      let value2DecodeURI: any;
      // try {
      value1DecodeURI = decodeURIComponent(value1);
      value2DecodeURI = decodeURIComponent(value2);

      if(ignoreKeys && ignoreKeys.indexOf(key) >=0 ) {
        console.log(`Ignoring key: ${key}`);
        return true;
      }

      if (key == 'id') {
        return true;
      }
      if (key === 'ttw' && value2DecodeURI === '0' && value1DecodeURI === 'null') {
        return true;
      }

      if (key === 'name') {
        value1DecodeURI = value1DecodeURI.replace(/'/g, '"');
      }
      if(ignoreKeys && ignoreKeys.indexOf(key) >=0 ) {
        console.log(`Ignoring key: ${key}`);
        return true;
      }
      if (key === 'data_event_name' && (value1DecodeURI === 'null' && value2DecodeURI === '')) {
        return true;
      }
      if (key === 'params' && value1DecodeURI && value2DecodeURI) {
        try {
          isDeepEqual(JSON.parse(value1DecodeURI), JSON.parse(value2DecodeURI), ignoreKeys);
        } catch (e) {
          return;
        }
        return;
      }
      if (value1DecodeURI !== value2DecodeURI) {
        console.log(`\n🔴 Values not Equals when comparing Values in key: ${key}`);
        console.log(`Expected: \x1B[32m${value1DecodeURI}\x1b[0m`);
        console.log(`Received: \x1B[31m${value2DecodeURI}\x1b[0m`);
        expect(value2DecodeURI).toBe(value1DecodeURI);
        return false;
      }
    }
  }
  return true;
}

function printDYObj(obj: any, DYExps: string, smartTagId: string) {
  console.error(`====================================================================== ${DYExps} === ${smartTagId}======================================================================================================================`);
  for(const [key,value] of Object.entries(obj)) {
    console.log(`  \x1B[36m${key}: \x1b[0m${JSON.stringify(value)}`)
  }

}

function normalizeInputArray(arr: string | undefined) {
  return arr?.replace(/\[/g, '')?.replace(/\]/g, '')?.split(',') || [];
}

const debugSections = '';
const sectionIds = normalizeInputArray(process.env.SECTION_ID || debugSections);
const ignoreKeys = normalizeInputArray(process.env.KEYS_TO_IGNORE);
sectionIds.forEach(async (sectionId) => {
    test(`DYExps vs DYExpsApi SectionId#: ${sectionId}`, async ({ page }) => {
      const URL = 'http://localhost:3000/' || 'https://api-script-loader.vercel.app/';
      // Local: api-dev
      // dev: api-test/
      const S3_BUCKET = process.env.BUCKET || 'api-dev';
      const CDN = process.env.CDN || `https://cdn-dev.dynamicyield.com/${S3_BUCKET}/`
      const FILE_NAME = process.env.FILE_NAME || 'api_dynamic_full.js'
      const comparingKey = process.env.COMPARING_KEY || 'otags';
      const smartTagId = process.env.SMART_TAG_ID || '';
      const logSmartTagObject = process.env.LOG_SMART_TAG_OBJ || false;
      const region = process.env.REGION || 'us';
    
      if (!sectionId) {
        console.error(`⛔ ⛔ ⛔ No section ID, Do Nothing ⛔ ⛔ ⛔`);
        return;
      }
      const apiAssemblyFilePath = `${CDN}${sectionId}/${FILE_NAME}`
      console.log('⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ');
      console.log(`Running Test for SectionId: \x1B[36m${sectionId}\x1b[0m in server: \x1B[36m${URL}\x1b[0m\nfile created by Api-Assembly: \x1B[36m${apiAssemblyFilePath}\x1b[0m and comparingKey: \x1B[36m${comparingKey}\x1b[0m`);
      console.log('⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ');
      await page.goto(URL);
      page.on('console', msg => console.log(msg.text()));
      await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(apiAssemblyFilePath);
      await page.locator('text=Click to load file').click();
      // This is trick for waiting to the clone action
      console.log('⏳ Waiting for cloning to be finish')
      await page.locator('[placeholder="Cloned"]').fill('🧬');
    
      await page.locator('[placeholder="Insert SectionId"]').fill(sectionId);
      await page.locator('select[name="dyRegion"]').selectOption({ label: region });
      await page.locator('text=Click to load prod file').click();
      await page.locator('select[name="dyObject"]').selectOption({ label: comparingKey });
    
      const DYExps: any = await page.evaluate('window.DYExps');
      const DYExpsApi: any = await page.evaluate('window.DYExpsApi');
    
      if (comparingKey === 'all') {
        const keys = Object.keys(DYExps);
        console.log(`🚧 Checking ${comparingKey} key with length: ${Object.keys(DYExps).length} Keys: ${Object.keys(DYExps)}`);
        for (let key of keys) {
          console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
          console.log(`🚀 Checking key: ${key}`);
          // smartTags
          if (key === 'otags') {
            const otagsKeys = Object.keys(DYExps['otags']);
            for (let cKey of otagsKeys) {
              console.log(`🚀 Smart Tag key: ${cKey}`);
              isDeepEqual(DYExps['otags'][cKey], DYExpsApi['otags'][cKey], ignoreKeys);
            }
          } else {
            isDeepEqual(DYExps[key], DYExpsApi[key], ignoreKeys);
          }
        }
        console.log(`✅ Done Checking ${Object.keys(DYExps).length} keys, for sectionId: ${sectionId}`);
      } else {
        if (smartTagId) {
          console.log(`🚧 Checking otags key with smartTagId: ${smartTagId}`);
          if (DYExpsApi['otags'] && DYExpsApi['otags'][smartTagId]) {
            isDeepEqual(DYExps['otags'][smartTagId], DYExpsApi['otags'][smartTagId], ignoreKeys);
            if (logSmartTagObject) {
              printDYObj(DYExps['otags'][smartTagId], 'DYExps', smartTagId);
              printDYObj(DYExpsApi['otags'][smartTagId], 'DYExpsApi', smartTagId);
            }
            console.log(`✅  Done Checking otags key with smartTagId: ${smartTagId}`);
          } else {
            console.log(`🔴 Section: ${sectionId} SmartTag: ${smartTagId}, doesn't  exist in DYExpsApi`);
          }
        } else {
          console.log(`🚧 Checking ${comparingKey} key with length: ${Object.keys(DYExps[comparingKey]).length} ${comparingKey}: ${Object.keys(DYExps[comparingKey])}`);
          const otherKeys = Object.keys(DYExps[comparingKey]);
          for (let oKey of otherKeys) {
            console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
            console.log(`🚀 Checking key: ${oKey}`);
            if (DYExpsApi[comparingKey] && DYExpsApi[comparingKey][oKey]) {
              isDeepEqual(DYExps[comparingKey][oKey], DYExpsApi[comparingKey][oKey], ignoreKeys);
            } else {
              console.log(`🔴 Section: ${sectionId} Key: ${oKey}, doesn't  exist in DYExpsApi`);
            }
          }
          console.log(`✅  Done Checking ${Object.keys(DYExps[comparingKey]).length} keys, for sectionId: ${sectionId}`);
        }
      }
    });
  });

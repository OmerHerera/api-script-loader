import { test, expect, type Page } from '@playwright/test';
//https://cdn-dev.dynamicyield.com/dev-use1-release
const S3_BUCKET = 'dev-use1-release';// || 'api-dev';
// const CDN = process.env.CDN || `https://cdn-dev.dynamicyield.com/${S3_BUCKET}/api/8784953/api_dynamic_assembly.js`
const CDN = process.env.CDN || `https://cdn-dev.dynamicyield.com/${S3_BUCKET}/api/`
const FILE_NAME = process.env.FILE_NAME || 'api_dynamic_full.js'
const comparingKey = process.env.COMPARING_KEY || 'otags';
const smartTagId = process.env.SMART_TAG_ID || '';
const logSmartTagObject = process.env.LOG_SMART_TAG_OBJ || false;
const region = process.env.REGION || 'us';
let DYExps: any = '';
let DYExpsApi: any = '';
const obj1 = {
	a: 1,
	b: {
		c: 2,
		d: {
			e: 3
		}
	}
};

const obj2 = {
	a: 1,
	b: {
		c: 2,
		d: {
			e: 3
		}
	}
};

test.beforeEach(async ({ page }) => {
  // const sectionId = [8780665]//normalizeInputArray(process.env.SECTION_ID || debugSections);
  const sectionId = [8784953]//normalizeInputArray(process.env.SECTION_ID || debugSections);
  const apiAssemblyFilePath = `${CDN}${sectionId}/${FILE_NAME}`
  await page.goto('https://api-script-loader.vercel.app/');
  page.on('console', msg => console.log(msg.text()));
  await page.locator('[placeholder="Insert URL Api-Assembly Result"]').fill(apiAssemblyFilePath);
  await page.locator('text=Click to load file').click();
  // This is trick for waiting to the clone action
  console.log('⏳ Waiting for cloning to be finish')
  await page.locator('[placeholder="Cloned"]').fill('🧬');
    
  await page.locator('[placeholder="Insert SectionId"]').fill(sectionId.toString());
  await page.locator('select[name="dyRegion"]').selectOption({ label: region });
  await page.locator('text=Click to load prod file').click();
  await page.locator('select[name="dyObject"]').selectOption({ label: comparingKey });
    
  DYExps = await page.evaluate('window.DYExps');
  DYExpsApi = await page.evaluate('window.DYExpsApi');
});

function consoleLog(color: string, msg: string) {
  let output = ''
  switch (color) {
    case 'B':
      console.log(`\x1b[94m${msg} \x1b[0m`);
      break;
    case 'R':
      console.log(`\x1b[91m${msg} \x1b[0m`);
      break;
    case 'G':
        console.log(`\x1b[32m${msg} \x1b[0m`);
        break;
  }
  // console.log('\x1b[33mKey: ${sendKey}, if not objects, perform simple comparison \x1b[0m');
}

function deepEqual(obj1: any, obj2: any, sendKey?: string) {
	// Check if both arguments are objects
	// if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) {
	if (typeof obj1 === 'object' && obj1 !== null) {
		const keys1 = Object.keys(obj1);
		// const keys2 = Object.keys(obj2);

    // Check if number of keys is the same
    // console.log(keys1)
    // console.log(keys2.length)
    // expect(keys1.length).toEqual(keys2.length);
		// // Check if number of keys is the same
		// if (keys1.length !== keys2.length) {
		// 	return false;
		// }

		// Check if each key-value pair is deeply equal
    for (let key of keys1) {
			if (!deepEqual(obj1[key], obj2[key] || '', `${ sendKey || ''}${sendKey ? '.' : ''}${key}`)) {
				return true;
			}
		}
		return true;
  } else {
    // If not objects, perform simple comparison
    if ((obj1 === obj2) === false) {
      if (obj1 === 0 && obj2 === '') {
        return true;
      }
      else if (obj1 === null && obj2 === '') {
        return true;
      }
      else if (obj1 === false && obj2 === '') {
        return true;
      }
      // get the current key
      const currKey = sendKey?.split('.')[sendKey?.split('.').length - 1];
      if (currKey === 'jsCode') {
        let a = encodeURIComponent(decodeURIComponent(obj1));
        let b = encodeURIComponent(decodeURIComponent(obj2));
        if (a === b) {
          return true;
        }
      }
      if (currKey === 'htmlCode' || currKey === 'resources' || currKey === 'cssCode' || currKey === 'params') { 
        if (decodeURIComponent(obj1) === decodeURIComponent(obj2)) { 
          return true;
        }
      }

      consoleLog('B', `Key: ${sendKey}, value is not equal`);
      consoleLog('R', `DYExps Ruby    : ${obj1}`);
      consoleLog('R', `DYExps Assembly: ${obj2}`)
      consoleLog('G', `------------------------------------------------------------------------------------------------------------`)
    }
		return true
		// return obj1 === obj2;
	}
}

test.describe('api-assembly', () => {
  test('Compare Objects', async ({ page }) => {
    // create a new todo locator
    // const newTodo = page.getByPlaceholder('What needs to be done?');
    // Create 1st todo.
    // await newTodo.fill(TODO_ITEMS[0]);
    // await newTodo.press('Enter');
  
    // Make sure the list only has one todo item.
    // await expect(page.getByTestId('todo-title')).toHaveText([
    //   TODO_ITEMS[0]
    // ]);
  
    // Create 2nd todo.
    // await newTodo.fill(TODO_ITEMS[1]);
    // await newTodo.press('Enter');
  
    // Make sure the list now has two todo items.
    // await expect(deepEqual(obj1, obj2)).toBeTruthy();
    // await expect(deepEqual(DYExps, DYExpsApi)).toBeTruthy();
    // await expect(deepEqual(DYExps, DYExpsApi)).toBeTruthy();
    deepEqual(DYExps, DYExpsApi);
    // await deepEqual(DYExps, DYExpsApi);
    // expect(true).toBe(true);
  });

  
});


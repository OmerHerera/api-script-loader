
import cloneDeep from 'lodash.clonedeep';

export const OPTIONS = {
  FULL_URL: 0,
  PROD_SECTION: 1
};

function getValue(id: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value || '';
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}
function isDeepEqual(object1: any, object2: any) {
  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    console.log(`window.DYExps    value: ${object1}`);
    console.log(`window.DYExpsApi value: ${object2}`);
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
          console.log(`\n1. Returning false, key: ${key}`);
          console.log(`\n window.DYExps    value:\n ${JSON.stringify(value1)}`);
          console.log(`\n window.DYExpsApi value:\n ${JSON.stringify(value2)}`);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e} \nwindow.DYExps value: ${value1} \nwindow.DYExpsApi value: ${value2}`)
      }
    }
    if (!isObjects && value1 !== value2) {
      let value1DecodeURI;
      let value2DecodeURI;
      try {
        value1DecodeURI = decodeURIComponent(value1)
        value2DecodeURI = decodeURIComponent(value2)
        if (key === 'cssCode' || key === 'jsCode' || key === 'htmlCode') {
          value1DecodeURI = value1DecodeURI.replace(/'/g, '"');
        }
        if (value1DecodeURI !== value2DecodeURI) {
          console.log(`\n !isObjects && window.DYExps !== window.DYExpsApi`);
          console.log(`\n 2. Returning false, key: ${key}\n`);
          console.log(`\n window.DYExps    decodeURI:\n ${value1DecodeURI}`);
          console.log(`\n window.DYExpsApi decodeURI:\n ${value2DecodeURI}`);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e} window.DYExps: ${value1} window.DYExpsApi: ${value2} key: ${key}`)
      }
    }
  }
  return true;
}

function cloneDYExps() {
  console.log('🧬 Cloning to DYExps . . .');
  window.DYExpsApi = cloneDeep(window.DYExps);
  window.DYExps = null;
  const el = document.getElementById('clone') as HTMLInputElement | null;
  // @ts-ignore: Object is possibly 'null'.
  el.style.display = ""
  console.log('🙌🏽 Cloned to DYExpsApi Object');
}

function runPopulateSelect() {
    const select = document.getElementById('dyObject') as HTMLSelectElement | null ;
    const arr = Object.keys(window.DYExps);
    for (const [index, a] of arr.entries()) {
      const opt = document.createElement('option');
      opt.value = index.toString();
      opt.innerHTML = a;
      select?.appendChild(opt);
    }
    // option all
    const opt = document.createElement('option');
    opt.value = 'all';
    opt.innerHTML = 'all';
    select?.appendChild(opt);
}

function loadFile(src: string, populateSelect: boolean = false) {
  console.log(`⏱️  Loading Objects, from file: ${src}`);
  let myScript = document.createElement('script');
  myScript.setAttribute('src', src);
  myScript.onload = populateSelect ? runPopulateSelect : cloneDYExps;
  document.body.appendChild(myScript);
}

function loadFilePromise(src: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`⏱️  Loading Objects, from file: ${src}`);
    let myScript = document.createElement('script');
    myScript.setAttribute('src', src);
    myScript.onload = () => {
      resolve();
    };
    document.body.appendChild(myScript);
  });
}

export function runCompare() {
  const select = document.getElementById('dyObject') as HTMLSelectElement | null;
  let text = select?.options[select.selectedIndex].text;
  console.log(`Running runCompare with option ${text} . . .`);
  if (text === 'all') {
    const keys = Object.keys(window.DYExps);
    for (let key of keys) {
      console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
      console.log(`🚀 Checking key: ${key}`);
      // smartTags
      if (key === 'otags') {
        const otagsKeys = Object.keys(window.DYExps['otags']);
        for (let cKey of otagsKeys) {
          console.log(`🚀 Smart Tag key: ${cKey}`);
          isDeepEqual(window.DYExps['otags'][cKey], window.DYExpsApi['otags'][cKey]);
        }
      }
      else {
        isDeepEqual(window.DYExps[key], window.DYExpsApi[key]);
      }
    }
  } else {
    const otherKeys = Object.keys(window.DYExps[text]);
    for (let oKey of otherKeys) {
      console.log(`⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞`);
      console.log(`🚀 Checking key: ${oKey}`);
      isDeepEqual(window.DYExps[text][oKey], window.DYExpsApi[text][oKey]);
    }
  }
}

export function starFlow(option: number, id: string, populate?: boolean) {
  const value = getValue(id);
  const select = document.getElementById('dyRegion') as HTMLSelectElement | null;
  let region = select?.options[select.selectedIndex || 0].text;
  console.log(`🗺️  Region: ${region}`);
  if(value) {
    switch (option) {
      case OPTIONS.PROD_SECTION:
        const regionPath = region == 'eu' ? 'https://cdn-eu.dynamicyield.com' : 'https://cdn.dynamicyield.com';
        loadFile(`${regionPath}/api/${value}/api_dynamic.js`, populate);
        break;
      case OPTIONS.FULL_URL:
        loadFile(value);
        break;
      default:
        break;
      }
    } else {
      console.error(`No: Data`);
  }
}

export function runFullFlow() {
  const pathFullFlow = getValue('pathFullFlow');
  const sectionIdFullFlow = pathFullFlow.split('_')[0]
  const pathProductionFile = `https://cdn.dynamicyield.com/api/${sectionIdFullFlow}/api_dynamic.js`

  const loadApiAssemblyFile = loadFilePromise(pathFullFlow);
  const loadProductionFile = loadFilePromise(pathProductionFile);

  loadApiAssemblyFile
    .then(() => {
      console.log('Api Assembly File Loaded');
      cloneDYExps();
      loadProductionFile
        .then(() => {
          console.log('Production File Loaded');
          const otagsKeys = Object.keys(window.DYExps['otags']);
          console.log(`🚧 Checking ${Object.keys(window.DYExps['otags']).length} SmartTags`);
          for (let cKey of otagsKeys) {
            console.log('⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞⚞');
            console.log(`🚀 Smart Tag key: ${cKey}`);
            isDeepEqual(window.DYExps['otags'][cKey], window.DYExpsApi['otags'][cKey]);
          }
          console.log(`✅ Done Checking ${Object.keys(window.DYExps['otags']).length} SmartTags`);
        })
    })
}

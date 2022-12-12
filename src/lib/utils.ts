
import cloneDeep from 'lodash.clonedeep';

export const OPTIONS = {
  FULL_URL: 0,
  PROD_SITE: 1  
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

    // original
    // if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
    //   const value1DecodeURI = decodeURI(value1);
    //   const value2DecodeURI = decodeURI(value2);
    //   console.log(`object1 decodeURI: ${value1DecodeURI}`);
    //   console.log(`object2 decodeURI: ${value2DecodeURI}`);
    //   if(value1DecodeURI !== value2DecodeURI) {
    //     return false;
    //   }
    // }
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
        console.log(`e: ${e} window.DYExps value: ${value1} window.DYExpsApi value: ${value2}`)
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
  window.DYExpsApi = cloneDeep(window.DYExps);
  window.DYExps = null;
  console.log('Cloned to DYExpsApi Object');
}

function runPopulateSelect() { 
  console.log('Onload fired . . .');
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
  console.log('Loading Objects . . .');
  let myScript = document.createElement('script');
  myScript.setAttribute('src', src);
  myScript.onload = populateSelect ? runPopulateSelect : cloneDYExps;
  document.body.appendChild(myScript);
  
}

export function runCompare() {
  const select = document.getElementById('dyObject') as HTMLSelectElement | null;
  let text = select?.options[select.selectedIndex].text;
  console.log(`Running runCompare with option ${text} . . .`);
  if (text === 'all') {
    const keys = Object.keys(window.DYExps);
    for (let key of keys) {
      console.log(`************************************************************`);
      console.log(`Checking key: ${key}`);
      // smartTags
      if (key === 'otags') {
        const otagsKeys = Object.keys(window.DYExps['otags']);
        for (let cKey of otagsKeys) {
          console.log(`Smart Tag key: ${cKey}`);
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
      console.log(`************************************************************`);
      console.log(`Checking key: ${oKey}`); 
      isDeepEqual(window.DYExps[text][oKey], window.DYExpsApi[text][oKey]);
    }
  }
}

export function starFlow(option: number, id: string) {
  const value = getValue(id);
  console.log(value);
  if(value) {
    switch (option) {
      case OPTIONS.PROD_SITE:
        loadFile(`https://cdn.dynamicyield.com/api/${value}/api_dynamic.js`, true);
        break;
      case OPTIONS.FULL_URL:
        loadFile(value);
        // clonewindow.DYExps();
        break;
      default:
        break;
      }
    } else {
      console.error(`No: Data`);
  }
}

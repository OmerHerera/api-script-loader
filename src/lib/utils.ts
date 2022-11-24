
export const OPTIONS = {
  FULL_URL: 0,
  PROD_SITE: 1  
};

function getValue(id: string) {
  const el = document.getElementById(id);
  return el.value || '';
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}

function isDeepEqual (object1: any, object2: any) {
  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);
  if (objKeys1.length !== objKeys2.length) return false;
    for (var key of objKeys1) {
      const value1 = object1[key];
      const value2 = object2[key];
      const isObjects = isObject(value1) && isObject(value2);
      
      // if ((isObjects && !isDeepEqual(value1, value2)) || (!isObjects && value1 !== value2)) {
      //   return false;
      // }

      if(isObjects && !isDeepEqual(value1, value2)) {
        console.log('isObjects && !isDeepEqual(value1, value2)')
        return false;
      }
      if(!isObjects && value1 !== value2) {
        console.log('!isObjects && value1 !== value2)')
        return false;
      }
    }
    return true;
}

function cloneDYExps() {
  window.DYExpsApi  = Object.assign({}, window.DYExps);
  console.log('Cloned to DYExpsApi Object');
}

function loadFile(src: string) {
  console.log('Loading Objects . . .');
  let myScript = document.createElement('script');
    myScript.setAttribute('src', src);
    // myScript.onload = ()=>{
    //   console.log('Loading . . .');
    //   // console.log(`DYExp: ${JSON.stringify(window.DYExps)}`)
    //   // window.DYExpsApi  = Object.assign({}, window.DYExps);
    //   // console.log('Loaded and cloned to DYExpsApi Object');
    // }
    document.body.appendChild(myScript);
}

export function runCompare() {
  console.log('Running runCompare . . .');
  const res = isDeepEqual(DYExps, DYExpsApi);
  console.log(`isDeepEqual: ${res}`);
}

export function starFlow(option: number, id: string) {
  const value = getValue(id);
  if(value) {
    switch (option) {
      case OPTIONS.PROD_SITE:
        loadFile(`https://cdn.dynamicyield.com/api/${value}/api_dynamic.js`);
        break;
      case OPTIONS.FULL_URL:
        cloneDYExps();
        loadFile(value);
        break;
      default:
        break;
      }
    } else {
      console.error(`No: Data`);
  }
}

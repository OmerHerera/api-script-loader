
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
function isDeepEqual(object1: any, object2: any) {
  if ((typeof object1 === 'string' && typeof object2 === 'string') && (object2 !== object1)) {
    console.log(`DYExps    value: ${object1}`);
    console.log(`DYExpsApi value: ${object2}`);
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
  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];
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
        value1DecodeURI = decodeURIComponent(value1);
        value2DecodeURI = decodeURIComponent(value2);
        if (value1DecodeURI !== value2DecodeURI) {
          console.log(`1. Returning false, key: ${key}`);
          console.log(`DYExps    value: ${JSON.stringify(value1)}`);
          console.log(`DYExpsApi value: ${JSON.stringify(value2)}`);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e} DYExps value: ${value1} DYExpsApi value: ${value2}`)
      }
    }
    if (!isObjects && value1 !== value2) {
      let value1DecodeURI;
      let value2DecodeURI;
      try {
        value1DecodeURI = decodeURIComponent(value1);
        value2DecodeURI = decodeURIComponent(value2);
        if (value1DecodeURI !== value2DecodeURI) {
          console.log(`!isObjects && DYExps !== DYExpsApi`);
          console.log(`2. Returning false, key: ${key}`);
          console.log(`DYExps    decodeURI: ${value1DecodeURI}`);
          console.log(`DYExpsApi decodeURI: ${value2DecodeURI}`);
          return false;
        }
      } catch (e) {
        console.log(`e: ${e} DYExps: ${value1} DYExpsApi: ${value2} key: ${key}`)
      }
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
  myScript.onload = ()=>{
    console.log('Loading . . .');
    const select = document.getElementById('dyObject');
    const arr = Object.keys(DYExps);
    for (const [index, a] of arr.entries()) {
      const opt = document.createElement('option');
      opt.value = index;
      opt.innerHTML = a;
      select.appendChild(opt);
    }
    // option all
    const opt = document.createElement('option');
    opt.value = 'all';
    opt.innerHTML = 'all';
    select.appendChild(opt);
  }
  document.body.appendChild(myScript);
  
}

export function runCompare() {
  const select = document.getElementById('dyObject');
  var text = select.options[select.selectedIndex].text;
  console.log(`Running runCompare with option ${text} . . .`);
  if (text === 'all') {
    const keys = Object.keys(DYExps);
    for (var key of keys) {
      console.log(`************************************************************`);
      console.log(`Checking key: ${key}`);
      // smartTags
      if (key === 'otags') {
        const otagsKeys = Object.keys(DYExps['otags']);
        for (var cKey of otagsKeys) {
          console.log(`Smart Tag key: ${cKey}`);
          isDeepEqual(DYExps['otags'][cKey], DYExpsApi['otags'][cKey]);
        }
      }
      else {
        isDeepEqual(DYExps[key], DYExpsApi[key]);
      }
    }
  } else {
    const otherKeys = Object.keys(DYExps[text]);
    for (var oKey of otherKeys) {
      console.log(`************************************************************`);
      console.log(`Checking key: ${oKey}`); 
      isDeepEqual(DYExps[text][oKey], DYExpsApi[text][oKey]);
    }
  }
}

export function starFlow(option: number, id: string) {
  const value = getValue(id);
  if(value) {
    switch (option) {
      case OPTIONS.PROD_SITE:
        loadFile(`https://cdn.dynamicyield.com/api/${value}/api_dynamic.js`);
        break;
      case OPTIONS.FULL_URL:
        loadFile(value);
        // cloneDYExps();
        break;
      default:
        break;
      }
    } else {
      console.error(`No: Data`);
  }
}

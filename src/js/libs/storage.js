// A wrapper around window.localStorage or chrome.storage.storage
// based on the platform

let isChrome = !!(chrome && chrome.storage && chrome.storage.local);

export default {
  get(key, cb){
    if(isChrome){
      return chrome.storage.local.get(key, (res) => {
        cb(res[key]);
      });
    }else{
      return cb(JSON.parse(localStorage.getItem(key)));
    }
  },

  // TODO errors, cb
  set(key, data){
    if(isChrome){
      let obj = {};
      obj[key] = data; // TODO can use dynamic properties in ES&?

      return chrome.storage.local.set(obj);
    }else{
      return localStorage.setItem(key, JSON.stringify(data));
    }    
  }
};
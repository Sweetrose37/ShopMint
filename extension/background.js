const KEY='shopmint.currentPackage';
chrome.runtime.onInstalled.addListener(()=>chrome.storage.local.set({'shopmint.debug':false}));
chrome.runtime.onMessage.addListener((message,_sender,sendResponse)=>{
  if(message?.type==='SHOPMINT_GET_PACKAGE'){
    chrome.storage.local.get(KEY).then(value=>sendResponse({package:value[KEY]||null}));
    return true;
  }
  return false;
});

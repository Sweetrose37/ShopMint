export const SUPPORTED_VERSIONS=['1.0.0','1.1.0','1.2.0'];
export const STORAGE_KEY='shopmint.currentPackage';

export function normalizePackage(raw){
  if(!raw||typeof raw!=='object')throw new Error('This file does not contain a listing package.');
  if(!SUPPORTED_VERSIONS.includes(String(raw.schemaVersion)))throw new Error(`Package version ${raw.schemaVersion||'unknown'} is not supported.`);
  const required=['productId','productName','productType','title','description','tags','price','quantity','sku'];
  const missing=required.filter(key=>raw[key]===undefined||raw[key]===null);
  if(missing.length)throw new Error(`Package is missing: ${missing.join(', ')}.`);
  if(!Array.isArray(raw.tags))throw new Error('Package tags must be an array.');
  if(raw.tags.length>13)throw new Error('A SHOPMINT package cannot contain more than 13 tags.');
  const tags=[...new Set(raw.tags.map(String).map(x=>x.trim()).filter(Boolean).map((x,i,a)=>a.findIndex(y=>y.toLowerCase()===x.toLowerCase())===i?x:null).filter(Boolean))].slice(0,13);
  return {...raw,tags,price:Number(raw.price),quantity:Number(raw.quantity),schemaVersion:String(raw.schemaVersion),creationDetails:raw.creationDetails&&typeof raw.creationDetails==='object'?raw.creationDetails:null,mockups:Array.isArray(raw.mockups)?raw.mockups:[],mockupImages:Array.isArray(raw.mockupImages)?raw.mockupImages.filter(image=>image&&typeof image.dataUrl==='string'&&image.dataUrl.startsWith('data:image/')).slice(0,20):[],sourceFiles:Array.isArray(raw.sourceFiles)?raw.sourceFiles:[],imageChecklist:Array.isArray(raw.imageChecklist)?raw.imageChecklist:[],deliveryChecklist:Array.isArray(raw.deliveryChecklist)?raw.deliveryChecklist:[]};
}

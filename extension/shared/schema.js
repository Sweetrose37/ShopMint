export const SUPPORTED_VERSIONS=['1.0.0','1.1.0','1.2.0'];
export const STORAGE_KEY='shopmint.currentPackage';

function normalizeEtsyTag(value){const cleaned=String(value??'').normalize('NFC').replace(/[^\p{L}\p{N}\s'-]+/gu,' ').replace(/(^|\s)['-]+/g,'$1').replace(/['-]+(?=\s|$)/g,'').replace(/\s+/g,' ').trim();if(cleaned.length<=20)return cleaned;const window=cleaned.slice(0,21);const breakAt=window.lastIndexOf(' ');return(breakAt>=8?window.slice(0,breakAt):cleaned.slice(0,20)).replace(/['-]+$/,'').trim()}

export function normalizePackage(raw){
  if(!raw||typeof raw!=='object')throw new Error('This file does not contain a listing package.');
  if(!SUPPORTED_VERSIONS.includes(String(raw.schemaVersion)))throw new Error(`Package version ${raw.schemaVersion||'unknown'} is not supported.`);
  const required=['productId','productName','productType','title','description','tags','price','quantity','sku'];
  const missing=required.filter(key=>raw[key]===undefined||raw[key]===null);
  if(missing.length)throw new Error(`Package is missing: ${missing.join(', ')}.`);
  if(!Array.isArray(raw.tags))throw new Error('Package tags must be an array.');
  if(raw.tags.length>13)throw new Error('A SHOPMINT package cannot contain more than 13 tags.');
  const tags=[];for(const value of raw.tags){const tag=normalizeEtsyTag(value);if(tag&&!tags.some(existing=>existing.toLowerCase()===tag.toLowerCase()))tags.push(tag);if(tags.length===13)break}
  return {...raw,tags,price:Number(raw.price),quantity:Number(raw.quantity),schemaVersion:String(raw.schemaVersion),creationDetails:raw.creationDetails&&typeof raw.creationDetails==='object'?raw.creationDetails:null,mockups:Array.isArray(raw.mockups)?raw.mockups:[],mockupImages:Array.isArray(raw.mockupImages)?raw.mockupImages.filter(image=>image&&typeof image.dataUrl==='string'&&image.dataUrl.startsWith('data:image/')).slice(0,20):[],sourceFiles:Array.isArray(raw.sourceFiles)?raw.sourceFiles:[],imageChecklist:Array.isArray(raw.imageChecklist)?raw.imageChecklist:[],deliveryChecklist:Array.isArray(raw.deliveryChecklist)?raw.deliveryChecklist:[]};
}

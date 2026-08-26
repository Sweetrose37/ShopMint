import type {Listing,ProductType,Project,Settings} from './types';
import {createListingPackage} from './schema';
import {normalizeEtsyTags,validateEtsyTag} from './etsyTags';
export const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`;
export const defaults:Settings={brandName:'',watermarkText:'© YOUR SHOP',defaultPrice:5.99,skuPrefix:'SM',usageStatement:'For personal and small-business use. Do not resell or redistribute the digital files.',customerInstructions:'Your files are available immediately after purchase. Download, unzip if needed, and enjoy.',digitalNote:'This is a digital download. No physical item will be shipped.',mockupPreference:'Flat-lay thumbnail',fileNaming:'kebab-case',creationDefaults:{whoMade:'',whatIsIt:'',productionPartner:'',productionPartnerName:'',whenMade:''},onboarded:false};
const keywords:Record<string,string[]>={
 'DTF PNG':['dtf transfer','shirt design','png download','print ready'], 'Sublimation PNG':['sublimation design','png download','heat transfer','printable art'],
 'Tumbler wrap':['tumbler wrap','20oz tumbler','skinny tumbler','wrap design'], 'Sticker pack':['sticker bundle','digital stickers','planner stickers','printable sticker'],
 'Clipart bundle':['clipart bundle','png clipart','commercial use','digital graphics'], 'Digital paper':['digital paper','seamless pattern','scrapbook paper','pattern pack'],
 'Printable':['printable art','instant download','wall decor','digital print'], 'PDF download':['pdf download','printable pdf','instant access','digital file'],
 'Ebook':['digital guide','ebook download','pdf ebook','instant download'], 'Digital bundle':['digital bundle','mega bundle','instant download','commercial use'],
 'Other custom digital product':['digital download','instant access','digital product','downloadable file']};
export function generateListing(name:string,type:ProductType,s:Settings):Listing{
 const topic=name.trim()||'Untitled Design'; const k=keywords[type]||keywords['Other custom digital product'];
 const tags=normalizeEtsyTags([...k,topic.toLowerCase(),`${topic.toLowerCase()} gift`,'creative download','small business','diy project','maker design','digital design','instant file','craft supply','apparel graphic','heat press design','crafting download']).slice(0,13);
 return {title:`${topic} | ${type} | Instant Digital Download`,description:`Bring your next idea to life with ${topic}, a carefully prepared ${type.toLowerCase()} ready for your creative workflow.\n\nWHAT'S INCLUDED\n• High-quality digital files\n• Instant access after purchase\n• Clear customer instructions\n\nPLEASE NOTE\n${s.digitalNote}\n\nUSAGE\n${s.usageStatement}`,tags,price:s.defaultPrice,quantity:999,sku:'',categorySuggestion:type.includes('PNG')?'Craft Supplies & Tools › Digital':type==='Ebook'?'Books, Movies & Music › Digital Books':'Digital Downloads',materials:'Digital file, instant download',primaryColor:'',secondaryColor:'',occasion:'',holiday:'',personalization:'',digitalDisclosure:s.digitalNote,includedFiles:'See product files',usageNotes:s.usageStatement,customerInstructions:s.customerInstructions,creationDetails:{...s.creationDefaults,digitalCreation:''}};
}
export const makeSku=(prefix:string,type:string)=>`${prefix||'SM'}-${type.replace(/[^A-Z]/gi,'').slice(0,4).toUpperCase()}-${Date.now().toString().slice(-5)}`;
export const newProject=(name:string,type:ProductType,s:Settings):Project=>{const now=new Date().toISOString();const listing=generateListing(name,type,s);listing.sku=makeSku(s.skuPrefix,type);return{id:uid(),productName:name,productType:type,sourceFiles:[],listing,mockups:[],packageStatus:'Not started',createdAt:now,updatedAt:now}};
export const fileSize=(n:number)=>n<1024?'0 KB':n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`;
export const download=(name:string,data:string|Blob,type='text/plain')=>{const blob=data instanceof Blob?data:new Blob([data],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)};
export const exportShape=(p:Project)=>createListingPackage(p);
export function validateTags(tags:string[]){return tags.map((t,i)=>({...validateEtsyTag(t),index:i,duplicate:!!t&&tags.findIndex(x=>x.trim().toLowerCase()===t.trim().toLowerCase())!==i}))}

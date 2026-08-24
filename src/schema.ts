import type {CreationDetails,Project} from './types';

export const LISTING_SCHEMA_VERSION='1.2.0' as const;
export const SUPPORTED_SCHEMA_VERSIONS=['1.0.0','1.1.0','1.2.0'] as const;

export type ShopmintListingPackage={
  schemaVersion:string;
  exportedBy:'SHOPMINT';
  exportPurpose:'sidekick-listing-assist';
  productId:string;
  productName:string;
  productType:string;
  title:string;
  description:string;
  tags:string[];
  price:number;
  salePrice?:number;
  quantity:number;
  sku:string;
  categorySuggestion:string;
  materials:string;
  primaryColor:string;
  secondaryColor:string;
  occasion:string;
  holiday:string;
  personalization:string;
  digitalDisclosure:string;
  includedFiles:string;
  usageNotes:string;
  customerInstructions:string;
  creationDetails?:CreationDetails;
  sourceFiles:Array<{name:string;type:string;size:number;customerFile:boolean}>;
  mockups:Array<{id:string;name:string;style:string;watermarked:boolean;createdAt:string;kind?:string;primary?:boolean;order?:number}>;
  imageChecklist:Array<{name:string;order:number;watermarked:boolean;kind?:string;primary?:boolean}>;
  mockupImages?:Array<{name:string;dataUrl:string;order:number;primary?:boolean}>;
  deliveryChecklist:Array<{name:string;size:number}>;
  createdAt:string;
  updatedAt:string;
};

export function createListingPackage(p:Project):ShopmintListingPackage{
  const orderedMockups=[...p.mockups].sort((a,b)=>Number(Boolean(b.primary))-Number(Boolean(a.primary))||(a.order??999)-(b.order??999));
  return {schemaVersion:LISTING_SCHEMA_VERSION,exportedBy:'SHOPMINT',exportPurpose:'sidekick-listing-assist',productId:p.id,productName:p.productName,productType:p.productType,title:p.listing.title,description:p.listing.description,tags:p.listing.tags.slice(0,13),price:p.listing.price,salePrice:p.listing.salePrice,quantity:p.listing.quantity,sku:p.listing.sku,categorySuggestion:p.listing.categorySuggestion,materials:p.listing.materials,primaryColor:p.listing.primaryColor,secondaryColor:p.listing.secondaryColor,occasion:p.listing.occasion,holiday:p.listing.holiday,personalization:p.listing.personalization,digitalDisclosure:p.listing.digitalDisclosure,includedFiles:p.listing.includedFiles,usageNotes:p.listing.usageNotes,customerInstructions:p.listing.customerInstructions,creationDetails:p.listing.creationDetails,sourceFiles:p.sourceFiles.map(({name,type,size,customerFile})=>({name,type,size,customerFile})),mockups:orderedMockups.map(({id,name,style,watermarked,createdAt,kind,primary,order})=>({id,name,style,watermarked,createdAt,kind,primary,order})),imageChecklist:orderedMockups.map((m,index)=>({name:m.name,order:index+1,watermarked:m.watermarked,kind:m.kind,primary:m.primary})),deliveryChecklist:p.sourceFiles.filter(f=>f.customerFile).map(({name,size})=>({name,size})),createdAt:p.createdAt,updatedAt:p.updatedAt};
}

export function listingReadiness(p:Project){
  const creation=p.listing.creationDetails;
  const checks=[
    {label:'Listing title',ok:!!p.listing.title.trim(),critical:true},
    {label:'Description',ok:!!p.listing.description.trim(),critical:true},
    {label:'Price',ok:Number.isFinite(p.listing.price)&&p.listing.price>0,critical:true},
    {label:'Creation details · Who made it?',ok:!!creation?.whoMade,critical:true},
    {label:'Creation details · What is it?',ok:!!creation?.whatIsIt,critical:true},
    {label:'Creation details · AI disclosure',ok:!!creation?.digitalCreation,critical:true},
    {label:'Creation details · Production partner',ok:!!creation?.productionPartner&&(creation.productionPartner!=='uses-production-partner'||!!creation.productionPartnerName.trim()),critical:true},
    {label:'Creation details · When made',ok:!!creation?.whenMade&&creation.whenMade!=='not-applicable-digital',critical:true},
    {label:'13 reviewed tags',ok:p.listing.tags.filter(Boolean).length===13,critical:false},
    {label:'SKU',ok:!!p.listing.sku.trim(),critical:false},
    {label:'Customer files',ok:p.sourceFiles.some(f=>f.customerFile),critical:false},
    {label:'Listing mockups',ok:p.mockups.length>0,critical:false}
  ];
  return {checks,ready:checks.filter(c=>c.critical).every(c=>c.ok),warnings:checks.filter(c=>!c.ok).map(c=>c.label)};
}

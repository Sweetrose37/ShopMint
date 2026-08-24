export const PRODUCT_TYPES=['DTF PNG','Sublimation PNG','Tumbler wrap','Sticker pack','Clipart bundle','Digital paper','Printable','PDF download','Ebook','Digital bundle','Other custom digital product'] as const;
export type ProductType=typeof PRODUCT_TYPES[number];
export type SourceFile={id:string;name:string;type:string;size:number;width?:number;height?:number;dataUrl?:string;customerFile:boolean};
export type Mockup={id:string;style:string;name:string;dataUrl:string;watermarked:boolean;createdAt:string};
export type Listing={title:string;description:string;tags:string[];price:number;salePrice?:number;quantity:number;sku:string;categorySuggestion:string;materials:string;primaryColor:string;secondaryColor:string;occasion:string;holiday:string;personalization:string;digitalDisclosure:string;includedFiles:string;usageNotes:string;customerInstructions:string};
export type Project={id:string;productName:string;productType:ProductType;sourceFiles:SourceFile[];previewImage?:string;listing:Listing;mockups:Mockup[];packageStatus:'Not started'|'In progress'|'Ready';createdAt:string;updatedAt:string};
export type Settings={brandName:string;watermarkText:string;defaultPrice:number;skuPrefix:string;usageStatement:string;customerInstructions:string;digitalNote:string;mockupPreference:string;fileNaming:string;onboarded:boolean};

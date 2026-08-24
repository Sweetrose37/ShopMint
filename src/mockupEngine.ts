import type {Mockup,SourceFile} from './types';
import {uid} from './lib';

export const GALLERY_KINDS=['hero','collage','apparel','detail','whats-included','file-info','instructions'] as const;
export type GalleryKind=typeof GALLERY_KINDS[number];
export type GalleryDirection='auto'|'luxury-editorial'|'trendy-boutique'|'colorful-studio'|'clean-premium'|'feminine-glam'|'bold-streetwear'|'seasonal';

type Theme={ink:string;paper:string;accent:string;accent2:string;soft:string;scene:'tee'|'sweatshirt'|'flatlay'};
const themes:Record<GalleryDirection,Theme>={
  auto:{ink:'#171218',paper:'#fbf5eb',accent:'#a9e7c6',accent2:'#e78b72',soft:'#3c2b3e',scene:'tee'},
  'luxury-editorial':{ink:'#171218',paper:'#f5efe5',accent:'#b8e7cd',accent2:'#c58b70',soft:'#30252f',scene:'tee'},
  'trendy-boutique':{ink:'#31222e',paper:'#fff5ef',accent:'#f2aaaf',accent2:'#9edcc0',soft:'#604152',scene:'sweatshirt'},
  'colorful-studio':{ink:'#28152d',paper:'#fff8ec',accent:'#78e0c5',accent2:'#ff8e75',soft:'#63446b',scene:'flatlay'},
  'clean-premium':{ink:'#1d2220',paper:'#fbfaf4',accent:'#aed7c2',accent2:'#c8b69b',soft:'#59605b',scene:'tee'},
  'feminine-glam':{ink:'#2d1a29',paper:'#fff4f4',accent:'#e8b7cf',accent2:'#d9bd74',soft:'#69465d',scene:'sweatshirt'},
  'bold-streetwear':{ink:'#101113',paper:'#e9eadf',accent:'#96e2b8',accent2:'#ef6f58',soft:'#34373b',scene:'sweatshirt'},
  seasonal:{ink:'#173129',paper:'#fff7e7',accent:'#d6b967',accent2:'#b64f3f',soft:'#355c4e',scene:'flatlay'}
};
type Options={productName:string;productType:string;files:SourceFile[];direction:GalleryDirection;watermark?:{enabled:boolean;text:string;opacity:number};scenes:{tee:string;sweatshirt:string;flatlay:string};onProgress?:(label:string)=>void};
const size=1200;
export function marketplaceHeadline(productName:string,_count:number){const clean=productName.trim();const internal=/^(google drive download|selected files?|product folder|untitled product|downloads?)$/i.test(clean)||/\.(png|jpe?g|webp|pdf|zip)$/i.test(clean);return internal?'PREMIUM DESIGN COLLECTION':clean}

const load=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src});
const canvas=()=>{const c=document.createElement('canvas');c.width=size;c.height=size;return c};
function round(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function contain(ctx:CanvasRenderingContext2D,image:CanvasImageSource,iw:number,ih:number,x:number,y:number,w:number,h:number,pad=0){const scale=Math.min((w-pad*2)/iw,(h-pad*2)/ih);const dw=iw*scale,dh=ih*scale;ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
function background(ctx:CanvasRenderingContext2D,t:Theme){const g=ctx.createLinearGradient(0,0,size,size);g.addColorStop(0,t.ink);g.addColorStop(.58,t.soft);g.addColorStop(1,t.ink);ctx.fillStyle=g;ctx.fillRect(0,0,size,size);ctx.globalAlpha=.12;ctx.fillStyle=t.accent;ctx.beginPath();ctx.arc(1040,140,340,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
function label(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,color:string,sizePx=28,align:CanvasTextAlign='left',weight=700){ctx.save();ctx.font=`${weight} ${sizePx}px Inter, Arial`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(text,x,y);ctx.restore()}
function multiline(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,maxWidth:number,lineHeight:number,color:string,sizePx:number,weight=700){const words=text.split(/\s+/);let line='',row=0;ctx.save();ctx.font=`${weight} ${sizePx}px Inter, Arial`;ctx.fillStyle=color;for(const word of words){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y+row*lineHeight);line=word;row++}else line=next}if(line)ctx.fillText(line,x,y+row*lineHeight);ctx.restore()}
function card(ctx:CanvasRenderingContext2D,image:HTMLImageElement,x:number,y:number,w:number,h:number,rotation=0,t?:Theme){ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rotation);ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=35;ctx.shadowOffsetY=18;ctx.fillStyle=t?.paper||'#fff';round(ctx,-w/2,-h/2,w,h,24);ctx.fill();ctx.shadowColor='transparent';contain(ctx,image,image.width,image.height,-w/2,-h/2,w,h,28);ctx.restore()}
function watermark(ctx:CanvasRenderingContext2D,opt:Options['watermark']){if(!opt?.enabled||!opt.text)return;ctx.save();ctx.globalAlpha=opt.opacity/100;ctx.fillStyle='#fff';ctx.strokeStyle='rgba(20,14,20,.9)';ctx.lineWidth=5;ctx.lineJoin='round';ctx.font='800 28px Arial';ctx.textAlign='center';ctx.translate(600,600);ctx.rotate(-Math.PI/6);for(let y=-700;y<700;y+=150)for(let x=-700;x<700;x+=360){ctx.strokeText(opt.text,x,y);ctx.fillText(opt.text,x,y)}ctx.restore()}
function sceneUrl(t:Theme,o:Options){return o.scenes[t.scene]}

async function render(kind:GalleryKind,o:Options,images:HTMLImageElement[],theme:Theme){const c=canvas(),ctx=c.getContext('2d')!;background(ctx,theme);const count=images.length;const headline=marketplaceHeadline(o.productName,count);
  if(kind==='hero'){
    const scene=await load(o.scenes.flatlay);ctx.drawImage(scene,0,0,size,size);ctx.fillStyle='rgba(20,11,22,.48)';ctx.fillRect(0,0,size,size);
    label(ctx,'SHOPMINT COLLECTION',70,75,theme.accent,20);multiline(ctx,headline.toUpperCase(),70,125,650,72,'#fff',62,800);
    const shown=images.slice(0,5);shown.forEach((im,i)=>card(ctx,im,590+i*82,345+i%2*105,360,440,(i-2)*.055,theme));
    ctx.fillStyle=theme.accent;round(ctx,70,965,360,112,56);ctx.fill();label(ctx,'PREMIUM BUNDLE',250,1008,theme.ink,30,'center',800);label(ctx,'CURATED DESIGN COLLECTION',70,1120,'#fff',21);
  } else if(kind==='collage'){
    label(ctx,'THE FULL COLLECTION',60,70,theme.accent,22);label(ctx,'ONE COHESIVE DESIGN BUNDLE.',60,116,'#fff',36);
    const cols=count<=4?2:3,rows=Math.ceil(Math.min(count,9)/cols),gap=24,top=175,w=(1080-gap*(cols-1))/cols,h=(930-gap*(rows-1))/rows;
    images.slice(0,9).forEach((im,i)=>card(ctx,im,60+(i%cols)*(w+gap),top+Math.floor(i/cols)*(h+gap),w,h,0,theme));
  } else if(kind==='apparel'){
    const scene=await load(sceneUrl(theme,o));ctx.drawImage(scene,0,0,size,size);ctx.fillStyle='rgba(0,0,0,.04)';ctx.fillRect(0,0,size,size);
    const area=theme.scene==='sweatshirt'?{x:390,y:335,w:420,h:420}:{x:385,y:355,w:430,h:430};contain(ctx,images[0],images[0].width,images[0].height,area.x,area.y,area.w,area.h,12);
    ctx.fillStyle='rgba(19,13,20,.86)';round(ctx,45,1015,500,125,22);ctx.fill();label(ctx,'APPAREL-READY DTF PNG',75,1055,theme.accent,20);label(ctx,'Styled product preview',75,1097,'#fff',27);
  } else if(kind==='detail'){
    const scene=await load(o.scenes.tee);ctx.drawImage(scene,-160,-150,1520,1520);ctx.fillStyle='rgba(15,10,15,.30)';ctx.fillRect(0,0,size,size);
    ctx.fillStyle=theme.paper;round(ctx,100,100,1000,920,32);ctx.fill();contain(ctx,images[0],images[0].width,images[0].height,145,145,910,830,20);label(ctx,'CRISP DETAIL • TRANSPARENT PNG',600,1080,theme.accent,25,'center');
  } else if(kind==='whats-included'){
    ctx.fillStyle=theme.paper;round(ctx,50,50,1100,1100,36);ctx.fill();label(ctx,'WHAT YOU GET',95,115,theme.ink,46);label(ctx,'ORIGINAL DESIGN COLLECTION',95,170,theme.accent2,24);
    const shown=images.slice(0,5);shown.forEach((im,i)=>card(ctx,im,90+i*202,240+(i%2)*55,190,290,(i-2)*.025,theme));
    const bullets=['High-resolution artwork','Clean transparent backgrounds','Ready for professional production','Simple customer delivery'];bullets.forEach((text,i)=>{ctx.fillStyle=theme.accent;ctx.beginPath();ctx.arc(120,855+i*62,13,0,Math.PI*2);ctx.fill();label(ctx,'✓',120,855+i*62,theme.ink,15,'center');label(ctx,text,155,855+i*62,theme.ink,25)});
  } else if(kind==='file-info'){
    label(ctx,'PRODUCTION-READY FILES',65,90,theme.accent,22);multiline(ctx,'EVERYTHING YOU NEED TO PRINT WITH CONFIDENCE',65,145,950,58,'#fff',47,800);
    const facts=[['FORMAT','PNG'],['BACKGROUND','TRANSPARENT'],['DELIVERY','INSTANT DOWNLOAD'],['LICENSE','SEE LISTING TERMS']];facts.forEach(([a,b],i)=>{const x=65+(i%2)*550,y=335+Math.floor(i/2)*210;ctx.fillStyle=i%2?theme.paper:theme.accent;round(ctx,x,y,510,170,24);ctx.fill();label(ctx,a,x+28,y+45,theme.ink,16);label(ctx,b,x+28,y+105,theme.ink,29)});
    label(ctx,'PRODUCTION-READY ARTWORK  •  ORIGINAL ART PRESERVED',65,845,'#fff',22);ctx.strokeStyle=theme.accent2;ctx.lineWidth=3;ctx.strokeRect(65,900,1070,205);multiline(ctx,'No physical product will be shipped. Colors may vary by monitor and printing setup.',95,955,1000,38,'#fff',24,500);
  } else {
    ctx.fillStyle=theme.paper;round(ctx,55,55,1090,1090,36);ctx.fill();label(ctx,'YOUR DIGITAL DOWNLOAD',90,125,theme.ink,42);label(ctx,'READY IN THREE SIMPLE STEPS',90,178,theme.accent2,21);
    const steps=[['01','PURCHASE','Complete checkout on the marketplace.'],['02','DOWNLOAD','Access your files from purchases.'],['03','CREATE','Print, press, and make something great.']];steps.forEach(([n,h,p],i)=>{const y=280+i*245;ctx.fillStyle=i===1?theme.accent:theme.ink;round(ctx,90,y,1020,190,28);ctx.fill();label(ctx,n,145,y+95,i===1?theme.ink:theme.accent,48,'center');label(ctx,h,230,y+68,i===1?theme.ink:'#fff',30);label(ctx,p,230,y+116,i===1?theme.ink:'#d9cfd7',20)});label(ctx,'DIGITAL PRODUCT  •  NO PHYSICAL ITEM SHIPS',600,1060,theme.ink,20,'center');
  }
  watermark(ctx,o.watermark);return c.toDataURL('image/png');
}

export async function generateMarketplaceGallery(o:Options):Promise<Mockup[]>{const sourceFiles=o.files.filter(f=>f.dataUrl&&f.type.startsWith('image/'));if(!sourceFiles.length)throw new Error('Add at least one PNG or image file first.');const images=await Promise.all(sourceFiles.map(f=>load(f.dataUrl!)));const chosen=o.direction==='auto'?(o.productType.includes('DTF')?'bold-streetwear':'luxury-editorial'):o.direction;const theme=themes[chosen];const createdAt=new Date().toISOString();const output:Mockup[]=[];for(let i=0;i<GALLERY_KINDS.length;i++){const kind=GALLERY_KINDS[i];o.onProgress?.(`${i+1} of ${GALLERY_KINDS.length} · ${kind.replace(/-/g,' ')}`);output.push({id:uid(),style:chosen,name:`${String(i+1).padStart(2,'0')} · ${kind.replace(/-/g,' ')}`,dataUrl:await render(kind,o,images,theme),watermarked:!!o.watermark?.enabled,createdAt,kind,primary:i===0,order:i})}return output}

export async function regenerateGalleryImage(kind:GalleryKind,o:Options):Promise<string>{const sourceFiles=o.files.filter(f=>f.dataUrl&&f.type.startsWith('image/'));const images=await Promise.all(sourceFiles.map(f=>load(f.dataUrl!)));const chosen=o.direction==='auto'?(o.productType.includes('DTF')?'bold-streetwear':'luxury-editorial'):o.direction;return render(kind,o,images,themes[chosen])}

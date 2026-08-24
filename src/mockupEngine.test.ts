// @vitest-environment jsdom
import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {GALLERY_KINDS,generateMarketplaceGallery,marketplaceHeadline} from './mockupEngine';
import type {SourceFile} from './types';

class LoadedImage {
  width=1000;
  height=1000;
  onload:null|(()=>void)=null;
  onerror:null|((error:unknown)=>void)=null;
  set src(_value:string){queueMicrotask(()=>this.onload?.())}
}

describe('DTF marketplace gallery engine',()=>{
  const context:any={
    fillStyle:'',strokeStyle:'',lineWidth:1,globalAlpha:1,font:'',textAlign:'left',textBaseline:'alphabetic',
    shadowColor:'',shadowBlur:0,shadowOffsetY:0,
    beginPath:vi.fn(),roundRect:vi.fn(),fill:vi.fn(),fillRect:vi.fn(),arc:vi.fn(),drawImage:vi.fn(),
    save:vi.fn(),restore:vi.fn(),translate:vi.fn(),rotate:vi.fn(),fillText:vi.fn(),strokeText:vi.fn(),strokeRect:vi.fn(),
    measureText:(value:string)=>({width:value.length*13}),
    createLinearGradient:()=>({addColorStop:vi.fn()})
  };

  beforeEach(()=>{
    vi.stubGlobal('Image',LoadedImage);
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(context);
    vi.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockReturnValue('data:image/png;base64,c2hvcG1pbnQ=');
  });
  afterEach(()=>vi.restoreAllMocks());

  it('builds the complete seven-image shop gallery from a five-design DTF bundle without changing source artwork',async()=>{
    const files:SourceFile[]=Array.from({length:5},(_,i)=>({
      id:`design-${i+1}`,name:`design-${i+1}.png`,type:'image/png',size:2048,width:4500,height:5400,
      dataUrl:`data:image/png;base64,exact-original-${i+1}`,customerFile:true
    }));
    const originals=files.map(file=>file.dataUrl);
    const gallery=await generateMarketplaceGallery({
      productName:'Five Design DTF Bundle',productType:'DTF PNG',files,direction:'auto',
      scenes:{tee:'scene:tee',sweatshirt:'scene:sweatshirt',flatlay:'scene:flatlay'}
    });

    expect(gallery).toHaveLength(7);
    expect(gallery.map(image=>image.kind)).toEqual([...GALLERY_KINDS]);
    expect(gallery.map(image=>image.order)).toEqual([0,1,2,3,4,5,6]);
    expect(gallery.filter(image=>image.primary)).toHaveLength(1);
    expect(gallery[0].primary).toBe(true);
    expect(gallery.every(image=>image.style==='bold-streetwear')).toBe(true);
    expect(gallery.every(image=>image.dataUrl.startsWith('data:image/png'))).toBe(true);
    expect(files.map(file=>file.dataUrl)).toEqual(originals);
    expect(context.drawImage).toHaveBeenCalled();
  });

  it('never prints import plumbing or a source filename as marketplace headline copy',()=>{
    expect(marketplaceHeadline('Google Drive download',5)).toBe('PREMIUM DESIGN COLLECTION');
    expect(marketplaceHeadline('bundle-export.zip',5)).toBe('PREMIUM DESIGN COLLECTION');
    expect(marketplaceHeadline('Dark Luxe Society',5)).toBe('Dark Luxe Society');
  });

  it('renders a contrast-safe watermark onto every generated listing image',async()=>{
    const files:SourceFile[]=[{id:'design-1',name:'design.png',type:'image/png',size:2048,width:4500,height:5400,dataUrl:'data:image/png;base64,exact-original',customerFile:true}];
    await generateMarketplaceGallery({productName:'Dark Luxe Society',productType:'DTF PNG',files,direction:'auto',watermark:{enabled:true,text:'PREVIEW',opacity:18},scenes:{tee:'scene:tee',sweatshirt:'scene:sweatshirt',flatlay:'scene:flatlay'}});
    expect(context.strokeText).toHaveBeenCalled();
    expect(context.fillText).toHaveBeenCalled();
  });
});

// @vitest-environment jsdom
import {afterEach,describe,expect,it,vi} from 'vitest';
import {importProductFiles,isSupportedProductFile} from './fileImport';

class LoadedImage{width=4500;height=5400;onload:null|(()=>void)=null;onerror:null|(()=>void)=null;set src(_value:string){queueMicrotask(()=>this.onload?.())}}
const folderFile=(name:string,path:string)=>{const file=new File([`original-${name}`],name,{type:'image/png'});Object.defineProperty(file,'webkitRelativePath',{value:path});return file};

describe('product folder import',()=>{
  afterEach(()=>vi.unstubAllGlobals());

  it('recognizes a five-design DTF folder in one import while keeping names and originals intact',async()=>{
    vi.stubGlobal('Image',LoadedImage);
    const files=[...Array.from({length:5},(_,i)=>folderFile(`design-${i+1}.png`,`Summer DTF Bundle/design-${i+1}.png`)),folderFile('.DS_Store','Summer DTF Bundle/.DS_Store')];
    const imported=await importProductFiles(files);

    expect(imported.folderName).toBe('Summer DTF Bundle');
    expect(imported.pngCount).toBe(5);
    expect(imported.imageCount).toBe(5);
    expect(imported.ignored).toBe(1);
    expect(imported.files.map(file=>file.name)).toEqual(['design-1.png','design-2.png','design-3.png','design-4.png','design-5.png']);
    expect(imported.files.filter(file=>file.primary)).toHaveLength(1);
    expect(imported.files.every(file=>file.dataUrl?.startsWith('data:image/png'))).toBe(true);
  });

  it('ignores common system files and unsupported executables',()=>{
    expect(isSupportedProductFile('bundle/art.png')).toBe(true);
    expect(isSupportedProductFile('bundle/Thumbs.db')).toBe(false);
    expect(isSupportedProductFile('bundle/__MACOSX/art.png')).toBe(false);
    expect(isSupportedProductFile('bundle/setup.exe')).toBe(false);
  });
});

import JSZip from 'jszip';
import type {SourceFile} from './types';
import {uid} from './lib';

const supported=/\.(png|jpe?g|webp|pdf|zip)$/i;
const ignored=/(^|\/)(\.ds_store|thumbs\.db|desktop\.ini|__macosx|\.git|\.spotlight-v100)(\/|$)/i;
const mime:Record<string,string>={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',pdf:'application/pdf',zip:'application/zip'};
const extension=(name:string)=>name.split('.').pop()?.toLowerCase()||'';
export const isSupportedProductFile=(name:string)=>supported.test(name)&&!ignored.test(name.replace(/\\/g,'/'));

async function dimensions(dataUrl:string,type:string){if(!type.startsWith('image/'))return{};return new Promise<{width?:number;height?:number}>(resolve=>{const image=new Image();image.onload=()=>resolve({width:image.width,height:image.height});image.onerror=()=>resolve({});image.src=dataUrl})}
async function sourceFromFile(file:File,relativePath?:string):Promise<SourceFile|null>{
  if(file.size>25*1024*1024)return null;
  const type=file.type||mime[extension(file.name)]||'application/octet-stream';
  const dataUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file)});
  return{id:uid(),name:file.name,type,size:file.size,dataUrl,...await dimensions(dataUrl,type),customerFile:true,relativePath,order:0};
}

export type ProductImport={files:SourceFile[];folderName:string;ignored:number;pngCount:number;imageCount:number;archiveCount:number};
export async function importProductFiles(input:File[]|FileList,folderNameHint='Product folder'):Promise<ProductImport>{
  const raw=Array.from(input);const output:SourceFile[]=[];let ignoredCount=0;
  const firstPath=(raw[0] as File&{webkitRelativePath?:string})?.webkitRelativePath;
  const folderName=folderNameHint==='Product folder'&&firstPath?firstPath.split('/')[0]:folderNameHint;
  for(const file of raw){
    const path=(file as File&{webkitRelativePath?:string}).webkitRelativePath||file.name;
    if(!isSupportedProductFile(path)){ignoredCount++;continue}
    const item=await sourceFromFile(file,path);if(!item){ignoredCount++;continue}
    if(extension(file.name)==='zip'){
      output.push(item);
      try{
        const archive=await JSZip.loadAsync(file);const entries=Object.values(archive.files).filter(entry=>!entry.dir&&isSupportedProductFile(entry.name)&&extension(entry.name)!=='zip');
        for(const entry of entries){const blob=await entry.async('blob');const inner=new File([blob],entry.name.split('/').pop()||entry.name,{type:mime[extension(entry.name)]||blob.type});const extracted=await sourceFromFile(inner,`${path}/${entry.name}`);if(extracted)output.push(extracted);else ignoredCount++}
      }catch{ /* Keep an unreadable ZIP as an untouched delivery file. */ }
    }else output.push(item)
  }
  output.forEach((file,index)=>{file.order=index;file.primary=false});const primary=output.find(file=>file.type.startsWith('image/'));if(primary)primary.primary=true;
  return{files:output,folderName,ignored:ignoredCount,pngCount:output.filter(file=>file.type==='image/png').length,imageCount:output.filter(file=>file.type.startsWith('image/')).length,archiveCount:output.filter(file=>file.type==='application/zip').length};
}

export async function filesFromDirectory(handle:any):Promise<File[]>{const files:File[]=[];async function walk(directory:any){for await(const entry of directory.values()){if(entry.kind==='file')files.push(await entry.getFile());else if(entry.kind==='directory'&&!ignored.test(entry.name))await walk(entry)}}await walk(handle);return files}

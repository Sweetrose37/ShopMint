import type {Project,Settings} from './types';import {defaults} from './lib';import {normalizeEtsyTags} from './etsyTags';
const PK='shopmint.projects.v1',SK='shopmint.settings.v1';
const GENERIC_IMPORT_NAME=/^(google drive download|selected files?|product folder|untitled product|downloads?)$/i;
export function cleanImportedProject(project:Project):Project{
  if(!GENERIC_IMPORT_NAME.test(project.productName.trim()))return project;
  const titleName=(project.listing.title||'').replace(/^[^A-Za-z0-9]+/,'').split(/[|—]/)[0].replace(/\s*[-–]?\s*\d+\s*(?:pk|pack)\b.*$/i,'').trim();
  const productName=titleName||'Premium Design Collection';
  const description=(project.listing.description||'').replace(/google drive download/gi,productName);
  const tags=normalizeEtsyTags(project.listing.tags.map(tag=>/^google drive$/i.test(tag)?'design collection':/^google download gift$/i.test(tag)?'dtf bundle':tag));
  return{...project,productName,listing:{...project.listing,description,tags}};
}
export const loadProjects=():Project[]=>{try{return (JSON.parse(localStorage.getItem(PK)||'[]') as Project[]).map(cleanImportedProject)}catch{return[]}};
export const saveProjects=(p:Project[])=>{try{localStorage.setItem(PK,JSON.stringify(p));return true}catch(error){console.warn('SHOPMINT could not save the latest binary previews. Browser storage may be full.',error instanceof Error?error.message:'Storage error');return false}};
export const loadSettings=():Settings=>{try{return{...defaults,...JSON.parse(localStorage.getItem(SK)||'{}')}}catch{return defaults}};
export const saveSettings=(s:Settings)=>localStorage.setItem(SK,JSON.stringify(s));

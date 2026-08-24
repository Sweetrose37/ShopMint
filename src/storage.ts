import type {Project,Settings} from './types';import {defaults} from './lib';
const PK='shopmint.projects.v1',SK='shopmint.settings.v1';
export const loadProjects=():Project[]=>{try{return JSON.parse(localStorage.getItem(PK)||'[]')}catch{return[]}};
export const saveProjects=(p:Project[])=>{try{localStorage.setItem(PK,JSON.stringify(p));return true}catch(error){console.warn('SHOPMINT could not save the latest binary previews. Browser storage may be full.',error instanceof Error?error.message:'Storage error');return false}};
export const loadSettings=():Settings=>{try{return{...defaults,...JSON.parse(localStorage.getItem(SK)||'{}')}}catch{return defaults}};
export const saveSettings=(s:Settings)=>localStorage.setItem(SK,JSON.stringify(s));

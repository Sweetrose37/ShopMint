import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {normalizePackage} from '../shared/schema.js';

const valid={schemaVersion:'1.2.0',productId:'p1',productName:'Spring Set',productType:'Digital paper',title:'Spring paper set',description:'A useful description',tags:['spring','SPRING','paper',''],price:6.5,quantity:999,sku:'SM-DP-1',categorySuggestion:'Digital Downloads',creationDetails:{whoMade:'i-did',whatIsIt:'finished-product',digitalCreation:'created-by-me',productionPartner:'none',productionPartnerName:'',whenMade:'2020 - 2026'}};

test('validates and normalizes packages without duplicate tags',()=>{
  const pkg=normalizePackage(valid);
  assert.deepEqual(pkg.tags,['spring','paper']);
  assert.equal(pkg.imageChecklist.length,0);
  const withImages=normalizePackage({...valid,mockupImages:[{name:'01-hero.png',dataUrl:'data:image/png;base64,AAAA'},{name:'bad.png',dataUrl:'not-an-image'}]});
  assert.equal(withImages.mockupImages.length,1);
  assert.throws(()=>normalizePackage({...valid,schemaVersion:'9.0'}),/not supported/);
  assert.throws(()=>normalizePackage({...valid,title:undefined}),/missing: title/);
  const cleaned=normalizePackage({...valid,tags:['pretty/girl png','this phrase is much too long for etsy','-bundle','pretty girl png']});
  assert.deepEqual(cleaned.tags,['pretty girl png','this phrase is much','bundle']);
});

test('detects a supported Etsy editor and fills reactive fields once',async()=>{
  const dom=new JSDOM(`<!doctype html><body>
    <label for="title">Title</label><input id="title" name="title">
    <label for="description">Description</label><textarea id="description" name="description"></textarea>
    <label for="price">Price</label><input id="price" name="price">
    <label for="quantity">Quantity</label><input id="quantity" name="quantity">
    <label for="sku">SKU</label><input id="sku" name="sku">
    <label for="when">When was it made?</label><select id="when" name="when_made"><option>When was it made?</option><option>2020 - 2026</option></select>
    <div data-selector="tags" role="group" aria-label="Tags"><input id="tags" aria-label="Add a tag"><button id="add-tag" disabled>Add</button><ul><li id="tag-counter">13 left</li></ul></div>
    <fieldset><legend>Who made it?</legend><label><input id="who" type="radio" name="who">I did</label><label><input type="radio" name="who">A member of my shop</label></fieldset>
    <fieldset><legend>What is it?</legend><label><input id="what" type="radio" name="what">A finished product</label><label><input type="radio" name="what">A supply or tool to make things</label></fieldset>
    <fieldset><legend>How is this digital content created?</legend><label><input id="creation" type="radio" name="creation">Created by me <span>It’s designed and created entirely by me.</span></label><label><input type="radio" name="creation">With an AI generator</label></fieldset>
  </body>`,{url:'https://www.etsy.com/your/shops/demo/listing-editor/create',runScripts:'outside-only'});
  Object.defineProperty(dom.window.HTMLElement.prototype,'offsetWidth',{get(){return 100}});
  let listener;
  dom.window.chrome={runtime:{onMessage:{addListener(fn){listener=fn}}}};
  const tagInput=dom.window.document.querySelector('#tags');
  tagInput.addEventListener('input',()=>{dom.window.document.querySelector('#add-tag').disabled=!tagInput.value});
  const addTag=()=>{if(tagInput.value){const chip=dom.window.document.createElement('span');chip.dataset.tag='';chip.textContent=tagInput.value;tagInput.parentElement.append(chip);const counter=dom.window.document.querySelector('#tag-counter');counter.textContent=`${Number.parseInt(counter.textContent,10)-1} left`;tagInput.value='';dom.window.document.querySelector('#add-tag').disabled=true}};
  dom.window.document.querySelector('#add-tag').addEventListener('click',addTag);
  dom.window.eval(await fs.readFile(new URL('../content/etsy-map.js',import.meta.url),'utf8'));
  dom.window.eval(await fs.readFile(new URL('../content/content.js',import.meta.url),'utf8'));
  const ping=await new Promise(resolve=>listener({type:'SHOPMINT_PING'},null,resolve));
  assert.equal(ping.isListingPage,true);
  const report=await new Promise(resolve=>listener({type:'SHOPMINT_FILL',package:normalizePackage(valid),mode:'all'},null,resolve));
  assert.equal(report.ok,true);
  assert.equal(dom.window.document.querySelector('#title').value,valid.title);
  assert.equal(dom.window.document.querySelectorAll('[data-tag]').length,2);
  assert.equal(report.results.find(x=>x.field==='tags').status,'filled');
  assert.equal(report.results.find(x=>x.field==='tags').reason,'2 tags verified in Etsy');
  assert.equal(dom.window.document.querySelector('#who').checked,true);
  assert.equal(dom.window.document.querySelector('#what').checked,true);
  assert.equal(dom.window.document.querySelector('#creation').checked,true);
  assert.equal(report.results.find(x=>x.field==='digitalCreation').status,'filled');
  assert.equal(report.results.find(x=>x.field==='productionPartner').status,'filled');
  assert.equal(report.results.find(x=>x.field==='whenMade').status,'filled');
  assert.equal(report.results.find(x=>x.field==='category').status,'manual');
  assert.equal(report.results.find(x=>x.field==='digitalFiles').status,'manual');
});

test('refuses to fill an Etsy page outside the listing editor',async()=>{
  const dom=new JSDOM('<!doctype html><body><input name="title"></body>',{url:'https://www.etsy.com/your/shops/demo/tools/listings',runScripts:'outside-only'});
  Object.defineProperty(dom.window.HTMLElement.prototype,'offsetWidth',{get(){return 100}});
  let listener;
  dom.window.chrome={runtime:{onMessage:{addListener(fn){listener=fn}}}};
  dom.window.eval(await fs.readFile(new URL('../content/etsy-map.js',import.meta.url),'utf8'));
  dom.window.eval(await fs.readFile(new URL('../content/content.js',import.meta.url),'utf8'));
  const ping=await new Promise(resolve=>listener({type:'SHOPMINT_PING'},null,resolve));
  assert.equal(ping.isListingPage,false);
  const report=await new Promise(resolve=>listener({type:'SHOPMINT_FILL',package:normalizePackage(valid),mode:'all'},null,resolve));
  assert.equal(report.ok,false);
  assert.match(report.error,/listing create or edit page/i);
});

test('manifest is MV3 and content automation contains no publish action',async()=>{
  const manifest=JSON.parse(await fs.readFile(new URL('../manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.manifest_version,3);
  assert.deepEqual(manifest.permissions,['storage','activeTab','scripting','unlimitedStorage']);
  const popup=await fs.readFile(new URL('../popup/popup.js',import.meta.url),'utf8');
  assert.match(popup,/scripting\.executeScript/);
  assert.match(popup,/content\/etsy-map\.js.*content\/content\.js/);
  assert.match(popup,/Etsy Photo & Video/);
  assert.doesNotMatch(popup,/SHOPMINT_IMAGE_STAGE/);
  const content=await fs.readFile(new URL('../content/content.js',import.meta.url),'utf8');
  assert.doesNotMatch(content,/(querySelector|getByText|getByRole)[^\n]*(publish|submit)/i);
  assert.doesNotMatch(content,/(publish|submit)[^\n]*\.click\s*\(/i);
});

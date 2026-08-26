export const ETSY_TAG_MAX_LENGTH=20;
export const ETSY_TAG_MAX_COUNT=13;

export function normalizeEtsyTag(value:unknown){
  const cleaned=String(value??'').normalize('NFC').replace(/[^\p{L}\p{N}\s'-]+/gu,' ').replace(/(^|\s)['-]+/g,'$1').replace(/['-]+(?=\s|$)/g,'').replace(/\s+/g,' ').trim();
  if(cleaned.length<=ETSY_TAG_MAX_LENGTH)return cleaned;
  const window=cleaned.slice(0,ETSY_TAG_MAX_LENGTH+1);
  const breakAt=window.lastIndexOf(' ');
  return (breakAt>=8?window.slice(0,breakAt):cleaned.slice(0,ETSY_TAG_MAX_LENGTH)).replace(/['-]+$/,'').trim();
}

export function normalizeEtsyTags(values:unknown[]){
  const tags:string[]=[];
  for(const value of values){
    const tag=normalizeEtsyTag(value);
    if(tag&&!tags.some(existing=>existing.toLowerCase()===tag.toLowerCase()))tags.push(tag);
    if(tags.length===ETSY_TAG_MAX_COUNT)break;
  }
  return tags;
}

export function validateEtsyTag(value:string){
  const trimmed=value.trim();
  return {empty:!trimmed,long:trimmed.length>ETSY_TAG_MAX_LENGTH,invalid:!!trimmed&&normalizeEtsyTag(trimmed)!==trimmed};
}

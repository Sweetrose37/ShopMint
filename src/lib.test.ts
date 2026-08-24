import {describe,expect,it} from 'vitest';
import {defaults,exportShape,generateListing,newProject,validateTags} from './lib';

describe('SHOPMINT listing engine',()=>{
  it('creates 13 editable starter tags',()=>{
    const listing=generateListing('Wildflower Wrap','Tumbler wrap',defaults);
    expect(listing.tags).toHaveLength(13);
    expect(listing.title).toContain('Wildflower Wrap');
  });
  it('detects duplicate, empty, and oversized Etsy tags',()=>{
    const result=validateTags(['bundle','bundle','this tag is definitely over twenty chars','']);
    expect(result[1].duplicate).toBe(true);
    expect(result[2].long).toBe(true);
    expect(result[3].empty).toBe(true);
  });
  it('exports the versioned PASS 2 contract without binary data',()=>{
    const project=newProject('Spring Papers','Digital paper',defaults);
    project.sourceFiles=[{id:'file-1',name:'paper.png',type:'image/png',size:10,dataUrl:'data:image/png;base64,AAAA',customerFile:true}];
    const payload=exportShape(project);
    expect(payload.schemaVersion).toBe('1.2.0');
    expect(payload.creationDetails?.digitalCreation).toBe('');
    expect(payload.exportPurpose).toBe('sidekick-listing-assist');
    expect(payload.tags).toHaveLength(13);
    expect(JSON.stringify(payload)).not.toContain('base64');
  });
});

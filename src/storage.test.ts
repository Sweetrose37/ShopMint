import {describe,expect,it} from 'vitest';
import {defaults,newProject} from './lib';
import {cleanImportedProject} from './storage';

describe('saved import cleanup',()=>{
  it('repairs an existing Google Drive placeholder without touching the listing title',()=>{
    const project=newProject('Google Drive download','DTF PNG',defaults);
    project.listing.title='✨ PRETTY GIRL POWER MOVES — 5PK DTF BUNDLE ✨';
    project.listing.description='Bring your next idea to life with Google Drive download.';
    project.listing.tags=['google drive','google download gift','pretty girl png'];
    const repaired=cleanImportedProject(project);
    expect(repaired.productName).toBe('PRETTY GIRL POWER MOVES');
    expect(repaired.listing.title).toBe(project.listing.title);
    expect(repaired.listing.description).not.toMatch(/google drive download/i);
    expect(repaired.listing.tags).not.toContain('google drive');
  });
});

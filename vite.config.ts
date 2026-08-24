import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

function sitesStaticWorker(){return{name:'shopmint-sites-worker',closeBundle(){const serverDir=resolve('dist/server');mkdirSync(serverDir,{recursive:true});writeFileSync(resolve(serverDir,'index.js'),`export default {\n  async fetch(request, env) {\n    const response = await env.ASSETS.fetch(request);\n    if (response.status !== 404 || request.method !== 'GET') return response;\n    const url = new URL(request.url);\n    url.pathname = '/index.html';\n    return env.ASSETS.fetch(new Request(url, request));\n  }\n};\n`);}}}
export default defineConfig({
  plugins:[react(),sitesStaticWorker()],
  server:{host:'127.0.0.1',port:5500,strictPort:true},
  preview:{host:'127.0.0.1',port:5500,strictPort:true}
});

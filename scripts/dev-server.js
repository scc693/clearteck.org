import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const portIndex=process.argv.indexOf('--port');
const root=resolve('dist'),port=Number(portIndex>=0?process.argv[portIndex+1]:process.env.PORT||5173);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
createServer(async(req,res)=>{try{let p=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(p!==root&&!p.startsWith(root+sep)){res.writeHead(403).end();return;}if((await stat(p)).isDirectory())p+='/index.html';const data=await readFile(p);res.writeHead(200,{'Content-Type':types[extname(p)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'0.0.0.0',()=>console.log(`Cycleway on ${port}`));

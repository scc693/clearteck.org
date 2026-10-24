import {cpSync,mkdirSync,rmSync} from 'node:fs';
rmSync('dist',{recursive:true,force:true});mkdirSync('dist');
for(const file of ['index.html','src','vendor'])cpSync(file,`dist/${file}`,{recursive:true});
console.log('Built Cycleway into dist/');

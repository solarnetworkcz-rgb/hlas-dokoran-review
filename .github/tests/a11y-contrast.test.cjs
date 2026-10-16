'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../../index.html'),'utf8');
function rgb(h){assert.match(h,/^#[a-f0-9]{6}$/i);return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)}
function lum(hex){const x=rgb(hex).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return x[0]*.2126+x[1]*.7152+x[2]*.0722}
function contrast(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
test('primary buttons have at least 4.5:1 contrast at both gradient endpoints',()=>{
 const css=html.match(/\.btn\.primary\s*\{([^}]*)\}/)?.[1];
 assert.ok(css,'primary button CSS found');
 assert.match(css,/\bcolor\s*:\s*white\b/i);
 const colors=css.match(/linear-gradient\(\s*135deg\s*,\s*(#[a-f0-9]{6})\s*,\s*(#[a-f0-9]{6})\s*\)/i);
 assert.ok(colors,'explicit gradient endpoint colors found');
 for(const color of colors.slice(1))assert.ok(contrast('#ffffff',color)>=4.5,
   color+': '+contrast('#ffffff',color).toFixed(2)+':1 is below 4.5:1');
});
test('back-to-top link has a native fallback when scripts are disabled',()=>{
 assert.match(html,/<a\b[^>]*href="#top"/i,'jump link exists');
 assert.match(html,/\bid="top"/i,'native #top target exists');
});

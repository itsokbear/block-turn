import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from '../lib/game.ts';
import {classifyMove,moveEvent} from '../lib/events.ts';
for(const [r,c,kind] of [[1,0,'normal'],[2,0,'double'],[0,2,'double'],[1,1,'cross'],[2,1,'triple'],[2,2,'quad'],[3,3,'mega']] as const)test(`classify ${r} rows ${c} cols`,()=>{assert.equal(classifyMove(r,c),kind);assert.equal(classifyMove(r,c,true),'perfect');});
for(const [rows,cols,kind] of [[[0,1],[],'double'],[[0],[1],'cross'],[[0,1],[2],'triple'],[[0],[1],'perfect']] as const)test(`combined rewards ${kind}`,()=>{const g=fresh();const perfect=kind==='perfect',bomb=kind==='triple'||perfect;const e=moveEvent(g,{...g,lines:rows.length+cols.length,rerolls:1,bombs:bomb?1:0,goldenBomb:perfect},perfect,true,[...rows],[...cols])!;assert.equal(e.classification,kind);assert.equal(e.reroll,true);assert.equal(e.bomb,bomb);assert.match(e.details,/Реролл готов/);if(bomb)assert.match(e.details,/бомба готова|Бомба готова/);});
test('no five-combo milestones or bomb placement rewards',()=>{const g=fresh();assert.equal(moveEvent(g,{...g,combo:5},false,true),null);assert.equal(moveEvent(g,{...g,rerolls:1},true,false),null);});
test('stored reroll still celebrates double without duplicate award',()=>{const g={...fresh(),rerolls:1};const e=moveEvent(g,{...g,lines:2},false,true,[1,2],[])!;assert.equal(e.reroll,false);assert.equal(e.title,'ДВОЙНАЯ!');});
test('perfect clear keeps golden reward caption when resources already full',()=>{const g={...fresh(),bombs:1,goldenBomb:true,rerolls:1};const e=moveEvent(g,{...g,lines:2},true,true,[0],[0])!;assert.equal(e.rewards,'Золотая бомба готова');assert.equal(e.bomb,false);assert.equal(e.reroll,false);});

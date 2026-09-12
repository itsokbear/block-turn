import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh} from '../lib/game.ts';
import {moveEvent} from '../lib/events.ts';
test('milestones celebrate 5, 10, 15 without repeating for bombs or ordinary moves',()=>{const g=fresh();for(const n of [5,10,15])assert.equal(moveEvent({...g,combo:n-1},{...g,combo:n},false,true)?.kind,'combo');assert.equal(moveEvent(g,{...g,combo:4},false,true),null);assert.equal(moveEvent({...g,combo:5},{...g,combo:5},false,true),null);assert.equal(moveEvent(g,{...g,combo:5},false,false),null);});
test('four lines and new bomb are combined without losing reward',()=>{const g=fresh();const e=moveEvent(g,{...g,lines:4,bombs:1},false,true)!;assert.equal(e.kind,'lines');assert.equal(e.bomb,true);assert.match(e.details,/4 линии/);assert.match(e.details,/Бомба готова/);});
test('full clear retains its own title and bomb pulse only for actual award',()=>{const g=fresh();assert.equal(moveEvent(g,{...g,bombs:1,goldenBomb:true},true,true)?.title,'');assert.equal(moveEvent({...g,bombs:1},{...g,bombs:1},false,true),null);assert.equal(moveEvent(g,{...g,bombs:1},false,true)?.kind,'bomb');});

test('three cleared lines trigger explosion; two do not',()=>{const g=fresh();assert.equal(moveEvent(g,{...g,lines:2},false,true),null);const e=moveEvent(g,{...g,lines:3},false,true)!;assert.equal(e.kind,'lines');assert.equal(e.title,'Мощный взрыв!');assert.match(e.details,/3 линии/);});

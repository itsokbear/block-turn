import {fresh,deal,fits,canPlay,rerollPiece,bombArea,restoreSave,canEarnReroll,BOMB_COMBO_THRESHOLD,type Game} from './game.ts';
export const POOP=6;
export const SERPENT_COPY={caught:'ПОПАЛАСЬ!',trap:'В ЛОВУШКЕ!'};
export function occupied(g:Game){const board=g.board.map(r=>[...r]);if(g.serpent&&!g.serpent.won)for(const cell of g.serpent.cells)board[cell>>3][cell%8]=7;return board;}
const adjacent=(a:number,b:number)=>Math.abs((a>>3)-(b>>3))+Math.abs(a%8-b%8)===1;
export function nextStep(cells:number[],random:()=>number=Math.random):number|null{
 const candidates=Array.from({length:64},(_,i)=>i).filter(i=>adjacent(cells[0],i)&&!cells.includes(i));
 // Prefer routes with an exit after the body advances; never enter the current body.
 const open=candidates.filter(i=>{const body=[i,...cells.slice(0,-1)];return Array.from({length:64},(_,j)=>j).some(j=>adjacent(i,j)&&!body.includes(j));});
 const pool=open.length?open:candidates;return pool.length?pool[Math.floor(random()*pool.length)]:null;
}
export function freshSerpent():Game{const g=fresh();const cells=[30,29,28,27,26,25];g.serpent={cells,next:nextStep(cells),stun:false,won:false};g.pieces=deal(occupied(g));return g;}
export function canPlaySerpent(g:Game){return !g.serpent?.won&&canPlay({...g,board:occupied(g)});}
export function rerollSerpent(g:Game,index:number,random:()=>number=Math.random){if(g.serpent?.won)return null;const result=rerollPiece({...g,board:occupied(g)},index,random);return result?{...result,board:g.board}:null;}
function clear(g:Game){
 const filled=occupied(g),rows=filled.flatMap((r,i)=>r.every(Boolean)?[i]:[]),cols=Array.from({length:8},(_,i)=>i).filter(i=>filled.every(r=>r[i]));
 const cells:number[]=[];g.board.forEach((r,y)=>r.forEach((v,x)=>{if(rows.includes(y)||cols.includes(x)){cells.push(y*8+x);g.board[y][x]=0;}}));
 const head=g.serpent!.cells[0],hit=rows.includes(head>>3)||cols.includes(head%8);
 return {rows,cols,cells,hit};
}
export function placeSerpent(g:Game,index:number,row:number,col:number,random:()=>number=Math.random){
 const p=g.pieces[index],snake=g.serpent;if(!snake||snake.won||!p||!fits(occupied(g),p.shape,row,col))return null;
 const next:Game={...g,board:g.board.map(r=>[...r]),pieces:g.pieces.map((p,i)=>i===index?null:p),serpent:{...snake,cells:[...snake.cells]}};
 let count=0;p.shape.forEach((r,y)=>r.forEach((v,x)=>{if(v){next.board[row+y][col+x]=p.color;count++;}}));
 const a=clear(next);let b={rows:[] as number[],cols:[] as number[],cells:[] as number[],hit:false};let eaten:number|null=null,poop:number|null=null;
 if(a.hit)next.serpent!.won='caught';
 else if(snake.stun)next.serpent!.stun=false;
 else if(snake.next!==null){
  const target=snake.next,tail=snake.cells[5];
  if(next.board[target>>3][target%8]){eaten=target;poop=tail;}
  next.board[target>>3][target%8]=0;
  next.serpent!.cells=[target,...snake.cells.slice(0,-1)];
  if(poop!==null)next.board[poop>>3][poop%8]=POOP;
  b=clear(next);if(b.hit)next.serpent!.won='trap';
 }
 const playerLines=a.rows.length+a.cols.length,total=playerLines+b.rows.length+b.cols.length;
 // Only player clear advances combo/earns resources; movement clears award base line points.
 next.combo=playerLines?g.combo+1:0;next.lines+=total;
 next.rerolls=canEarnReroll(playerLines)?1:g.rerolls;
 next.bombs=Math.min(1,g.bombs+(next.combo>0&&next.combo%BOMB_COMBO_THRESHOLD===0?1:0));
 const allClear=!!next.serpent!.won&&next.board.every(r=>r.every(v=>v===0));
 if(allClear&&a.hit){next.bombs=1;next.goldenBomb=true;}
 const points=count*10+playerLines*100*Math.max(1,next.combo)+(b.rows.length+b.cols.length)*100;next.score+=points;
 if(next.serpent!.won)next.serpent!.next=null;
 if(!next.serpent!.won&&!snake.stun)next.serpent!.next=nextStep(next.serpent!.cells,random);
 if(next.pieces.every(p=>p===null))next.pieces=deal(occupied(next),random);
 return {game:next,cleared:[...new Set([...a.cells,...b.cells])],points,allClear:false,rowsCleared:a.rows,colsCleared:a.cols,eaten,poop};
}
export function bombSerpent(g:Game,row:number,col:number){
 if(!g.serpent||g.serpent.won||!g.bombs)return null;const area=bombArea(row,col,g.goldenBomb?5:3);if(!area.length)return null;
 const board=g.board.map(r=>[...r]);let count=0;for(const cell of area){if(board[cell>>3][cell%8])count++;board[cell>>3][cell%8]=0;}
 return {game:{...g,board,bombs:0,goldenBomb:false,score:g.score+count*10,serpent:{...g.serpent,stun:g.serpent.stun||area.includes(g.serpent.cells[0])}},points:count*10,cleared:area,allClear:false,rowsCleared:[] as number[],colsCleared:[] as number[],eaten:null,poop:null};
}
export function restoreSerpent(value:unknown):Game|null{
 if(!value||typeof value!=='object')return null;const g=value as Game,s=g.serpent;
 if(!s||!Array.isArray(s.cells)||s.cells.length!==6||new Set(s.cells).size!==6||!s.cells.every((c,i)=>Number.isInteger(c)&&c>=0&&c<64&&(!i||adjacent(c,s.cells[i-1])))||typeof s.stun!=='boolean'||![false,'caught','trap'].includes(s.won))return null;
 if(s.next!==null&&(!Number.isInteger(s.next)||s.next<0||s.next>=64||s.cells.includes(s.next)||!adjacent(s.cells[0],s.next)))return null;
 if(!Array.isArray(g.board)||g.board.length!==8||!g.board.every(r=>Array.isArray(r)&&r.length===8&&r.every(v=>Number.isInteger(v)&&v>=0&&v<=POOP)))return null;
 if(!s.won&&s.cells.some(c=>g.board[c>>3][c%8]!==0))return null;
 const valid=restoreSave({...g,board:g.board.map(r=>r.map(v=>v===POOP?1:v))});return valid?{...valid,board:g.board,serpent:s}:null;
}

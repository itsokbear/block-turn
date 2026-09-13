'use client';
import type {CSSProperties} from 'react';
import type {Serpent} from '../lib/game';
export default function SnakeLayer({snake,eaten}:{snake:Serpent;eaten:number|null}){
 const direction=snake.next===null?'•':snake.next-snake.cells[0]===1?'›':snake.next-snake.cells[0]===-1?'‹':snake.next>snake.cells[0]?'⌄':'⌃';
 return <div className="serpent-layer" aria-hidden="true">{snake.cells.map((cell,index)=><span key={index} className={`serpent-segment ${index===0?'serpent-segment-head':''} ${index===0&&snake.stun?'serpent-segment-stunned':''}`} style={{left:`calc(${cell%8} * (100% + 4px) / 8)`,top:`calc(${cell>>3} * (100% + 4px) / 8)`,zIndex:6-index} as CSSProperties}>{index===0&&<span className={eaten===cell?'serpent-eating':''}>{direction}</span>}</span>)}</div>;
}

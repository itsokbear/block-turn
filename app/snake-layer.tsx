'use client';
import type {CSSProperties} from 'react';
import type {Serpent} from '../lib/game';
import {BruniHead,BruniTail} from './bruni-art';
export default function SnakeLayer({snake,eaten,bruni=false}:{snake:Serpent;eaten:number|null;bruni?:boolean}){
 const direction=snake.next===null?'•':snake.next-snake.cells[0]===1?'›':snake.next-snake.cells[0]===-1?'‹':snake.next>snake.cells[0]?'⌄':'⌃';
 const tail=snake.cells.at(-1)!,beforeTail=snake.cells.at(-2)!;
 const tailAngle=Math.atan2((tail>>3)-(beforeTail>>3),(tail%8)-(beforeTail%8))*180/Math.PI;
 return <div className={`serpent-layer ${bruni?'serpent-bruni':''}`} aria-hidden="true">{snake.cells.map((cell,index)=><span key={index} className={`serpent-segment ${index===0?'serpent-segment-head':''} ${index===snake.cells.length-1?'serpent-segment-tail':''} ${index===0&&snake.stun?'serpent-segment-stunned':''}`} style={{left:`calc(${cell%8} * (100% + 4px) / 8)`,top:`calc(${cell>>3} * (100% + 4px) / 8)`,zIndex:6-index} as CSSProperties}>{index===0?<span className={`serpent-face ${eaten===cell?'serpent-eating':''}`}>{bruni?<BruniHead/>:direction}</span>:bruni&&index===snake.cells.length-1?<BruniTail angle={tailAngle}/>:null}</span>)}</div>;
}

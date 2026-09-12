import type {Game} from './game';
export function classifyMove(rows:number,cols:number,allClear=false){
 const total=rows+cols;
 return allClear?'perfect':total>=5?'mega':total===4?'quad':total===3?'triple':total===2?(rows&&cols?'cross':'double'):'normal';
}
export function moveEvent(before:Game,after:Game,allClear:boolean,placement:boolean,rowsCleared:number[]=[],colsCleared:number[]=[]){
 if(!placement)return null;
 const bomb=after.bombs>before.bombs||(!before.goldenBomb&&after.goldenBomb),reroll=after.rerolls>before.rerolls;
 const totalLines=after.lines-before.lines;
 const classification=classifyMove(rowsCleared.length,colsCleared.length,allClear);
 if(classification==='normal'&&!bomb&&!reroll)return null;
 const titles={perfect:'ЧИСТАЯ РАБОТА!',mega:'МОЩНЫЙ ХОД!',quad:'ЧЕТВЕРНАЯ!',triple:'ТРОЙНАЯ!',cross:'КРЕСТ!',double:'ДВОЙНАЯ!',normal:bomb?'БОМБА ЗАРЯЖЕНА!':'РЕРОЛЛ ГОТОВ'};
 const tier=allClear||classification==='mega'||(bomb&&after.goldenBomb)?3:totalLines>=3||bomb?2:1;
 const rewards=[allClear?'Золотая бомба готова':bomb?(after.goldenBomb?'Золотая бомба готова':'Бомба готова'):null,reroll?'Реролл готов':null].filter(Boolean).join(' · ');
 const details=[totalLines>=2?`${totalLines} ${totalLines<=4?'линии':'линий'}`:null,classification==='triple'&&rowsCleared.length&&colsCleared.length?'крестом':null,rewards||null].filter(Boolean).join(' · ');
 return {bomb,reroll,classification,totalLines,rowsCleared,colsCleared,tier,duration:tier===3?1200:tier===2?1000:750,kind:totalLines>=2?'lines':'bomb',title:titles[classification],details,rewards};
}

import type {Game} from './game';
export function moveEvent(before:Game,after:Game,allClear:boolean,placement:boolean){
 if(!placement)return null;
 const bomb=after.bombs>before.bombs||(!before.goldenBomb&&after.goldenBomb);
 const lines=after.lines-before.lines;
 const milestone=after.combo>before.combo&&after.combo>=5&&after.combo%5===0;
 if(!bomb&&lines<3&&!milestone)return null;
 const details=[lines>=3?`${lines} ${lines<=4?'линии':'линий'} за один ход`:null,milestone?`Комбо ×${after.combo}`:null,bomb?(after.goldenBomb?'Золотая бомба готова':'Бомба готова'):null].filter(Boolean).join(' · ');
 return {bomb,kind:lines>=3?'lines':milestone?'combo':'bomb',title:allClear?'':lines>=3?'Мощный взрыв!':milestone?(after.combo>=10?'Невероятная серия!':'В ударе!'):'Бомба заряжена!',details};
}

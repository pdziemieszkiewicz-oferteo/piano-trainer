import { SONGS } from './song-engine-v2.1.js';
const N=(m,hand,beats=1,finger=null)=>({m,hand,beats,finger});
function bar(id,notes,extra={}) { let beat=0;return {id,notes:notes.map((note,i)=>{const n={...note,id:id+'-'+i,beat};beat+=note.beats;return n}),...extra}; }
export const SCORES = {
 ragtime: {
  meter:4, systems:[[0,1,2,3],[4,5,6,7,8]], order:[0,1,2,3,4,5,6,7,4,5,6,8],
  bars:[
   bar('r1',[N(67,'right',1,5),N(64,'right'),N(62,'right'),N(64,'right')]),
   bar('r2',[N(60,'right',4)]),
   bar('r3',[N(55,'left',1,4),N(60,'left'),N(59,'left'),N(59,'left')]),
   bar('r4',[N(60,'left',4)]),
   bar('r5',[N(65,'right',1,4),N(64,'right'),N(62,'right',2)],{repeatStart:true}),
   bar('r6',[N(60,'right'),N(62,'right'),N(64,'right',2)]),
   bar('r7',[N(62,'right',1,2),N(60,'right'),N(59,'left',1,2),N(55,'left')]),
   bar('r8',[N(60,'left',1,1),N(62,'right',2,2),N(64,'right',1,3)],{ending:1,repeatEnd:true}),
   bar('r9',[N(60,'right',4)],{ending:2,alternativeHand:true,final:true})
  ]
 },
 piwnica: {
  meter:2, systems:[[0,1,2,3],[4,5,6,7]], order:[0,1,2,3,4,5,6,7],
  bars:[
   bar('p1',[N(67,'right',.5,5),N(62,'right',.5,2),N(62,'right',.5,2),N(60,'right',.5,1)],{breathAfter:[1]}),
   bar('p2',[N(59,'left',.5,2),N(60,'left',.5),N(62,'right')],{breathAfter:[2]}),
   bar('p3',[N(67,'right',.5,5),N(62,'right',.5),N(62,'right',.5),N(60,'right',.5)],{slurs:[[0,1]]}),
   bar('p4',[N(59,'left',.5),N(57,'left',.5),N(55,'left')],{breathAfter:[2]}),
   bar('p5',[N(55,'left',.5,4),N(57,'left',.5),N(59,'left',.5),N(57,'left',.5)]),
   bar('p6',[N(59,'left',.5),N(60,'left',.5),N(62,'right',1,2)]),
   bar('p7',[N(59,'left',.5,2),N(62,'right',.5,2),N(62,'right',.5),N(60,'right',.5)],{beams:[[0,1],[2,3]],handMarks:{0:'2L',1:'2P'},slurs:[[2,3]]}),
   bar('p8',[N(59,'left',.5),N(57,'left',.5),N(55,'left')],{slurs:[[0,2]],final:true})
  ]
 }
};
// Wersja wizualna i rozpoznawana muszą zawierać te same dźwięki, łącznie z repetycją.
export function performanceNotes(songId) {const score=SCORES[songId];return score.order.flatMap(i=>score.bars[i].notes);}
for(const id of Object.keys(SCORES)){const p=performanceNotes(id);if(p.length!==SONGS[id].sequence.length||p.some((n,i)=>n.m!==SONGS[id].sequence[i]))throw Error('Niezgodna partytura: '+id);}

// Lokalizacja jest niezależna od naliczania nagród. Pokazujemy wszystkie miejsca
// zgodne z najdłuższym pasującym końcem dotychczas usłyszanej sekwencji.
export class ScoreFollower {
 constructor(songId){this.notes=performanceNotes(songId);this.reset();}
 reset(){this.history=[];return {ids:[],matchedLength:0,certain:false};}
 push(midi){
  this.history.push(midi);if(this.history.length>this.notes.length)this.history.shift();
  let longest=0;const ids=new Set();
  for(let end=0;end<this.notes.length;end++){
   if(this.notes[end].m!==midi)continue;
   let count=0;while(count<this.history.length&&count<=end&&this.history[this.history.length-1-count]===this.notes[end-count].m)count++;
   if(count>longest){longest=count;ids.clear();}if(count===longest)ids.add(this.notes[end].id);
  }
  return {ids:[...ids],matchedLength:longest,certain:ids.size===1&&longest>=2};
 }
}
const NS='http://www.w3.org/2000/svg';
const step=m=>{const chroma=[0,0,1,1,2,3,3,4,4,5,5,6];return 7*(Math.floor(m/12)-1)+chroma[m%12];};
function e(tag,attrs,parent,text){const node=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;parent.appendChild(node);return node;}
export function highlightScore(container,result){const ids=new Set(result.ids);for(const note of container.querySelectorAll('[data-note-id]')){const match=ids.has(note.getAttribute('data-note-id'));note.classList.toggle('is-candidate',match&&!result.certain);note.classList.toggle('is-certain',match&&result.certain);}}
export function drawSongScore(container,songId,{width=900,zoom=1.1,showFinger=false}={}){
 const score=SCORES[songId],W=Math.max(240,width/zoom),columns=Math.max(1,Math.min(5,Math.floor((W-64)/158)));
 const rows=[];for(const system of score.systems)for(let i=0;i<system.length;i+=columns)rows.push(system.slice(i,i+columns));
 const rowHeight=224;
 const hasLowerLabels=rows.at(-1).some(index=>{
  const bar=score.bars[index];
  return bar.notes.some((note,i)=>note.hand==='left'&&(bar.handMarks?.[i]||(showFinger&&note.finger)));
 });
 const H=(rows.length-1)*rowHeight+(hasLowerLabels?211:189);container.replaceChildren();
 const svg=e('svg',{xmlns:NS,viewBox:`0 8 ${W} ${H-8}`,width:W,height:H-8,class:'song-svg',role:'img','aria-label':'Interaktywna partytura: '+SONGS[songId].title},container);
 e('title',{},svg,SONGS[songId].title+' — obie ręce, cały utwór');
 rows.forEach((indices,row)=>{
  const y0=row*rowHeight,trebleTop=y0+45,bassTop=y0+133,gap=12,staffEnd=W-8,left=row===0?72:48,measureWidth=(staffEnd-left)/indices.length;
  const group=e('g',{'aria-label':'System '+(row+1)},svg);
  for(const top of [trebleTop,bassTop])for(let line=0;line<5;line++)e('line',{x1:8,y1:top+line*gap,x2:staffEnd,y2:top+line*gap,stroke:'#8c968f','stroke-width':1.1},group);
  e('path',{d:`M 7 ${trebleTop} Q -3 ${trebleTop+35} 4 ${y0+111} Q -3 ${bassTop+18} 7 ${bassTop+48}`,fill:'none',stroke:'#283447','stroke-width':2},group);
  e('text',{x:12,y:trebleTop+42,'font-size':48,'font-family':'Noto Music,Segoe UI Symbol,serif',fill:'#29364a'},group,'𝄞');
  e('text',{x:12,y:bassTop+28,'font-size':36,'font-family':'Noto Music,Segoe UI Symbol,serif',fill:'#29364a'},group,'𝄢');
  if(row===0)for(const top of [trebleTop,bassTop])for(let part=0;part<2;part++)e('text',{x:55,y:top+19+part*22,'font-size':24,'font-weight':700,'text-anchor':'middle',fill:'#29364a'},group,String(part===0?score.meter:4));
  indices.forEach((barIndex,column)=>{
   const measure=score.bars[barIndex],start=left+column*measureWidth,end=start+measureWidth;
   if(!measure.ending)e('text',{x:start+6,y:y0+24,'font-size':12,'font-weight':600,fill:'#566071'},group,String(barIndex+1));
   if(measure.ending){e('path',{d:`M ${start+3} ${y0+36} V ${y0+9} H ${end-5}`,fill:'none',stroke:'#29364a','stroke-width':1.5},group);e('text',{x:start+12,y:y0+28,'font-size':15,'font-weight':700,fill:'#29364a'},group,measure.ending+'.');}
   const line=(x,weight=1.4)=>e('line',{x1:x,y1:trebleTop,x2:x,y2:bassTop+48,stroke:'#29364a','stroke-width':weight},group);
   line(start);line(end,measure.final?3:1.4);
   const repeat=(x,direction)=>{line(x+direction*4,3);for(const top of [trebleTop,bassTop])for(const offset of [18,30])e('circle',{cx:x+direction*12,cy:top+offset,r:2.2,fill:'#29364a'},group);};
   if(measure.repeatStart)repeat(start,1);if(measure.repeatEnd)repeat(end,-1);
   if(measure.final)line(end-6,1.2);
   const pad=measure.repeatStart?27:18,usable=measureWidth-pad-(measure.repeatEnd?27:18);
   const positions=measure.notes.map(note=>{const top=note.hand==='right'?trebleTop:bassTop,base=note.hand==='right'?64:43;return {note,x:start+pad+usable*((note.beat+.38)/score.meter),y:top+48-(step(note.m)-step(base))*gap/2,top,down:note.hand==='right'?note.m>=71:note.m>=50};});
   const beamed=new Set();const beams=[];
   if(measure.beams){for(const pair of measure.beams){beams.push(pair);pair.forEach(i=>beamed.add(i));}}
   else for(let i=0;i<positions.length-1;i++){const a=positions[i],b=positions[i+1];if(!beamed.has(i)&&a.note.beats===.5&&b.note.beats===.5&&a.note.hand===b.note.hand){beamed.add(i);beamed.add(i+1);beams.push([i,i+1]);i++;}}
   const stemEnd=new Map();for(const [a,b]of beams){const cross=positions[a].note.hand!==positions[b].note.hand;if(cross){const y=(positions[a].y+positions[b].y)/2;positions[a].down=positions[a].y<y;positions[b].down=positions[b].y<y;stemEnd.set(a,y);stemEnd.set(b,y);continue;}const down=positions[a].down;const y=down?Math.max(positions[a].y,positions[b].y)+34:Math.min(positions[a].y,positions[b].y)-34;stemEnd.set(a,y);stemEnd.set(b,y);}
   function head(position,i,alternative=false){const {note,x,y,top,down}=position;const g=e('g',{'data-note-id':note.id,class:'score-note','aria-label':(note.hand==='right'?'Prawa':'Lewa')+' ręka, '+['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][note.m%12]+(Math.floor(note.m/12)-1)},group);
    e('ellipse',{cx:x,cy:y,rx:16,ry:13,class:'note-glow',fill:'currentColor'},g);
    if(y>top+48)for(let ledger=top+60;ledger<=y+.1;ledger+=gap)e('line',{x1:x-14,x2:x+14,y1:ledger,y2:ledger,stroke:'currentColor','stroke-width':1.4},g);
    if(y<top)for(let ledger=top-gap;ledger>=y-.1;ledger-=gap)e('line',{x1:x-14,x2:x+14,y1:ledger,y2:ledger,stroke:'currentColor','stroke-width':1.4},g);
    e('ellipse',{cx:x,cy:y,rx:note.beats===4?10:8,ry:5.7,transform:note.beats===4?'':`rotate(-17 ${x} ${y})`,class:'note-head '+(note.beats<2?'filled':'hollow'),fill:note.beats<2?'currentColor':'none',stroke:'currentColor','stroke-width':1.8},g);
    if(note.beats<4){const stemX=x+(down?-7.5:7.5),stemY=stemEnd.get(i)??(y+(down?34:-34));e('line',{x1:stemX,y1:y,x2:stemX,y2:stemY,stroke:'currentColor','stroke-width':1.5},g);if(note.beats===.5&&!beamed.has(i)){const sign=down?-1:1;e('path',{d:`M ${stemX} ${stemY} q ${12*sign} ${10*sign} ${4*sign} ${22*sign} q ${4*sign} ${-10*sign} ${-4*sign} ${-14*sign}`,fill:'currentColor'},g);}}
    if(measure.handMarks?.[i]||(showFinger&&note.finger))e('text',{x,y:note.hand==='right'?Math.min(y-16,top-9):Math.max(y+23,top+70),'text-anchor':'middle','font-size':13,'font-weight':700,fill:'currentColor'},g,measure.handMarks?.[i]||String(note.finger));
    if(alternative){e('text',{x:x-20,y:y+7,'font-size':26,fill:'currentColor'},g,'(');e('text',{x:x+14,y:y+7,'font-size':26,fill:'currentColor'},g,')');}
   }
   positions.forEach((pos,i)=>head(pos,i,!!measure.alternativeHand));
   if(measure.alternativeHand){const pos=positions[0];head({...pos,note:{...pos.note,hand:'left'},top:bassTop,down:true,y:bassTop+48-(step(pos.note.m)-step(43))*gap/2},0,true);}
   for(const [a,b]of beams){const first=positions[a],last=positions[b],y=stemEnd.get(a),shift=first.down?-7.5:7.5;e('path',{d:`M ${first.x+shift} ${y} H ${last.x+(last.down?-7.5:7.5)}`,'data-beam':`${measure.id}:${a}-${b}`,fill:'none',stroke:'#29364a','stroke-width':4.5},group);}
   for(const i of measure.breathAfter||[]){const pos=positions[i],next=positions[i+1];e('text',{x:next?(pos.x+next.x)/2:end-10,y:pos.top-10,'text-anchor':'middle','font-size':23,'font-family':'serif','font-weight':700,fill:'#29364a'},group,'’');}
   for(const [a,b]of measure.slurs||[]){const first=positions[a],last=positions[b],y=Math.min(first.y-16,last.y-16,...[a,b].filter(i=>!positions[i].down&&stemEnd.has(i)).map(i=>stemEnd.get(i)-8));e('path',{d:`M ${first.x-4} ${y} Q ${(first.x+last.x)/2} ${y-17} ${last.x+5} ${y}`,fill:'none',stroke:'#29364a','stroke-width':1.3},group);}
  });
 });
 return {rows:rows.length,width:W,height:H};
}

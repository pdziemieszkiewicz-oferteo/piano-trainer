import { SONGS, SongMatcher, SONG_BONUS } from './song-engine.js';
import { SCORES } from './song-score.js';
export const HIT_POINTS = 1;
export const BAR_BONUS = 5;
const endsWith = (played, expected) => played.length >= expected.length && expected.every((n,i)=>played[played.length-expected.length+i]===n);
/** @param {string} songId @param {number[]} played @param {string|null} [barId] @param {boolean} [complete] */
export function practiceBreakdown(songId, played, barId=null, complete=false) {
 const song=SONGS[songId], score=SCORES[songId];
 if(!song||!score||!Array.isArray(played)||!played.length||played.length>song.sequence.length||!played.every(n=>Number.isInteger(n)&&n>=21&&n<=108))throw Error('Nieprawidłowe dźwięki.');
 const bar=barId?score.bars.find(b=>b.id===barId):null;
 if(barId&&(!bar||!endsWith(played,bar.notes.map(n=>n.m))))throw Error('Nie zagrano poprawnego taktu.');
 if(complete&&!endsWith(played,song.sequence))throw Error('Nie zagrano całego utworu.');
 const base=HIT_POINTS,barBonus=bar?BAR_BONUS:0,bonus=complete?SONG_BONUS:0;
 return {base,barBonus,bonus,total:base+barBonus+bonus};
}
export class SongPractice {
 constructor(songId){this.songId=songId;this.reset();}
 reset(){this.matcher=new SongMatcher(SONGS[this.songId].sequence);this.sinceBar=0;}
 push(midi){
  const complete=this.matcher.push(midi);this.sinceBar++;
  const played=[...this.matcher.history];
  const bar=SCORES[this.songId].bars.filter(b=>b.notes.length<=this.sinceBar&&endsWith(played,b.notes.map(n=>n.m))).sort((a,b)=>b.notes.length-a.notes.length)[0];
  if(bar)this.sinceBar=0;
  return {playedNotes:played,barId:bar?.id||null,complete,...practiceBreakdown(this.songId,played,bar?.id,complete)};
 }
}

// Jedno źródło kolejności nut dla przeglądarki i serwera. MIDI: C4=60.
const ragtimeIntro = [67,64,62,64, 60, 55,60,59,59, 60];
const ragtimeRepeat = [65,64,62, 60,62,64, 62,60,59,55];
export const SONGS = {
  ragtime: {
    number: 7, title: 'Ragtime małego klauna', image: '/scores/ragtime.png',
    sequence: [...ragtimeIntro, ...ragtimeRepeat, 60,62,64, ...ragtimeRepeat, 60],
    hint: 'Wstęp raz, fragment od znaku repetycji dwa razy: zakończenie 1, potem 2. Ostatnie do możesz zagrać dowolną ręką.'
  },
  piwnica: {
    number: 8, title: 'W murowanej piwnicy', image: '/scores/piwnica.png',
    sequence: [67,62,62,60, 59,60,62, 67,62,62,60, 59,57,55, 55,57,59,57, 59,60,62, 59,62,62,60, 59,57,55],
    hint: 'Zagraj całość od lewej do prawej, kolejno oba systemy pięciolinii. Możesz przerwać i zacząć od początku.'
  }
};
export const NEW_SCORES = {"musicbox":{"number":9,"title":"Pozytywka","meter":1.5,"denominator":8,"lowerClef":"treble","systems":[[0,1,2,3],[4,5,6,7]],"bars":[{"id":"musicbox-1","notes":[{"m":62,"hand":"left","beats":0.5,"finger":"4","ink":"1","lyric":"","sharp":false},{"m":64,"hand":"left","beats":0.5,"finger":null,"ink":"2","lyric":"","sharp":false},{"m":66,"hand":"left","beats":0.5,"finger":null,"ink":"3 · *1","lyric":"","sharp":true}],"final":false},{"id":"musicbox-2","notes":[{"m":67,"hand":"left","beats":1.5,"finger":null,"ink":"1 · 1–2–3","lyric":"","sharp":false}],"final":false},{"id":"musicbox-3","notes":[{"m":67,"hand":"right","beats":0.5,"finger":"1","ink":"","lyric":"","sharp":false},{"m":69,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":71,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"musicbox-4","notes":[{"m":69,"hand":"right","beats":1.5,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"musicbox-5","notes":[{"m":62,"hand":"left","beats":0.5,"finger":"4","ink":"","lyric":"","sharp":false},{"m":64,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":66,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":true}],"final":false},{"id":"musicbox-6","notes":[{"m":67,"hand":"left","beats":1.5,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"musicbox-7","notes":[{"m":74,"hand":"right","beats":0.5,"finger":"5","ink":"D","lyric":"","sharp":false},{"m":73,"hand":"right","beats":0.5,"finger":null,"ink":"4 · *2","lyric":"","sharp":true},{"m":71,"hand":"right","beats":0.5,"finger":null,"ink":"H","lyric":"","sharp":false}],"final":false},{"id":"musicbox-8","notes":[{"m":69,"hand":"right","beats":1.5,"finger":null,"ink":"","lyric":"","sharp":false}],"final":true}],"order":[0,1,2,3,4,5,6,7],"hint":"Lekko · 3/8. Zagraj kolejno oba systemy. Dolna pięciolinia też ma klucz wiolinowy."},"sharps":{"number":10,"title":"Piosenka o krzyżykach","meter":4,"denominator":4,"lowerClef":"bass","systems":[[0,1,2,3]],"bars":[{"id":"sharps-1","notes":[{"m":69,"hand":"right","beats":1,"finger":"5","ink":"A","lyric":"Ra-","sharp":false},{"m":66,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"dość","sharp":true},{"m":62,"hand":"right","beats":1,"finger":null,"ink":"1","lyric":"wie-","sharp":false},{"m":66,"hand":"right","beats":1,"finger":null,"ink":"(♯)","lyric":"lką","sharp":false}],"final":false},{"id":"sharps-2","notes":[{"m":64,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"z te-","sharp":false},{"m":66,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"go","sharp":true},{"m":67,"hand":"right","beats":2,"finger":null,"ink":"4","lyric":"mam,","sharp":false}],"final":false},{"id":"sharps-3","notes":[{"m":57,"hand":"left","beats":1,"finger":"4","ink":"A?","lyric":"że","sharp":false},{"m":59,"hand":"left","beats":1,"finger":null,"ink":"","lyric":"krzy-","sharp":false},{"m":61,"hand":"left","beats":1,"finger":null,"ink":"2","lyric":"ży-","sharp":true},{"m":57,"hand":"left","beats":1,"finger":null,"ink":"","lyric":"ki","sharp":false}],"final":false},{"id":"sharps-4","notes":[{"m":62,"hand":"left","beats":1,"finger":null,"ink":"1?","lyric":"do-","sharp":false},{"m":61,"hand":"left","beats":1,"finger":null,"ink":"2","lyric":"brze","sharp":true},{"m":62,"hand":"left","beats":2,"finger":null,"ink":"1","lyric":"znam.","sharp":false}],"final":true}],"order":[0,1,2,3],"hint":"Wesoło · 4/4. Słowa są zapisane pod nutami. Krzyżyk obowiązuje do końca taktu."},"leaves":{"number":11,"title":"Bukiet liści","meter":3,"denominator":4,"lowerClef":"bass","systems":[[0,1,2],[3,4,5]],"bars":[{"id":"leaves-1","notes":[{"m":60,"hand":"left","beats":1,"finger":"1","ink":"","lyric":"","sharp":false},{"m":59,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":55,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":60,"hand":"left","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"leaves-2","notes":[{"m":59,"hand":"left","beats":0.5,"finger":"2","ink":"","lyric":"","sharp":false},{"m":57,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":55,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":59,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":60,"hand":"left","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"leaves-3","notes":[{"m":67,"hand":"right","beats":0.5,"finger":"5","ink":"","lyric":"","sharp":false},{"m":64,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":65,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":62,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":60,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"leaves-4","notes":[{"m":64,"hand":"right","beats":1,"finger":"3","ink":"","lyric":"","sharp":false},{"m":62,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":65,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":64,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"leaves-5","notes":[{"m":67,"hand":"right","beats":1,"finger":"5","ink":"","lyric":"","sharp":false},{"m":65,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":62,"hand":"right","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":60,"hand":"right","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false},{"id":"leaves-6","notes":[{"m":55,"hand":"left","beats":1,"finger":"4","ink":"","lyric":"","sharp":false},{"m":57,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":59,"hand":"left","beats":0.5,"finger":null,"ink":"","lyric":"","sharp":false},{"m":60,"hand":"left","beats":1,"finger":null,"ink":"","lyric":"","sharp":false}],"final":false}],"order":[0,1,2,3,4,5],"hint":"Wybierz cztery listki w kolejności, w jakiej chcesz je zagrać."}};
for(const [id,score] of Object.entries(NEW_SCORES)){
 SONGS[id]={number:score.number,title:score.title,image:'',sequence:score.bars.flatMap(b=>b.notes.map(n=>n.m)),hint:score.hint};
}
export function validLeafOrder(order){
 return Array.isArray(order)&&order.length===4&&new Set(order).size===4&&order.every(i=>Number.isInteger(i)&&i>=0&&i<6);
}
export function sequenceForSong(songId,leafOrder){
 if(songId!=='leaves')return SONGS[songId]?.sequence;
 if(!validLeafOrder(leafOrder))return undefined;
 return leafOrder.flatMap(i=>NEW_SCORES.leaves.bars[i].notes.map(n=>n.m));
}
export const SONG_BONUS = 300;
export const SONG_NOTE_POINTS = 10;
export function rewardCounts(total) {
  total = Math.max(0, Math.floor(Number(total) || 0));
  return { yellow: total % 10, red: Math.floor(total/10) % 10,
    purple: Math.floor(total/100) % 10, white: Math.floor(total/1000) };
}
// Zawsze porównujemy ostatnie N zdarzeń z pełnym utworem; bez sygnału początku.
export class SongMatcher {
  constructor(sequence) { this.sequence = [...sequence]; this.reset(); }
  reset() { this.history = []; this.sinceAward = 0; }
  push(midi) {
    this.history.push(midi); this.sinceAward++;
    if (this.history.length > this.sequence.length) this.history.shift();
    const complete = this.sinceAward >= this.sequence.length &&
      this.history.length === this.sequence.length &&
      this.sequence.every((note,i) => note === this.history[i]);
    if (complete) this.sinceAward = 0; // kolejne zaliczenie wymaga nowego pełnego wykonania
    return complete;
  }
}
// Dwa stabilne pomiary wysokości. Ta sama nuta wymaga ciszy albo nowego ataku.
export class NoteGate {
  constructor() { this.reset(); }
  reset() {
    this.last = null; this.candidate = null; this.stable = 0;
    this.acceptedAt = -Infinity; this.silenceAt = null; this.released = true;
    this.previousRms = 0; this.envelope = 0; this.dipped = false; this.pendingAttack = false;
  }
  observe(midi,rms,time) {
    if (midi === null) {
      this.candidate = null; this.stable = 0; this.pendingAttack = false;
      if (this.silenceAt === null) this.silenceAt = time;
      if (time-this.silenceAt >= 100) this.released = true;
      if (rms < this.envelope*.65) this.dipped = true;
      this.previousRms = rms;
      return null;
    }
    this.silenceAt = null;
    if (this.candidate === midi) this.stable++; else { this.candidate = midi; this.stable = 1; }
    if (rms < this.envelope*.65) this.dipped = true;
    const attack = this.dipped && rms > this.previousRms*1.45 && time-this.acceptedAt >= 160;
    if (attack) this.pendingAttack = true;
    this.previousRms = rms; this.envelope = Math.max(rms,this.envelope*.97);
    if (this.stable < 2 || time-this.acceptedAt < 100) return null;
    if (midi === this.last && !this.released && !this.pendingAttack) return null;
    this.last = midi; this.acceptedAt = time; this.released = false;
    this.dipped = false; this.pendingAttack = false; this.envelope = rms;
    return midi;
  }
}

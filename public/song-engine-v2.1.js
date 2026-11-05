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

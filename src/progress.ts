

const profileIds = ["marcel", "adrianka", "przemek"];
const noCache = { "Cache-Control": "no-store" };
export function createProgressApi(database: D1Database) {
function db(){if(!database)throw new Error("D1 database unavailable");return database;}
const roundPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Payload = { profileId?: string; type?: string; awardId?: string; roundId?: string; noteIndex?: number; noteCount?: number; level?: string; tempo?: number; activeSeconds?: number; settings?: {lesson?:string;level?:string;tempo?:number;showFinger?:boolean;direction?:string;mic?:boolean;randomCount?:number} };

async function profile(id: string) {
  return db().prepare("SELECT id,stars,hits,lessons,points,practice_day,practice_seconds,settings_json FROM profiles WHERE id=?").bind(id).first();
}
async function addPoints(id: string, amount: number) {
  if (amount <= 0) return;
  await db().prepare("UPDATE profiles SET stars=stars+CAST((points+?)/30 AS INTEGER), points=(points+?)%30 WHERE id=?").bind(amount, amount, id).run();
}
function warsawDay() {
  return new Intl.DateTimeFormat("en-CA", {timeZone:"Europe/Warsaw", year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}

async function GET() {
  try {
    const {results} = await db().prepare("SELECT id,stars,hits,lessons,points,practice_day,practice_seconds,settings_json FROM profiles").all();
    const profiles = Object.fromEntries(profileIds.map(id => [id, results.find((row:any) => row.id === id) || {id,stars:0,hits:0,lessons:0,points:0,practice_day:"",practice_seconds:0,settings_json:"{}"}]));
    return Response.json({profiles,today:warsawDay()}, {headers:noCache});
  } catch (e) { console.error(e); return Response.json({error:"Nie można pobrać wyników."},{status:503}); }
}

async function POST(request: Request) {
  try {
    const data = await request.json() as Payload;
    if (!profileIds.includes(data.profileId || "")) return Response.json({error:"Nieprawidłowy profil."},{status:400});
    const id = data.profileId!;
    await db().prepare("INSERT OR IGNORE INTO profiles(id,stars,hits,lessons) VALUES (?,0,0,0)").bind(id).run();

    // Earlier versions can finish a round in an already open tab.
    if (data.type === "star" || data.type === "lesson") {
      if (!/^[a-zA-Z0-9-]{12,80}$/.test(data.awardId || "")) return Response.json({error:"Nieprawidłowa nagroda."},{status:400});
      const inserted = await db().prepare("INSERT OR IGNORE INTO awards(id,profile_id,created_at) VALUES (?,?,?)").bind(data.awardId,id,new Date().toISOString()).run();
      if (inserted.meta.changes) await db().prepare(data.type === "star"?"UPDATE profiles SET stars=stars+1 WHERE id=?":"UPDATE profiles SET lessons=lessons+1 WHERE id=?").bind(id).run();
      return Response.json({profile:await profile(id)}, {headers:noCache});
    }

    if (data.type === "settings") {
      const v = data.settings;
      if (!v || !["right","left","exercise5","exercise6","original5","original6"].includes(v.lesson || "") || !["easy","medium","random"].includes(v.level || "") || typeof v.tempo !== "number" || !Number.isFinite(v.tempo) || v.tempo < .5 || v.tempo > 5 || typeof v.showFinger !== "boolean" || !["auto","horizontal","vertical"].includes(v.direction || "") || typeof v.mic !== "boolean" || !Number.isInteger(v.randomCount) || v.randomCount! < 5 || v.randomCount! > 100) return Response.json({error:"Nieprawidłowe ustawienia."},{status:400});
      await db().prepare("UPDATE profiles SET settings_json=? WHERE id=?").bind(JSON.stringify(v),id).run();
      return Response.json({profile:await profile(id)}, {headers:noCache});
    }

    if (!roundPattern.test(data.roundId || "")) return Response.json({error:"Nieprawidłowa runda."},{status:400});
    const roundId = data.roundId!;
    const noteCount = data.noteCount ?? 24;
    if (!Number.isInteger(noteCount) || noteCount < 5 || noteCount > 100 || (data.level && data.level !== "random" && ![24,14,25].includes(noteCount))) return Response.json({error:"Nieprawidłowa długość lekcji."},{status:400});
    if (data.type === "note") {
      if (!Number.isInteger(data.noteIndex) || data.noteIndex! < 0 || data.noteIndex! >= noteCount || !["easy","medium","random"].includes(data.level || "")) return Response.json({error:"Nieprawidłowa nuta."},{status:400});
      const noteIndex = data.noteIndex!;
      const previous = await db().prepare("SELECT note_index FROM score_events WHERE round_id=? AND profile_id=? AND kind='note' AND note_index<? ORDER BY note_index DESC LIMIT 20").bind(roundId,id,noteIndex).all();
      const seen = new Set(previous.results.map((row:any) => Number(row.note_index)));
      let streak = 1;
      while (seen.has(noteIndex-streak)) streak++;
      const base = 10;
      const difficulty = data.level === "easy" ? 0 : data.level === "medium" ? 2 : 4;
      const series = streak === 5 ? 5 : streak === 10 ? 10 : streak === 20 ? 15 : 0;
      const points = base + difficulty + series;
      const inserted = await db().prepare("INSERT OR IGNORE INTO score_events(id,profile_id,round_id,kind,note_index,points,created_at) VALUES (?,?,?,?,?,?,?)").bind(`${roundId}-n${noteIndex}`,id,roundId,"note",noteIndex,points,new Date().toISOString()).run();
      if (inserted.meta.changes) await addPoints(id, points);
      return Response.json({profile:await profile(id),breakdown:inserted.meta.changes?{base,difficulty,series,total:points}:null}, {headers:noCache});
    }

    if (data.type === "round") {
      if (typeof data.tempo !== "number" || data.tempo < .5 || data.tempo > 5 || typeof data.activeSeconds !== "number" || !Number.isFinite(data.activeSeconds) || data.activeSeconds < 0) return Response.json({error:"Nieprawidłowe dane rundy."},{status:400});
      const countRow = await db().prepare("SELECT COUNT(*) AS hits FROM score_events WHERE round_id=? AND profile_id=? AND kind='note'").bind(roundId,id).first<{hits:number}>();
      const hits = Number(countRow?.hits || 0);
      const tempoUnit = data.tempo < 1 ? 3 : data.tempo < 2 ? 2 : data.tempo < 3 ? 1 : 0;
      const speed = hits >= Math.ceil(noteCount * .8) ? hits * tempoUnit : 0;
      const perfect = hits === noteCount ? 15 : 0;
      const today = warsawDay();
      const before = await profile(id) as {practice_day?:string;practice_seconds?:number} | null;
      const prior = before?.practice_day === today ? Number(before.practice_seconds || 0) : 0;
      const practiced = hits >= Math.ceil(noteCount * .25) ? Math.floor(Math.min(data.activeSeconds,noteCount*data.tempo)) : 0;
      const next = Math.min(900,prior+practiced);
      const milestones = [300,600,900];
      const practice = milestones.filter(m => prior < m && next >= m).length * 10;
      const total = speed + perfect + practice;
      const inserted = await db().prepare("INSERT OR IGNORE INTO score_events(id,profile_id,round_id,kind,note_index,points,created_at) VALUES (?,?,?,?,?,?,?)").bind(`${roundId}-end`,id,roundId,"round",null,total,new Date().toISOString()).run();
      if (inserted.meta.changes) {
        await db().prepare("UPDATE profiles SET stars=stars+CAST((points+?)/30 AS INTEGER),points=(points+?)%30,practice_day=?,practice_seconds=?,lessons=lessons+1 WHERE id=?").bind(total,total,today,next,id).run();
      }
      return Response.json({profile:await profile(id),breakdown:inserted.meta.changes?{speed,perfect,practice,total,hits}:null}, {headers:noCache});
    }
    return Response.json({error:"Nieprawidłowy typ zdarzenia."},{status:400});
  } catch (e) { console.error(e); return Response.json({error:"Nie udało się zapisać wyniku."},{status:503}); }
}

return { GET, POST };
}

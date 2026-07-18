import { useState, useCallback } from "react";

// ─── Discogs genre map ───────────────────────────────────────────────────────
const DISCOGS_GENRES = {
  hiphop:  { style: ["Hip Hop","Funk","Soul","Breakbeat","Boom Bap","Electro"],       genre: "Hip Hop" },
  rave:    { style: ["Hardcore","Rave","Jungle","Drum n Bass","Breakbeat Hardcore"],   genre: "Electronic" },
  rnb:     { style: ["Rhythm & Blues","Soul","Funk","Disco","Boogie"],                 genre: "Funk / Soul" },
  house:   { style: ["House","Deep House","Chicago House","Acid House","Garage House"],genre: "Electronic" },
  newwave: { style: ["Synth-pop","New Wave","Post-Punk","Sophisti-Pop","Electro"],     genre: "Electronic" },
  jazz:    { style: ["Bop","Hard Bop","Soul Jazz","Free Jazz","Fusion","Modal"],       genre: "Jazz" },
  latin:   { style: ["Latin Jazz","Salsa","Cumbia","Boogaloo","Afrobeat","Samba"],     genre: "Latin" },
  reggae:  { style: ["Reggae","Dub","Roots Reggae","Dancehall","Rocksteady"],          genre: "Reggae" },
  psych:   { style: ["Psychedelic Rock","Krautrock","Prog Rock","Garage Rock"],        genre: "Rock" },
  library: { style: ["Library","Score","Background Music","Soundtrack"],               genre: "Stage & Screen" },
  african: { style: ["Afrobeat","Highlife","Juju","Soukous","Mbalax"],                 genre: "African" },
  custom:  { style: [], genre: "" },
};

const MODES = [
  { key: "hiphop",  label: "HIP-HOP",  sub: "Breaks & Soul",    color: "#ff6b00" },
  { key: "rave",    label: "RAVE",      sub: "Hardcore & Jungle", color: "#00ccff" },
  { key: "rnb",     label: "R&B",       sub: "Soul & Funk",       color: "#cc44ff" },
  { key: "house",   label: "HOUSE",     sub: "Deep & Classic",    color: "#ff3366" },
  { key: "newwave", label: "NEW WAVE",  sub: "Synth & Post-Punk", color: "#00ff88" },
  { key: "jazz",    label: "JAZZ",      sub: "Bop to Fusion",     color: "#ffdd00" },
  { key: "latin",   label: "LATIN",     sub: "Global Rhythms",    color: "#ff8800" },
  { key: "reggae",  label: "REGGAE",    sub: "Roots & Dub",       color: "#44ff88" },
  { key: "psych",   label: "PSYCH",     sub: "Rock & Krautrock",  color: "#ff44cc" },
  { key: "library", label: "LIBRARY",   sub: "Rare Soundtracks",  color: "#88aaff" },
  { key: "african", label: "AFRICAN",   sub: "Afrobeat & More",   color: "#ffaa22" },
  { key: "custom",  label: "CUSTOM",    sub: "Any Genre",         color: "#ffd700" },
];

// ─── Vinyl SVG ───────────────────────────────────────────────────────────────
function VinylRecord({ spinning, color, record, loading }) {
  return (
    <div style={{ position: "relative", width: 260, height: 260, margin: "0 auto", flexShrink: 0 }}>
      <style>{`
        @keyframes vinylSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes vinylPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .vinyl { animation: ${spinning || loading ? "vinylSpin 1.8s linear infinite" : "none"}; width:210px; height:210px; }
      `}</style>
      <svg className="vinyl" viewBox="0 0 220 220" style={{width:"260px",height:"260px"}} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="vg" cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#3a3a3a"/>
            <stop offset="25%"  stopColor="#111"/>
            <stop offset="55%"  stopColor="#1a1a1a"/>
            <stop offset="100%" stopColor="#222"/>
          </radialGradient>
          <radialGradient id="sh" cx="28%" cy="22%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)"/>
            <stop offset="70%"  stopColor="rgba(255,255,255,0.02)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="lg" cx="50%" cy="42%" r="58%">
            <stop offset="0%"   stopColor="#1a1200"/>
            <stop offset="100%" stopColor="#060400"/>
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="109" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="0.5"/>
        <circle cx="110" cy="110" r="107" fill="url(#vg)"/>
        {[96,88,80,72,64,56,48,41,35,30,25,21,18].map((r,i) => (
          <circle key={i} cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.9"/>
        ))}
        <circle cx="110" cy="110" r="107" fill="url(#sh)"/>
        <circle cx="110" cy="110" r="43" fill="url(#lg)" stroke={color} strokeWidth="1" strokeOpacity="0.5"/>
        <circle cx="110" cy="110" r="40" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.3"/>
        <circle cx="110" cy="110" r="36" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.18"/>
        <text x="110" y="94"  textAnchor="middle" fontSize="5.2" fill={color} fontFamily="Georgia,serif" letterSpacing="2.5" opacity="0.9">SAMPLE</text>
        <text x="110" y="102" textAnchor="middle" fontSize="5.2" fill={color} fontFamily="Georgia,serif" letterSpacing="2.5" opacity="0.9">ROULETTE</text>
        {loading && (
          <text x="110" y="116" textAnchor="middle" fontSize="3.8" fill="rgba(255,255,255,0.4)" fontFamily="Georgia,serif" letterSpacing="1">DIGGING...</text>
        )}
        {record && !loading && (
          <>
            <text x="110" y="113" textAnchor="middle" fontSize="4.2" fill="#fff" fontFamily="Georgia,serif" opacity="0.95">
              {(record.title||"").length > 18 ? (record.title||"").slice(0,17)+"…" : (record.title||"")}
            </text>
            <text x="110" y="121" textAnchor="middle" fontSize="3.4" fill="rgba(255,255,255,0.55)" fontFamily="Georgia,serif">
              {(record.artist||"").length > 22 ? (record.artist||"").slice(0,21)+"…" : (record.artist||"")}
            </text>
            <text x="110" y="129" textAnchor="middle" fontSize="3.8" fill={color} fontFamily="Georgia,serif" opacity="0.85">
              {record.year || ""}
            </text>
          </>
        )}
        {!record && !loading && (
          <text x="110" y="116" textAnchor="middle" fontSize="3.8" fill="rgba(255,255,255,0.18)" fontFamily="Georgia,serif" letterSpacing="1">HIT SPIN</text>
        )}
        <circle cx="110" cy="110" r="4.5" fill="#000" stroke="#2a2a2a" strokeWidth="0.5"/>
        <circle cx="110" cy="110" r="107" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

// ─── Year Stepper ────────────────────────────────────────────────────────────
function YearStepper({ label, value, onChange, color }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginBottom: 4, fontFamily: "Georgia,serif" }}>{label}</div>
      <button onClick={() => onChange(value + 1)} style={{
        width: "100%", padding: "7px 0", background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
        borderRadius: "8px 8px 0 0", color, fontSize: 16, cursor: "pointer",
        transition: "background 0.15s",
      }}>▲</button>
      <div style={{
        width: "100%", padding: "11px 0", textAlign: "center",
        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
        fontSize: 22, fontWeight: 900, color: "#fff",
        fontFamily: "Georgia,serif", letterSpacing: 2, boxSizing: "border-box",
      }}>{value}</div>
      <button onClick={() => onChange(value - 1)} style={{
        width: "100%", padding: "7px 0", background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)", borderTop: "none",
        borderRadius: "0 0 8px 8px", color, fontSize: 16, cursor: "pointer",
        transition: "background 0.15s",
      }}>▼</button>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function SampleRoulette() {
  const [modeKey, setModeKey]       = useState("hiphop");
  const [fromYear, setFromYear]     = useState(1980);
  const [toYear, setToYear]         = useState(1995);
  const [record, setRecord]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [spinning, setSpinning]     = useState(false);
  const [history, setHistory]       = useState([]);
  const [error, setError]           = useState("");
  const [customGenre, setCustomGenre] = useState("");
  const [ytApiKey, setYtApiKey]     = useState("");
  const [ytVideo, setYtVideo]       = useState(null);
  const [ytLoading, setYtLoading]   = useState(false);
  const [status, setStatus]         = useState("");

  const mode = MODES.find(m => m.key === modeKey);
  const color = mode.color;
  const isCustom = modeKey === "custom";

  const switchMode = (key) => {
    setModeKey(key); setRecord(null); setError("");
    setYtVideo(null); setStatus("");
    const defaults = {
      hiphop: [1980,1995], rave: [1990,1995], rnb: [1980,1994],
      house: [1984,1995], newwave: [1979,1990], jazz: [1955,1975],
      latin: [1965,1980], reggae: [1968,1985], psych: [1966,1978],
      library: [1965,1980], african: [1970,1985], custom: [1970,1995],
    };
    setFromYear(defaults[key][0]);
    setToYear(defaults[key][1]);
  };

  // ── Discogs search ──────────────────────────────────────────────────────────
  const digDiscogs = useCallback(async () => {
    setLoading(true); setSpinning(true); setRecord(null);
    setYtVideo(null); setError(""); setStatus("");

    try {
      const cfg = DISCOGS_GENRES[modeKey];
      let searchUrl;

      if (isCustom && customGenre.trim()) {
        // Custom: search by genre text
        const randomPage = Math.floor(Math.random() * 40) + 1;
        const q = encodeURIComponent(customGenre.trim());
        searchUrl = `https://api.discogs.com/database/search?q=${q}&format=Vinyl&type=release&per_page=100&page=${randomPage}`;
      } else {
        // Pick random style from genre
        const style = cfg.style[Math.floor(Math.random() * cfg.style.length)];
        // Mix deep pages (rare cuts) with early pages (bangers) — 70% deep, 30% early
        const deepDig = Math.random() > 0.3;
        const randomPage = deepDig
          ? Math.floor(Math.random() * 35) + 5   // pages 5-40 = rarities
          : Math.floor(Math.random() * 4) + 1;   // pages 1-4 = known bangers
        setStatus(deepDig ? "◆ GOING DEEP..." : "◆ FINDING A BANGER...");
        searchUrl = `https://api.discogs.com/database/search?style=${encodeURIComponent(style)}&genre=${encodeURIComponent(cfg.genre)}&format=Vinyl&type=release&per_page=100&page=${randomPage}`;
      }

      const res = await fetch(searchUrl, {
        headers: { "User-Agent": "SampleRoulette/1.0 +https://sampleroulette.vercel.app" }
      });

      if (!res.ok) throw new Error(`Discogs ${res.status}`);
      const data = await res.json();
      let results = data.results || [];

      // Filter by year
      const filtered = results.filter(r => {
        if (!r.year) return true;
        const y = parseInt(r.year);
        return y >= fromYear && y <= toYear;
      });
      const pool = filtered.length > 0 ? filtered : results;
      if (!pool.length) { setError("Nothing found — try wider years"); setLoading(false); setSpinning(false); setStatus(""); return; }

      // Pick random record
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const parts  = (picked.title || "").split(" - ");
      const artist = parts[0]?.trim() || "Unknown";
      const title  = parts.slice(1).join(" - ").trim() || picked.title || "Unknown";

      const rec = {
        artist, title,
        year:    picked.year || `${fromYear}s`,
        label:   Array.isArray(picked.label) ? picked.label[0] : picked.label || "",
        country: picked.country || "",
        style:   Array.isArray(picked.style) ? picked.style.slice(0,2).join(" · ") : "",
        thumb:   picked.cover_image || picked.thumb || "",
        uri:     picked.uri || "",
        catno:   picked.catno || "",
        id:      picked.id,
      };

      // Animate spin then show result
      setTimeout(async () => {
        setRecord(rec);
        setHistory(prev => [rec, ...prev.filter(h => h.id !== rec.id)].slice(0, 12));
        setLoading(false);
        setSpinning(false);
        setStatus("");
        // Auto find YouTube if key is set
        if (ytApiKey) findYouTube(rec, ytApiKey);
      }, 1200);

    } catch(e) {
      setError(`Discogs: ${e.message}`);
      setLoading(false); setSpinning(false); setStatus("");
    }
  }, [modeKey, fromYear, toYear, customGenre, ytApiKey, isCustom]);

  // ── YouTube search ──────────────────────────────────────────────────────────
  const findYouTube = async (rec, key) => {
    if (!key) { setError("Paste your YouTube API key below to auto-find videos"); return; }
    setYtLoading(true); setYtVideo(null);
    try {
      const q = encodeURIComponent(`${rec.artist} ${rec.title}`);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&order=viewCount&maxResults=1&key=${key}`;
      const res  = await fetch(url);
      const data = await res.json();
      if (data.error) { setError(`YouTube: ${data.error.message}`); setYtLoading(false); return; }
      const item = data.items?.[0];
      if (item) setYtVideo({ id: item.id.videoId, title: item.snippet.title, channel: item.snippet.channelTitle });
    } catch(e) { setError("YouTube search failed"); }
    setYtLoading(false);
  };

  const openYT = (rec) => {
    if (ytVideo) window.open(`https://www.youtube.com/watch?v=${ytVideo.id}`, "_blank");
    else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((rec.artist||"") + " " + (rec.title||""))}`, "_blank");
  };

  const glass = (extra={}) => ({
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 14,
    ...extra,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 0%, #1c0a02 0%, #0a0808 45%, #000 100%)", minWidth: "100vw",
      color: "#fff", fontFamily: "'Courier New', monospace",
      display: "flex", flexDirection: "column", alignItems: "stretch",
      padding: "30px 40px 60px", gap: 16, maxWidth: "100%",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .tap{transition:transform 0.12s;cursor:pointer;border:none}
        .tap:hover{transform:scale(1.03)} .tap:active{transform:scale(0.96)}
        .hist:hover{background:rgba(255,255,255,0.07)!important}
        input::placeholder{color:rgba(255,255,255,0.2)}
        input:focus{outline:none}
        button{font-family:'Courier New',monospace}
        ::-webkit-scrollbar{width:0}
        html,body{margin:0;padding:0;background:#000;min-height:100vh}
        #root{background:#000;min-height:100vh}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ width:"100%", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <div style={{
            display:"inline-block", border:`1px solid ${color}`,
            borderRadius:4, padding:"2px 12px", marginBottom:6,
            background:"rgba(0,0,0,0.5)",
          }}>
            <span style={{ fontSize:8, letterSpacing:5, color, fontFamily:"Georgia,serif" }}>EST. 2024 · POWERED BY DISCOGS</span>
          </div>
          <div style={{
            fontSize:27, fontWeight:900, fontFamily:"Georgia,serif", letterSpacing:3,
            background:`linear-gradient(135deg, #fff 30%, ${color})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>SAMPLE ROULETTE</div>
          <div style={{ fontSize:8, color:"rgba(255,255,255,0.18)", letterSpacing:4, marginTop:2, fontFamily:"Georgia,serif" }}>
            ◆ 15M+ RECORDS · ALL ERAS · WORLDWIDE ◆
          </div>
        </div>
        {/* Status badge */}
        {status && (
          <div style={{
            fontSize:9, color, letterSpacing:2, fontFamily:"Georgia,serif",
            animation:"pulse 1s infinite", marginTop:8,
          }}>{status}</div>
        )}
      </div>

      {/* ── VINYL ── */}
      <VinylRecord spinning={spinning} loading={loading} color={color} record={record} />

      {/* ── GENRE GRID ── */}
      <div style={{ ...glass(), width:"100%", padding:6 }}>
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.2)", letterSpacing:4, marginBottom:6, textAlign:"center", fontFamily:"Georgia,serif" }}>◆ SELECT GENRE ◆</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:6 }}>
          {MODES.map(m => (
            <button key={m.key} onClick={() => switchMode(m.key)} className="tap" style={{
              padding:"7px 3px", fontSize:8, letterSpacing:0.5,
              fontFamily:"Georgia,serif", fontWeight:700,
              border:`1px solid ${modeKey === m.key ? m.color : "rgba(255,255,255,0.07)"}`,
              borderRadius:8,
              background: modeKey === m.key ? `${m.color}18` : "rgba(255,255,255,0.02)",
              color: modeKey === m.key ? m.color : "rgba(255,255,255,0.28)",
              transition:"all 0.15s", lineHeight:1.4,
            }}>
              {m.label}
              <div style={{ fontSize:6, opacity:0.55, marginTop:1 }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── CUSTOM INPUT ── */}
      {isCustom && (
        <div style={{ width:"100%", animation:"fadeUp 0.3s ease" }}>
          <div style={{ fontSize:8, color:"rgba(255,255,255,0.3)", letterSpacing:3, marginBottom:6, fontFamily:"Georgia,serif", textAlign:"center" }}>
            TYPE ANY GENRE OR ARTIST — LOFI · BOSSA NOVA · MADLIB STYLE · ANYTHING
          </div>
          <input type="text" value={customGenre} onChange={e => setCustomGenre(e.target.value)}
            placeholder="e.g. rare soul breaks, afrobeat, cumbia..."
            style={{ width:"100%", boxSizing:"border-box", ...glass(), color:"#fff", fontSize:13, fontFamily:"Georgia,serif", padding:"12px 16px", letterSpacing:1 }}
          />
        </div>
      )}

      {/* ── YEAR STEPPERS ── */}
      <div style={{ width:"100%" }}>
        <div style={{ fontSize:8, color:"rgba(255,255,255,0.18)", letterSpacing:4, marginBottom:8, textAlign:"center", fontFamily:"Georgia,serif" }}>◆ SET YOUR ERA — ANY YEAR ◆</div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <YearStepper label="FROM" value={fromYear} onChange={v => { setFromYear(v); setRecord(null); }} color={color} />
          <div style={{ color:"rgba(255,255,255,0.12)", fontSize:18, flexShrink:0 }}>—</div>
          <YearStepper label="TO" value={toYear} onChange={v => { setToYear(v); setRecord(null); }} color={color} />
          <div style={{ fontSize:8, color:"rgba(255,255,255,0.2)", fontFamily:"Georgia,serif", textAlign:"center", lineHeight:1.6, flexShrink:0 }}>
            15M+<br/><span style={{ fontSize:6, opacity:0.6 }}>records</span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ fontSize:10, color:"#ff7777", letterSpacing:1, textAlign:"center", fontFamily:"Georgia,serif", width:"100%", animation:"fadeUp 0.2s ease" }}>
          {error}
        </div>
      )}

      {/* ── RECORD RESULT ── */}
      {record && !loading && (
        <div style={{ ...glass({ borderColor:`${color}44` }), width:"100%", padding:"18px 20px", animation:"fadeUp 0.4s ease" }}>
          {/* Album art + info */}
          <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:14 }}>
            {record.thumb && (
              <img src={record.thumb} alt="" style={{ width:64, height:64, objectFit:"cover", borderRadius:6, border:`1px solid ${color}33`, flexShrink:0 }}
                onError={e => e.target.style.display="none"} />
            )}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9, color, letterSpacing:3, marginBottom:4, fontFamily:"Georgia,serif" }}>
                {record.year}{record.country ? ` · ${record.country}` : ""}
              </div>
              <div style={{ fontSize:19, fontWeight:900, lineHeight:1.2, marginBottom:4, fontFamily:"Georgia,serif" }}>{record.title}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginBottom:4, fontFamily:"Georgia,serif" }}>{record.artist}</div>
              {record.label && <div style={{ fontSize:8, color:"rgba(255,255,255,0.25)", letterSpacing:1, fontFamily:"Georgia,serif" }}>🏷 {record.label}{record.catno ? ` · ${record.catno}` : ""}</div>}
              {record.style && <div style={{ fontSize:8, color:"rgba(255,255,255,0.18)", marginTop:2, fontFamily:"Georgia,serif" }}>{record.style}</div>}
            </div>
          </div>

          {/* YouTube found result */}
          {ytLoading && (
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:2, marginBottom:12, animation:"pulse 1s infinite", fontFamily:"Georgia,serif" }}>
              ◆ FINDING MOST VIEWED VIDEO...
            </div>
          )}
          {ytVideo && !ytLoading && (
            <div style={{ background:"rgba(255,0,0,0.08)", border:"1px solid rgba(255,0,0,0.2)", borderRadius:8, padding:"8px 12px", marginBottom:12 }}>
              <div style={{ fontSize:8, color:"rgba(255,100,100,0.7)", letterSpacing:2, marginBottom:2, fontFamily:"Georgia,serif" }}>▶ MOST VIEWED ON YOUTUBE</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontFamily:"Georgia,serif", lineHeight:1.4 }}>
                {ytVideo.title.length > 55 ? ytVideo.title.slice(0,54)+"…" : ytVideo.title}
              </div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.25)", marginTop:2, fontFamily:"Georgia,serif" }}>{ytVideo.channel}</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button className="tap" onClick={() => openYT(record)} style={{
              background:"linear-gradient(135deg, #bb0000, #ff2222)",
              color:"#fff", fontSize:9, letterSpacing:2, padding:"9px 16px",
              borderRadius:8, fontFamily:"Georgia,serif", fontWeight:700,
              boxShadow:"0 4px 14px rgba(200,0,0,0.3)",
            }}>▶ YOUTUBE</button>

            {ytApiKey && !ytVideo && !ytLoading && (
              <button className="tap" onClick={() => findYouTube(record, ytApiKey)} style={{
                background:`linear-gradient(135deg, ${color}, ${color}88)`,
                color:"#000", fontSize:9, letterSpacing:2, padding:"9px 14px",
                borderRadius:8, fontFamily:"Georgia,serif", fontWeight:700,
              }}>◆ FIND VIDEO</button>
            )}

            <button className="tap" onClick={() => window.open(`https://www.discogs.com${record.uri}`, "_blank")} style={{
              ...glass(), color:"rgba(255,255,255,0.4)", fontSize:9, letterSpacing:2,
              padding:"9px 12px", borderRadius:8, fontFamily:"Georgia,serif",
            }}>DISCOGS →</button>

            <button className="tap" onClick={() => { setRecord(null); setYtVideo(null); digDiscogs(); }} style={{
              background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
              color:"rgba(255,255,255,0.4)", fontSize:9, letterSpacing:2, padding:"9px 12px",
              borderRadius:8, fontFamily:"Georgia,serif",
            }}>↻ SKIP</button>
          </div>
        </div>
      )}

      {/* ── SPIN BUTTON ── */}
      <button className="tap" onClick={digDiscogs} disabled={loading} style={{
        width:"100%", padding:"19px", fontSize:15, fontWeight:900,
        letterSpacing:6, fontFamily:"Georgia,serif", borderRadius:12,
        background: loading ? "rgba(255,255,255,0.04)" : `linear-gradient(135deg, ${color}, ${color}88)`,
        color: loading ? "rgba(255,255,255,0.12)" : "#000",
        boxShadow: loading ? "none" : `0 8px 30px ${color}44`,
        animation: loading ? "pulse 1.4s infinite" : "none",
        transition:"all 0.2s",
      }}>
        {loading ? "◆  DIGGING THE CRATES  ◆" : isCustom ? "◆  SEARCH THE CRATES  ◆" : "◆  SPIN THE RECORD  ◆"}
      </button>

      <div style={{ fontSize:8, color:"rgba(255,255,255,0.07)", letterSpacing:3, fontFamily:"Georgia,serif" }}>
        SPIN → YOUTUBE → MP3 → LOGIC PRO
      </div>

      {/* ── YOUTUBE API KEY ── */}
      <div style={{ ...glass({ borderColor: ytApiKey ? `${color}44` : "rgba(255,215,0,0.18)" }), width:"100%", padding:"14px 16px" }}>
        <div style={{ fontSize:8, color: ytApiKey ? color : "rgba(255,215,0,0.6)", letterSpacing:3, marginBottom:7, fontFamily:"Georgia,serif" }}>
          {ytApiKey ? "✓ YOUTUBE API ACTIVE — AUTO VIDEO SEARCH ON" : "⚙ YOUTUBE API KEY — ENABLES AUTO VIDEO SEARCH"}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input type="password" value={ytApiKey}
            onChange={e => { setYtApiKey(e.target.value); setError(""); }}
            placeholder="Paste AIzaSy... key here"
            style={{
              flex:1, background:"rgba(0,0,0,0.45)",
              border: ytApiKey ? `1px solid ${color}44` : "1px solid rgba(255,255,255,0.1)",
              borderRadius:8, color:"#fff", fontSize:11,
              fontFamily:"monospace", padding:"10px 12px", boxSizing:"border-box",
            }}
          />
          {ytApiKey && (
            <button onClick={() => { setYtApiKey(""); setYtVideo(null); }} style={{
              background:"rgba(255,50,50,0.12)", border:"1px solid rgba(255,50,50,0.25)",
              borderRadius:8, color:"rgba(255,100,100,0.7)", fontSize:12,
              padding:"0 14px", cursor:"pointer",
            }}>✕</button>
          )}
        </div>
        <div style={{ fontSize:7, color:"rgba(255,255,255,0.12)", marginTop:6, fontFamily:"Georgia,serif", letterSpacing:1 }}>
          🔒 Stays in this session only · never stored or sent anywhere
        </div>
      </div>

      {/* ── HISTORY ── */}
      {history.length > 1 && (
        <div style={{ width:"100%" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }}/>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.15)", letterSpacing:4, fontFamily:"Georgia,serif" }}>PREVIOUS SPINS</div>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.05)" }}/>
          </div>
          {history.slice(1).map((r, i) => (
            <div key={i} className="hist" onClick={() => { setRecord(r); setYtVideo(null); if(ytApiKey) findYouTube(r, ytApiKey); }} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"8px 12px", marginBottom:3,
              background:"rgba(255,255,255,0.03)",
              border:"1px solid rgba(255,255,255,0.05)",
              borderRadius:8, cursor:"pointer",
              opacity: Math.max(0.2, 1 - i * 0.08),
              transition:"all 0.15s",
            }}>
              <div style={{ minWidth:0, overflow:"hidden" }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)", fontFamily:"Georgia,serif" }}>{r.title}</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.22)", fontFamily:"Georgia,serif" }}> — {r.artist}</span>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, marginLeft:8 }}>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.18)", fontFamily:"Georgia,serif" }}>{r.year}</span>
                <button onClick={e => { e.stopPropagation(); window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((r.artist||"")+" "+(r.title||""))}`, "_blank"); }} style={{
                  background:"#bb0000", border:"none", color:"#fff",
                  fontSize:7, padding:"3px 7px", borderRadius:4, cursor:"pointer",
                }}>▶</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useCallback } from "react";

const DISCOGS_GENRES = {
  hiphop:  { style: ["Hip Hop","Funk","Soul","Breakbeat","Boom Bap","Electro"],        genre: "Hip Hop" },
  rave:    { style: ["Hardcore","Rave","Jungle","Drum n Bass","Breakbeat Hardcore"],    genre: "Electronic" },
  rnb:     { style: ["Rhythm & Blues","Soul","Funk","Disco","Boogie"],                  genre: "Funk / Soul" },
  house:   { style: ["House","Deep House","Chicago House","Acid House","Garage House"], genre: "Electronic" },
  newwave: { style: ["Synth-pop","New Wave","Post-Punk","Sophisti-Pop","Electro"],      genre: "Electronic" },
  jazz:    { style: ["Bop","Hard Bop","Soul Jazz","Free Jazz","Fusion","Modal"],        genre: "Jazz" },
  latin:   { style: ["Latin Jazz","Salsa","Cumbia","Boogaloo","Afrobeat","Samba"],      genre: "Latin" },
  reggae:  { style: ["Reggae","Dub","Roots Reggae","Dancehall","Rocksteady"],           genre: "Reggae" },
  psych:   { style: ["Psychedelic Rock","Krautrock","Prog Rock","Garage Rock"],         genre: "Rock" },
  library: { style: ["Library","Score","Background Music","Soundtrack"],                genre: "Stage & Screen" },
  african: { style: ["Afrobeat","Highlife","Juju","Soukous","Mbalax"],                  genre: "African" },
  custom:  { style: [], genre: "" },
};

const MODES = [
  { key: "hiphop",  label: "HIP-HOP",  sub: "Breaks & Soul"    },
  { key: "rave",    label: "RAVE",      sub: "Hardcore & Jungle" },
  { key: "rnb",     label: "R&B",       sub: "Soul & Funk"       },
  { key: "house",   label: "HOUSE",     sub: "Deep & Classic"    },
  { key: "newwave", label: "NEW WAVE",  sub: "Synth & Post-Punk" },
  { key: "jazz",    label: "JAZZ",      sub: "Bop to Fusion"     },
  { key: "latin",   label: "LATIN",     sub: "Global Rhythms"    },
  { key: "reggae",  label: "REGGAE",    sub: "Roots & Dub"       },
  { key: "psych",   label: "PSYCH",     sub: "Rock & Krautrock"  },
  { key: "library", label: "LIBRARY",   sub: "Rare Soundtracks"  },
  { key: "african", label: "AFRICAN",   sub: "Afrobeat & More"   },
  { key: "custom",  label: "CUSTOM",    sub: "Any Genre"         },
];

const SPLAT_DATA = [
  { left:"2%",   top:"5%",   w:180, opacity:0.55, rot:15  },
  { left:"80%",  top:"1%",   w:140, opacity:0.50, rot:200 },
  { left:"88%",  top:"45%",  w:200, opacity:0.60, rot:90  },
  { left:"0%",   top:"68%",  w:160, opacity:0.55, rot:310 },
  { left:"42%",  top:"82%",  w:120, opacity:0.45, rot:45  },
  { left:"58%",  top:"10%",  w:100, opacity:0.40, rot:180 },
  { left:"18%",  top:"38%",  w:90,  opacity:0.45, rot:270 },
  { left:"91%",  top:"78%",  w:110, opacity:0.50, rot:130 },
  { left:"33%",  top:"55%",  w:80,  opacity:0.40, rot:20  },
  { left:"70%",  top:"62%",  w:90,  opacity:0.45, rot:340 },
];

function Splat({ left, top, w, opacity, rot }) {
  return (
    <svg style={{ position:"absolute", left, top, width:w, height:w, opacity, transform:`rotate(${rot}deg)`, overflow:"visible", pointerEvents:"none" }} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="16" fill="#cc0000"/>
      <ellipse cx="50" cy="76" rx="4" ry="13" fill="#aa0000"/>
      <ellipse cx="61" cy="71" rx="3" ry="9"  fill="#bb0000"/>
      <ellipse cx="39" cy="73" rx="2" ry="7"  fill="#990000"/>
      <circle cx="27" cy="34" r="4"   fill="#cc0000"/>
      <circle cx="73" cy="29" r="3"   fill="#bb0000"/>
      <circle cx="79" cy="57" r="5"   fill="#cc0000"/>
      <circle cx="19" cy="61" r="3"   fill="#aa0000"/>
      <circle cx="64" cy="19" r="2"   fill="#cc0000"/>
      <circle cx="34" cy="21" r="2"   fill="#bb0000"/>
      <circle cx="83" cy="41" r="2"   fill="#cc0000"/>
      <circle cx="14" cy="44" r="1.5" fill="#cc0000"/>
      <circle cx="86" cy="69" r="1"   fill="#aa0000"/>
      <circle cx="54" cy="14" r="1.5" fill="#cc0000"/>
      <path d="M50 66 Q51 78 50 92" stroke="#880000" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M61 64 Q62 73 60 81" stroke="#770000" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function BloodDrips() {
  const drips = [
    { left:"12%", h:180 }, { left:"71%", h:130 }, { left:"87%", h:80 },
    { left:"34%", h:55 },  { left:"55%", h:100 }, { left:"95%", h:60 },
  ];
  return (
    <>
      {SPLAT_DATA.map((s,i) => <Splat key={i} {...s} />)}
      {drips.map((d,i) => (
        <svg key={i} style={{ position:"absolute", top:0, left:d.left, width:6, opacity:0.55, pointerEvents:"none" }} viewBox={`0 0 4 ${d.h}`} height={d.h}>
          <path d={`M2 0 Q2.5 ${d.h*0.4} 2 ${d.h*0.75} Q1.5 ${d.h*0.9} 2 ${d.h}`} stroke="#cc0000" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <circle cx="2" cy={d.h} r="4" fill="#cc0000"/>
        </svg>
      ))}
    </>
  );
}

function VinylRecord({ spinning, record, loading }) {
  return (
    <div style={{ position:"relative", width:280, height:280, margin:"0 auto", flexShrink:0 }}>
      <style>{`
        @keyframes vinylSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .vinyl { animation: ${spinning||loading ? "vinylSpin 1.8s linear infinite" : "none"}; width:280px; height:280px; }
      `}</style>
      <svg className="vinyl" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="vg2" cx="38%" cy="32%" r="68%">
            <stop offset="0%"   stopColor="#2e2e2e"/>
            <stop offset="20%"  stopColor="#0a0a0a"/>
            <stop offset="55%"  stopColor="#181818"/>
            <stop offset="100%" stopColor="#1e1e1e"/>
          </radialGradient>
          <radialGradient id="shine2" cx="28%" cy="22%" r="52%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.2)"/>
            <stop offset="50%"  stopColor="rgba(255,255,255,0.03)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <clipPath id="lclip">
            <circle cx="140" cy="140" r="56"/>
          </clipPath>
        </defs>
        <circle cx="140" cy="140" r="139" fill="#040404" stroke="#1a1a1a" strokeWidth="1"/>
        <circle cx="140" cy="140" r="137" fill="url(#vg2)"/>
        {[126,118,110,102,94,86,78,71,65,59].map((r,i) => (
          <circle key={i} cx="140" cy="140" r={r} fill="none" stroke="rgba(255,255,255,0.032)" strokeWidth="0.9"/>
        ))}
        <circle cx="140" cy="140" r="137" fill="url(#shine2)"/>
        <circle cx="140" cy="140" r="58" fill="none" stroke="#cc0000" strokeWidth="1.5" opacity="0.5"/>
        <image href="/Logo.png" x="84" y="84" width="112" height="112" clipPath="url(#lclip)" preserveAspectRatio="xMidYMid slice"/>
        <circle cx="140" cy="140" r="5" fill="#000" stroke="#1a1a1a" strokeWidth="0.5"/>
        <circle cx="140" cy="140" r="137" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2"/>
        {record && !loading && (
          <>
            <text x="140" y="224" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.22)" fontFamily="'Courier New',monospace" letterSpacing="1">
              {(record.title||"").length>24?(record.title||"").slice(0,23)+"…":(record.title||"")}
            </text>
            <text x="140" y="233" textAnchor="middle" fontSize="6" fill="rgba(204,0,0,0.45)" fontFamily="'Courier New',monospace">
              {(record.artist||"").length>28?(record.artist||"").slice(0,27)+"…":(record.artist||"")}
            </text>
          </>
        )}
        {loading && (
          <text x="140" y="228" textAnchor="middle" fontSize="7" fill="rgba(204,0,0,0.5)" fontFamily="'Courier New',monospace" letterSpacing="2">DIGGING...</text>
        )}
      </svg>
    </div>
  );
}

function Btn({ onClick, disabled, children, primary, style={} }) {
  const [p, setP] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
      onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)}
      style={{
        background: primary ? (p?"#aa0000":"linear-gradient(135deg,#cc0000,#880000)") : "rgba(255,255,255,0.04)",
        backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)",
        border: p||primary ? "1px solid #cc0000" : "1px solid rgba(255,255,255,0.1)",
        borderRadius:8, cursor:disabled?"wait":"pointer",
        color: primary?"#fff" : p?"#ff3333":"rgba(255,255,255,0.65)",
        fontSize:10, letterSpacing:2, padding:"9px 14px",
        fontFamily:"'CaptureIt','Courier New',monospace", fontWeight:700,
        boxShadow: p ? "0 0 14px rgba(204,0,0,0.5),inset 0 0 8px rgba(204,0,0,0.1)" : primary?"0 4px 16px rgba(204,0,0,0.35)":"none",
        transition:"all 0.12s", ...style,
      }}>{children}</button>
  );
}

function YearStep({ label, value, onChange }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{ fontSize:8, color:"rgba(204,0,0,0.5)", letterSpacing:4, marginBottom:4, fontFamily:"'CaptureIt','Courier New',monospace" }}>{label}</div>
      <Btn onClick={()=>onChange(value+1)} style={{ width:"100%", borderRadius:"8px 8px 0 0", borderBottom:"none", fontSize:14, padding:"6px 0" }}>▲</Btn>
      <div style={{ width:"100%", padding:"11px 0", textAlign:"center", background:"rgba(0,0,0,0.6)", border:"1px solid rgba(204,0,0,0.2)", fontSize:22, fontWeight:900, color:"#fff", fontFamily:"'CaptureIt','Courier New',monospace", letterSpacing:3 }}>{value}</div>
      <Btn onClick={()=>onChange(value-1)} style={{ width:"100%", borderRadius:"0 0 8px 8px", borderTop:"none", fontSize:14, padding:"6px 0" }}>▼</Btn>
    </div>
  );
}

const glass = { background:"rgba(255,255,255,0.03)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12 };

export default function SampleRoulette() {
  const [modeKey, setModeKey]   = useState("hiphop");
  const [fromYear, setFromYear] = useState(1980);
  const [toYear, setToYear]     = useState(1995);
  const [record, setRecord]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory]   = useState([]);
  const [error, setError]       = useState("");
  const [customGenre, setCustomGenre] = useState("");
  const [ytApiKey, setYtApiKey] = useState("");
  const [ytVideo, setYtVideo]   = useState(null);
  const [ytLoading, setYtLoading] = useState(false);
  const [status, setStatus]     = useState("");
  const [copied, setCopied]     = useState(false);

  const isCustom = modeKey === "custom";

  const switchMode = (key) => {
    setModeKey(key); setRecord(null); setError(""); setYtVideo(null); setStatus("");
    const def = { hiphop:[1980,1995],rave:[1990,1995],rnb:[1980,1994],house:[1984,1995],newwave:[1979,1990],jazz:[1955,1975],latin:[1965,1980],reggae:[1968,1985],psych:[1966,1978],library:[1965,1980],african:[1970,1985],custom:[1970,1995] };
    setFromYear(def[key][0]); setToYear(def[key][1]);
  };

  const digDiscogs = useCallback(async () => {
    setLoading(true); setSpinning(true); setRecord(null); setYtVideo(null); setError(""); setStatus("");
    try {
      const cfg = DISCOGS_GENRES[modeKey];
      let url;
      if (isCustom && customGenre.trim()) {
        const pg = Math.floor(Math.random()*40)+1;
        url = `https://api.discogs.com/database/search?q=${encodeURIComponent(customGenre.trim())}&format=Vinyl&type=release&per_page=100&page=${pg}`;
      } else {
        const style = cfg.style[Math.floor(Math.random()*cfg.style.length)];
        const deep = Math.random()>0.3;
        const pg = deep ? Math.floor(Math.random()*35)+5 : Math.floor(Math.random()*4)+1;
        setStatus(deep?"GOING DEEP...":"FINDING A BANGER...");
        url = `https://api.discogs.com/database/search?style=${encodeURIComponent(style)}&genre=${encodeURIComponent(cfg.genre)}&format=Vinyl&type=release&per_page=100&page=${pg}`;
      }
      const res = await fetch(url, { headers:{"User-Agent":"SampleRoulette/1.0"} });
      if (!res.ok) throw new Error(`Discogs ${res.status}`);
      const data = await res.json();
      let results = data.results||[];
      const filtered = results.filter(r => { if(!r.year) return true; const y=parseInt(r.year); return y>=fromYear&&y<=toYear; });
      const pool = filtered.length>0?filtered:results;
      if (!pool.length) { setError("NOTHING FOUND — TRY WIDER YEARS"); setLoading(false); setSpinning(false); setStatus(""); return; }
      const picked = pool[Math.floor(Math.random()*pool.length)];
      const parts  = (picked.title||"").split(" - ");
      const rec = {
        artist: parts[0]?.trim()||"Unknown",
        title:  parts.slice(1).join(" - ").trim()||picked.title||"Unknown",
        year:   picked.year||`${fromYear}s`,
        label:  Array.isArray(picked.label)?picked.label[0]:picked.label||"",
        country:picked.country||"",
        style:  Array.isArray(picked.style)?picked.style.slice(0,2).join(" · "):"",
        thumb:  picked.cover_image||picked.thumb||"",
        uri:    picked.uri||"",
        catno:  picked.catno||"",
        id:     picked.id,
      };
      setTimeout(async () => {
        setRecord(rec);
        setHistory(prev=>[rec,...prev.filter(h=>h.id!==rec.id)].slice(0,12));
        setLoading(false); setSpinning(false); setStatus("");
        if (ytApiKey) findYouTube(rec, ytApiKey);
      }, 1400);
    } catch(e) { setError(`ERROR: ${e.message}`); setLoading(false); setSpinning(false); setStatus(""); }
  }, [modeKey, fromYear, toYear, customGenre, ytApiKey, isCustom]);

  const findYouTube = async (rec, key) => {
    if (!key) { setError("PASTE YOUR YOUTUBE API KEY BELOW"); return; }
    setYtLoading(true); setYtVideo(null);
    try {
      const q = encodeURIComponent(`${rec.artist} ${rec.title}`);
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${q}&type=video&order=viewCount&maxResults=1&key=${key}`);
      const data = await res.json();
      if (data.error) { setError(`YOUTUBE: ${data.error.message}`); setYtLoading(false); return; }
      const item = data.items?.[0];
      if (item) setYtVideo({ id:item.id.videoId, title:item.snippet.title, channel:item.snippet.channelTitle });
    } catch(e) { setError("YOUTUBE SEARCH FAILED"); }
    setYtLoading(false);
  };

  const openYT = () => {
    if (ytVideo) window.open(`https://www.youtube.com/watch?v=${ytVideo.id}`,"_blank");
    else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((record.artist||"")+" "+(record.title||""))}`, "_blank");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#060606", color:"#fff", fontFamily:"'CaptureIt','Courier New',monospace", position:"relative", overflow:"hidden" }}>
      <style>{`
        @font-face{font-family:'CaptureIt';src:url('/Capture_it.ttf') format('truetype');font-weight:normal;font-style:normal}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        html,body,#root{background:#060606;margin:0;padding:0;min-height:100vh}
        *{box-sizing:border-box}
        input::placeholder{color:rgba(255,255,255,0.18)}
        input:focus{outline:none;border-color:rgba(204,0,0,0.5)!important}
        ::-webkit-scrollbar{width:0}
        .hist:hover{background:rgba(204,0,0,0.07)!important;border-left-color:#cc0000!important}
      `}</style>

      {/* Real splatter background */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <img src="/splatter.png" alt="" style={{
          width:"100%", height:"100%", objectFit:"cover",
          opacity:0.75, mixBlendMode:"screen",
        }}/>
        <BloodDrips />
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:960, margin:"0 auto", padding:"28px 36px 60px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ fontSize:8, color:"rgba(204,0,0,0.4)", letterSpacing:8, marginBottom:8 }}>◆ EST. 2024 · DISCOGS · 15M+ RECORDS ◆</div>
          <div style={{ fontSize:52, fontWeight:900, letterSpacing:10, color:"#cc0000", textTransform:"uppercase", textShadow:"0 0 60px rgba(204,0,0,0.8), 0 3px 0 #660000, 2px 2px 0 #000", fontFamily:"'CaptureIt','Courier New',monospace" }}>
            SAMPLE ROULETTE
          </div>
          <div style={{ fontSize:9, color:"rgba(255,255,255,0.12)", letterSpacing:6, marginTop:6 }}>RARE CUTS · ALL ERAS · WORLDWIDE</div>
        </div>

        {/* TWO COL */}
        <div style={{ display:"flex", gap:32, alignItems:"flex-start", flexWrap:"wrap" }}>

          {/* LEFT — Vinyl + status */}
          <div style={{ flex:"0 0 300px", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
            <VinylRecord spinning={spinning} loading={loading} record={record} />
            {status && <div style={{ fontSize:9, color:"#cc0000", letterSpacing:4, animation:"pulse 1s infinite" }}>{status}</div>}
          </div>

          {/* RIGHT — Controls */}
          <div style={{ flex:1, minWidth:260, display:"flex", flexDirection:"column", gap:14 }}>

            {/* Genre grid */}
            <div style={{ ...glass, padding:10 }}>
              <div style={{ fontSize:8, color:"rgba(204,0,0,0.45)", letterSpacing:5, marginBottom:8, textAlign:"center" }}>◆ SELECT GENRE ◆</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5 }}>
                {MODES.map(m => {
                  const [p,setP] = useState(false);
                  return (
                    <button key={m.key} onClick={()=>switchMode(m.key)}
                      onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)}
                      style={{
                        padding:"7px 3px", fontSize:8, letterSpacing:0.5,
                        fontFamily:"'CaptureIt','Courier New',monospace", fontWeight:700, cursor:"pointer",
                        border:`1px solid ${modeKey===m.key||p?"#cc0000":"rgba(255,255,255,0.06)"}`,
                        borderRadius:6,
                        background:modeKey===m.key?"rgba(204,0,0,0.1)":"rgba(255,255,255,0.02)",
                        color:modeKey===m.key?"#ff3333":p?"#cc0000":"rgba(255,255,255,0.32)",
                        boxShadow:p?"0 0 10px rgba(204,0,0,0.3)":"none",
                        transition:"all 0.12s", lineHeight:1.4,
                      }}>
                      {m.label}
                      <div style={{ fontSize:6, opacity:0.5, marginTop:1 }}>{m.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom */}
            {isCustom && (
              <div style={{ ...glass, padding:"12px 14px", animation:"fadeUp 0.3s ease" }}>
                <div style={{ fontSize:8, color:"rgba(204,0,0,0.45)", letterSpacing:3, marginBottom:6 }}>TYPE ANY GENRE — LOFI · BOSSA NOVA · ANYTHING</div>
                <input type="text" value={customGenre} onChange={e=>setCustomGenre(e.target.value)}
                  placeholder="e.g. rare soul breaks, afrobeat..."
                  style={{ width:"100%", background:"rgba(0,0,0,0.5)", border:"1px solid rgba(204,0,0,0.2)", borderRadius:8, color:"#fff", fontSize:12, fontFamily:"'CaptureIt','Courier New',monospace", padding:"10px 12px" }}
                />
              </div>
            )}

            {/* Years */}
            <div style={{ ...glass, padding:"14px" }}>
              <div style={{ fontSize:8, color:"rgba(204,0,0,0.45)", letterSpacing:5, marginBottom:10, textAlign:"center" }}>◆ SET YOUR ERA — ANY YEAR ◆</div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <YearStep label="FROM" value={fromYear} onChange={v=>{setFromYear(v);setRecord(null);}} />
                <div style={{ color:"rgba(204,0,0,0.3)", fontSize:18, flexShrink:0 }}>—</div>
                <YearStep label="TO" value={toYear} onChange={v=>{setToYear(v);setRecord(null);}} />
              </div>
            </div>

            {/* SPIN */}
            <Btn primary onClick={digDiscogs} disabled={loading} style={{
              width:"100%", padding:"18px", fontSize:16, letterSpacing:8, borderRadius:10,
              boxShadow: loading?"none":"0 6px 30px rgba(204,0,0,0.35)",
              animation: loading?"pulse 1.2s infinite":"none",
            }}>
              {loading ? "◆  DIGGING THE CRATES  ◆" : isCustom ? "◆  SEARCH THE CRATES  ◆" : "◆  SPIN THE RECORD  ◆"}
            </Btn>

            {error && <div style={{ fontSize:10, color:"#ff4444", letterSpacing:2, textAlign:"center", animation:"fadeUp 0.2s" }}>{error}</div>}
          </div>
        </div>

        {/* RECORD CARD */}
        {record && !loading && (
          <div style={{ ...glass, border:"1px solid rgba(204,0,0,0.25)", padding:"20px 24px", animation:"fadeUp 0.4s ease", boxShadow:"0 0 40px rgba(204,0,0,0.07)" }}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start", marginBottom:14, flexWrap:"wrap" }}>
              {record.thumb && (
                <img src={record.thumb} alt="" style={{ width:72, height:72, objectFit:"cover", borderRadius:6, border:"1px solid rgba(204,0,0,0.3)", flexShrink:0 }}
                  onError={e=>e.target.style.display="none"} />
              )}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, color:"#cc0000", letterSpacing:4, marginBottom:4 }}>{record.year}{record.country?` · ${record.country}`:""}</div>
                <div style={{ fontSize:22, fontWeight:900, lineHeight:1.15, marginBottom:4, letterSpacing:1 }}>{record.title}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>{record.artist}</div>
                {record.label && <div style={{ fontSize:8, color:"rgba(255,255,255,0.18)", letterSpacing:1 }}>🏷 {record.label}{record.catno?` · ${record.catno}`:""}</div>}
                {record.style && <div style={{ fontSize:8, color:"rgba(204,0,0,0.35)", marginTop:2 }}>{record.style}</div>}
              </div>
            </div>

            {ytLoading && <div style={{ fontSize:9, color:"rgba(204,0,0,0.5)", letterSpacing:3, marginBottom:12, animation:"pulse 1s infinite" }}>◆ FINDING MOST VIEWED VIDEO...</div>}
            {ytVideo && !ytLoading && (
              <div style={{ background:"rgba(204,0,0,0.06)", border:"1px solid rgba(204,0,0,0.18)", borderRadius:8, padding:"8px 12px", marginBottom:14 }}>
                <div style={{ fontSize:8, color:"rgba(204,0,0,0.65)", letterSpacing:2, marginBottom:2 }}>▶ MOST VIEWED ON YOUTUBE</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.55)", lineHeight:1.4 }}>{ytVideo.title.length>65?ytVideo.title.slice(0,64)+"…":ytVideo.title}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.22)", marginTop:2 }}>{ytVideo.channel}</div>
              </div>
            )}

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn primary onClick={openYT} style={{ boxShadow:"0 4px 14px rgba(200,0,0,0.3)" }}>▶ YOUTUBE</Btn>

              {ytVideo && (
                <Btn onClick={()=>{ navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${ytVideo.id}`).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); }}
                  style={{ borderColor:copied?"#cc0000":undefined, color:copied?"#ff3333":undefined }}>
                  {copied?"✓ COPIED!":"⧉ COPY URL"}
                </Btn>
              )}

              {ytVideo && <Btn onClick={()=>window.open("https://convertytmp3.org","_blank")}>🇺🇸 US MP3</Btn>}
              {ytVideo && <Btn onClick={()=>window.open("https://media.ytmp3.gg/tools/youtube-to-mp3-320kbps-converter/nuurya","_blank")}>🇪🇺 EU MP3</Btn>}

              {ytApiKey && !ytVideo && !ytLoading && (
                <Btn onClick={()=>findYouTube(record,ytApiKey)} style={{ borderColor:"rgba(204,0,0,0.4)", color:"#ff4444" }}>◆ FIND VIDEO</Btn>
              )}

              <Btn onClick={()=>window.open(`https://www.discogs.com${record.uri}`,"_blank")}>DISCOGS →</Btn>
              <Btn onClick={()=>{ setRecord(null); setYtVideo(null); digDiscogs(); }}>↻ SKIP</Btn>
            </div>
          </div>
        )}

        {/* YOUTUBE API KEY */}
        <div style={{ ...glass, border:ytApiKey?"1px solid rgba(204,0,0,0.25)":"1px solid rgba(255,255,255,0.06)", padding:"14px 16px" }}>
          <div style={{ fontSize:8, color:ytApiKey?"#cc0000":"rgba(255,255,255,0.18)", letterSpacing:4, marginBottom:7 }}>
            {ytApiKey?"✓ YOUTUBE API ACTIVE — AUTO VIDEO SEARCH ON":"⚙ PASTE YOUTUBE API KEY TO ENABLE AUTO VIDEO SEARCH"}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <input type="password" value={ytApiKey} onChange={e=>{setYtApiKey(e.target.value);setError("");}}
              placeholder="Paste AIzaSy... key here"
              style={{ flex:1, background:"rgba(0,0,0,0.55)", border:ytApiKey?"1px solid rgba(204,0,0,0.25)":"1px solid rgba(255,255,255,0.07)", borderRadius:8, color:"#fff", fontSize:11, fontFamily:"monospace", padding:"10px 12px" }}
            />
            {ytApiKey && <Btn onClick={()=>{setYtApiKey("");setYtVideo(null);}}>✕</Btn>}
          </div>
          <div style={{ fontSize:7, color:"rgba(255,255,255,0.08)", marginTop:6, letterSpacing:1 }}>🔒 SESSION ONLY · NEVER STORED · NEVER SENT ANYWHERE</div>
        </div>

        <div style={{ fontSize:8, color:"rgba(255,255,255,0.05)", letterSpacing:5, textAlign:"center" }}>SPIN → YOUTUBE → MP3 → LOGIC PRO</div>

        {/* HISTORY */}
        {history.length > 1 && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <div style={{ flex:1, height:1, background:"rgba(204,0,0,0.12)" }}/>
              <div style={{ fontSize:8, color:"rgba(204,0,0,0.35)", letterSpacing:5 }}>PREVIOUS SPINS</div>
              <div style={{ flex:1, height:1, background:"rgba(204,0,0,0.12)" }}/>
            </div>
            {history.slice(1).map((r,i) => (
              <div key={i} className="hist" onClick={()=>{ setRecord(r); setYtVideo(null); if(ytApiKey) findYouTube(r,ytApiKey); }} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"8px 12px", marginBottom:3, background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.04)", borderLeft:"2px solid rgba(204,0,0,0.18)",
                borderRadius:6, cursor:"pointer", opacity:Math.max(0.2,1-i*0.08), transition:"all 0.15s",
              }}>
                <div style={{ minWidth:0, overflow:"hidden" }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{r.title}</span>
                  <span style={{ fontSize:10, color:"rgba(255,255,255,0.18)" }}> — {r.artist}</span>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0, marginLeft:8 }}>
                  <span style={{ fontSize:9, color:"rgba(204,0,0,0.28)" }}>{r.year}</span>
                  <button onClick={e=>{ e.stopPropagation(); window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((r.artist||"")+" "+(r.title||""))}`, "_blank"); }}
                    style={{ background:"#aa0000", border:"none", color:"#fff", fontSize:7, padding:"3px 7px", borderRadius:4, cursor:"pointer" }}>▶</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

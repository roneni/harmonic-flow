"use client";

import { useState, useEffect, useRef } from "react";

export const BRUSHED_METAL_BG = [
  "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 3px)",
  "linear-gradient(180deg, #363636 0%, #272727 22%, #2e2e2e 50%, #272727 78%, #343434 100%)",
].join(", ");

const GREEN = "#ccff00";

function PhillipsScrew({ uid }: { uid: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={`s-${uid}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="60%" stopColor="#222" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
      </defs>
      <circle cx="10" cy="11" r="9" fill="rgba(0,0,0,0.5)" />
      <circle cx="10" cy="10" r="9" fill="#111" stroke="#333" strokeWidth="0.8" />
      <circle cx="10" cy="10" r="7.5" fill={`url(#s-${uid})`} />
      <path d="M4,10 A6,6,0,0,1,16,10" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
      <rect x="3"   y="9.2"  width="14"  height="1.6" rx="0.5" fill="#080808" />
      <rect x="9.2" y="3"    width="1.6" height="14"  rx="0.5" fill="#080808" />
      <rect x="3"   y="9.2"  width="14"  height="0.5" rx="0.3" fill="#2a2a2a" />
      <rect x="9.2" y="3"    width="0.5" height="14"  rx="0.3" fill="#2a2a2a" />
    </svg>
  );
}

type State = "idle" | "processing" | "complete";

const SEGS = 24;
function segCol(i: number, filled: number) {
  if (i >= filled) return { bg: "#0c0c0c", bdr: "#1a1a1a", sh: "inset 0 1px 3px #000" };
  const p = i / SEGS;
  if (p < 0.55) return { bg: "#84cc16", bdr: "#4a7a0a", sh: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 6px rgba(132,204,22,0.9)" };
  if (p < 0.78) return { bg: "#f59e0b", bdr: "#a06808", sh: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 6px rgba(245,158,11,0.9)" };
  return             { bg: "#ef4444", bdr: "#9e1e1e", sh: "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 6px rgba(239,68,68,0.9)" };
}
function barCol(v: number) { return v > 0.82 ? "#ef4444" : v > 0.55 ? "#f59e0b" : "#84cc16"; }

export function StudioInputUpload() {
  const [state,    setState]    = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  const [bars,     setBars]     = useState<number[]>(Array(10).fill(0.08));
  const [ledOn,    setLedOn]    = useState(true);
  const tRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state !== "processing") return;
    setProgress(0);
    tRef.current = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(tRef.current!); setState("complete"); return 100; } return p + 1; });
      setBars(Array(10).fill(0).map(() => 0.1 + Math.random() * 0.9));
    }, 60);
    return () => clearInterval(tRef.current!);
  }, [state]);

  useEffect(() => {
    if (state !== "complete") { setLedOn(true); return; }
    let n = 0;
    fRef.current = setInterval(() => { setLedOn(v => !v); if (++n >= 8) { clearInterval(fRef.current!); setLedOn(true); } }, 260);
    return () => clearInterval(fRef.current!);
  }, [state]);

  const activate  = () => { if (state === "idle") setState("processing"); else if (state === "complete") { setState("idle"); setProgress(0); setBars(Array(10).fill(0.08)); } };
  const drop      = (e: React.DragEvent) => { e.preventDefault(); if (state === "idle") setState("processing"); };
  const filled    = Math.round((progress / 100) * SEGS);
  const sigActive = !(state === "complete" && !ledOn);

  // Green glow intensity by state
  const glow = state === "idle"
    ? `0 0 0 4px ${GREEN}66, 0 0 18px 6px ${GREEN}99, 0 0 40px 14px ${GREEN}44, 0 0 80px 28px ${GREEN}22`
    : state === "processing"
    ? `0 0 0 5px ${GREEN}cc, 0 0 24px 8px ${GREEN}ee, 0 0 56px 20px ${GREEN}77, 0 0 110px 40px ${GREEN}33`
    : ledOn
    ? `0 0 0 6px ${GREEN}, 0 0 28px 10px ${GREEN}ff, 0 0 70px 26px ${GREEN}99, 0 0 140px 54px ${GREEN}44`
    : `0 0 0 2px ${GREEN}22`;

  return (
    <section
      aria-label="Studio Input Upload"
      style={{
        background:   "linear-gradient(180deg,#3a3a38 0%,#282826 40%,#2e2e2c 60%,#242422 100%)",
        borderTop:    "2px solid #585856",
        borderBottom: "2px solid #141412",
        boxShadow:    "0 4px 20px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Rack rails */}
      <div style={{ height: 7, background: "linear-gradient(180deg,#111,#1e1e1c)", borderBottom: "1px solid #2a2a28" }} />

      {/* Centre the silver plate */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "clamp(16px,2vw,32px) clamp(20px,2.5vw,40px)" }}>

        {/* ═══ SILVER PLATE ═══ */}
        <div style={{
          position:      "relative",
          width:         "clamp(460px, 60vw, 740px)",
          background:    [
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0.035) 3px)",
            "linear-gradient(160deg, #dddbd5 0%, #c0beb8 18%, #d2d0ca 40%, #b8b6b0 62%, #cac8c2 80%, #d8d6d0 100%)",
          ].join(", "),
          borderRadius:  8,
          borderTop:     "2px solid #e8e6e0",
          borderLeft:    "2px solid #dedad4",
          borderRight:   "2px solid #929088",
          borderBottom:  "2px solid #868480",
          boxShadow:     "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.15), 4px 4px 18px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05)",
          padding:       "clamp(16px,2vw,24px)",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "clamp(8px,1vw,14px)",
        }}>

          {/* Corner screws — on the silver plate */}
          <span style={{ position:"absolute", top:10, left:10   }}><PhillipsScrew uid="tl" /></span>
          <span style={{ position:"absolute", top:10, right:10  }}><PhillipsScrew uid="tr" /></span>
          <span style={{ position:"absolute", bottom:10, left:10  }}><PhillipsScrew uid="bl" /></span>
          <span style={{ position:"absolute", bottom:10, right:10 }}><PhillipsScrew uid="br" /></span>

          {/* Header — engraved on silver */}
          <p style={{
            margin:0, color:"#1a1816",
            fontSize:"clamp(14px,1.5vw,20px)", fontWeight:800,
            letterSpacing:"0.25em", textTransform:"uppercase",
            fontFamily:"var(--font-mono)",
            textShadow:"0 1px 0 rgba(255,255,255,0.6), 0 -1px 0 rgba(0,0,0,0.2)",
          }}>
            Studio Input Upload
          </p>

          {/* Ring row: ring + SIGNAL INPUT indicator */}
          <div style={{ display:"flex", alignItems:"center", gap:"clamp(16px,2vw,28px)" }}>

            {/* ─── RING ASSEMBLY ─── */}
            <div style={{
              position:"relative",
              width:"clamp(360px,50vw,620px)",
              aspectRatio:"1",
              flexShrink:0,
              borderRadius:"50%",
              // Dark knurled outer band
              background:[
                "radial-gradient(circle at 40% 35%, rgba(100,100,95,0.4) 0%, transparent 50%)",
                "repeating-conic-gradient(from 0deg, #0e0e0c 0deg, #282826 3.5deg, #0e0e0c 7deg)",
              ].join(", "),
              boxShadow:[
                "0 16px 56px rgba(0,0,0,0.95)",
                "0  4px 16px rgba(0,0,0,0.80)",
                "inset 0  2px 0 rgba(255,255,255,0.05)",
                "inset 0 -2px 0 rgba(0,0,0,0.90)",
              ].join(", "),
            }}>

              {/* ── Lime-green glow ring — the #1 visual ── */}
              <div style={{
                position:"absolute",
                width:"82%", height:"82%",
                left:"9%", top:"9%",
                borderRadius:"50%",
                border:`7px solid ${GREEN}`,
                boxShadow:[
                  `0 0 0 2px ${GREEN}99`,
                  `0 0 18px 6px ${GREEN}dd`,
                  `0 0 40px 14px ${GREEN}88`,
                  `0 0 80px 28px ${GREEN}44`,
                  `inset 0 0 20px ${GREEN}22`,
                ].join(", "),
                pointerEvents:"none",
                zIndex:2,
              }} />

              {/* Bolt holes at diagonal corners */}
              {[45,135,225,315].map((deg,i) => {
                const r = ((deg-90)*Math.PI)/180;
                return (
                  <div key={i} style={{
                    position:"absolute", borderRadius:"50%",
                    width:"3.8%", height:"3.8%",
                    left:`${(50+43*Math.cos(r)-1.9).toFixed(1)}%`,
                    top: `${(50+43*Math.sin(r)-1.9).toFixed(1)}%`,
                    background:"radial-gradient(circle at 35% 30%,#2a2a28,#060604)",
                    border:"1px solid #1a1a18",
                    boxShadow:"inset 0 1px 4px rgba(0,0,0,0.95)",
                    zIndex:3,
                  }} />
                );
              })}

              {/* ── VU circle — inner display ── */}
              <div
                role="button" tabIndex={0}
                onClick={activate}
                onKeyDown={e => e.key==="Enter" && activate()}
                onDrop={drop} onDragOver={e => e.preventDefault()}
                aria-label={state==="idle"?"Click or drop XML":state==="processing"?`${progress}%`:"Complete"}
                style={{
                  position:"absolute",
                  width:"72%", height:"72%",
                  left:"14%", top:"14%",
                  borderRadius:"50%",
                  background:"radial-gradient(circle at 45% 38%, #1c1c1a 0%, #0e0e0c 50%, #020200 100%)",
                  border:`2px solid ${GREEN}66`,
                  boxShadow: glow,
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  cursor:state==="processing"?"default":"pointer",
                  transition:"box-shadow 0.5s ease",
                  outline:"none", overflow:"hidden",
                  zIndex:4,
                }}
              >
                {/* Tick marks */}
                <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 200 200" aria-hidden="true">
                  {Array.from({length:36},(_,i)=>{
                    const a=(i/36)*2*Math.PI-Math.PI/2, maj=i%9===0;
                    return <line key={i} x1={100+98*Math.cos(a)} y1={100+98*Math.sin(a)} x2={100+(maj?86:93)*Math.cos(a)} y2={100+(maj?86:93)*Math.sin(a)} stroke={maj?"#303030":"#1e1e1e"} strokeWidth={maj?1.8:1} />;
                  })}
                </svg>

                {/* Processing: VU bars */}
                {state==="processing" && (
                  <div style={{display:"flex",alignItems:"flex-end",gap:2,height:32,marginBottom:4,flexShrink:0}}>
                    {bars.map((v,i)=>(
                      <div key={i} style={{width:6,height:Math.max(3,Math.round(v*32)),background:barCol(v),borderRadius:1,boxShadow:`0 0 4px ${barCol(v)}`,flexShrink:0}} />
                    ))}
                  </div>
                )}

                {/* Idle: flat line */}
                {state==="idle" && <div style={{width:"36%",height:1,background:"#242422",marginBottom:10,flexShrink:0}} />}

                {/* Text content */}
                <div style={{textAlign:"center",padding:"0 12%",zIndex:1}}>
                  {state==="idle" && <>
                    <div style={{color:"#ffffff",fontSize:"clamp(7px,0.6vw,9px)",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:"var(--font-mono)",marginBottom:4}}>
                      Patch In Your Playlist
                    </div>
                    <div style={{color:"#666664",fontSize:"clamp(6px,0.5vw,8px)",letterSpacing:"0.07em",textTransform:"uppercase",fontFamily:"var(--font-mono)",lineHeight:1.8}}>
                      Drop XML<br/>(Rekordbox, Serato, Traktor)
                    </div>
                  </>}
                  {state==="processing" && <>
                    <div style={{color:"#ccff00",fontSize:"clamp(7px,0.58vw,9px)",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"var(--font-mono)",marginBottom:3,textShadow:`0 0 8px ${GREEN}`}}>
                      Analyzing<br/>Harmonics...
                    </div>
                    <div style={{color:"#ffffff",fontSize:"clamp(18px,2.2vw,28px)",fontWeight:700,fontFamily:"var(--font-mono)",lineHeight:1,textShadow:"0 0 12px rgba(255,255,255,0.5)"}}>
                      {progress}%
                    </div>
                  </>}
                  {state==="complete" && (
                    <div style={{color:"#ccff00",fontSize:"clamp(7px,0.62vw,9px)",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"var(--font-mono)",lineHeight:1.9,textShadow:`0 0 10px ${GREEN}`}}>
                      Optimization<br/>Complete
                    </div>
                  )}
                </div>

                {/* LED segment bar */}
                {state!=="idle" && (
                  <div style={{display:"flex",gap:"clamp(1px,0.12vw,2px)",marginTop:10,flexShrink:0}}>
                    {Array.from({length:SEGS},(_,i)=>{
                      const c=segCol(i,filled);
                      return <div key={i} style={{width:"clamp(3px,0.45vw,6px)",height:"clamp(9px,1vw,13px)",borderRadius:1.5,background:c.bg,border:`1px solid ${c.bdr}`,boxShadow:c.sh,transition:"background 0.06s",flexShrink:0}} />;
                    })}
                  </div>
                )}
              </div>
            </div>
            {/* end ring */}

            {/* SIGNAL INPUT — right of ring, on silver plate */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{
                width:14,height:14,borderRadius:"50%",
                border:"1px solid #484846",
                background:sigActive?"#84cc16":"#1a1a18",
                boxShadow:sigActive&&state!=="idle"?"0 0 10px rgba(132,204,22,0.95),0 0 22px rgba(132,204,22,0.5)":"none",
                animation:state==="idle"?"led-pulse 2.4s ease-in-out infinite":"none",
                transition:"background 0.15s,box-shadow 0.15s",
              }}/>
              <span style={{color:"#1e1c18",fontSize:8,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"var(--font-mono)",writingMode:"vertical-rl",transform:"rotate(180deg)",textShadow:"0 1px 0 rgba(255,255,255,0.5)"}}>
                Signal Input
              </span>
            </div>

          </div>
          {/* end ring row */}

          {/* PROCESSING — bottom-center of silver plate */}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{
              width:10,height:10,borderRadius:"50%",
              border:"1px solid #484846",
              background:state==="processing"?"#84cc16":"#1a1a18",
              boxShadow:state==="processing"?"0 0 10px rgba(132,204,22,0.95),0 0 22px rgba(132,204,22,0.5)":"none",
              transition:"background 0.2s,box-shadow 0.2s",flexShrink:0,
            }}/>
            <span style={{color:"#1e1c18",fontSize:9,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",fontFamily:"var(--font-mono)",textShadow:"0 1px 0 rgba(255,255,255,0.5)"}}>
              Processing
            </span>
          </div>

        </div>
        {/* end silver plate */}
      </div>

      <div style={{height:7,background:"linear-gradient(0deg,#111,#1e1e1c)",borderTop:"1px solid #2a2a28"}}/>
    </section>
  );
}

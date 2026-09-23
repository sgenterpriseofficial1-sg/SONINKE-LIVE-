import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Radio, Plus, Trash2, Play, Pause, SkipForward, Upload,
  ListVideo, Settings, Tv, Volume2, VolumeX, Clock3
} from "lucide-react";
import "./styles.css";

const initialQueue = [
  { id: crypto.randomUUID(), title: "Soninke TV — Welcome", type: "Animation", duration: "00:30", url: "", builtin: true },
  { id: crypto.randomUUID(), title: "Standby Animation", type: "Animation", duration: "01:00", url: "", builtin: true }
];

function App() {
  const [queue, setQueue] = useState(() => {
    try { return JSON.parse(localStorage.getItem("soninke-live-queue")) || initialQueue; }
    catch { return initialQueue; }
  });
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [tab, setTab] = useState("player");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const videoRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("soninke-live-queue", JSON.stringify(queue.map(({url, ...x}) => ({...x, url: ""}))));
  }, [queue]);

  const item = queue[current];

  const next = () => {
    if (!queue.length) return;
    setCurrent((i) => (i + 1) % queue.length);
    setPlaying(true);
  };

  const previous = () => {
    if (!queue.length) return;
    setCurrent((i) => (i - 1 + queue.length) % queue.length);
  };

  const addFiles = (files) => {
    const newItems = [...files].filter(f => f.type.startsWith("video/")).map(file => ({
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, ""),
      type: "Video",
      duration: "Local",
      url: URL.createObjectURL(file),
      builtin: false
    }));
    setQueue(q => [...q, ...newItems]);
    setFileInputKey(Date.now());
  };

  const remove = (id) => {
    const index = queue.findIndex(x => x.id === id);
    setQueue(q => q.filter(x => x.id !== id));
    if (index >= 0 && index < current) setCurrent(i => Math.max(0, i - 1));
    else if (index === current) setCurrent(i => Math.min(i, Math.max(0, queue.length - 2)));
  };

  const move = (from, to) => {
    if (to < 0 || to >= queue.length) return;
    const copy = [...queue];
    [copy[from], copy[to]] = [copy[to], copy[from]];
    setQueue(copy);
    if (current === from) setCurrent(to);
    else if (current === to) setCurrent(from);
  };

  const onEnded = () => next();

  const displayTitle = item?.title || "Soninke TV Live";
  const hasVideo = Boolean(item?.url);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo"><Tv size={23}/></div>
          <div>
            <strong>SONINKE TV</strong>
            <span>LIVE BROADCAST</span>
          </div>
        </div>
        <div className="live-pill"><i></i> LIVE</div>
      </header>

      <main>
        {tab === "player" && (
          <section className="player-page">
            <div className="screen">
              {hasVideo ? (
                <video
                  ref={videoRef}
                  src={item.url}
                  autoPlay={playing}
                  muted={muted}
                  controls
                  onEnded={onEnded}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
              ) : (
                <div className="standby">
                  <div className="standby-logo">SONINKE TV</div>
                  <div className="wave"></div>
                  <p>{displayTitle}</p>
                  <small>Broadcast standby</small>
                </div>
              )}
              <div className="onair"><Radio size={15}/> ON AIR</div>
            </div>

            <div className="program-info">
              <div>
                <span className="eyebrow">NOW PLAYING</span>
                <h1>{displayTitle}</h1>
                <p>{item?.type || "Live program"} · Automatic next program enabled</p>
              </div>
              <div className="controls">
                <button onClick={() => setPlaying(true)}><Play size={18}/></button>
                <button onClick={() => setPlaying(false)}><Pause size={18}/></button>
                <button onClick={previous}>Previous</button>
                <button className="primary" onClick={next}><SkipForward size={18}/> Next</button>
                <button onClick={() => setMuted(v => !v)}>{muted ? <VolumeX/> : <Volume2/>}</button>
              </div>
            </div>

            <div className="notice">
              <Clock3 size={18}/>
              <div><b>Continuous broadcast</b><span>When a video ends, the next item starts automatically.</span></div>
            </div>
          </section>
        )}

        {tab === "queue" && (
          <section className="panel">
            <div className="panel-head">
              <div><span className="eyebrow">BROADCAST</span><h2>Program Queue</h2></div>
              <label className="upload-btn"><Upload size={18}/> Add videos
                <input key={fileInputKey} type="file" accept="video/*" multiple onChange={e => addFiles([...e.target.files])}/>
              </label>
            </div>
            <div className="queue">
              {queue.map((q, i) => (
                <div className={`queue-row ${i === current ? "active" : ""}`} key={q.id}>
                  <div className="number">{i + 1}</div>
                  <div className="thumb">{q.type === "Animation" ? <Tv size={22}/> : <Play size={22}/>}</div>
                  <div className="qinfo"><b>{q.title}</b><span>{q.type} · {q.duration}</span></div>
                  <div className="row-actions">
                    <button onClick={() => move(i, i - 1)} disabled={i === 0}>↑</button>
                    <button onClick={() => move(i, i + 1)} disabled={i === queue.length - 1}>↓</button>
                    <button className="danger" onClick={() => remove(q.id)}><Trash2 size={17}/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "admin" && (
          <section className="panel">
            <span className="eyebrow">CONTROL CENTER</span>
            <h2>Live TV Settings</h2>
            <div className="cards">
              <div className="card"><Radio/><b>Channel status</b><span>Live / continuous mode</span><strong className="green">ON AIR</strong></div>
              <div className="card"><ListVideo/><b>Queue items</b><span>Programs in broadcast queue</span><strong>{queue.length}</strong></div>
              <div className="card"><Settings/><b>Automatic transition</b><span>Start next program after ending</span><strong>ENABLED</strong></div>
            </div>
            <div className="info-box">
              <b>Next development step</b>
              <p>This GitHub-ready version is a front-end MVP. For a true 24/7 Internet TV stream, connect the queue to cloud storage and an FFmpeg/HLS streaming server. That makes every viewer receive the same broadcast at the same time.</p>
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={tab==="player"?"selected":""} onClick={()=>setTab("player")}><Tv/><span>Live</span></button>
        <button className={tab==="queue"?"selected":""} onClick={()=>setTab("queue")}><ListVideo/><span>Queue</span></button>
        <button className={tab==="admin"?"selected":""} onClick={()=>setTab("admin")}><Settings/><span>Admin</span></button>
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

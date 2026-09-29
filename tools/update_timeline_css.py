import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# We need to replace the block starting at /* ─── TIMELINE ────────────────────────────────────────────── */
# up to just before /* ─── PHASE CARDS ─────────────────────────────────────────── */

new_css = """/* ─── TIMELINE ────────────────────────────────────────────── */
.timeline-wrap { display:grid; grid-template-columns:200px 1fr; gap:64px; align-items:start; }
.timeline-wrap.story-layout { display:block; position:relative; max-width:1180px; margin:0 auto; }

.timeline-nav { position:sticky; top:calc(var(--nav-h) + 24px); }
.story-layout .timeline-nav { 
  top:120px; float:left; width:60px; margin-left:-20px; z-index:50; 
}
.timeline-nav-title { font-size:10.5px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-muted); margin-bottom:14px; }
.story-layout .timeline-nav-title { display:none; }

.timeline-nav-list { display:flex; flex-direction:column; gap:2px; }
.story-layout .timeline-nav-list { gap:16px; }

.timeline-nav-item {
  display:block; padding:10px 14px; border-radius:var(--r-xs);
  font-size:12.5px; font-weight:500; color:var(--text-muted);
  border-left:2px solid transparent;
  transition:all var(--trans); cursor:pointer;
}
.story-layout .timeline-nav-item {
  padding:4px; font-size:13px; font-weight:700; text-align:center; border:none; white-space:nowrap;
}
.timeline-nav-item:hover { color:var(--text-primary); background:var(--glass-bg); border-left-color:var(--onyx-border); }
.story-layout .timeline-nav-item:hover { background:transparent; }

.timeline-nav-item.active { color:var(--yellow); font-weight:700; background:var(--yellow-pale); border-left-color:var(--yellow); }
.story-layout .timeline-nav-item.active { background:transparent; }

/* Timeline Body */
.timeline-body { position:relative; --tl-gutter: 120px; padding-left:var(--tl-gutter); }
.story-layout .timeline-body { padding:0 40px; margin:0 auto; clear:none; }

.timeline-body:not(.has-curve)::before {
  content:''; position:absolute; left:calc(var(--tl-gutter) / 2); top:8px; bottom:8px;
  width:1.5px; background:linear-gradient(to bottom, var(--yellow), var(--onyx-border));
  border-radius:2px;
}

.tl-svg {
  position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none; z-index:0;
}
.tl-track {
  fill:none; stroke:rgba(255,255,255,.05); stroke-width:2px; stroke-linecap:round;
}
.tl-progress {
  fill:none; stroke:url(#tl-grad); stroke-width:4px; stroke-linecap:round;
  filter:drop-shadow(0 0 6px rgba(255,209,0,.45));
}
.tl-head {
  fill:var(--yellow); filter:drop-shadow(0 0 8px var(--yellow));
}

.timeline-item { position:relative; margin-bottom:56px; scroll-margin-top:calc(var(--nav-h) + 28px); }
.story-layout .timeline-item {
  display:grid; grid-template-columns:1fr 1fr; gap:calc(var(--tl-a, 80px) * 2 + 96px);
  align-items:center; margin-bottom:120px;
}

/* Dots */
.timeline-dot {
  position:absolute;
  left:calc(var(--dot-x, 0) * 1px); top:calc(var(--dot-y, 0) * 1px);
  transform:translate(-50%, -50%);
  width:20px; height:20px; border-radius:50%;
  background:var(--obsidian); border:2px solid rgba(255,255,255,.2);
  transition:all 0.3s ease-out; z-index:2;
}
.timeline-dot::before {
  content:''; position:absolute; inset:-4px; border-radius:50%;
  border:2px solid transparent; transition:border-color 0.4s ease-out;
}
.timeline-dot.reached {
  background:var(--yellow); border-color:var(--yellow);
  box-shadow:0 0 14px rgba(255,209,0,0.5);
}
.timeline-dot.reached::before { border-color:rgba(255,209,0,0.4); }
.timeline-dot.pulse {
  animation:tl-pulse-once 0.6s cubic-bezier(0.16,1,0.3,1);
}
.timeline-dot.pulse-loop {
  animation:tl-pulse-loop 2s cubic-bezier(0.16,1,0.3,1) infinite;
}
@keyframes tl-pulse-once {
  0% { box-shadow:0 0 0 0 rgba(255,209,0,0.8); }
  100% { box-shadow:0 0 0 20px rgba(255,209,0,0); }
}
@keyframes tl-pulse-loop {
  0% { box-shadow:0 0 0 0 rgba(255,209,0,0.6); }
  100% { box-shadow:0 0 0 16px rgba(255,209,0,0); }
}

/* Text Block */
.tl-text {
  position:relative; opacity:calc(var(--p, 0) * 3);
  transform:translateY(calc((1 - var(--p, 0)) * 40px));
  z-index:2;
}
.tl-ghost-year {
  position:absolute; top:-60px; left:-20px; font-size:140px; font-family:var(--font-serif);
  color:transparent; -webkit-text-stroke:1px rgba(255,255,255,0.05); z-index:-1; pointer-events:none;
  transform:translateY(calc((var(--p, 0) - 0.5) * -80px));
}
.tl-heading-row { display:flex; gap:16px; align-items:flex-start; }
.tl-ring {
  width:12px; height:12px; border:2px solid rgba(255,209,0,0.5); border-radius:50%;
  margin-top:6px; flex-shrink:0;
}
.tl-active .tl-ring { border-color:var(--yellow); box-shadow:0 0 8px rgba(255,209,0,0.3); }

.timeline-year-badge {
  display:inline-block; font-size:11px; font-weight:700;
  letter-spacing:0.12em; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px;
  transition:color 0.3s;
}
.tl-active .timeline-year-badge, .timeline-item.reached .timeline-year-badge { color:var(--yellow); }

.timeline-title { font-family:var(--font-serif); font-size:21px; font-weight:700; color:var(--text-primary); margin-bottom:10px; }
.timeline-desc { font-size:15px; color:var(--text-secondary); line-height:1.8; }
.tl-dash-sub { width:40px; height:2px; background:var(--onyx-border); margin-bottom:16px; }

/* Photo Block */
.tl-photo {
  position:relative; perspective:1000px; display:flex; align-items:center; justify-content:center;
  z-index:2;
}
.tl-card {
  width:100%; aspect-ratio:4/3; background:var(--obsidian);
  border:1px solid var(--yellow); border-radius:var(--r-sm);
  display:flex; align-items:center; justify-content:center;
  position:relative; overflow:hidden;
  box-shadow:0 10px 30px rgba(0,0,0,0.5);
  
  --t-p: clamp(0, calc(var(--p, 0) * 1.5), 1);
  opacity:var(--t-p);
  transform:translateX(calc((1 - var(--t-p)) * var(--slide-dir, 60px))) rotate(calc(var(--card-end-r, -2deg) + (1 - var(--t-p)) * 10deg));
  transition: opacity 0.1s, transform 0.1s;
}
.timeline-item:nth-child(even) .tl-card { --slide-dir:-60px; --card-end-r:2deg; }
.timeline-item:nth-child(odd) .tl-card { --slide-dir:60px; --card-end-r:-2deg; }

.tl-card.offset {
  position:absolute; top:20px; left:-20px; width:80%; z-index:-1;
  --card-end-r:-8deg; opacity:calc(var(--t-p) * 0.6);
  transform:translateX(calc((1 - var(--t-p)) * var(--slide-dir, 60px))) rotate(calc(var(--card-end-r) + (1 - var(--t-p)) * 14deg));
}

.tl-card.placeholder .tl-card-inner {
  position:absolute; inset:10px; border:1px dashed rgba(255,209,0,0.3);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px;
  color:rgba(255,209,0,0.4); border-radius:var(--r-xs);
}
.tl-card-year { font-family:var(--font-serif); font-size:20px; }

.tl-branch {
  position:absolute; height:2px; background:rgba(255,209,0,0.3); z-index:1; pointer-events:none;
  transform:scaleX(var(--t-p)); transition:transform 0.1s;
}

/* Responsive */
@media (max-width: 900px) {
  .story-layout .timeline-item { gap:calc(var(--tl-a, 40px) * 2 + 40px); }
  .tl-card { border-width: 1px; }
  .tl-ghost-year { font-size:100px; top:-40px; }
}

@media (max-width: 600px) {
  .story-layout .timeline-item {
    grid-template-columns:1fr; gap:32px;
    padding-left:var(--tl-gutter); margin-bottom:80px;
  }
  .story-layout .timeline-body { padding:0 20px; }
  .story-layout .timeline-nav { display:none; }
  .timeline-item:nth-child(even) .tl-card, .timeline-item:nth-child(odd) .tl-card {
    --slide-dir: 40px; --card-end-r: 0deg;
  }
  .tl-ghost-year { font-size:80px; left:0; }
  .tl-branch { width: 30px !important; left: calc(52px) !important; transform-origin: left center !important; }
}
"""

start_marker = "/* ─── TIMELINE ────────────────────────────────────────────── */"
end_marker = "/* ─── PHASE CARDS ─────────────────────────────────────────── */"

start_idx = css.find(start_marker)
end_idx = css.find(end_marker)

if start_idx != -1 and end_idx != -1:
    updated = css[:start_idx] + new_css + "\n" + css[end_idx:]
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(updated)
    print("Replaced timeline CSS successfully.")
else:
    print("Could not find markers in style.css.")

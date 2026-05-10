/* shared.js — 旅日記 Journey Site */

// ===== STATE =====
const STATE = {
  visited: JSON.parse(localStorage.getItem('tabi_visited') || '[]'),
  xp:      parseInt(localStorage.getItem('tabi_xp') || '0'),
  dark:    localStorage.getItem('tabi_dark') === '1',
  music:   false,
};

function saveState() {
  localStorage.setItem('tabi_visited', JSON.stringify(STATE.visited));
  localStorage.setItem('tabi_xp',      STATE.xp);
  localStorage.setItem('tabi_dark',    STATE.dark ? '1' : '0');
}

// ===== CURSOR =====
function initCursor() {
  const c  = document.getElementById('cursor');
  const cr = document.getElementById('cursor-ring');
  if (!c || !cr) return;
  let mx=0,my=0, rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  const loop = () => {
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    c.style.left=mx+'px';  c.style.top=my+'px';
    cr.style.left=rx+'px'; cr.style.top=ry+'px';
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener('mousedown', () => { c.style.transform='translate(-50%,-50%) scale(0.5)'; cr.style.transform='translate(-50%,-50%) scale(0.7)'; });
  document.addEventListener('mouseup',   () => { c.style.transform=''; cr.style.transform=''; });

  // Sparkles
  let last=0;
  document.addEventListener('mousemove', e => {
    const now=Date.now(); if(now-last<50) return; last=now;
    const spark=document.createElement('div');
    spark.style.cssText=`position:fixed;pointer-events:none;z-index:9990;left:${e.clientX}px;top:${e.clientY}px;width:5px;height:5px;border-radius:50%;background:${['#e63946','#fbbf24','#2563eb','#16a34a'][Math.floor(Math.random()*4)]};transform:translate(-50%,-50%);animation:spark-out 0.5s ease forwards;`;
    document.body.appendChild(spark);
    setTimeout(()=>spark.remove(),600);
  });
  if (!document.getElementById('spark-style')) {
    const s=document.createElement('style');
    s.id='spark-style';
    s.textContent='@keyframes spark-out{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(calc(-50% + '+(Math.random()*40-20)+'px),calc(-50% - 30px)) scale(0)}}';
    document.head.appendChild(s);
  }
}

// ===== SCROLL PROGRESS =====
function initScroll() {
  const fill = document.getElementById('scroll-fill');
  if (!fill) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.transform = `scaleX(${total > 0 ? window.scrollY/total : 0})`;
  });
}

// ===== TOAST =====
function toast(msg, type='default', icon='⭐') {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) { wrap=document.createElement('div'); wrap.id='toast-wrap'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span style="font-size:1rem">${icon}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),400); }, 3000);
}

// ===== XP SYSTEM =====
function addXP(amount, label='') {
  STATE.xp += amount;
  saveState();
  updateXPBar();
  if (label) toast(`+${amount} XP — ${label}`, 'red', '⚡');
}

function updateXPBar() {
  const fill = document.getElementById('xp-fill');
  const num  = document.getElementById('xp-num');
  if (fill) fill.style.width = Math.min((STATE.xp / 600)*100, 100) + '%';
  if (num)  num.textContent  = STATE.xp + ' XP';
}

// ===== PAGE TRANSITION =====
function navigateTo(url, label='...') {
  const ov = document.getElementById('page-transition');
  const tx = document.getElementById('pt-text');
  if (!ov) { window.location.href=url; return; }
  ov.style.transition = 'transform 0.35s ease';
  ov.style.transformOrigin = 'left';
  ov.style.transform = 'scaleX(1)';
  if (tx) { tx.textContent=label; tx.style.opacity='1'; }
  setTimeout(()=>{ window.location.href=url; }, 380);
}

function pageEnter() {
  const ov = document.getElementById('page-transition');
  const tx = document.getElementById('pt-text');
  if (!ov) return;
  ov.style.transition = 'none';
  ov.style.transformOrigin = 'right';
  ov.style.transform = 'scaleX(1)';
  if (tx) tx.style.opacity='0';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    ov.style.transition = 'transform 0.4s ease';
    ov.style.transform = 'scaleX(0)';
  }));
}

// ===== REVEAL ON SCROLL =====
function initReveal() {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{ if(e.isIntersecting){ e.target.style.transitionDelay=(e.target.dataset.delay||0)+'s'; e.target.classList.add('done'); } });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = [
  {id:'day1',  icon:'🏛️', label:'Explorer',    xp:50},
  {id:'day2',  icon:'⚡',  label:'Techie',      xp:50},
  {id:'day3',  icon:'🎬',  label:'Artist',      xp:50},
  {id:'day4',  icon:'🚦',  label:'Urbanist',    xp:50},
  {id:'day5',  icon:'🎡',  label:'Adventurer',  xp:50},
  {id:'day67', icon:'🌲',  label:'Wanderer',    xp:75},
  {id:'all',   icon:'👑',  label:'Legend',      xp:200},
];

function renderAchievements() {
  const strip = document.getElementById('ach-strip');
  if (!strip) return;
  strip.innerHTML = '<span class="ach-label">実績:</span>';
  ACHIEVEMENTS.forEach(a => {
    const el=document.createElement('div');
    el.className='ach-badge' + (STATE.visited.includes(a.id)?' lit':'');
    el.id='ach-'+a.id;
    el.innerHTML=`<div class="ach-icon">${a.icon}</div><span>${a.label}</span>`;
    el.title=a.label;
    strip.appendChild(el);
  });
}

function unlockAchievement(id) {
  if (STATE.visited.includes(id)) return;
  STATE.visited.push(id);
  const ach = ACHIEVEMENTS.find(a=>a.id===id);
  saveState();
  const el=document.getElementById('ach-'+id);
  if (el) el.classList.add('lit');
  if (ach) { addXP(ach.xp, ach.label+' Achievement!'); launchConfetti(); }
  // Check all
  if (['day1','day2','day3','day4','day5','day67'].every(d=>STATE.visited.includes(d))) {
    setTimeout(()=>unlockAchievement('all'),800);
  }
}

// ===== SAKURA PETALS =====
function launchPetals(count=8) {
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      const p=document.createElement('div');
      p.className='petal';
      p.textContent=['🌸','🌺','🍃','🌸'][Math.floor(Math.random()*4)];
      p.style.cssText=`left:${Math.random()*100}vw;top:-40px;--dur:${4+Math.random()*4}s;--delay:0s;--px:${(Math.random()-0.5)*200}px;--pr:${Math.random()*720}deg;`;
      document.body.appendChild(p);
      setTimeout(()=>p.remove(),9000);
    }, i*200);
  }
}

// ===== CONFETTI =====
function launchConfetti() {
  const colors=['#e63946','#fbbf24','#2563eb','#16a34a','#7c3aed','#ea580c'];
  for(let i=0;i<60;i++){
    const el=document.createElement('div');
    el.style.cssText=`position:fixed;pointer-events:none;z-index:9100;top:0;left:${Math.random()*100}vw;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>0.5?'50%':'2px'};animation:confetti-drop ${1.5+Math.random()*2}s ${Math.random()*0.5}s ease-in forwards;--cx:${(Math.random()-0.5)*400}px;--cy:${60+Math.random()*40}vh;--cr:${Math.random()*720}deg;`;
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),3500);
  }
}

// ===== RIPPLE =====
function addRipple(el) {
  el.style.position='relative'; el.style.overflow='hidden';
  el.addEventListener('click', e=>{
    const r=document.createElement('span');
    const rect=el.getBoundingClientRect();
    const size=Math.max(rect.width,rect.height)*2;
    r.style.cssText=`position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:ripple-out 0.6s ease;pointer-events:none;`;
    el.appendChild(r); setTimeout(()=>r.remove(),700);
  });
}

// ===== DARK MODE =====
function toggleDark() {
  STATE.dark = !STATE.dark;
  saveState();
  applyDark();
  toast(STATE.dark?'🌙 ダークモード ON':'☀️ ライトモード ON', 'default', STATE.dark?'🌙':'☀️');
}
function applyDark() {
  if(STATE.dark) {
    document.documentElement.style.setProperty('--cream','#1a1614');
    document.documentElement.style.setProperty('--paper','#231e1a');
    document.documentElement.style.setProperty('--paper2','#2e2820');
    document.documentElement.style.setProperty('--ink','#f0e8d8');
    document.documentElement.style.setProperty('--ink2','#d4c8b4');
    document.documentElement.style.setProperty('--muted','#8a7a6a');
  } else {
    document.documentElement.style.setProperty('--cream','#faf6ee');
    document.documentElement.style.setProperty('--paper','#f5efe0');
    document.documentElement.style.setProperty('--paper2','#ede4cc');
    document.documentElement.style.setProperty('--ink','#1a1410');
    document.documentElement.style.setProperty('--ink2','#3d3028');
    document.documentElement.style.setProperty('--muted','#8a7a6a');
  }
}

// ===== TOPBAR ACTIVE LINK =====
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-pill[data-page]').forEach(el=>{
    el.classList.toggle('active', el.dataset.page===page);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', ()=>{
  initCursor();
  initScroll();
  initReveal();
  renderAchievements();
  updateXPBar();
  applyDark();
  setActiveNav();
  pageEnter();
  document.querySelectorAll('.btn,.nav-pill').forEach(addRipple);
  // Periodic petals
  setInterval(()=>launchPetals(3), 12000);
});

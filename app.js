function $(s){return document.getElementById(s)}

// SPK 已废弃，发音改为点击文本本身触发
const SPK=t=>'';
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function speak(txt,btn){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang='en-US';u.rate=.9;if(btn){btn.style.transform='scale(1.3)';setTimeout(()=>btn.style.transform='',300)}window.speechSynthesis.speak(u);}
document.addEventListener("click",function(e){
  const el=e.target.closest("[data-say]");
  if(el&&el.dataset.say){speak(el.dataset.say,el);}
  const card=e.target.closest("[data-href]");
  if(card){location.hash=card.dataset.href;}
  const fbtn=e.target.closest("[data-filter]");
  if(fbtn){filterCat(fbtn.dataset.filter);}
});

function renderNav(){
  const active=location.hash;
  let html='<a href="#/" class="'+(active==='#/'||active===''?'active':'')+'" onclick="closeSidebar()">🏠 首页</a>';
  html+='<a href="#/timer" class="'+(active==='#/timer'?'active':'')+'" onclick="closeSidebar()">⏱️ 计时训练</a>';
  html+='<a href="#/vocab" class="'+(active==='#/vocab'?'active':'')+'" onclick="closeSidebar()">📚 生词本 <span class="badge">'+WORDS.length+'</span></a>';
  html+='<div class="nav-vocab"></div>';
  LESSONS.forEach(l=>{
    const cls=(active==='#/lesson/'+l.id)?'active':'';
    const label=l.pending?'⏳':'📖';
    const title=l.pending?'第'+l.id+'课（待更新）':l.title.split('：')[0];
    html+='<a href="#/lesson/'+l.id+'" class="'+cls+'" onclick="closeSidebar()">'+label+' '+title+'<span class="date">'+l.date.slice(5)+'</span></a>';
  });
  $("nav").innerHTML=html;
}

/* ---- 移动端侧边栏 ---- */
function toggleSidebar(){
  const sb=$('sidebar'),ov=$('overlay');
  const open=sb.classList.toggle('open');
  ov.classList.toggle('show',open);
  document.body.classList.toggle('no-scroll',open);
}
function closeSidebar(){
  $('sidebar').classList.remove('open');
  $('overlay').classList.remove('show');
  document.body.classList.remove('no-scroll');
}
function openSidebar(){
  $('sidebar').classList.add('open');
  $('overlay').classList.add('show');
  document.body.classList.add('no-scroll');
}

// 汉堡菜单 & 遮罩点击
setTimeout(function(){
  const mb=$('menuBtn'),ov=$('overlay');
  if(mb)mb.addEventListener('click',toggleSidebar);
  if(ov)ov.addEventListener('click',closeSidebar);
},0);

/* ---- 环形进度 ---- */
function ringSvg(pct){
  const r=45,c=2*Math.PI*r;
  const off=c-(pct/100)*c;
  return '<div class="ring"><svg viewBox="0 0 110 110"><circle class="ring-bg" cx="55" cy="55" r="'+r+'"/><circle class="ring-fill" cx="55" cy="55" r="'+r+'" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'"/></svg><div class="ring-text"><div class="num">'+pct+'%</div><div class="lab">学习进度</div></div></div>';
}

/* ---- 首页 ---- */
function renderHome(){
  const done=LESSONS.filter(l=>!l.pending).length;
  const total=LESSONS.length;
  const pct=Math.round((done/total)*100);
  let html='<div class="content">';

  // Hero 区
  html+='<div class="hero">';
  html+='<h2>🌸 Hanna，欢迎回来！</h2>';
  html+='<p>每天10分钟，让英语成为习惯</p>';
  html+='<div class="progress-ring">'+ringSvg(pct)+'<div class="ring-info"><div class="big">'+done+'<span style="font-size:16px;color:var(--muted)">/'+total+'</span></div><div class="small">已完成课程 · '+WORDS.length+' 生词</div></div></div>';
  html+='</div>';

  // 快捷入口
  html+='<div class="quick-actions">';
  html+='<a class="qa-btn" href="https://my.feishu.cn/drive/folder/HGRqfC2ialcw6RdoVnpcPYbjn6K?from=space_personal_filelist" target="_blank" rel="noopener"><span class="qa-icon">📼</span><span class="qa-label">课程回放</span><span class="qa-desc">飞书文档</span></a>';
  html+='<a class="qa-btn" href="#/timer"><span class="qa-icon">⏱️</span><span class="qa-label">计时训练</span><span class="qa-desc">倒逼语速</span></a>';
  html+='<a class="qa-btn" href="#/vocab"><span class="qa-icon">📚</span><span class="qa-label">生词本</span><span class="qa-desc">'+WORDS.length+' 词</span></a>';
  html+='</div>';

  // 复习提示
  html+='<div class="review-tip">💡 <strong>今日复习策略：</strong>用计时器测一遍背过的范文 → 从90秒逐步压缩到60秒。先看中文说英文，再脱稿说。每天最少10分钟！</div>';

  // 最新课程
  const latest=LESSONS.filter(l=>!l.pending).pop();
  if(latest){
    html+='<div class="section-title"><span class="dot"></span>最新课程</div>';
    html+='<div class="lesson-grid">';
    html+='<div class="lesson-card latest" onclick="location.href=\"#/lesson/'+latest.id+'\"">';
    html+='<div class="l-num">第 '+latest.id+' 课</div>';
    html+='<div class="l-title">'+latest.title.split('：')[1]+'</div>';
    html+='<div class="l-date">'+latest.date+'</div>';
    html+='<span class="l-tag new">NEW</span>';
    html+='</div>';
    html+='</div>';
  }

  // 全部课程网格
  html+='<div class="section-title"><span class="dot"></span>全部课程</div>';
  html+='<div class="lesson-grid">';
  LESSONS.forEach(l=>{
    const isPending=l.pending;
    const titleText=isPending?'第'+l.id+'课（待更新）':(l.title.split('：')[1]||l.title);
    html+='<div class="lesson-card '+(isPending?'pending':'')+(l.id===latest?.id?' latest':'')+'" '+(isPending?'':'data-href="#/lesson/'+l.id+'"')+'>;'
    html+='<div class="l-num">第 '+l.id+' 课</div>';
    html+='<div class="l-title">'+titleText+'</div>';
    html+='<div class="l-date">'+l.date+'</div>';
    if(l.id===latest?.id) html+='<span class="l-tag new">NEW</span>';
    html+='</div>';
  });
  html+='</div>';

  html+='</div>';
  $("main").innerHTML=html;
}

/* ---- 计时器页面 ---- */

let timerInterval=null,timerSeconds=0,timerTarget=60,timerRunning=false;

function renderTimer(){
  let html='<div class="content">';
  html+='<div class="timer-hero">';
  html+='<h2 style="font-size:20px;font-weight:800;margin-bottom:4px">⏱️ 计时训练</h2>';
  html+='<p style="color:var(--muted);font-size:13px;margin-bottom:10px">遮住英文，只看中文说英文——用时间压力逼出流利度</p>';
  html+='<div class="timer-display" id="timerDisplay">01:00</div>';
  html+='<div class="preset-times">';
  [30,60,90,120].forEach(t=>{
    html+='<button class="preset-btn '+(t===timerTarget?'active':'')+'" onclick="setTimer('+t+')">'+t+'秒</button>';
  });
  html+='</div>';
  html+='<div class="timer-controls">';
  html+='<button class="timer-btn start" id="timerStart" onclick="startTimer()">▶ 开始</button>';
  html+='<button class="timer-btn pause" id="timerPause" onclick="pauseTimer()" style="display:none">⏸ 暂停</button>';
  html+='<button class="timer-btn reset" onclick="resetTimer()">↺ 重置</button>';
  html+='</div>';
  html+='<div class="history-list" id="timerHistory"></div>';
  html+='</div>';

  // 范文卡片
  html+='<div class="section-title"><span class="dot"></span>选择范文练习</div>';
  html+='<div class="script-cards">';
  TIMER_SCRIPTS.forEach((s,i)=>{
    html+='<div class="script-card" onclick="loadScript('+i+')">';
    html+='<div class="sc-title">📄 '+s.title+'</div>';
    html+='<div class="sc-time">建议时长：'+s.time+'秒</div>';
    html+='<div class="sc-content">'+s.content.join(' ')+'</div>';
    html+='<div class="sc-action">点击加载练习 →</div>';
    html+='</div>';
  });
  html+='</div>';

  // 练习区
  html+='<div class="timer-practice" id="practiceArea" style="display:none">';
  html+='<div class="tp-title" id="practiceTitle">练习范文</div>';
  html+='<div class="tp-script" id="practiceScript"></div>';
  html+='</div>';

  html+='</div>';
  $("main").innerHTML=html;
  updateTimerDisplay();
}

function setTimer(sec){timerTarget=sec;timerSeconds=sec;timerRunning=false;clearInterval(timerInterval);updateTimerDisplay();document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');$('timerStart').style.display='';$('timerPause').style.display='none';}
function updateTimerDisplay(){const m=Math.floor(timerSeconds/60).toString().padStart(2,'0');const s=(timerSeconds%60).toString().padStart(2,'0');$('timerDisplay').textContent=m+':'+s;const d=$('timerDisplay');d.classList.remove('warning','danger');if(timerSeconds<=10&&timerSeconds>0)d.classList.add('danger');else if(timerSeconds<=20)d.classList.add('warning');}
function startTimer(){if(timerRunning)return;timerRunning=true;$('timerStart').style.display='none';$('timerPause').style.display='';timerInterval=setInterval(()=>{if(timerSeconds>0){timerSeconds--;updateTimerDisplay();}else{clearInterval(timerInterval);timerRunning=false;$('timerStart').style.display='';$('timerPause').style.display='none';addHistory(timerTarget,'完成');}},1000);}
function pauseTimer(){clearInterval(timerInterval);timerRunning=false;$('timerStart').style.display='';$('timerPause').style.display='none';}
function resetTimer(){clearInterval(timerInterval);timerRunning=false;timerSeconds=timerTarget;updateTimerDisplay();$('timerStart').style.display='';$('timerPause').style.display='none';}
function addHistory(target,result){const h=$('timerHistory');if(!h)return;const item=document.createElement('span');item.className='history-item'+(result==='超时'?' warn':'');item.textContent=(target-target+timerSeconds)+'秒 / '+target+'秒';h.appendChild(item);}

let currentScriptIdx=-1;
function loadScript(idx){
  currentScriptIdx=idx;
  const s=TIMER_SCRIPTS[idx];
  $('practiceArea').style.display='block';
  $('practiceTitle').innerHTML='📄 '+s.title+' <span style="font-size:12px;color:var(--muted);font-weight:400">建议 '+s.time+' 秒</span>';
  let scriptHtml='';
  s.content.forEach(line=>{
    scriptHtml+='<div style="margin-bottom:12px"><div class="cn-only">'+line+'</div></div>';
  });
  $('practiceScript').innerHTML=scriptHtml;
  // 滚动到练习区
  $('practiceArea').scrollIntoView({behavior:'smooth',block:'start'});
  // 自动设置推荐时间
  timerTarget=s.time;timerSeconds=s.time;timerRunning=false;clearInterval(timerInterval);updateTimerDisplay();
  document.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('active'));
  const presetBtns=document.querySelectorAll('.preset-btn');
  [30,60,90,120].forEach((t,i)=>{if(t===s.time&&presetBtns[i])presetBtns[i].classList.add('active');});
  $('timerStart').style.display='';$('timerPause').style.display='none';
}

/* ---- 课程详情 ---- */
function renderLesson(id){
  const l=LESSONS.find(x=>x.id===id);
  if(!l){$("main").innerHTML='<div class="content"><p>课程不存在</p></div>';return;}
  let html='<div class="content">';
  html+='<button class="back" onclick="history.back()">← 返回</button>';
  html+='<div class="lesson-header">';
  html+='<h2>'+esc(l.title)+'</h2>';
  html+='<div class="meta">'+l.date+' · '+l.subtitle+'</div>';
  html+='</div>';

  if(l.pending){
    html+='<div class="card" style="text-align:center;padding:40px"><div style="font-size:48px;margin-bottom:16px">📝</div><h3 style="margin-bottom:8px">第 '+l.id+' 课笔记待更新</h3><p style="color:var(--muted)">这节课没有录制回放，笔记将在补充后更新。<br>可以先复习其他课程 👇</p></div>';
    const others=LESSONS.filter(x=>!x.pending&&Math.abs(x.id-l.id)<=2);
    if(others.length){
      html+='<div style="margin-top:16px">';
      others.forEach(o=>html+='<a href="#/lesson/'+o.id+'" style="display:block;padding:12px 16px;background:var(--card);border-radius:10px;margin-bottom:8px;text-decoration:none;color:var(--text);border:1px solid var(--border)">📖 '+esc(o.title)+'</a>');
      html+='</div>';
    }
    html+='</div>';
    $("main").innerHTML=html;return;
  }

  // 复习指南
  if(l.review&&l.review.length){
    html+='<div class="guide-box"><h4>🎯 复习指南</h4><ul>';
    l.review.forEach(r=>html+='<li>'+r+'</li>');
    html+='</ul></div>';
  }
  // 知识加餐
  if(l.extra&&l.extra.length){
    html+='<div class="extra-box"><h4>📚 知识加餐</h4><ul>';
    l.extra.forEach(e=>html+='<li>'+e+'</li>');
    html+='</ul></div>';
  }

  l.sections.forEach(s=>html+=secHtml(s));
  html+='</div>';
  $("main").innerHTML=html;
}

function secHtml(s){
  let h='<div class="sec">';
  h+='<h3><span class="num">📌</span>'+esc(s.t)+'</h3>';
  if(s.type==="dialog"){
    s.lines.forEach(line=>{
      h+='<div class="dialog-line"><div class="speaker">'+esc(line[0])+'</div><div class="txt spk" data-say="'+esc(line[1])+'" title="点击发音">'+esc(line[1])+'</div></div>';
    });
    if(s.note) h+='<div class="dialog-note">'+s.note+'</div>';
  }else if(s.type==="list"){
    h+='<ul class="ulist">';
    s.items.forEach(item=>h+='<li>'+item+'</li>');
    h+='</ul>';
  }else if(s.type==="table"){
    h+='<table><thead><tr><th>中文</th><th>English</th></tr></thead><tbody>';
    s.rows.forEach(row=>h+='<tr><td>'+row[0]+'</td><td>'+row[1]+'</td></tr>');
    h+='</tbody></table>';
    if(s.note) h+='<div class="dialog-note">'+s.note+'</div>';
  }else if(s.type==="article"){
    s.paras.forEach(p=>{
      h+='<div class="para-pair"><div class="en spk" data-say="'+esc(p[0])+'" title="点击发音">'+esc(p[0])+'</div><div class="cn">'+p[1]+'</div></div>';
    });
    if(s.note) h+='<div class="dialog-note">'+s.note+'</div>';
  }else if(s.type==="homework"){
    h+='<div class="homework-box"><h4>📝 课后作业</h4><p>'+esc(s.text)+'</p></div>';
  }
  h+='</div>';
  return h;
}

/* ---- 生词本 ---- */
let currentCat="all";
function renderVocab(){
  const cats=[...new Set(WORDS.map(w=>w.cat))];
  let html='<div class="content">';
  html+='<div class="card"><div class="card-title"><span class="icon">📚</span>生词本</div>';
  html+='<div class="cat-bar">';
  html+='<button class="cat-btn '+(currentCat==="all"?"active":"")+'" data-filter="all">全部 ('+WORDS.length+')</button>';
  cats.forEach(c=>{
    const count=WORDS.filter(w=>w.cat===c).length;
    html+='<button class="cat-btn '+(currentCat===c?"active":"")+'" data-filter="'+c+'">'+c+' ('+count+')</button>';
  });
  html+='</div>';
  html+='<div class="vocab-grid">';
  const list=currentCat==="all"?WORDS:WORDS.filter(w=>w.cat===currentCat);
  list.forEach(w=>{
    html+='<div class="vocab-card">';
    html+='<div class="v-top"><span class="v-word">'+esc(w.w)+'</span><span class="v-pos">'+w.pos+'</span></div>';
    html+='<div class="v-phon">'+w.p+'</div>';
    html+='<div class="v-mean">'+esc(w.m)+'</div>';
    html+='<div class="v-ex">'+esc(w.e)+'<br><span style="color:var(--muted)">'+esc(w.em)+'</span></div>';
    html+='</div>';
  });
  html+='</div></div></div>';
  $("main").innerHTML=html;
}
function filterCat(c){currentCat=c;renderVocab();}

/* ---- 路由 ---- */
function route(){
  closeSidebar();
  const h=location.hash;
  renderNav();
  if(h==="#/"||h===""||h==="#") renderHome();
  else if(h==="#/vocab") renderVocab();
  else if(h==="#/timer") renderTimer();
  else if(h.startsWith("#/lesson/")){const id=parseInt(h.split("/").pop());renderLesson(id);}
  else $("main").innerHTML='<div class="content"><p>页面不存在</p></div>';
}
window.addEventListener("hashchange",route);
route();


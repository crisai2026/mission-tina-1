/* ============ CONFIG: easy things to change ============ */
const CREW='Tina';
const SIGN='From Cris';
// The personal message that arrives just before losing signal behind the Moon:
const UPLINK='Tina, before you lose signal: thank you for being the kind of boss who makes Mondays feel doable. You look after everyone else\'s crew. Auckland has no idea how lucky it\'s about to get. Go well.';
// Christina Koch's own words (Artemis II). Check the exact wording against the source before gifting.
const KOCH_QUOTE='Planet Earth, you are a crew.';
const HOME={name:'Nelson',lon:173.28,lat:-41.27};
const NEXT={name:'Auckland',lon:174.76,lat:-36.85};

const SCENES=[
  {id:'invite',k:'Day 0 · 08:15',t:'Incoming',nav:'Invitation'},
  {id:'launch',k:'Day 1 · 06:58',t:'Launch',nav:'Launch',c:'Christina Koch flew this · March 2019'},
  {id:'cargo',k:'Day 2 · 07:10',t:'Catch a cargo ship',nav:'Cargo ship',c:'Christina Koch did this · September 2019'},
  {id:'eva',k:'Day 2 · 11:40',t:'Spacewalk',nav:'Spacewalk',c:'Christina Koch did this · October 2019'},
  {id:'window',k:'Day 2 · After hours',t:'The window',nav:'The window',c:'Christina Koch had this view for 328 days'},
  {id:'moon',k:'Day 5 · Far side',t:'The Moon',nav:'The Moon',c:'Christina Koch flew this · Artemis II'},
  {id:'home',k:'Day 10 · Pacific Ocean',t:'Coming home',nav:'Home',c:'Christina Koch did this · February 2020'},
  {id:'patch',k:'Debrief',t:'Mission patch',nav:'Patch'},
];
const ACH={
  form:['Completed Form 27-B/6 without crying','#ffd36b'],
  maxq:['Survived Max Q','#ff4fa3'],
  orbit:['Reached orbit. Stomach filed a complaint','#a78bfa'],
  cargo:['Caught twelve tonnes with a robot arm','#ffd36b'],
  ticket:['Closed Ticket #4471 in space','#7ee8d0'],
  firsttry:['Wired a space station on the first try','#8df0b8'],
  window:['Did absolutely nothing, beautifully','#6fb6ff'],
  inbox:['Inbox zero (involuntary, behind the Moon)','#cfc6dc'],
  photo:['Saw Earth rise. Did not post it','#ff9ad0'],
  chute:['Deployed the chutes at exactly the right time','#ffb36b'],
  home:['Came home in one piece','#8df0b8'],
};
const $=id=>document.getElementById(id);
const state={i:0,voices:false,sound:false,calm:matchMedia('(prefers-reduced-motion: reduce)').matches,nerd:false,nums:false,got:new Set(),photo:null,done:new Set()};

/* ============ pixel art ============ */
function px(rows,pal,s=1){const h=rows.length,w=rows[0].length,c=document.createElement('canvas');c.width=w*s;c.height=h*s;const x=c.getContext('2d');
  rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(pal[ch]){x.fillStyle=pal[ch];x.fillRect(i*s,j*s,s,s);}}));return c;}
function face(o){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),R=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  R(0,0,16,16,o.bg);
  if(o.static){for(let i=0;i<110;i++)R(Math.random()*16|0,Math.random()*16|0,1,1,i%3?'#3b3350':'#8e84a8');return c.toDataURL();}
  R(3,12,10,4,o.shirt);R(6,10,4,2,o.skin);R(4,3,8,8,o.skin);
  if(o.helmet){R(2,1,12,11,'#efeaf7');R(4,3,8,7,'#2b1d4d');R(5,4,3,1,'#8d7bd0');R(3,12,10,4,'#efeaf7');R(7,13,2,1,o.badge||'#ff4fa3');return c.toDataURL();}
  R(4,2,8,2,o.hair);R(3,3,1,o.long?9:4,o.hair);R(12,3,1,o.long?9:4,o.hair);if(o.bun)R(6,0,4,2,o.hair);if(o.fringe)R(4,4,5,1,o.hair);
  R(6,6,1,1,'#1a1020');R(9,6,1,1,'#1a1020');R(7,9,2,1,o.mouth||'#b04a6a');
  if(o.glasses){R(5,6,3,1,'#1a1020');R(8,6,3,1,'#1a1020');R(6,6,1,1,'#bfe9ff');R(9,6,1,1,'#bfe9ff');}
  if(o.headset){R(2,5,1,3,'#2a2338');R(3,8,1,2,'#2a2338');R(4,9,2,1,'#2a2338');}
  if(o.visor){R(3,2,10,1,o.visor);R(3,3,11,1,o.visor);}
  if(o.cross){R(10,13,3,1,'#e33');R(11,12,1,3,'#e33');}
  if(o.tie){R(7,12,2,1,o.tie);R(7,13,2,3,o.tie);}
  if(o.clip){R(10,11,5,5,'#c9a66b');R(11,12,3,1,'#fff');R(11,14,3,1,'#fff');R(12,10,1,1,'#888');}
  return c.toDataURL();}
const ROLES={
  HOUSTON:{n:'Houston · CapCom',c:'#7ee8d0',pitch:.95,f:{bg:'#12303a',skin:'#e8b990',hair:'#6a2f4f',shirt:'#2f6f7a',headset:1,long:1,fringe:1}},
  FLIGHT:{n:'Flight Director',c:'#ff4fa3',pitch:.8,f:{bg:'#3a1230',skin:'#c98e6a',hair:'#1c1320',shirt:'#8a1f5c',bun:1,headset:1}},
  SURGEON:{n:'Flight Surgeon',c:'#8df0b8',pitch:1.15,f:{bg:'#123a2a',skin:'#f0c8a8',hair:'#c98a3a',shirt:'#f3f3f3',long:1,cross:1}},
  EECOM:{n:'EECOM · Power',c:'#ffd36b',pitch:1.05,f:{bg:'#3a3012',skin:'#d9a57c',hair:'#5a4a3a',shirt:'#3a4a7a',glasses:1,fringe:1}},
  ACCT:{n:'Accounting',c:'#cfc6dc',pitch:.7,f:{bg:'#2a2733',skin:'#e6c2a6',hair:'#8e8e98',shirt:'#f3f3f3',tie:'#444',visor:'#3fae6a'}},
  ROSTER:{n:'Roster',c:'#ffb36b',pitch:1.25,f:{bg:'#3a2412',skin:'#b97f5c',hair:'#2a1a12',shirt:'#c9642f',long:1,clip:1}},
  KOCH:{n:'Seat 2 · C. Koch',c:'#a78bfa',gesture:1,f:{bg:'#1d1440',helmet:1,badge:'#a78bfa'}},
  TINA:{n:CREW,c:'#ff9ad0',mute:1,f:{bg:'#40143a',helmet:1,badge:'#ff4fa3'}},
  LOS:{n:'— No signal —',c:'#6d618c',mute:1,f:{bg:'#15121f',static:1}},
  QUIET:{n:'The window',c:'#6fb6ff',mute:1,f:{bg:'#0b1430',helmet:1,badge:'#6fb6ff'}},
  LEAK:{n:'Unlisted channel · source unknown',c:'#a78bfa',mute:1,cls:'uplink',f:{bg:'#1d1440',helmet:1,badge:'#a78bfa'}},
  CRIS:{n:'Personal uplink · from Cris',c:'#ff4fa3',pitch:1,cls:'uplink',f:{bg:'#2a1438',skin:'#d9a57c',hair:'#4a3a2a',shirt:'#5a3a8a',glasses:1}},
};
for(const r of Object.values(ROLES))r.img=face(r.f);
function astro(up){const c=document.createElement('canvas');c.width=240;c.height=300;const x=c.getContext('2d');
  const rr=(a,b,w,h,r,col)=>{x.fillStyle=col;x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h);x.fill();},ci=(a,b,r,col)=>{x.fillStyle=col;x.beginPath();x.arc(a,b,r,0,7);x.fill();};
  rr(60,98,120,124,24,'#cdc3e4');
  rr(78,200,36,78,16,'#f4f0fa');rr(126,200,36,78,16,'#f4f0fa');rr(72,260,46,26,11,'#b3a6de');rr(122,260,46,26,11,'#b3a6de');
  rr(32,112,34,86,16,'#f4f0fa');ci(49,202,17,'#b3a6de');
  if(up){rr(174,36,34,96,16,'#f4f0fa');ci(191,34,18,'#b3a6de');rr(184,4,13,26,6,'#b3a6de');}else{rr(174,112,34,86,16,'#f4f0fa');ci(191,202,17,'#b3a6de');}
  rr(66,100,108,118,28,'#f4f0fa');rr(92,142,56,36,9,'#e2daf2');rr(100,152,18,10,4,'#a78bfa');rr(124,152,16,10,4,'#ff4fa3');
  ci(120,66,58,'#f4f0fa');rr(76,34,88,64,30,'#2b1d4d');rr(90,44,34,10,5,'rgba(167,139,250,.85)');rr(132,74,18,6,3,'rgba(255,154,208,.6)');
  return c;}
const SPR={astro:astro(false),astroUp:astro(true)};
function medal(col){const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');x.fillStyle='#ff4fa3';x.beginPath();x.moveTo(14,2);x.lineTo(24,20);x.lineTo(34,2);x.closePath();x.fill();
  x.fillStyle=col;x.beginPath();x.arc(24,30,15,0,7);x.fill();x.fillStyle='rgba(255,255,255,.75)';x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?4:9;x.lineTo(24+Math.cos(a)*r,30+Math.sin(a)*r);}x.closePath();x.fill();return c.toDataURL();}
for(const a of Object.values(ACH))a[2]=medal(a[1]);
const MATE={n:SPR.astro.toDataURL(),up:SPR.astroUp.toDataURL()};
function mate(){$('mate').hidden=true;}
function thumbs(ms=2600){return;const m=$('mate');if(m.hidden)return;m.src=MATE.up;setTimeout(()=>{m.src=MATE.n;},ms);}

/* ============ helpers ============ */
const stage=$('stage'),c2d=$('c2d'),ctx=c2d.getContext('2d');
let W=0,H=0,DPR=1;
function fit(){const r=stage.getBoundingClientRect();DPR=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;c2d.width=W*DPR;c2d.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);if(GL.r){GL.r.setSize(W,H,false);GL.cam&&(GL.cam.aspect=W/H,GL.cam.updateProjectionMatrix());}}
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=t=>t*t*(3-2*t);
function interp(tab,x){if(x<=tab[0][0])return tab[0][1];for(let i=1;i<tab.length;i++)if(x<=tab[i][0]){const t=(x-tab[i-1][0])/(tab[i][0]-tab[i-1][0]);return lerp(tab[i-1][1],tab[i][1],t);}return tab[tab.length-1][1];}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const hold=ms=>Promise.all([wait(ms),Promise.race([lastVoice,wait(20000)])]);
let token=0;const alive=t=>t===token;
let lastVoice=Promise.resolve();
function say(role,text){const R=ROLES[role],m=$('msg');m.hidden=false;m.className='msg '+(R.gesture?'gesture ':'')+(R.cls||'');m.style.setProperty('--rc',R.c);
  $('face').src=R.img;$('who').textContent=R.n;$('say').textContent=text;if(!R.mute&&!R.gesture){tone(1150,.035,.02);tone(900,.03,.015,'sine',.05);}lastVoice=R.gesture?Promise.resolve():voice(text,role);}
function hush(){$('msg').hidden=true;}
async function talk(T,lines){for(const [role,text,extra] of lines){if(!alive(T))return false;say(role,text);await Promise.all([wait(1500+text.length*50+(extra||0)),Promise.race([lastVoice,wait(15000)])]);}return alive(T);}
function acts(list){const a=$('acts');a.innerHTML='';(list||[]).forEach(b=>{const el=document.createElement('button');el.textContent=b.label;if(b.go)el.className='go';el.onclick=()=>{if(!b.keep)a.innerHTML='';b.fn();};a.appendChild(el);});}
function ask(role,text,label){return new Promise(res=>{say(role,text);acts([{label,go:true,fn:res}]);});}
let achTm;function award(k){if(state.got.has(k))return;state.got.add(k);const el=$('ach');$('achI').src=ACH[k][2];$('achT').textContent=ACH[k][0];el.style.opacity=1;clearTimeout(achTm);achTm=setTimeout(()=>el.style.opacity=0,3400);chime();}
function layer(html){$('layer').innerHTML=html||'';return $('layer');}
function fact(eyebrow,title,body,nerd,btn='Continue'){return new Promise(res=>{
  layer(`<div class="card"><div class="eyebrow">${eyebrow}</div><h2>${title}</h2>${body}${state.nerd&&nerd?`<div class="nerd">${nerd}</div>`:''}<div class="row"><button class="go" id="fNext">${btn}</button></div></div>`);
  $('fNext').onclick=()=>{layer('');res();};$('fNext').focus({preventScroll:true});});}
// HUD rows: [label, number text, word text]. Words by default: Mission Control does the maths.
function hud(rows){$('hud').innerHTML=rows.filter(r=>state.nums?r[1]!=null:r[2]!=null).map(r=>`${r[0]} <b>${state.nums?r[1]:r[2]}</b>`).join('<br>');}
const wSpeed=v=>v<50?'still':v<1500?'fast':v<8000?'very fast':v<22000?'absurdly fast':'ridiculous';
const wAlt=a=>a<.5?'on the ground':a<12?'in the clouds':a<50?'above the weather':a<100?'edge of space':'space';
const wG=g=>g<.2?'floating':g<1.25?'normal':g<2?'heavy':g<3.2?'very heavy':'elephant on your chest';
function fmtT(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s/60)%60,ss=s%60;return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');}

/* ============ sound (all generated) ============ */
const SND={ctx:null};
function audio(){if(SND.ctx){SND.ctx.resume();return;}const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const C=new AC();SND.ctx=C;
  SND.m=C.createGain();SND.m.gain.value=.7;SND.m.connect(C.destination);
  const b=C.createBuffer(1,C.sampleRate*3,C.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5;}SND.brown=b;
  const loop=(type,f,q)=>{const s=C.createBufferSource();s.buffer=b;s.loop=true;const fl=C.createBiquadFilter();fl.type=type;fl.frequency.value=f;if(q)fl.Q.value=q;const g=C.createGain();g.gain.value=0;s.connect(fl);fl.connect(g);g.connect(SND.m);s.start();return {g,fl};};
  const r=loop('lowpass',300);SND.rumble=r.g;SND.rf=r.fl;SND.breath=loop('bandpass',700,.6).g;
  // ambient pad: a slow, warm chord
  SND.pad=C.createGain();SND.pad.gain.value=0;SND.pad.connect(SND.m);
  [110,164.8,220,277.2,329.6].forEach((f,i)=>{const o=C.createOscillator(),g=C.createGain(),lf=C.createOscillator(),lg=C.createGain();o.type=i%2?'triangle':'sine';o.frequency.value=f*(1+(i-2)*.0015);g.gain.value=.05;
    lf.frequency.value=.05+i*.017;lg.gain.value=.035;lf.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(SND.pad);o.start();lf.start();});}
function setG(g,v,tc=.15){if(!SND.ctx||!g)return;g.gain.setTargetAtTime(state.sound?v:0,SND.ctx.currentTime,state.sound?tc:.05);}
function tone(f,d,v,type='sine',when=0){if(!SND.ctx||!state.sound)return;const C=SND.ctx,o=C.createOscillator(),g=C.createGain(),t=C.currentTime+when;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(SND.m);o.start(t);o.stop(t+d+.02);}
const beep=(f=880,d=.1,v=.06)=>tone(f,d,v);
function chime(){[660,880,1320].forEach((f,i)=>tone(f,.18,.035,'sine',i*.09));}
function thud(v=.6){if(!SND.ctx||!state.sound)return;const C=SND.ctx,s=C.createBufferSource(),g=C.createGain(),f=C.createBiquadFilter(),t=C.currentTime;s.buffer=SND.brown;f.type='lowpass';f.frequency.value=180;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.9);s.connect(f);f.connect(g);g.connect(SND.m);s.start(t);s.stop(t+1);}
function shutter(){tone(2400,.03,.08);tone(1800,.04,.06,'sine',.06);}
let voices=[];function pickV(){voices=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang));}
if('speechSynthesis' in window){pickV();speechSynthesis.onvoiceschanged=pickV;}
const VPREF={HOUSTON:['Samantha','Ava','Allison','Google US English'],FLIGHT:['Kate','Serena','Google UK English Female','Moira'],SURGEON:['Karen','Catherine','Fiona','Susan'],EECOM:['Rishi','Aaron','Tom','Alex'],ACCT:['Alex','Tom','Reed','Evan'],ROSTER:['Tessa','Moira','Veena','Victoria']};
function vFor(role){if(!voices.length)return null;for(const n of VPREF[role]||[]){const v=voices.find(x=>x.name.includes(n));if(v)return v;}return voices[(Object.keys(VPREF).indexOf(role)*3+1)%voices.length];}
const CLIPS={"HOUSTON|goodmorningcommandertinalastchanceforthebathroom":"houston-01","HOUSTON|tminusten":"houston-02","HOUSTON|nine":"houston-03","HOUSTON|eight":"houston-04","HOUSTON|seven":"houston-05","HOUSTON|six":"houston-06","HOUSTON|five":"houston-07","HOUSTON|four":"houston-08","HOUSTON|threeignition":"houston-09","HOUSTON|two":"houston-10","HOUSTON|one":"houston-11","HOUSTON|liftofftinahasclearedthetower":"houston-12","HOUSTON|maxqthisisthebumpybithangon":"houston-13","HOUSTON|boosterseparationconfirm":"houston-14","HOUSTON|welcometoorbittinayourstomachhasfiledacomplaint":"houston-15","HOUSTON|cargoshiponapproachitcantdockbyitself":"houston-16","HOUSTON|movethearmoverthetargetandholdsteadythenclickorpressspace":"houston-17","HOUSTON|linedupclickorpressspacetocapture":"houston-18","HOUSTON|itdriftedlineitupagain":"houston-19","HOUSTON|captureconfirmedniceflying":"houston-20","HOUSTON|firstruleoutsideclipyourtetherclicktheyellowring":"houston-21","HOUSTON|nowgohandoverhandalongthetrussholdthebuttonorspace":"houston-22","HOUSTON|theglowingpinkunitisthebrokenoneclickit":"houston-23","HOUSTON|oldunitoutnowwireinthenewone":"houston-24","HOUSTON|ticketclosedtenoutoftenwouldspacewalkagain":"houston-25","HOUSTON|lookdownthatsmallwarmlightisnelsonthatshome":"houston-26","HOUSTON|andthebrightoneupnorthisaucklandyournextmission":"houston-27","HOUSTON|youreabouttolosesignalbehindthemoononemessagecameinfirst":"houston-28","HOUSTON|beforeyougodontforgetto":"houston-29","HOUSTON|signalsbacksorryrostergotinfirst":"houston-30","HOUSTON|entrythefireballisnormalmostly":"houston-31","HOUSTON|boldwrongbutboldwaitforthegreenzone":"houston-32","HOUSTON|droguechutesoutperfecttiming":"houston-33","HOUSTON|theautopilotdeployedthechutesforyouwewonttellanyone":"houston-34","HOUSTON|splashdownwelcomehometina":"houston-35","FLIGHT|goornogoforlaunch":"flight-01","FLIGHT|overruledwedothenumbersyoubringthejudgmentgo":"flight-02","EECOM|yoursparepowercontrollerisonboardgoodtimingonejustfailed":"eecom-01","EECOM|nomathsjustmatchthecolours":"eecom-02","EECOM|sparksprettybutnosamecolournextbox":"eecom-03","EECOM|poweroneverychannelimaycry":"eecom-04","ACCT|goreluctantlydoyouknowwhatthiscosts":"acct-01","ACCT|thoseboosterswerearental":"acct-02","ACCT|twelvetonnesnotascratchaccountingisrelieved":"acct-03","ACCT|mainchutesopenpleasereturnthemfolded":"acct-04","ROSTER|nogotinahasntloggedherhours":"roster-01","ROSTER|hitinawasthisspacewalkpreapprovedasovertime":"roster-02","ROSTER|yourebackyourtimesheetisfortyminutesoverdue":"roster-03","LEAK|hitinasogladyousignedupforthismissionenjoythelastpartmeetyouonearth":"leak-01","LEAK|onemorethingsomeonewhoflewthisforrealsaiditbest":"leak-02","LEAK|planetearthyouareacrew":"leak-03"};
const normK=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
function clipFor(role,text){const id=CLIPS[role+'|'+normK(text)];return id?id+'.mp3':null;}
let curClip=null,curRes=null;
function unduck(){if(SND.ctx&&SND.m)SND.m.gain.setTargetAtTime(.7,SND.ctx.currentTime,.25);}
function stopClip(){if(curClip){try{curClip.pause();}catch(e){}curClip=null;}if(curRes){const r=curRes;curRes=null;r();}unduck();}
function voice(t,role){stopClip();const src=clipFor(role,t);if(!src||!state.sound||!state.voices)return Promise.resolve();
  return new Promise(res=>{try{const a=new Audio(src);curClip=a;curRes=res;a.volume=1;
    if(SND.ctx&&SND.m)SND.m.gain.setTargetAtTime(.35,SND.ctx.currentTime,.1);
    const done=()=>{if(curClip===a){curClip=null;curRes=null;unduck();}res();};
    a.onended=a.onerror=done;const p=a.play();if(p&&p.catch)p.catch(done);}catch(e){res();}});}

/* ============ shared art ============ */
const STARS=Array.from({length:280},()=>[Math.random(),Math.random(),Math.random()*1.3+.3,Math.random()]);
let perf=0;
function stars(a=1,drift=0){ctx.save();for(const [x,y,r,tw] of STARS){ctx.globalAlpha=a*(.5+.5*Math.sin(perf/900+tw*9));ctx.fillStyle=tw>.9?'#ffb3dc':'#fff';ctx.fillRect(((x+drift)%1)*W,y*H,r,r);}ctx.restore();}
function nebula(){const g=ctx.createRadialGradient(W*.2,H*.25,0,W*.2,H*.25,W*.7);g.addColorStop(0,'rgba(120,60,200,.22)');g.addColorStop(1,'rgba(7,5,15,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const g2=ctx.createRadialGradient(W*.85,H*.8,0,W*.85,H*.8,W*.6);g2.addColorStop(0,'rgba(255,79,163,.14)');g2.addColorStop(1,'rgba(7,5,15,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,W,H);}

/* ============ Three.js (lazy) ============ */
const GL={r:null,cam:null};
function gl(){if(GL.r)return GL;GL.r=new THREE.WebGLRenderer({antialias:true,logarithmicDepthBuffer:true,preserveDrawingBuffer:true});GL.r.setPixelRatio(Math.min(2,window.devicePixelRatio||1));GL.r.outputEncoding=THREE.sRGBEncoding;$('glhost').appendChild(GL.r.domElement);fit();return GL;}
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
let EARTH_TEX=null,MOON_TEX=null;
function earthTex(){if(EARTH_TEX)return EARTH_TEX;EARTH_TEX=canvasTex(2048,1024,(x,w,h)=>{
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1d3f66');g.addColorStop(.5,'#1b4f86');g.addColorStop(1,'#1d3f66');x.fillStyle=g;x.fillRect(0,0,w,h);
  const blob=(cx,cy,r,col,n)=>{x.fillStyle=col;for(let i=0;i<n;i++){const a=Math.random()*6.28,d=Math.random()*r;x.beginPath();x.arc(cx+Math.cos(a)*d*1.6,cy+Math.sin(a)*d,r*(.15+Math.random()*.35),0,7);x.fill();}};
  [[300,330,120],[520,640,110],[1000,300,150],[1100,560,120],[1500,330,170],[1650,700,90],[880,820,60]].forEach(([cx,cy,r])=>{blob(cx,cy,r,'#3c6b3a',40);blob(cx,cy,r*.7,'#7a6a45',18);});
  x.fillStyle='#e8eef5';x.fillRect(0,0,w,40);x.fillRect(0,h-50,w,50);
  for(let i=0;i<380;i++){x.globalAlpha=.06+Math.random()*.2;x.fillStyle='#fff';x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,20+Math.random()*90,6+Math.random()*20,Math.random()*.6,0,7);x.fill();}x.globalAlpha=1;});return EARTH_TEX;}
function moonTex(){if(MOON_TEX)return MOON_TEX;MOON_TEX=canvasTex(1024,512,(x,w,h)=>{x.fillStyle='#8d8b86';x.fillRect(0,0,w,h);
  for(let i=0;i<40;i++){x.globalAlpha=.25;x.fillStyle='#5e5d5a';x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,30+Math.random()*90,20+Math.random()*60,0,0,7);x.fill();}
  for(let i=0;i<700;i++){const cx=Math.random()*w,cy=Math.random()*h,r=1+Math.pow(Math.random(),3)*22;x.globalAlpha=.5;x.strokeStyle='#bdbab3';x.lineWidth=1;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();x.fillStyle='#6f6d68';x.globalAlpha=.35;x.beginPath();x.arc(cx+r*.15,cy+r*.15,r*.85,0,7);x.fill();}x.globalAlpha=1;});return MOON_TEX;}
function earthMesh(R){const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.SphereGeometry(R,96,64),new THREE.MeshStandardMaterial({map:earthTex(),roughness:.9,metalness:0})));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.025,96,64),new THREE.MeshBasicMaterial({color:'#8fa8ff',transparent:true,opacity:.2,side:THREE.BackSide,blending:THREE.AdditiveBlending,depthWrite:false})));return g;}
function starSphere(R){const g=new THREE.BufferGeometry(),p=[];for(let i=0;i<2500;i++){const v=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(R);p.push(v.x,v.y,v.z);}g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));return new THREE.Points(g,new THREE.PointsMaterial({color:'#ffffff',size:1.4,sizeAttenuation:false}));}

/* ============ scene engine ============ */
let cur=null,last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;perf=now;if(cur&&cur.update)cur.update(dt);requestAnimationFrame(loop);}
function go(i){
  token++;if(cur&&cur.end)cur.end();
  state.i=i;const S=SCENES[i];$('stK').textContent=S.k;$('stT').textContent=S.t;$('stC').textContent=S.c||'';$('clock').textContent='MISSION '+S.k.toUpperCase();
  hush();acts([]);layer('');$('hud').innerHTML='';$('visor').hidden=true;$('glhost').style.display='none';mate(false);ctx.clearRect(0,0,W,H);c2d.onclick=null;c2d.style.cursor='';
  setG(SND.rumble,0);setG(SND.breath,0);setG(SND.pad,0,1.5);stopClip();
  cur=SCENE_IMPL[S.id]();renderTimeline();
}
function next(){state.done.add(state.i);go(Math.min(SCENES.length-1,state.i+1));}
function renderTimeline(){const ol=$('timeline');ol.innerHTML='';SCENES.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');
  b.className=(i===state.i?'cur ':'')+(state.done.has(i)?'done':'');b.innerHTML=`<span class="n">${state.done.has(i)?'✓ ':''}0${i}</span>${s.nav}`;b.onclick=()=>go(i);li.appendChild(b);ol.appendChild(li);});}

/* ============ porthole (launch + home) ============ */
function porthole(o){
  const sh=state.calm?0:o.shake||0, ox=(Math.random()-.5)*sh, oy=(Math.random()-.5)*sh;
  ctx.save();ctx.translate(ox,oy);
  const wall=ctx.createLinearGradient(0,0,0,H);wall.addColorStop(0,'#241a3d');wall.addColorStop(1,'#110b22');ctx.fillStyle=wall;ctx.fillRect(-20,-20,W+40,H+40);
  ctx.fillStyle='#1a1330';ctx.fillRect(18,H*.22,W*.2,H*.5);ctx.strokeStyle='#3a2d5c';ctx.strokeRect(18,H*.22,W*.2,H*.5);
  for(let r=0;r<6;r++)for(let c=0;c<4;c++){const on=((r*4+c+Math.floor(perf/700))%7)===0;ctx.fillStyle=on?'#ff4fa3':(r+c)%3?'#3a2d5c':'#7ee8d0';ctx.fillRect(34+c*(W*.2-32)/4,H*.26+r*H*.07,8,8);}
  const cx=W*.56,cy=H*.46,R=Math.min(W*.3,H*.36);
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.clip();
  const alt=o.alt||0,d=clamp(alt/90,0,1);
  const sky=ctx.createLinearGradient(0,cy-R,0,cy+R);
  sky.addColorStop(0,`rgb(${lerp(110,4,d)|0},${lerp(165,3,d)|0},${lerp(225,14,d)|0})`);sky.addColorStop(1,`rgb(${lerp(190,14,d)|0},${lerp(210,8,d)|0},${lerp(240,30,d)|0})`);
  ctx.fillStyle=sky;ctx.fillRect(cx-R,cy-R,2*R,2*R);
  if(d>.5){ctx.save();ctx.globalAlpha=(d-.5)*2;for(const [x,y,r] of STARS.slice(0,120)){ctx.fillStyle='#fff';ctx.fillRect(cx-R+x*2*R,cy-R+y*2*R,r,r);}ctx.restore();}
  if(o.water){const wg=ctx.createLinearGradient(0,cy,0,cy+R);wg.addColorStop(0,'#2f6f9a');wg.addColorStop(1,'#0d3553');const bob=Math.sin(perf/700)*R*.05;ctx.fillStyle=wg;ctx.fillRect(cx-R,cy+bob,2*R,R*1.2);
    ctx.strokeStyle='rgba(255,255,255,.35)';for(let i=0;i<9;i++){const y=cy+bob+8+i*i*3;ctx.beginPath();for(let x=cx-R;x<cx+R;x+=12)ctx.lineTo(x,y+Math.sin((x+perf/8)/18+i)*2);ctx.stroke();}}
  else if(alt<1.5){ctx.fillStyle='#4d6a3f';ctx.fillRect(cx-R,cy+R*.45+alt*R*.5,2*R,R);
    ctx.strokeStyle='#8a3d6a';ctx.lineWidth=5;const tx=cx-R*.55,ty=cy+R*.45+alt*R*.5;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx,ty-R*1.2);ctx.moveTo(tx+20,ty);ctx.lineTo(tx+20,ty-R*1.2);ctx.stroke();ctx.lineWidth=2;for(let y=ty;y>ty-R*1.2;y-=16){ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(tx+20,y-16);ctx.stroke();}ctx.lineWidth=1;}
  if(alt>1&&alt<14&&!o.water){ctx.fillStyle='rgba(255,255,255,.75)';const off=(o.cloud||0);for(let i=0;i<7;i++){const y=((i*137+off)%(2.6*R))-R*.3+cy-R;const x=cx-R+((i*271)%(2*R));ctx.beginPath();ctx.ellipse(x,y,R*.35,R*.08,0,0,7);ctx.fill();}}
  if(alt>35&&!o.water){const k=clamp((alt-35)/80,0,1),ER=R*lerp(14,4.5,k),ey=cy+R*lerp(.95,.5,k)+ER;
    const eg=ctx.createRadialGradient(cx,ey,ER*.9,cx,ey,ER);eg.addColorStop(0,'#1b4f86');eg.addColorStop(.98,'#3f86c6');eg.addColorStop(1,'#d6c6ff');
    ctx.fillStyle=eg;ctx.beginPath();ctx.arc(cx,ey,ER,0,7);ctx.fill();
    // the thin line of atmosphere: the thing nobody sees unless they're up here
    for(let i=0;i<5;i++){ctx.strokeStyle=`rgba(${150+i*20},${170-i*10},255,${.5-i*.09})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,ey,ER+2+i*3,0,7);ctx.stroke();}ctx.lineWidth=1;
    ctx.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<14;i++){ctx.beginPath();ctx.ellipse(cx-R+((i*97+perf/40)%(2*R)),ey-ER+12+(i%4)*9,30,5,0,0,7);ctx.fill();}
    if(o.glow){const sg=ctx.createRadialGradient(cx+R*.5,ey-ER,0,cx+R*.5,ey-ER,R*o.glow*1.2);sg.addColorStop(0,`rgba(255,240,220,${.9*o.glow})`);sg.addColorStop(.3,`rgba(255,150,200,${.5*o.glow})`);sg.addColorStop(1,'rgba(120,80,255,0)');ctx.fillStyle=sg;ctx.fillRect(cx-R,cy-R,2*R,2*R);}}
  if(o.plasma>0){const p=o.plasma*(state.calm?.6:1);const pg=ctx.createRadialGradient(cx,cy+R,R*.1,cx,cy+R*.3,R*1.4);pg.addColorStop(0,`rgba(255,240,220,${.95*p})`);pg.addColorStop(.35,`rgba(255,110,120,${.8*p})`);pg.addColorStop(.7,`rgba(255,60,180,${.5*p})`);pg.addColorStop(1,'rgba(90,30,120,0)');ctx.fillStyle=pg;ctx.fillRect(cx-R,cy-R,2*R,2*R);}
  if(o.chutes){const n=o.chutes===1?2:3;for(let i=0;i<n;i++){const x=cx+(i-(n-1)/2)*R*.55+Math.sin(perf/900+i)*6,y=cy-R*.75,s=o.chutes===1?R*.16:R*.33;ctx.fillStyle=i%2?'#f6f1f7':'#ff4fa3';ctx.beginPath();ctx.ellipse(x,y,s,s*.55,0,Math.PI,0);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(cx,cy+R);ctx.moveTo(x+s,y);ctx.lineTo(cx,cy+R);ctx.stroke();}}
  ctx.restore();
  ctx.lineWidth=R*.12;ctx.strokeStyle='#3a2d5c';ctx.beginPath();ctx.arc(cx,cy,R+R*.06,0,7);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#6a5a96';ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  for(let i=0;i<12;i++){const a=i/12*6.283;ctx.fillStyle='#7a6aa6';ctx.beginPath();ctx.arc(cx+Math.cos(a)*(R+R*.06),cy+Math.sin(a)*(R+R*.06),3,0,7);ctx.fill();}
  ctx.lineWidth=1;
  // zero-g indicator: a pixel plush planet on a string
  const f=o.float||0,hx=cx-R-34+Math.sin(perf/1300)*f*34,hy=lerp(H*.12+R*.55,H*.14+Math.sin(perf/1700)*f*26,f);
  if(f<.99){ctx.strokeStyle='rgba(230,220,245,.6)';ctx.beginPath();ctx.moveTo(cx-R-34,H*.05);ctx.quadraticCurveTo(cx-R-34+f*22,H*.05+(hy-H*.05)*.5,hx,hy-20);ctx.stroke();}
  ctx.save();ctx.translate(hx,hy);ctx.rotate(f*Math.sin(perf/1100)*.6);ctx.fillStyle='#ff9ad0';ctx.beginPath();ctx.arc(0,0,19,0,7);ctx.fill();ctx.strokeStyle='#7ee8d0';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,32,8,-.3,0,7);ctx.stroke();ctx.lineWidth=1;ctx.fillStyle='#3a1030';ctx.beginPath();ctx.arc(-6,-3,2.3,0,7);ctx.arc(6,-3,2.3,0,7);ctx.fill();ctx.strokeStyle='#3a1030';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,3,5,.2,2.9);ctx.stroke();ctx.restore();
  ctx.restore();
}


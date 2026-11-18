/* ============ SCENES ============ */
const SCENE_IMPL={
/* ---------- invitation ---------- */
invite(){
  const L=layer(`<div class="mail" role="dialog" aria-label="Email from the Office of Astronaut Selection">
   <div class="main">
    <div class="meta">From: <b>Office of Astronaut Selection</b> (Dept. of Extremely Long Forms)<br>To: <b>${CREW}</b><br>Subject: <b>RE: RE: RE: Your application (approved)</b></div>
    <p>Dear ${CREW},</p>
    <p>After reviewing 12,000 applications, three committees and one very confused printer, we are pleased to confirm your seat on a one-day astronaut experience, following the path of NASA astronaut <b>Christina Koch</b>.</p>
    <p>The committee noted that your experience keeping young people calm, focused and heard under pressure is <i>"frankly more relevant than half the flight manual."</i></p>
    <p>Before you go, please complete Form 27-B/6.</p>
    <div class="form"><div class="ft">Form 27-B/6 · Crew declaration</div>
     <label><input type="checkbox" class="req" id="f1"> I am not a robot.</label>
     <label><input type="checkbox" class="req" id="f2"> I am not a billionaire.</label>
     <label><input type="checkbox" class="req" id="f3"> I understand that Mission Control does the maths. All of it. That is literally their job.</label>
     <label><input type="checkbox" class="req" id="f4"> I understand that launch is non-refundable.</label>
     <label class="off"><input type="checkbox" disabled> I would like to bring my own rocket company.<small>Option unavailable. See Rule 1.</small></label>
    </div>
    <div class="signbar"><button class="go" id="sign">Sign the form</button><span id="signhint">Tick the four boxes to continue.</span></div>
   </div>
   <div class="side"><h3>Crew manifest</h3><ul><li>Seat 1 · ${CREW}, Commander</li><li>Seat 2 · One plush planet</li><li>Flight plan · borrowed from C. Koch</li></ul>
    <h3>Mission rules</h3><ol><li>No billionaires on board.</li><li>The coffee machine is a shared resource.</li><li>There is no Rule 3. We ran out of budget.</li></ol>
    <div class="fine">Best with headphones: switch on Sound for music and effects. Calm mode stops the shaking. Numbers are off: you get words instead.</div></div>
  </div>`);
  const allOk=()=>[...L.querySelectorAll('.req')].every(c=>c.checked);const chk=()=>{$('signhint').textContent=allOk()?'All set.':'Tick the four boxes to continue.';$('signhint').style.color='';};
  L.querySelectorAll('.req').forEach(c=>{c.onchange=chk;c.oninput=chk;});chk();
  $('sign').onclick=()=>{if(!allOk()){$('signhint').textContent='Not yet: tick the four boxes first.';$('signhint').style.color='#c22a77';return;}award('form');
    layer(`<div class="card" style="text-align:center;max-width:520px"><div class="eyebrow">Form 27-B/6 accepted</div><h2>Mission Tina-1 is ready</h2><p>About 15 minutes. Best with headphones.</p>
      <div class="row" style="justify-content:center"><button class="go" id="s1">Start mission</button><button id="s3">Start silent</button></div>
      <p style="font-family:var(--mono);font-size:12px;color:var(--muted)">Start mission = music, sound effects and voices. Start silent = text only.</p></div>`);
    const begin=(snd,vo)=>{state.sound=snd;state.voices=vo;if(snd)audio();paintToggles();next();};
    $('s1').onclick=()=>begin(true,true);$('s3').onclick=()=>begin(false,false);$('s1').focus({preventScroll:true});};
  return {update(){ctx.fillStyle='#07050f';ctx.fillRect(0,0,W,H);nebula();stars(.8,perf/400000);}};
},

/* ---------- launch ---------- */
launch(){
  const T=token;let phase='pad',t=0,cnt=null,float=0,cloud=0,glow=0;const SPEED=9.3;
  const ALT=[[0,0],[60,11],[90,22],[132,48],[300,110],[480,160],[510,165]];
  const VEL=[[0,0],[60,1500],[90,2500],[132,5500],[300,13000],[480,26500],[510,28000]];
  const GF=[[0,1.3],[60,1.7],[90,1.9],[131,2.6],[133,1.0],[300,1.5],[470,3.0],[500,3.0],[506,0]];
  mate(true);
  (async()=>{
    await ask('HOUSTON','Good morning, Commander '+CREW+'. Last chance for the bathroom.','Done. Reluctantly.');if(!alive(T))return;
    if(!await talk(T,[['FLIGHT','Go or no-go for launch?'],['ACCT','Go. Reluctantly. Do you know what this costs?'],['ROSTER','No-go. Tina hasn\'t logged her hours.']]))return;
    await ask('FLIGHT','Overruled. We do the numbers, you bring the judgment. Go?','GO');if(!alive(T))return;
    audio();cnt=10;say('HOUSTON','T minus ten.');
    for(let n=10;n>0;n--){if(!alive(T))return;cnt=n;if(n<10)say('HOUSTON',n===3?'Three. Ignition.':['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'][n]+'.');beep(880,.08,.05);if(n===3)setG(SND.rumble,.35,.8);await wait(n===3?1800:1000);}
    if(!alive(T))return;cnt=null;phase='ascent';say('HOUSTON','Liftoff! '+CREW+' has cleared the tower.');setG(SND.rumble,.9,.4);
  })();
  const events=[[70,()=>{say('HOUSTON','Max Q. This is the bumpy bit. Hang on.');award('maxq');}],
    [132,()=>{thud(.9);say('HOUSTON','Booster separation. Confirm?');acts([{label:'Confirm separation',go:true,fn:()=>{say('ACCT','Those boosters were a rental.');}}]);}],
    [300,()=>{acts([]);hush();}],
    
    [506,()=>{phase='orbit';setG(SND.rumble,0,.2);setG(SND.pad,.5,3);thud(.4);say('HOUSTON','Welcome to orbit, '+CREW+'. Your stomach has filed a complaint.');award('orbit');
      (async()=>{await wait(5000);if(!alive(T))return;
        say('QUIET','That thin glowing line is all the air there is.');await wait(7000);if(!alive(T))return;
        await fact('Christina Koch · real','Her first launch',`<p>Koch first launched on <b>14 March 2019</b> and stayed <b>328 days</b>: the longest single spaceflight by a woman.</p><p>The floating plush is a real tradition. When the toy floats, the crew knows they're weightless.</p>`,
        `<b>Orbit isn't "no gravity".</b> You float because you're falling around Earth at about 28,000 km/h, so fast the ground curves away before you hit it.`);if(alive(T))next();})();}]];
  let ei=0;
  return {update(dt){
    let alt=0,vel=0,g=1;
    if(phase!=='pad'){t+=dt*SPEED;const tt=Math.min(t,510);alt=interp(ALT,tt);vel=interp(VEL,tt);g=phase==='orbit'?0:interp(GF,tt);
      while(ei<events.length&&t>=events[ei][0]){events[ei][1]();ei++;}
      cloud+=dt*(alt<14?vel/6:0);if(phase==='orbit'){float=Math.min(1,float+dt*.5);glow=Math.min(1,glow+dt*.12);}
      if(SND.rf)SND.rf.frequency.value=lerp(320,140,clamp(alt/80,0,1));}
    const sh=phase==='ascent'?(t<132?2+12*Math.exp(-(((t-70)/30)**2)):1.5):cnt!=null&&cnt<=3?1.5:0;
    porthole({alt,shake:sh,float,cloud,glow});
    if(cnt!=null){ctx.save();ctx.fillStyle='rgba(7,5,15,.35)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font=`700 ${Math.min(W*.2,150)}px "Barlow Condensed", sans-serif`;ctx.textAlign='center';ctx.fillText('T−'+cnt,W*.56,H*.52);ctx.restore();}
    hud([['T+',phase==='pad'?'00:00':fmtT(t),null],['HEIGHT',alt.toFixed(1)+' km',wAlt(alt)],['SPEED',Math.round(vel).toLocaleString('en-NZ')+' km/h',wSpeed(vel)],['WEIGHT',g.toFixed(1)+' g',wG(g)],['STATUS',phase==='pad'?'ON THE PAD':phase==='orbit'?'IN ORBIT':'ASCENT',phase==='pad'?'ON THE PAD':phase==='orbit'?'IN ORBIT':'ASCENT']]);
  },end(){setG(SND.rumble,0,.1);}};
},

/* ---------- catch a cargo ship with the robot arm ---------- */
cargo(){
  const T=token;let t=0,step='approach',tx=W*.25,ty=H*.3,ax=W*.25,ay=H*.3,hold=0,cap=0,auto=false,fx=0,fy=0;
  const S=()=>Math.min(W,H),keys={};
  const move=e=>{const r=c2d.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;auto=false;};
  stage.addEventListener('pointermove',move);stage.addEventListener('pointerdown',move);c2d.style.touchAction='none';c2d.onclick=()=>{if(step==='ready')capture();};
  const kd=e=>{if(e.key.startsWith('Arrow')){keys[e.key]=e.type==='keydown';e.preventDefault();auto=false;}if(e.code==='Space'&&e.type==='keydown'&&step==='ready'){e.preventDefault();capture();}};
  addEventListener('keydown',kd);addEventListener('keyup',kd);
  const helper=()=>acts([{label:'Let the autopilot help',keep:true,fn:()=>{auto=true;}}]);
  function capture(){if(step!=='ready')return;step='captured';acts([]);thud(.5);award('cargo');
    (async()=>{if(!await talk(T,[['HOUSTON','Capture confirmed. Nice flying.'],['ACCT','Twelve tonnes, not a scratch. Accounting is relieved.'],['EECOM','Your spare power controller is on board. Good timing: one just failed.']]))return;
      await fact('Christina Koch · real','Catching a cargo ship',`<p>In <b>September 2019</b>, Koch used the station's 17-metre robot arm to catch a Japanese cargo ship. It could fly up to the station, but it couldn't dock by itself.</p><p>On board: new batteries for the station. Installing them led to the spacewalk you're about to do.</p>`,
        `Both the station and the cargo ship are moving at about 28,000 km/h. They're just doing it together, so the catch happens at walking pace.`);if(alive(T))next();})();}
  (async()=>{if(!await talk(T,[['HOUSTON','Cargo ship on approach. It can\'t dock by itself.'],['HOUSTON','Move the arm over the target and hold steady. Then click, or press Space.']]))return;if(step==='approach'){step='align';helper();}})();
  return {update(dt){t+=dt;const s=S();
    // Earth sliding past, far below
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#123a6e');bg.addColorStop(1,'#1d5a96');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    for(let i=0;i<7;i++){const x=((i*311+t*26)%(W+500))-250,y=(i*173)%H;ctx.fillStyle=i%2?'rgba(60,110,70,.55)':'rgba(120,105,70,.45)';ctx.beginPath();ctx.ellipse(x,y,140+i*22,60+i*9,i*.5,0,7);ctx.fill();}
    for(let i=0;i<22;i++){const x=((i*197+t*38)%(W+400))-200,y=(i*89)%H;ctx.fillStyle='rgba(255,255,255,.3)';ctx.beginPath();ctx.ellipse(x,y,90+(i%5)*26,14+(i%4)*7,.25,0,7);ctx.fill();}
    // the ship
    const k=lerp(.3,1,ease(clamp(t/8,0,1)));
    if(step!=='captured'){fx=W*.5+Math.sin(t*.31)*W*.13+Math.sin(t*.83)*W*.03;fy=H*.46+Math.cos(t*.27)*H*.11;}
    const R=s*.22*k;
    ctx.save();ctx.translate(fx,fy);ctx.rotate(Math.sin(t*.1)*.15);
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.arc(R*.08,R*.1,R*1.02,0,7);ctx.fill();
    ctx.fillStyle='#5a5668';ctx.beginPath();ctx.arc(0,0,R,0,7);ctx.fill();
    const gg=ctx.createRadialGradient(-R*.3,-R*.35,R*.1,0,0,R*.93);gg.addColorStop(0,'#fbe3a0');gg.addColorStop(.6,'#d9a94a');gg.addColorStop(1,'#a8762a');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(0,0,R*.93,0,7);ctx.fill();
    ctx.strokeStyle='rgba(120,80,20,.35)';ctx.lineWidth=1;for(let i=0;i<14;i++){const a=i*2.4;ctx.beginPath();ctx.moveTo(Math.cos(a)*R*.2,Math.sin(a)*R*.2);ctx.lineTo(Math.cos(a+.5)*R*.88,Math.sin(a+.5)*R*.88);ctx.stroke();}
    for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2+.4);ctx.fillStyle='#3d3a4a';ctx.fillRect(R*.86,-R*.07,R*.2,R*.14);ctx.restore();}
    const pl=R*.26;ctx.fillStyle='#f4f0fa';ctx.beginPath();ctx.roundRect?ctx.roundRect(-pl,-pl,pl*2,pl*2,pl*.2):ctx.rect(-pl,-pl,pl*2,pl*2);ctx.fill();
    ctx.strokeStyle='#15121f';ctx.lineWidth=Math.max(2,R*.03);ctx.beginPath();ctx.moveTo(-pl*.8,0);ctx.lineTo(pl*.8,0);ctx.moveTo(0,-pl*.8);ctx.lineTo(0,pl*.8);ctx.stroke();ctx.beginPath();ctx.arc(0,0,pl*.5,0,7);ctx.stroke();
    ctx.fillStyle='#15121f';ctx.beginPath();ctx.arc(0,0,pl*.2,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,pl*.07,0,7);ctx.fill();
    ctx.restore();ctx.lineWidth=1;
    // the arm: heavy, so it lags behind your hand
    for(const [key,dx,dy] of [['ArrowLeft',-1,0],['ArrowRight',1,0],['ArrowUp',0,-1],['ArrowDown',0,1]])if(keys[key]){tx+=dx*300*dt;ty+=dy*300*dt;}
    if(auto){tx=fx;ty=fy;}
    if(step==='captured'){cap=Math.min(1,cap+dt*1.4);ax=lerp(ax,fx,Math.min(1,dt*8));ay=lerp(ay,fy,Math.min(1,dt*8));}
    else{ax=lerp(ax,tx,Math.min(1,dt*2.4));ay=lerp(ay,ty,Math.min(1,dt*2.4));}
    const d=Math.hypot(ax-fx,ay-fy),tol=s*.045;
    if(step==='align'||step==='ready'){hold=clamp(hold+(d<tol?dt/1.3:-dt*1.1),0,1);
      if(hold>=1&&step==='align'){step='ready';tone(990,.1,.05);say('HOUSTON','Lined up! Click or press Space to capture.');acts([{label:'Capture (Space)',go:true,fn:capture}]);}
      if(hold<.25&&step==='ready'){step='align';say('HOUSTON','It drifted. Line it up again.');helper();}}
    const bx=W*1.03,by=H*1.08,ex=lerp(bx,ax,.5)+s*.12,ey=lerp(by,ay,.5)-s*.06;
    ctx.lineCap='round';ctx.lineJoin='round';
    for(const [w,c] of [[s*.05,'#8f88a6'],[s*.036,'#e4def0']]){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.lineTo(ax,ay);ctx.stroke();}
    ctx.fillStyle='#8f88a6';ctx.beginPath();ctx.arc(ex,ey,s*.032,0,7);ctx.fill();
    const rr=s*.075*(1-cap*.35),col=step==='captured'?'#8df0b8':d<tol?'#8df0b8':'#ff4fa3';
    ctx.strokeStyle='#e4def0';ctx.lineWidth=s*.02;ctx.beginPath();ctx.arc(ax,ay,rr,0,7);ctx.stroke();
    ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ax-rr*1.5,ay);ctx.lineTo(ax-rr*.3,ay);ctx.moveTo(ax+rr*.3,ay);ctx.lineTo(ax+rr*1.5,ay);ctx.moveTo(ax,ay-rr*1.5);ctx.lineTo(ax,ay-rr*.3);ctx.moveTo(ax,ay+rr*.3);ctx.lineTo(ax,ay+rr*1.5);ctx.stroke();
    if(hold>0&&step!=='captured'){ctx.strokeStyle='#8df0b8';ctx.lineWidth=5;ctx.beginPath();ctx.arc(ax,ay,rr*1.35,-Math.PI/2,-Math.PI/2+hold*6.283);ctx.stroke();}
    if(step==='ready'){ctx.fillStyle='#8df0b8';ctx.font='600 20px "Barlow Condensed", sans-serif';ctx.textAlign='center';ctx.fillText('CLICK OR PRESS SPACE',ax,ay-rr*1.9);}
    if(step==='captured'){ctx.strokeStyle='#8df0b8';ctx.lineWidth=3;for(let i=0;i<3;i++){const a=i*2.094+cap*1.2;ctx.beginPath();ctx.moveTo(ax+Math.cos(a)*rr,ay+Math.sin(a)*rr);ctx.lineTo(ax+Math.cos(a+2.4)*rr,ay+Math.sin(a+2.4)*rr);ctx.stroke();}}
    ctx.lineWidth=1;
    const vg=ctx.createRadialGradient(W/2,H/2,s*.35,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(7,5,15,0)');vg.addColorStop(1,'rgba(7,5,15,.7)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    const al=step==='captured'?'captured':hold>=1?'locked':d<tol*2?'almost':'drifting';
    hud([['DISTANCE',(9*(1.12-k)).toFixed(1)+' m',k<.75?'closing in':'arm\'s reach'],['ALIGNMENT',step==='captured'?'100%':Math.round(hold*100)+'%',al],['CARGO','12 t','very heavy']]);
  },end(){stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerdown',move);removeEventListener('keydown',kd);removeEventListener('keyup',kd);c2d.style.touchAction='';}};
},

/* ---------- spacewalk ---------- */
eva(){
  const T=token;gl();$('glhost').style.display='block';$('visor').hidden=false;
  const sc=new THREE.Scene();const cam=new THREE.PerspectiveCamera(62,W/H,.1,5e7);GL.cam=cam;
  sc.add(starSphere(4e7));
  const RE=6371e3,earth=earthMesh(RE);earth.position.set(0,-RE-400e3,0);sc.add(earth);
  const sun=new THREE.DirectionalLight('#fff3e0',1.2);sc.add(sun);sc.add(new THREE.AmbientLight('#5a4a88',.4));
  const metal=c=>new THREE.MeshStandardMaterial({color:c,metalness:.6,roughness:.45});
  sc.add(new THREE.Mesh(new THREE.BoxGeometry(60,1.6,1.6),metal('#b9b6c7')));
  for(let x=-29;x<=29;x+=2){const r=new THREE.Mesh(new THREE.BoxGeometry(.12,1.7,1.7),metal('#7d7892'));r.position.x=x;sc.add(r);}
  const panelTex=canvasTex(256,512,(x,w,h)=>{x.fillStyle='#231d55';x.fillRect(0,0,w,h);x.strokeStyle='#c9a24a';x.lineWidth=2;for(let i=0;i<=w;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke();}for(let j=0;j<=h;j+=32){x.beginPath();x.moveTo(0,j);x.lineTo(w,j);x.stroke();}});
  for(const sx of [-1,1])for(const sz of [-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(8,.05,30),new THREE.MeshStandardMaterial({map:panelTex,metalness:.2,roughness:.75}));p.position.set(sx*26,0,sz*17);sc.add(p);}
  const mod=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,12,32),metal('#e3e0ea'));mod.rotation.x=Math.PI/2;mod.position.set(-8,0,-9);sc.add(mod);
  const lights=[];for(let x=-24;x<=24;x+=6){const l=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshBasicMaterial({color:'#3a3344'}));l.position.set(x,.85,.85);sc.add(l);lights.push(l);}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.35,.08,12,32),new THREE.MeshStandardMaterial({color:'#ffd36b',emissive:'#6b4a00'}));ring.position.set(-4,1.05,.4);ring.rotation.x=Math.PI/2;sc.add(ring);
  const unit=new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.7),new THREE.MeshStandardMaterial({color:'#8a2a55',emissive:'#ff2f7f',emissiveIntensity:.6,metalness:.4,roughness:.5}));unit.position.set(6,1.15,0);sc.add(unit);
  // your spacewalk partner
  const mkTex=c=>new THREE.CanvasTexture(c);
  const texN=mkTex(SPR.astro),texU=mkTex(SPR.astroUp);
  const buddy=new THREE.Sprite(new THREE.SpriteMaterial({map:texN,transparent:true}));buddy.visible=false;
  let tether=null;const look=new THREE.Vector3(-1,.8,0);
  let step='ticket',sunA=-.4,moveP=0,holding=false,unitFloat=false,fixed=false,wrongs=0,eT=0,rostered=false;const uv=new THREE.Vector3(.25,.55,-.7);
  setG(SND.breath,.12,1);
  const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
  const onClick=e=>{const r=GL.r.domElement.getBoundingClientRect();mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mouse,cam);
    if(step==='tether'&&ray.intersectObject(ring).length){acts([]);doTether();}else if(step==='remove'&&ray.intersectObject(unit).length){acts([]);doRemove();}};
  GL.r.domElement.addEventListener('click',onClick);
  const key=e=>{if(e.code==='Space'&&step==='move'){e.preventDefault();holding=e.type==='keydown';}};
  addEventListener('keydown',key);addEventListener('keyup',key);
  function doTether(){step='x';tether=new THREE.Line(new THREE.BufferGeometry().setFromPoints([ring.position,cam.position.clone()]),new THREE.LineBasicMaterial({color:'#ffd36b'}));sc.add(tether);beep(600,.06,.06);
    say('TINA','Tether clipped. If I float away, I float away politely.');setTimeout(()=>{if(alive(T))startMove();},2200);}
  function startMove(){step='move';say('HOUSTON','Now go hand over hand along the truss. Hold the button, or Space.');
    const a=$('acts');a.innerHTML='';const b=document.createElement('button');b.className='go';b.textContent='Hold to move';a.appendChild(b);
    const on=e=>{e.preventDefault();holding=true;},off=()=>holding=false;b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);}
  function doRemove(){step='x';unitFloat=true;thud(.3);say('HOUSTON','Old unit out. Now wire in the new one.');setTimeout(()=>{if(alive(T))puzzle();},2400);}
  function puzzle(){step='puzzle';say('EECOM','No maths. Just match the colours.');
    const P={sa_p:[90,120,'+'],sa_n:[90,200,'−'],in_p:[260,120,'+'],in_n:[260,200,'−'],out_p:[380,120,'+'],out_n:[380,200,'−'],bt_p:[550,120,'+'],bt_n:[550,200,'−']};
    const GOOD=new Set(['sa_p|in_p','sa_n|in_n','out_p|bt_p','out_n|bt_n']),KEYS=Object.keys(P);
    const L=layer(`<div class="card circuit"><div class="eyebrow">Install the new power controller</div><h2>Connect the power</h2>
      <p>Click a terminal, then the same colour in the next box.</p>
      <svg viewBox="0 0 640 280" role="img" aria-label="Circuit board">
       <rect x="20" y="70" width="110" height="170" fill="#231d55" stroke="#c9a24a" stroke-width="3"/><text x="75" y="58" fill="#a99fc6" font-family="IBM Plex Mono" font-size="13" text-anchor="middle">SOLAR ARRAY</text>
       <rect x="230" y="70" width="180" height="170" fill="#1d1440" stroke="#a78bfa" stroke-width="3"/><text x="320" y="58" fill="#a99fc6" font-family="IBM Plex Mono" font-size="13" text-anchor="middle">NEW CONTROLLER</text>
       <text x="260" y="258" fill="#6d618c" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">IN</text><text x="380" y="258" fill="#6d618c" font-family="IBM Plex Mono" font-size="11" text-anchor="middle">OUT</text>
       <rect x="510" y="70" width="110" height="170" fill="#2a2016" stroke="#ffd36b" stroke-width="3"/><text x="565" y="58" fill="#a99fc6" font-family="IBM Plex Mono" font-size="13" text-anchor="middle">BATTERY</text>
       <g id="wires"></g>
       ${Object.entries(P).map(([k,[x,y,s]])=>`<g class="term" data-k="${k}" tabindex="0" role="button" aria-label="${k.replace('_',' ')} terminal"><circle cx="${x}" cy="${y}" r="12" fill="${s==='+'?'#ff4fa3':'#7ee8d0'}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-family="IBM Plex Mono" fill="#07050f" pointer-events="none">${s}</text></g>`).join('')}
      </svg><p id="pz" style="font-family:var(--mono);font-size:12.5px;color:var(--muted)">No wires yet.</p><div class="row"><button id="pzReset">Pull all wires</button></div></div>`);
    let sel=null;const made=new Set();
    const draw=()=>{$('wires').innerHTML=[...made].map(w=>{const [a,b]=w.split('|');const mx=(P[a][0]+P[b][0])/2,sag=P[a][2]==='+'?-46:46;return `<path d="M${P[a][0]} ${P[a][1]} C ${mx} ${P[a][1]+sag}, ${mx} ${P[b][1]+sag}, ${P[b][0]} ${P[b][1]}" stroke="${P[a][2]==='+'?'#ff4fa3':'#7ee8d0'}" stroke-width="5" stroke-linecap="round" fill="none"/>`;}).join('');$('pz').textContent=['No wires yet.','One wire in.','Two wires in. Halfway.','Three wires in. One to go.','All wired.'][made.size];};
    L.querySelectorAll('.term').forEach(g=>{const pick=()=>{const k=g.dataset.k;if(!sel){sel=k;g.classList.add('sel');return;}
      L.querySelectorAll('.term').forEach(x=>x.classList.remove('sel'));if(sel===k){sel=null;return;}
      const pair=[sel,k].sort((a,b)=>KEYS.indexOf(a)-KEYS.indexOf(b)).join('|');sel=null;
      if(GOOD.has(pair)){made.add(pair);tone(990,.05,.05,'square');draw();if(made.size===4)win();}
      else{wrongs++;tone(160,.18,.08,'square');say('EECOM','Sparks. Pretty, but no. Same colour, next box.');}};
      g.onclick=pick;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick();}};});
    $('pzReset').onclick=()=>{made.clear();draw();};}
  async function win(){fixed=true;layer('');award('ticket');lights.forEach(l=>l.material.color.set('#8df0b8'));
    if(!await talk(T,[['EECOM','Power on every channel. I may cry.'],['HOUSTON','Ticket closed. Ten out of ten, would spacewalk again.']]))return;
    if(!wrongs)award('firsttry');
    await fact('Christina Koch · real','The first all-woman spacewalk',`<p>On <b>18 October 2019</b>, Christina Koch and Jessica Meir made the first all-woman spacewalk.</p><p>Their job: replace a failed power controller, like the one you just wired. Before NASA, Koch was an <b>electrical engineer</b>.</p>`,
      `The station laps Earth every 90 minutes or so: a sunrise or sunset every 45. Batteries carry it through each night, which is why that controller matters.`);if(alive(T))next();}
  (async()=>{
    layer(`<div class="ticket"><div class="tn">TICKET #4471 · OPENED 06:12 GMT</div><h2>Power controller failed</h2>
      <dl><dt>Location</dt><dd>Outside. Very outside.</dd><dt>Priority</dt><dd>HIGH</dd><dt>Est. fix</dt><dd>All afternoon</dd><dt>Coffee</dt><dd>Unavailable</dd><dt>Union break</dt><dd>Denied (you are in space)</dd><dt>Assigned to</dt><dd>${CREW}</dd></dl>
      <div class="stamp">ACCEPT OR ACCEPT</div><div class="row"><button class="go" id="tk">Take the ticket</button></div></div>`);
    await new Promise(r=>$('tk').onclick=r);if(!alive(T))return;layer('');
    step='tether';say('HOUSTON','First rule outside: clip your tether. Click the yellow ring.');
    acts([{label:'Clip tether',go:true,fn:()=>{if(step==='tether')doTether();}}]);
  })();
  return {update(dt){
    eT+=dt;sunA+=dt*.045;sun.position.set(Math.cos(sunA)*1e7,Math.sin(sunA)*1e7*.6+2e6,-4e6);sun.intensity=clamp(Math.sin(sunA+.6)*1.3+.3,.12,1.2);
    earth.rotation.y+=dt*.004;
    if(step==='move'&&holding){moveP=Math.min(1,moveP+dt*.3);
      if(moveP>.45&&!rostered){rostered=true;say('ROSTER','Hi Tina! Was this spacewalk pre-approved as overtime?');}
      if(moveP>=1){step='remove';holding=false;acts([{label:'Remove the unit',go:true,fn:()=>{if(step==='remove')doRemove();}}]);say('HOUSTON','The glowing pink unit is the broken one. Click it.');}}
    const bob=state.calm?0:Math.sin(eT*1.3)*.05;
    cam.position.set(lerp(-7,3.2,moveP),2.6+bob,lerp(5,3.2,moveP));look.set(lerp(-1,6,moveP),lerp(.8,1.1,moveP),0);cam.lookAt(look);
    buddy.position.y=2.3+Math.sin(eT*.8)*.12;
    if(tether){const p=tether.geometry.attributes.position;p.setXYZ(1,cam.position.x-.4,cam.position.y-.9,cam.position.z-.6);p.needsUpdate=true;}
    if(!fixed&&!unitFloat)unit.material.emissiveIntensity=.35+.35*Math.sin(eT*4);
    if(unitFloat){unit.position.addScaledVector(uv,dt);unit.rotation.x+=dt*.4;unit.rotation.y+=dt*.3;unit.material.emissiveIntensity=.1;}
    ring.material.emissiveIntensity=step==='tether'?.6+.4*Math.sin(eT*5):.3;
    GL.r.render(sc,cam);
    const day=Math.sin(sunA+.6)>0;
    hud([['EVA TIME',fmtT(eT*20),null],['OXYGEN','98%','plenty'],['SUIT','4.3 psi','snug'],['ORBIT','400 km · 27,600 km/h','very high, very fast'],['LIGHT',day?'DAY':'NIGHT',day?'DAY':'NIGHT']]);
  },end(){GL.r.domElement.removeEventListener('click',onClick);removeEventListener('keydown',key);removeEventListener('keyup',key);setG(SND.breath,0,.1);sc.traverse(o=>{o.geometry&&o.geometry.dispose();});}};
},

/* ---------- the window: Aotearoa at night ---------- */
window(){
  const T=token;let t=0,said=0,ready=false;mate(true);setG(SND.pad,.9,3);
  const S=52,PJ=(lon,lat)=>[(lon-160)*S*.76+60,(-lat-30)*S+40];
  const NI=[[172.7,-34.4],[173.1,-35.0],[174.3,-35.3],[174.8,-36.3],[175.4,-36.5],[175.9,-36.7],[175.9,-37.6],[177.2,-38.0],[178.5,-37.7],[178.0,-38.7],[177.0,-39.2],[176.9,-39.7],[176.3,-40.6],[175.3,-41.6],[174.7,-41.3],[175.1,-40.3],[174.9,-39.9],[174.0,-39.6],[173.8,-39.2],[174.6,-38.8],[174.8,-37.9],[174.7,-37.1],[174.2,-36.4],[173.4,-35.5],[173.0,-35.1]];
  const SI=[[172.7,-40.5],[173.0,-40.9],[173.1,-41.25],[173.9,-40.9],[174.3,-41.0],[174.2,-41.7],[173.7,-42.4],[172.8,-43.2],[173.1,-43.8],[172.3,-43.9],[171.3,-44.4],[170.6,-45.9],[169.6,-46.6],[168.3,-46.6],[167.5,-46.2],[166.5,-45.9],[166.9,-45.0],[168.1,-44.0],[169.6,-43.5],[171.2,-42.4],[171.5,-41.8],[172.1,-40.9]];
  const ST=[[167.6,-46.8],[168.2,-46.9],[168.1,-47.2],[167.6,-47.2]];
  const CITIES=[[174.76,-36.85,26],[175.28,-37.79,12],[176.17,-37.69,11],[174.78,-41.29,15],[173.28,-41.27,8],[172.64,-43.53,16],[170.5,-45.87,10],[168.66,-45.03,5],[176.9,-39.5,8],[174.07,-39.06,7],[175.6,-40.35,7],[168.35,-46.41,6],[171.25,-44.4,5],[176.25,-38.14,6],[174.32,-35.73,6]];
  const M=document.createElement('canvas');M.width=1200;M.height=1150;const m=M.getContext('2d');
  m.fillStyle='#040817';m.fillRect(0,0,1200,1150);
  for(let i=0;i<260;i++){m.fillStyle=`rgba(120,140,200,${.02+Math.random()*.05})`;m.beginPath();m.ellipse(Math.random()*1200,Math.random()*1150,30+Math.random()*120,8+Math.random()*30,Math.random()*1.2,0,7);m.fill();}
  for(const poly of [NI,SI,ST]){m.beginPath();poly.forEach(([lo,la],i)=>{const [x,y]=PJ(lo,la);i?m.lineTo(x,y):m.moveTo(x,y);});m.closePath();m.fillStyle='#152246';m.fill();m.strokeStyle='#24345c';m.lineWidth=2;m.stroke();}
  for(const [lo,la,r] of CITIES){const [x,y]=PJ(lo,la);const g=m.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,'rgba(255,236,190,1)');g.addColorStop(.25,'rgba(255,200,120,.75)');g.addColorStop(1,'rgba(255,170,90,0)');m.fillStyle=g;m.fillRect(x-r*3,y-r*3,r*6,r*6);
    for(let i=0;i<r*3;i++){const a=Math.random()*6.28,d=Math.random()*r*2.2;m.fillStyle='rgba(255,225,170,.8)';m.fillRect(x+Math.cos(a)*d,y+Math.sin(a)*d,1.3,1.3);}}
  const P_SW=PJ(167,-47.5),P_H=PJ(HOME.lon,HOME.lat),P_N=PJ(NEXT.lon,NEXT.lat),P_NE=PJ(178.5,-32.5);
  const KX=[[0,P_SW[0]],[24,P_H[0]],[35,P_H[0]],[47,P_N[0]],[58,P_N[0]],[95,P_NE[0]]],KY=[[0,P_SW[1]],[24,P_H[1]],[35,P_H[1]],[47,P_N[1]],[58,P_N[1]],[95,P_NE[1]]];
  const ROT=-.45,FY=.5;
  (async()=>{await wait(2500);if(!alive(T))return;say('QUIET','Nothing to do here. Stay as long as you like.');})();
  function leave(){acts([]);award('window');(async()=>{await fact('The Cupola · real','The best window anywhere',`<p>The station's <b>Cupola</b> has seven windows facing Earth. Crews say nobody ever gets used to it.</p><p>The feeling has a name: the <b>overview effect</b>. Christina Koch had 328 days of it.</p>`,
    `From the station you look <i>down</i> on the aurora: particles from the Sun hitting the upper air near the pole.`);if(alive(T))next();})();}
  return {update(dt){t+=dt;
    const fx=interp(KX,t),fy=interp(KY,t),z=Math.max(W,H)/560*(1+.12*Math.sin(clamp((t-20)/40,0,1)*Math.PI));
    const toS=(mx,my)=>{const dx=(mx-fx)*z,dy=(my-fy)*z;return [W/2+dx*Math.cos(ROT)-dy*Math.sin(ROT),H*.66+(dx*Math.sin(ROT)+dy*Math.cos(ROT))*FY];};
    ctx.fillStyle='#03030a';ctx.fillRect(0,0,W,H);stars(1,t/900);
    // the planet, seen at a slant
    const ex=W/2,ey=H*1.42,rx=W*1.15,ry=H*1.06;
    ctx.save();ctx.beginPath();ctx.ellipse(ex,ey,rx,ry,0,0,7);ctx.clip();
    ctx.fillStyle='#040817';ctx.fillRect(0,0,W,H);
    ctx.save();ctx.translate(W/2,H*.66);ctx.scale(1,FY);ctx.rotate(ROT);ctx.drawImage(M,-fx*z,-fy*z,1200*z,1150*z);ctx.restore();
    // aurora australis, rippling along the southern edge
    const au=clamp((t-4)/10,0,1)*(1-.5*clamp((t-70)/20,0,1));
    for(let i=0;i<30;i++){const x=W*(-.05+i*.016)+Math.sin(t*.4+i*.7)*10,hh=H*(.1+.07*Math.sin(t*.6+i*.9)),y0=H*.42+i*H*.004+Math.sin(t*.3+i*.4)*8;
      const g=ctx.createLinearGradient(0,y0-hh,0,y0);g.addColorStop(0,'rgba(255,79,163,0)');g.addColorStop(.35,`rgba(255,79,163,${.16*au})`);g.addColorStop(.75,`rgba(126,232,208,${.3*au})`);g.addColorStop(1,'rgba(126,232,208,0)');ctx.fillStyle=g;ctx.fillRect(x,y0-hh,W*.02,hh);}
    // haze toward the horizon
    const hz=ctx.createLinearGradient(0,H*.36,0,H*.62);hz.addColorStop(0,'rgba(90,110,220,.5)');hz.addColorStop(1,'rgba(90,110,220,0)');ctx.fillStyle=hz;ctx.fillRect(0,H*.3,W,H*.35);
    // markers
    const mark=(P,label,a,col)=>{if(a<=0)return;const [x,y]=toS(P[0],P[1]);const pr=10+((t*24)%34);ctx.strokeStyle=col;ctx.globalAlpha=a*(1-((t*24)%34)/34);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,pr,pr*FY,0,0,7);ctx.stroke();ctx.globalAlpha=a;
      ctx.beginPath();ctx.moveTo(x,y-6);ctx.lineTo(x,y-46);ctx.stroke();ctx.fillStyle=col;ctx.font='600 20px "Barlow Condensed", sans-serif';ctx.textAlign='center';ctx.fillText(label.toUpperCase(),x,y-54);ctx.globalAlpha=1;ctx.lineWidth=1;};
    mark(P_H,HOME.name+' · home',clamp((t-22)/2,0,1)*clamp((43-t)/5,0,1),'#ff9ad0');
    mark(P_N,NEXT.name+' · next mission',clamp((t-45)/2,0,1),'#7ee8d0');
    ctx.restore();
    // the thin blue line
    for(let i=0;i<6;i++){ctx.strokeStyle=`rgba(${120+i*22},${150+i*8},255,${.55-i*.09})`;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(ex,ey,rx+i*2.5,ry+i*2.5,0,Math.PI,2*Math.PI);ctx.stroke();}ctx.lineWidth=1;
    // sunrise
    const sr=clamp((t-66)/22,0,1);if(sr>0){const sx=W*.86,sy=ey-ry*Math.sqrt(Math.max(0,1-((sx-ex)/rx)**2));const g=ctx.createRadialGradient(sx,sy,0,sx,sy,W*.5*sr);g.addColorStop(0,`rgba(255,250,235,${.95*sr})`);g.addColorStop(.12,`rgba(255,170,190,${.6*sr})`);g.addColorStop(.45,`rgba(150,110,255,${.25*sr})`);g.addColorStop(1,'rgba(40,30,120,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    // window frame
    ctx.strokeStyle='#1d1533';ctx.lineWidth=Math.max(26,W*.03);ctx.strokeRect(0,0,W,H);ctx.lineWidth=10;ctx.strokeStyle='#2c2248';ctx.beginPath();ctx.moveTo(W*.5,0);ctx.lineTo(W*.5,H*.07);ctx.moveTo(0,H*.5);ctx.lineTo(W*.03,H*.5);ctx.moveTo(W,H*.5);ctx.lineTo(W*.97,H*.5);ctx.stroke();ctx.lineWidth=1;
    if(t>24&&said<1){said=1;say('HOUSTON','Look down. That small warm light is Nelson. That\'s home.');}
    if(t>47&&said<2){said=2;say('HOUSTON','And the bright one up north is Auckland. Your next mission.');}
    if(t>57&&!ready){ready=true;acts([{label:'Back to work, when you\'re ready',fn:leave}]);}
    if(t>68&&said<3){said=3;say('QUIET','Sunrise. The fourth one since lunch.');}
    hud([['OVER','Aotearoa New Zealand','Aotearoa New Zealand'],['HEIGHT','400 km','space'],['TO DO','0 items','nothing at all']]);
  }};
},

/* ---------- the moon ---------- */
moon(){
  const T=token;gl();$('glhost').style.display='block';
  const sc=new THREE.Scene();const cam=new THREE.PerspectiveCamera(38,W/H,1,2e6);GL.cam=cam;
  sc.add(starSphere(1.5e6));
  const moon=new THREE.Mesh(new THREE.SphereGeometry(1737,128,96),new THREE.MeshStandardMaterial({map:moonTex(),roughness:1,metalness:0}));sc.add(moon);
  const earth=earthMesh(6371);earth.position.set(0,0,384400);sc.add(earth);
  const sun=new THREE.DirectionalLight('#ffffff',1.5);sun.position.set(-.5,.35,-1);sc.add(sun);sc.add(new THREE.AmbientLight('#3a3058',.3));
  let t=0,phase='approach',y=0,photoReady=false,shot=false;const tgt=new THREE.Vector3(0,0,384400);
  mate(true);
  (async()=>{
    if(!await talk(T,[['HOUSTON','You\'re about to lose signal behind the Moon. One message came in first.']]))return;
    say('CRIS',UPLINK);beep(990,.1,.04);await Promise.all([wait(11000),Promise.race([lastVoice,wait(20000)])]);if(!alive(T))return;
    say('HOUSTON','Before you go, don\'t forget to');await hold(2200);if(!alive(T))return;
    phase='los';beep(220,.25,.05);setG(SND.pad,.8,4);say('LOS','Nobody can email you now.');award('inbox');
    await wait(6500);if(!alive(T))return;
    say('LOS','The far side. Not dark: it just never faces Earth.');
    await wait(5500);if(!alive(T))return;
    phase='rise';say('LOS','Wait. Look up over the horizon.');
  })();
  function photo(){if(shot)return;shot=true;shutter();GL.r.render(sc,cam);state.photo=GL.r.domElement.toDataURL('image/jpeg',.85);award('photo');acts([]);thumbs(4000);
    say('LOS','Saved. No caption. No posting.');
    (async()=>{await wait(4500);if(!alive(T))return;
      tone(170,.5,.03,'sawtooth');tone(240,.35,.02,'sawtooth',.25);say('LOS','Wait. Something is coming in on a channel that should be empty.');await wait(4200);if(!alive(T))return;
      tone(520,.5,.03);say('LEAK','Hi '+CREW+'. So glad you signed up for this mission. Enjoy the last part. Meet you on Earth.');await hold(8000);if(!alive(T))return;
      say('LEAK','One more thing. Someone who flew this for real said it best:');await hold(4200);if(!alive(T))return;
      tone(660,.4,.025);say('LEAK','“'+KOCH_QUOTE+'”');await hold(7000);if(!alive(T))return;
      say('LOS','That last line: Christina Koch\'s real words, from her own trip around the Moon.');await wait(5200);if(!alive(T))return;beep(990,.1,.05);
      if(!await talk(T,[['ROSTER','You\'re back! Your timesheet is forty minutes overdue.'],['HOUSTON','Signal\'s back. Sorry, Roster got in first.']]))return;
      await fact('Christina Koch · real','Around the Moon',`<p>Koch flew on <b>Artemis II</b>, the first crewed flight around the Moon since 1972. She is the first woman to travel to the Moon.</p><p>The line you just heard is hers, said while looking back at Earth.</p>`,
        `Radio travels in straight lines, and there are 3,474 km of Moon in the way. Even with signal, messages take 1.3 seconds each way.`);if(alive(T))next();})();}
  return {update(dt){t+=dt;
    if(phase==='rise'){y=Math.min(2700,y+dt*(y<1700?260:110));if(y>2150&&!photoReady){photoReady=true;say('LOS','Earthrise. Everyone you know is on that small blue thing.');acts([{label:'Take the photo',go:true,fn:photo}]);}}
    cam.position.set(Math.sin(t*.01)*300,y*.92,-9000+Math.sin(t*.02)*200);cam.lookAt(tgt);
    moon.rotation.y+=dt*.004;earth.rotation.y+=dt*.02;
    GL.r.render(sc,cam);
    const sig=phase==='approach'?'OK':'LOST';
    hud([['FROM EARTH','~'+(392000+Math.round(t*5)).toLocaleString('en-NZ')+' km','further than anyone you know'],['ABOVE THE MOON','~7,300 km','close enough to count craters'],['SIGNAL',sig,sig],['MESSAGE DELAY','1.3 s','one awkward pause']]);
  },end(){sc.traverse(o=>{o.geometry&&o.geometry.dispose();});}};
},

/* ---------- coming home ---------- */
home(){
  const T=token;let t=0,alt=120,vel=39500,deployed=false,mains=false,splash=false;
  const ALT=[[0,120],[10,80],[22,45],[34,18],[44,9],[52,6.5],[60,4.5]];
  const VEL=[[0,39500],[10,38000],[22,24000],[34,5000],[44,1300],[52,700],[60,500]];
  const GF=[[0,0],[10,1.5],[22,4.0],[34,3.2],[44,1.4],[60,1]];
  audio();setG(SND.rumble,.25,1);mate(true);
  say('HOUSTON','Entry. The fireball is normal. Mostly.');
  function drogue(){if(deployed)return;if(alt>9.5){say('HOUSTON','Bold. Wrong, but bold. Wait for the green zone.');tone(160,.18,.08,'square');acts([{label:'Deploy drogue chutes',go:true,fn:drogue}]);return;}
    deployed=true;thud(.6);award('chute');say('HOUSTON','Drogue chutes out. Perfect timing.');
    setTimeout(()=>{if(!alive(T))return;mains=true;thud(.5);say('ACCT','Main chutes open. Please return them folded.');},3500);}
  return {update(dt){
    if(!splash){t+=dt*(mains?1.6:1);if(!mains){alt=interp(ALT,t);vel=interp(VEL,t);}else{alt=Math.max(0,alt-dt*.55);vel=Math.max(28,vel-dt*400);}
      if(t>40&&!deployed&&!$('acts').children.length)acts([{label:'Deploy drogue chutes',go:true,fn:drogue}]);
      if(!deployed&&alt<5){deployed=true;acts([]);thud(.5);say('HOUSTON','The autopilot deployed the chutes for you. We won\'t tell anyone.');setTimeout(()=>{if(alive(T))mains=true;},3000);}
      if(alt<=0&&mains){splash=true;setG(SND.rumble,0,.3);thud(1);award('home');thumbs(5000);
        say('HOUSTON','Splashdown! Welcome home, '+CREW+'.');
        (async()=>{await wait(6000);if(!alive(T))return;await fact('Christina Koch · real','Coming home',`<p>Koch came home on <b>6 February 2020</b> after <b>328 days</b> in space.</p><p>Her mission showed how months of weightlessness change the body, which helps plan trips to the Moon and Mars.</p>`,
          `The fireball isn't friction: the capsule squeezes the air ahead of it until it glows. The heat shield burns away on purpose.`,'See your mission patch');if(alive(T))next();})();}}
    const plasma=splash?0:clamp(1-Math.abs(t-20)/16,0,1);
    porthole({alt:splash?0:Math.max(alt,.6),shake:splash?0:plasma*6+(mains?.6:0),plasma,water:splash||alt<1.2,chutes:mains?2:deployed?1:0,float:0});
    if(t>38&&!deployed){ctx.save();const x=W*.9,y0=H*.2,hh=H*.5;ctx.fillStyle='#1a1233';ctx.fillRect(x-14,y0,28,hh);const z=a=>y0+hh*(1-a/12);ctx.fillStyle='rgba(141,240,184,.4)';ctx.fillRect(x-14,z(9.5),28,z(5)-z(9.5));
      ctx.fillStyle='#ff4fa3';ctx.fillRect(x-18,z(clamp(alt,0,12))-3,36,6);ctx.font='11px "IBM Plex Mono", monospace';ctx.fillStyle='#a99fc6';ctx.textAlign='right';ctx.fillText('GREEN = GO',x-20,z(9.5)-4);ctx.restore();}
    const g=splash?1:interp(GF,t),st=splash?'SPLASHDOWN':mains?'MAIN CHUTES':deployed?'DROGUES':'ENTRY';
    hud([['HEIGHT',alt.toFixed(1)+' km',splash?'sea level':wAlt(alt)],['SPEED',Math.round(vel).toLocaleString('en-NZ')+' km/h',splash?'bobbing':wSpeed(vel)],['WEIGHT',g.toFixed(1)+' g',wG(g)],['HEAT SHIELD',plasma>.3?'GLOWING':'NOMINAL',plasma>.3?'GLOWING':'fine'],['STATUS',st,st]]);
  },end(){setG(SND.rumble,0,.1);}};
},

/* ---------- patch ---------- */
patch(){
  state.done.add(6);setG(SND.pad,.7,3);$('stK').textContent='';$('stT').textContent='';$('stC').textContent='';
  const got=[...state.got];
  const patchSVG=`<svg viewBox="0 0 300 300" width="260" height="260" role="img" aria-label="Mission patch for ${CREW}">
    <defs><clipPath id="pc"><circle cx="150" cy="150" r="118"/></clipPath><linearGradient id="sp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120c24"/><stop offset="1" stop-color="#3a1f66"/></linearGradient></defs>
    <circle cx="150" cy="150" r="146" fill="#ff4fa3"/><circle cx="150" cy="150" r="134" fill="#1a1233"/><circle cx="150" cy="150" r="118" fill="url(#sp)"/>
    <g clip-path="url(#pc)"><circle cx="150" cy="330" r="150" fill="#2c6aa8"/><circle cx="150" cy="330" r="150" fill="none" stroke="#d6c6ff" stroke-width="4"/>
    <circle cx="205" cy="105" r="26" fill="#cfccc4"/><circle cx="198" cy="98" r="5" fill="#a9a59c"/><circle cx="212" cy="114" r="4" fill="#a9a59c"/>
    ${Array.from({length:22},(_,i)=>`<rect x="${40+((i*53)%220)}" y="${40+((i*37)%120)}" width="${i%3?2:3}" height="${i%3?2:3}" fill="${i%5?'#fff':'#ff9ad0'}"/>`).join('')}
    <path d="M70 230 Q 120 150 205 105" stroke="#7ee8d0" stroke-width="3" fill="none" stroke-dasharray="6 6"/><path d="M60 236 l14 -8 l-4 12 z" fill="#7ee8d0"/></g>
    <path id="arcT" d="M 40 150 A 110 110 0 0 1 260 150" fill="none"/><path id="arcB" d="M 52 160 A 98 98 0 0 0 248 160" fill="none"/>
    <text font-family="Barlow Condensed" font-weight="700" font-size="28" letter-spacing="5" fill="#fff"><textPath href="#arcT" startOffset="50%" text-anchor="middle">COMMANDER ${CREW.toUpperCase()}</textPath></text>
    <text font-family="Barlow Condensed" font-weight="600" font-size="15" letter-spacing="4" fill="#2a0018"><textPath href="#arcB" startOffset="50%" text-anchor="middle">MISSION TINA-1</textPath></text>
    ${got.map((_,i)=>`<rect x="${148-(got.length-1)*6+i*12}" y="279" width="5" height="5" fill="#fff"/>`).join('')}</svg>`;
  layer(`<div class="finale">
    <div class="patchwrap">${patchSVG}
      ${state.photo?`<div class="polaroid"><img src="${state.photo}" alt="Earthrise photo taken behind the Moon"><span>Earthrise · not posted</span></div>`:''}</div>
    <div><div class="eyebrow">Mission complete</div>
      <h2>Welcome home, Commander ${CREW}</h2>
      <p class="facts">A launch, a cargo ship caught by robot arm, a spacewalk, the far side of the Moon and a splashdown, all before dinner. Christina Koch needed 328 days and a whole career. You needed about fifteen minutes and a signed Form 27-B/6.</p>
      <div class="seat2"><img src="${ROLES.KOCH.img}" alt="" style="image-rendering:pixelated"><p><b>You borrowed this day.</b> Every mission you flew today is one Christina Koch flew for real.</p></div>
      <ul class="achs">${Object.entries(ACH).map(([k,v])=>`<li class="${state.got.has(k)?'got':''}"><img class="pix" src="${v[2]}" alt="">${v[0]}</li>`).join('')}<li class="pending"><img class="pix" src="${medal('#ffd36b')}" alt="">Logged your hours · still pending</li></ul>
      <p class="facts">Keeping a crew calm and focused in a tin can 400 km up? You do harder things on a Monday.</p>
      <p class="facts">Read more about Christina Koch: <a href="https://en.wikipedia.org/wiki/Christina_Koch" target="_blank" rel="noopener">her story</a>.</p>
      <div class="sign">— ${SIGN}</div>
      <p class="facts" style="font-family:var(--mono);font-size:12px;color:var(--dim)">P.S. Roster says your timesheet is still pending. I'd help, but I never log mine either.</p>
      <div class="row"><button class="go" id="again">Fly the day again</button></div></div></div>`);
  $('again').onclick=()=>{state.got.clear();state.photo=null;state.done.clear();go(0);};
  return {update(){ctx.fillStyle='#07050f';ctx.fillRect(0,0,W,H);nebula();stars(.7,perf/500000);}};
},
};

/* ============ toggles ============ */
function paintToggles(){const set=(id,label,on)=>{$(id).textContent=label+': '+(on?'on':'off');$(id).classList.toggle('on',on);};
  set('tSound','Sound',state.sound);set('tVoices','Voices',state.voices);set('tCalm','Calm mode',state.calm);set('tNums','Numbers',state.nums);set('tNerd','Nerd mode',state.nerd);$('app').classList.toggle('calm',state.calm);}
$('tSound').onclick=()=>{state.sound=!state.sound;if(state.sound)audio();else{stopClip();setG(SND.rumble,0);setG(SND.breath,0);setG(SND.pad,0);}paintToggles();};
$('tVoices').onclick=()=>{state.voices=!state.voices;if(state.voices&&!state.sound){state.sound=true;audio();}if(!state.voices)stopClip();paintToggles();};
$('tCalm').onclick=()=>{state.calm=!state.calm;paintToggles();};
$('tNums').onclick=()=>{state.nums=!state.nums;paintToggles();};
$('tNerd').onclick=()=>{state.nerd=!state.nerd;paintToggles();};
addEventListener('resize',fit);
fit();paintToggles();go(0);requestAnimationFrame(loop);
window.__mt={go,state};

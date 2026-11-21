const kidLessons = {
 "conducao": {
  "name": "Bola no pé",
  "icon": "⚽",
  "tone": "lime",
  "short": "Aprenda a guiar a bola.",
  "steps": [
   [
    "Prepare o caminho",
    "Espalhe três marcadores. Deixe espaço para passar entre eles."
   ],
   [
    "Bola pertinho",
    "Vá pelo caminho dando toques curtinhos na bola."
   ],
   [
    "Pare e vire",
    "Pise de leve na bola. Agora vire e siga para o outro lado."
   ]
  ]
 },
 "passe": {
  "name": "Passe para um amigo",
  "icon": "🤝",
  "tone": "sky",
  "short": "Aprenda a passar e receber.",
  "steps": [
   [
    "Faça uma portinha",
    "Coloque dois marcadores no chão. Seu parceiro fica do outro lado."
   ],
   [
    "Passe rasteiro",
    "Toque na bola com a parte de dentro do pé. Passe pelo meio da portinha."
   ],
   [
    "Receba e devolva",
    "Espere a bola chegar. Domine pertinho do pé e passe de volta."
   ]
  ]
 },
 "finalizacao": {
  "name": "Chute ao gol",
  "icon": "🥅",
  "tone": "peach",
  "short": "Escolha uma meta e chute.",
  "steps": [
   [
    "Monte duas metas",
    "Faça duas metas pequenas com marcadores, uma de cada lado."
   ],
   [
    "Olhe e escolha",
    "Leve a bola pelo meio. Levante a cabeça e escolha uma meta."
   ],
   [
    "Chute rasteiro",
    "Chute em direção à meta que você escolheu. Na próxima, tente a outra."
   ]
  ]
 },
 "movimento": {
  "name": "Pule e equilibre",
  "icon": "⭐",
  "tone": "peach",
  "short": "Brinque no caminho da amarelinha.",
  "steps": [
   [
    "Desenhe o caminho",
    "Marque quadrados no chão e deixe espaço ao redor."
   ],
   [
    "Pule ou caminhe",
    "Vá de quadrado em quadrado. Pare um pouquinho para se equilibrar."
   ],
   [
    "Invente outro jeito",
    "Volte pelo caminho. Tente alternar um pé e dois pés, se quiser."
   ]
  ]
 },
 "jogo": {
  "name": "Jogue em equipe",
  "icon": "🏅",
  "tone": "sky",
  "short": "Jogue junto e passe a bola.",
  "steps": [
   [
    "Monte o jogo",
    "Faça duas metas. Divida as crianças em dois times pequenos."
   ],
   [
    "Passe e se mova",
    "Passe para alguém do seu time. Depois, procure um espaço para receber."
   ],
   [
    "Faça uma pausa",
    "Descanse, beba água e converse com o time sobre uma jogada."
   ]
  ]
 }
};
function drawKidDemo(canvas,id,step,total){
  const g=canvas.getContext('2d'), t=(total % 3000)/3000, q=Math.min(1,t*1.13);
  const w=640,h=360;
  const lime='#ecff8c', white='#ffffef', sky='#9ce4ff', orange='#ffb36c', ink='#123c2b';
  g.clearRect(0,0,w,h);
  g.fillStyle='#21553e';g.fillRect(0,0,w,h);
  for(let i=0;i<8;i+=2){g.fillStyle='#285f47';g.fillRect(i*80,0,80,h);}
  g.strokeStyle='#94bb92';g.lineWidth=3;g.strokeRect(24,25,592,309);
  function circle(x,y,r,c){g.beginPath();g.fillStyle=c;g.arc(x,y,r,0,Math.PI*2);g.fill();}
  function line(arr,color,size=5){g.strokeStyle=color;g.lineWidth=size;g.lineJoin='round';g.lineCap='round';g.beginPath();arr.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
  function text(str,x,y,sz=21,color=white){g.font='bold '+sz+'px system-ui';g.textAlign='center';g.fillStyle=color;g.fillText(str,x,y);}
  function cone(x,y){line([[x-13,y+10],[x,y-16],[x+13,y+10],[x-13,y+10]],orange,5);line([[x-6,y-1],[x+6,y-1]],white,3);}
  function net(x,y,a,b){g.fillStyle='#ffffff16';g.fillRect(x,y,a,b);for(let i=9;i<a;i+=12)line([[x+i,y],[x+i,y+b]],'#ffffff55',1);for(let i=8;i<b;i+=12)line([[x,y+i],[x+a,y+i]],'#ffffff55',1);g.strokeStyle=white;g.lineWidth=4;g.strokeRect(x,y,a,b);}
  function ball(x,y){circle(x,y+13,10,'#11281b70');circle(x,y,12,white);circle(x+1,y-2,4,ink);}
  function kid(x,y,moves=false,shirt=sky,flip=1,hop=0){
    const stride=moves?7*Math.sin(t*22*Math.PI):0;
    g.save();g.translate(x,y-hop);g.scale(flip,1);
    line([[-4,3],[-6-stride,16],[-11-stride,20]],white,6);
    line([[5,3],[7+stride,15],[12+stride,19]],white,6);
    line([[-8,-16],[-14+stride,-7]],orange,5);line([[8,-16],[15-stride,-8]],orange,5);
    line([[0,-18],[0,2]],shirt,17);circle(0,-28,9,'#e5a670');circle(-1,-31,8,'#2b2925');g.restore();
  }
  function route(points){
    if(total>0){g.setLineDash([11,10]);line(points,lime,4);g.setLineDash([]);}
    const [x,y]=points.at(-1),[a,b]=points.at(-2),d=Math.atan2(y-b,x-a);
    line([[x-15*Math.cos(d-.54),y-15*Math.sin(d-.54)],[x,y],[x-15*Math.cos(d+.54),y-15*Math.sin(d+.54)]],lime,4);
  }
  function point(path,p=q){const z=p*(path.length-1),a=Math.min(path.length-2,Math.floor(z)),f=z-a;return path[a].map((v,k)=>v+(path[a+1][k]-v)*f);}
  function moving(points){route(points);const [x,y]=point(points);kid(x-16,y+1,true,sky,points[0][0]>points.at(-1)[0]?-1:1);ball(x+7,y+16);}
  if(id==='conducao'){
    [211,322,437].forEach(x=>cone(x,179));
    if(step===0){kid(103,191);ball(134,204);text('Deixe espaço',320,263);}
    if(step===1)moving([[110,185],[211,122],[322,221],[437,122],[539,184]]);
    if(step===2){
      const pts=[[523,175],[523,175],[503,238],[402,249]];
      moving(pts);if(q<.35)text('Pare',528,135);else text('Vire',483,288);
    }
  } else if(id==='passe'){
    cone(320,125);cone(320,224);kid(104,184,false,sky);kid(535,184,false,orange,-1);
    if(step===0){ball(138,197);text('Portinha',320,92);}
    if(step===1){const pts=[[137,193],[508,193]];route(pts);ball(...point(pts));}
    if(step===2){const pts=[[502,193],[502,193],[320,193],[137,193]];route(pts.slice(1));ball(...point(pts));}
  } else if(id==='finalizacao'){
    net(502,58,66,60);net(502,244,66,60);
    if(step===0){kid(111,186);ball(146,203);text('Duas metas',472,186);}
    if(step===1){moving([[113,188],[218,188],[335,188],[424,173]]);text('Olhe para as metas',307,116);}
    if(step===2){
      kid(340,198);const pts=[[365,209],[432,164],[527,85]];route(pts);ball(...point(pts));
    }
  } else if(id==='movimento'){
    const cells=[[120,181],[193,181],[265,144],[265,218],[337,181],[409,144],[409,218],[481,181]];
    cells.forEach(([x,y],i)=>{const cx=x-32, cy=y-32;g.fillStyle=i%2?'#376b55':'#4a7860';g.fillRect(cx,cy,64,64);g.strokeStyle=white;g.lineWidth=2;g.strokeRect(cx,cy,64,64);text(String(i+1),x,y+8,23);});
    const pts=[[82,182],[120,182],[193,182],[265,144],[337,181],[409,218],[481,181],[548,181]];
    if(step===0){kid(80,185);text('Amarelinha',320,90);}
    else {const [x,y]=point(step===2?[...pts].reverse():pts);kid(x,y+6,true,orange,step===2?-1:1,Math.abs(Math.sin(q*7*Math.PI))*22);}
  } else {
    net(37,138,35,85);net(568,138,35,85);
    if(step===0){kid(145,139,false,sky);kid(242,238,false,sky);kid(451,139,false,orange,-1);kid(498,239,false,orange,-1);ball(320,190);text('Dois times',320,92);}
    if(step===1){
      const pass=[[166,166],[234,210],[311,250]];
      route(pass);ball(...point(pass));kid(140+q*79,148-q*22,true,sky);kid(326,241,false,sky,-1);kid(450,143,false,orange,-1);kid(497,243,false,orange,-1);
    }
    if(step===2){kid(225,198,false,sky);kid(280,198,false,sky);kid(360,198,false,orange,-1);kid(415,198,false,orange,-1);ball(320,230);text('Hora da pausa',320,116);}
  }
}

let kidProfileId='', activeKidDemo=null;
function kidHome(root){kidFeed(root);}
function kidUtterance(text){
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return null;
  const voices=window.speechSynthesis.getVoices();
  const language=v=>v.lang.toLowerCase().replace('_','-');
  const brazilian=voices.filter(v=>language(v)==='pt-br');
  const match=brazilian.find(v=>v.localService)??brazilian[0]??voices.find(v=>language(v).startsWith('pt'));
  if(!match&&voices.length)return null;
  const u=new SpeechSynthesisUtterance(text);
  u.lang='pt-BR';u.rate=.9;
  if(match)u.voice=match;
  return u;
}
function kidDemo(id,profile,date=today(),{animated=false}={}){
  if(reelAssets[id]&&!animated){kidReel(id,profile,date);return;}
  activeKidDemo?.();
  activeKidTimer?.();
  const selected=profile??(view==='Modo infantil'?state.profiles.find(p=>p.id===kidProfileId):null);
  const bell=kidBell();
  const lesson=kidLessons[id]; if(!lesson)return;
  const dialog=$('dialog');
  dialog.classList.add('demo-dialog');
  const canvas=el('canvas');canvas.width=640;canvas.height=360;
  canvas.setAttribute('role','img');
  const stage=el('p',null,'demo-set');
  const caption=el('p',null,'demo-caption'); caption.setAttribute('aria-live','polite');
  const tip=el('p',null,'demo-help');
  const canSpeak=Boolean(window.speechSynthesis&&window.SpeechSynthesisUtterance);
  const speech=canSpeak?window.speechSynthesis:null;
  let step=0, elapsed=0, last=0, frame=0, playing=false, withVoice=canSpeak, spoken=true, utterance=null;
  const play=button('▶ Começar',()=>{
    if(playing){ pause(); return; }
    bell.unlock();
    playing=true; last=0;
    narrate(); paint(); frame=requestAnimationFrame(tick);
  },'primary');
  const voice=button('🔊 Narração ligada',()=>{
    withVoice=!withVoice;
    if(playing)narrate();else stopVoice();
    paint();
  });
  const dots=lesson.steps.map((_,i)=>{
    const b=button('Passo '+(i+1),()=>choose(i));
    return b;
  });
  const panel=add(el('div',null,'demo'),stage,canvas,caption,add(el('div',null,'demo-progress'),...dots),
    add(el('div',null,'demo-controls'),play,voice),tip);
  function stopVoice(){
    const had=Boolean(utterance);utterance=null;spoken=true;
    if(had)speech.cancel();
  }
  function narrate(){
    stopVoice();
    if(!withVoice||!speech)return;
    const [title,words]=lesson.steps[step];
    const u=kidUtterance(title+'. '+words);
    if(!u){
      tip.textContent='A voz em português não está disponível neste aparelho. Siga pela legenda.';
      return;
    }
    spoken=false;utterance=u;
    u.onend=()=>{if(utterance===u){utterance=null;spoken=true;}};
    u.onerror=e=>{
      if(utterance!==u)return;
      utterance=null;spoken=true;
      if(!['canceled','interrupted'].includes(e.error))tip.textContent='A voz não está disponível neste aparelho. Você pode acompanhar pela legenda.';
    };
    try {speech.speak(u);} catch {utterance=null;spoken=true;tip.textContent='A voz não está disponível neste aparelho. Siga pela legenda.';}
  }
  function paint(){
    const [title,words]=lesson.steps[step];
    stage.textContent='Passo '+(step+1)+' de 3 · '+title;
    caption.textContent=words;
    canvas.setAttribute('aria-label',title+' — '+words);
    play.textContent=playing?'Ⅱ Pausar':elapsed?'▶ Continuar':'▶ Começar';
    voice.hidden=!canSpeak;
    voice.textContent=withVoice?'🔊 Narração ligada':'🔇 Narração desligada';
    voice.setAttribute('aria-pressed',String(withVoice));
    dots.forEach((button,i)=>{if(step===i)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    drawKidDemo(canvas,id,step,elapsed);
  }
  function choose(i){
    if(i<0||i>=lesson.steps.length)return;
    step=i;elapsed=0;last=0;
    if(playing)narrate();
    paint();
  }
  function tick(now){
    if(!playing||!canvas.isConnected||!dialog.open){pause();return;}
    if(last)elapsed+=Math.min(60,now-last);
    last=now;
    drawKidDemo(canvas,id,step,elapsed);
    const minTime=withVoice?4800:6000;
    if(elapsed>=minTime&&(spoken||elapsed>=16000)){
      if(step<2) choose(step+1);
      else {
        closeDemo(true);
        kidTimer(id,selected,date,{auto:true,bell});
        return;
      }
    }
    frame=requestAnimationFrame(tick);
  }
  function pause(){
    playing=false;cancelAnimationFrame(frame);last=0;stopVoice();paint();
  }
  function closeDemo(keepBell=false){
    pause();
    dialog.classList.remove('demo-dialog');
    if(!keepBell)bell.close();
    activeKidDemo=null;
  }
  activeKidDemo=closeDemo;
  panel.append(button('⏱ Ir para o temporizador',()=>kidTimer(id,selected,date)));
  tip.textContent=canSpeak?'A narração usa a voz em português do seu aparelho.':'Acompanhe a demonstração pela legenda.';
  openModal(lesson.name,panel);paint();
}
$('dialog').addEventListener('close',()=>{if(!$('dialog').open)activeKidDemo?.();});

function kidBell() {
  let context=null, closed=false;
  return {
    unlock(){
      if(closed)return;
      try {
        const Audio=window.AudioContext||window.webkitAudioContext;
        if(Audio){
          context??=new Audio();
          context.resume().catch(()=>{});
        }
      }catch{}
    },
    ring(onEnded){
      if(closed||!context||context.state!=='running'||document.hidden)return false;
      const notes=[[0,620],[.21,820],[.42,970]];
      for(const [i,[delay,frequency]] of notes.entries()){
        const at=context.currentTime+delay;
        const tone=context.createOscillator(), volume=context.createGain();
        tone.frequency.value=frequency;
        volume.gain.setValueAtTime(.15,at);
        volume.gain.exponentialRampToValueAtTime(.001,at+.18);
        tone.connect(volume).connect(context.destination);
        if(i===notes.length-1)tone.onended=onEnded;
        tone.start(at);tone.stop(at+.19);
      }
      return true;
    },
    close(){
      if(closed)return;
      closed=true;
      context?.close().catch(()=>{});
    }
  };
}
function kidWorkout(id, profile, date) {
  if(!profile)return {item:{type:id,minutes:'',age:7},recordKey:null};
  const scheduled=activity(profile,date);
  const base=activityKey(profile.id,date);
  if(weekOf(date)>=1&&weekOf(date)<=12&&scheduled.type===id)return {item:scheduled,recordKey:base};
  return {item:{type:id,minutes:'',age:profile.age},recordKey:base+'|extra:'+id};
}

const timerMemory=new Map();
const timerPrefix='futebol-em-familia-timer-v1:';
let activeKidTimer=null;
function kidTimer(id,profile,date=today(),{auto=false,bell=kidBell(),onDone}={}) {
  activeKidDemo?.();
  activeKidTimer?.();
  const lesson=kidLessons[id];
  const {item,recordKey}=kidWorkout(id,profile,date);
  const suggested=Number(item.minutes)||Number(duration(id,item.age).match(/\d+/)?.[0])||5;
  const key=timerPrefix+[profile?.id??'livre',date,id].join('|');
  function readTimer(){
    try{
      const previous=JSON.parse(localStorage.getItem(key));
      if(previous&&Number.isFinite(previous.remaining)&&Number.isFinite(previous.minutes))return previous;
    }catch{}
    return timerMemory.get(key)??{minutes:suggested,remaining:suggested*60000,endAt:0};
  }
  let clock=readTimer(), interval=0, lastSeconds=null, wakeLock=null, wakePending=false;
  let noticeTurn=0, noticeVoice=null, noticeTimeout=0;
  const dialog=$('dialog');
  const digits=el('p',null,'kid-timer-digits');
  digits.setAttribute('role','timer');
  digits.setAttribute('aria-label','Tempo restante');
  const message=el('p',null,'kid-timer-message');
  message.setAttribute('role','status');
  const options=[...new Set([1,3,5,10,15,20,25,30,35,40,suggested,clock.minutes])].sort((a,b)=>a-b);
  const preset=select(options.map(n=>[String(n),n+' min']),String(clock.minutes));
  const go=button('▶ Começar',()=>{
    if(clock.endAt){
      clock.remaining=remaining();
      clock.endAt=0;
      releaseScreen();
    } else {
      bell.unlock();
      startCountdown();
      keepScreenOn();
    }
    lastSeconds=null;
    writeTimer();refresh();
  },'primary');
  const finish=recordKey?button('✓ Já fiz',()=>{
    if(state.records[recordKey]?.status==='Realizada')return;
    stopNotice();
    state.records[recordKey]={
      activity:item,mood:'',notes:'',
      ...state.records[recordKey],
      status:'Realizada',minutes:clock.minutes
    };
    save('Boa! Exercício registrado.');
    if(onDone&&!storageError){
      dialog.close();
      onDone();
      return;
    }
    refresh();
    message.focus();
  },'primary'):null;
  message.tabIndex=-1;
  const restart=button('↻ Reiniciar',()=>{
    stopNotice();
    clock.endAt=0;clock.remaining=clock.minutes*60000;
    lastSeconds=null;
    writeTimer();refresh();
  });
  preset.onchange=()=>{
    stopNotice();
    const minutes=Number(preset.value);
    clock={minutes,remaining:minutes*60000,endAt:0};
    lastSeconds=null;
    writeTimer();refresh();
  };
  function writeTimer(){
    timerMemory.set(key,{...clock});
    try{localStorage.setItem(key,JSON.stringify(clock));}catch{}
  }
  function remaining(){return clock.endAt?Math.max(0,clock.endAt-Date.now()):clock.remaining;}
  function startCountdown(){
    if(clock.remaining<=0)clock.remaining=clock.minutes*60000;
    clock.endAt=Date.now()+clock.remaining;
  }
  function keepScreenOn(){
    if(wakeLock||wakePending||!navigator.wakeLock||document.hidden||!clock.endAt||remaining()<=0)return;
    wakePending=true;
    navigator.wakeLock.request('screen').then(lock=>{
      if(activeKidTimer!==close||!clock.endAt||document.hidden||remaining()<=0){
        lock.release().catch(()=>{});
        return;
      }
      wakeLock=lock;
      lock.addEventListener('release',()=>{if(wakeLock===lock)wakeLock=null;},{once:true});
    }).catch(()=>{}).finally(()=>{wakePending=false;});
  }
  function releaseScreen(){
    const held=wakeLock;wakeLock=null;
    held?.release().catch(()=>{});
  }
  function onVisibility(){
    if(document.hidden)releaseScreen();
    else {refresh();keepScreenOn();}
  }
  function alreadyRegistered(){
    return Boolean(recordKey&&state.records[recordKey]?.status==='Realizada');
  }
  function stopNotice(){
    noticeTurn++;
    clearTimeout(noticeTimeout);
    releaseScreen();
    if(noticeVoice){
      noticeVoice=null;
      window.speechSynthesis.cancel();
    }
  }
  function finishNotice(){
    const turn=++noticeTurn;
    const done=()=>{
      if(turn!==noticeTurn)return;
      clearTimeout(noticeTimeout);
      noticeVoice=null;
      releaseScreen();
    };
    noticeTimeout=setTimeout(done,12000);
    const announce=()=>{
      if(turn!==noticeTurn)return;
      if(!dialog.open||!digits.isConnected||document.hidden){done();return;}
      try{
        const text=finish&&!alreadyRegistered()?'Tempo acabou! Toque em Já fiz.':'Tempo acabou!';
        const u=kidUtterance(text);
        if(!u){done();return;}
        noticeVoice=u;
        u.onend=u.onerror=done;
        window.speechSynthesis.speak(u);
      }catch{done();}
    };
    try{if(bell.ring(announce))return;}catch{}
    announce();
  }
  function refresh(){
    if(!dialog.open||!digits.isConnected){close();return;}
    const seconds=Math.ceil(remaining()/1000);
    if(clock.endAt&&seconds===0){
      if(document.hidden)return;
      if(lastSeconds!==null&&lastSeconds>0)finishNotice();
      else releaseScreen();
      clock.remaining=0;clock.endAt=0;writeTimer();
    }
    if(seconds!==lastSeconds){
      digits.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
      lastSeconds=seconds;
    }
    const registered=alreadyRegistered();
    const status=seconds===0?(registered?'Exercício registrado!':'Tempo acabou!'):clock.endAt?'Valendo!':clock.remaining===clock.minutes*60000?'Tudo pronto?':'Em pausa';
    if(finish)finish.hidden=seconds!==0||registered;
    go.hidden=seconds===0;
    if(message.textContent!==status)message.textContent=status;
    const text=clock.endAt?'Ⅱ Pausar':seconds>0&&clock.remaining<clock.minutes*60000?'▶ Continuar':'▶ Começar';
    if(go.textContent!==text)go.textContent=text;
    preset.disabled=Boolean(clock.endAt);
  }
  function close(){
    stopNotice();
    clearInterval(interval);
    document.removeEventListener('visibilitychange',onVisibility);
    bell.close();
    activeKidTimer=null;
  }
  activeKidTimer=close;
  if(auto&&(!clock.endAt||remaining()===0)){
    if(clock.endAt)clock.remaining=0;
    startCountdown();writeTimer();
  }
  openModal('Temporizador',add(el('div',null,'kid-timer'),
    el('p',lesson.name,'kid-timer-title'),label('Quanto tempo?',preset),digits,message,
    add(el('div',null,'kid-actions'),finish,go,restart),
    el('p','Mantenha esta tela aberta para ouvir o aviso.','demo-help')));
  interval=setInterval(refresh,200);
  document.addEventListener('visibilitychange',onVisibility);
  refresh();
  keepScreenOn();
  if(auto)message.focus();
}
$('dialog').addEventListener('close',()=>{if(!$('dialog').open)activeKidTimer?.();});

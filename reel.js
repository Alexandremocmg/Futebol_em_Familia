const lessonIds=Object.keys(kidLessons);
const reelAssets={
  conducao:{
    path:'bola-no-pe-v1',
    lines:[
      'Monte o caminho. Deixe espaço entre os três marcadores.',
      'Olhe os pés dos jogadores. Dê toques curtinhos e deixe a bola perto do pé.',
      'Pare e vire. Encoste a sola na bola. Vire e siga para o outro lado.'
    ]
  },
  passe:{
    path:'passe-amigo-v1',
    lines:[
      'Faça uma portinha com dois cones. Um amigo de cada lado.',
      'Olhe o passe. Use a parte de dentro do pé. Passe rasteiro.',
      'Espere a bola chegar. Domine pertinho do pé e passe de volta.'
    ]
  },
  finalizacao:{
    path:'chute-ao-gol-v1',
    lines:[
      'Monte dois gols com cones. Deixe espaço no meio.',
      'Olhe os pés e a bola. Veja como o jogador finaliza.',
      'Agora é sua vez. Conduza, escolha um gol e chute rasteiro.'
    ]
  },
  movimento:{
    path:'pule-e-equilibre-v1',
    lines:[
      'Marque quadrados no chão e deixe espaço para pular.',
      'Olhe os pulos. Vá de quadrado em quadrado, sem pressa.',
      'Volte pelo caminho. Tente alternar um pé e dois pés.'
    ]
  }
};
const lessonCues=[0,5.2,12.2];
const animatedLength=19;
let kidFeedIndex=0, unmountKidFeed=null;

function createKidPlayer(id,profile,date,{onDone,onLeaving,forceAnimation=false}={}){
  const lesson=kidLessons[id], asset=reelAssets[id];
  const useFootage=Boolean(asset&&!forceAnimation);
  const speech=window.speechSynthesis;
  const video=useFootage?el('video'):null;
  const canvas=el('canvas');canvas.width=640;canvas.height=360;
  canvas.setAttribute('role','img');
  const animationTitle=el('h3'), animationWords=el('p');
  const animation=add(el('div',null,'reel-animation'),el('small','FUTEBOL EM FAMÍLIA'),el('h2',lesson.name),canvas,
    add(el('div',null,'reel-animation-card'),animationTitle,animationWords));
  const surface=el('div',null,'reel-surface');
  const progress=el('progress');progress.max=animatedLength;progress.value=0;
  progress.setAttribute('aria-label','Progresso da aula');
  const stage=add(el('div',null,'reel-stage'),surface,progress);
  const status=el('p','Toque em Reproduzir.','reel-status');status.setAttribute('role','status');
  let bell=kidBell(), footage=useFootage;
  let voiceOn=Boolean(speech&&window.SpeechSynthesisUtterance);
  let utterance=null, cue=-1, withCue=-1, elapsed=0, began=0, frame=0, finishWait=0;
  let playing=false, ending=false, closed=false;

  function action(icon,text,click,primary=false){
    const b=button('',click,'reel-action'+(primary?' reel-action-primary':''));
    const glyph=el('span',icon,'reel-glyph');glyph.setAttribute('aria-hidden','true');
    return add(b,glyph,el('span',text,'reel-action-label'));
  }
  const play=action('▶','Reproduzir',toggle);
  const voice=action('🔊','Voz ligada',()=>{
    voiceOn=!voiceOn;
    stopSpeech();withCue=-1;updateControls();
    if(ending)openTimer();
    else if(playing)paint(elapsed,true);
  });
  voice.hidden=!voiceOn;
  const train=action('⏱','Treinar agora',()=>{
    bell.unlock();
    openTimer();
  },true);
  const rail=add(el('div',null,'reel-rail'),play,voice,train);
  const panel=add(el('div',null,'reel-panel'),add(el('div',null,'reel-layout'),stage,rail),status);
  panel.setAttribute('aria-label',lesson.name);
  if(video){
    video.playsInline=true;
    video.muted=true;
    video.preload='metadata';
    video.poster='./media/'+asset.path+'.jpg';
    video.src='./media/'+asset.path+'.mp4';
    video.setAttribute('aria-label','Vídeo com instruções de '+lesson.name);
    video.addEventListener('timeupdate',()=>{if(!closed&&footage)paint(video.currentTime,playing);});
    video.addEventListener('durationchange',()=>{
      if(footage&&Number.isFinite(video.duration)&&video.duration>0)progress.max=video.duration;
    });
    video.addEventListener('ended',()=>{if(!closed&&footage)finish();});
    video.addEventListener('error',videoError);
    surface.append(video);
  }else surface.append(animation);
  paint(0);updateControls();
  surface.addEventListener('click',toggle);

  function updateControls(){
    play.firstChild.textContent=playing?'Ⅱ':'▶';
    play.lastChild.textContent=playing?'Pausar':'Reproduzir';
    play.disabled=ending;
    voice.firstChild.textContent=voiceOn?'🔊':'🔇';
    voice.lastChild.textContent=voiceOn?'Voz ligada':'Voz desligada';
    voice.setAttribute('aria-pressed',String(voiceOn));
  }
  function stopSpeech(){
    const had=Boolean(utterance);
    utterance=null;
    if(had)speech.cancel();
  }
  function say(index){
    if(!voiceOn||index===withCue||closed)return;
    withCue=index;
    stopSpeech();
    try{
      const [title,words]=lesson.steps[index];
      const u=kidUtterance((footage&&asset.lines[index])||title+'. '+words);
      if(!u)return;
      utterance=u;
      u.onend=u.onerror=()=>{
        if(utterance!==u)return;
        utterance=null;
        if(ending)openTimer();
      };
      speech.speak(u);
    }catch{utterance=null;}
  }
  function paint(position,speak=false){
    elapsed=position;
    progress.value=Math.min(progress.max,position);
    const index=position<lessonCues[1]?0:position<lessonCues[2]?1:2;
    if(!footage){
      const [title,words]=lesson.steps[index];
      if(cue!==index){
        animationTitle.textContent=title;
        animationWords.textContent=words;
        canvas.setAttribute('aria-label',title+'. '+words);
      }
      drawKidDemo(canvas,id,index,(elapsed-lessonCues[index])*1000);
    }
    cue=index;
    if(speak)say(index);
  }
  function animate(now){
    if(!playing||closed||footage)return;
    const position=(now-began)/1000;
    paint(position,true);
    if(position>=animatedLength)finish();
    else frame=requestAnimationFrame(animate);
  }
  function toggle(){
    if(closed||ending)return;
    if(playing){
      playing=false;
      if(footage)video.pause();
      cancelAnimationFrame(frame);stopSpeech();updateControls();
      status.textContent='Aula em pausa.';
      return;
    }
    bell.unlock();
    withCue=-1;playing=true;
    paint(footage?video.currentTime:elapsed,true);updateControls();
    status.textContent='Ao terminar, o temporizador começa.';
    if(footage)video.play().catch(videoError);
    else {
      began=performance.now()-elapsed*1000;
      frame=requestAnimationFrame(animate);
    }
  }
  function videoError(){
    if(!footage||closed)return;
    playing=false;footage=false;
    video.pause();stopSpeech();withCue=-1;cue=-1;
    surface.replaceChildren(animation);progress.max=animatedLength;
    paint(0);updateControls();
    status.textContent='Vídeo indisponível. Toque em Reproduzir para ver a animação.';
  }
  function finish(){
    if(closed||ending)return;
    playing=false;ending=true;updateControls();
    status.textContent='Preparando o temporizador…';
    if(!utterance)openTimer();
    else finishWait=setTimeout(openTimer,8000);
  }
  function reset(){
    clearTimeout(finishWait);cancelAnimationFrame(frame);stopSpeech();
    playing=false;ending=false;withCue=-1;
    if(footage){
      video.pause();
      if(video.readyState)video.currentTime=0;
    }
    paint(0);updateControls();
  }
  function openTimer(){
    if(closed)return;
    const unlockedBell=bell;
    bell=kidBell();
    reset();
    status.textContent='Toque em Reproduzir para rever a aula.';
    onLeaving?.();
    kidTimer(id,profile,date,{auto:true,bell:unlockedBell,onDone});
  }
  function close(){
    if(closed)return;
    closed=true;
    clearTimeout(finishWait);cancelAnimationFrame(frame);stopSpeech();bell.close();
    if(video){video.pause();video.removeAttribute('src');video.load();}
  }
  return {panel,surface,close};
}

function kidReel(id,profile,date){
  activeKidDemo?.();activeKidTimer?.();
  const dialog=$('dialog');dialog.classList.add('reel-dialog');
  const player=createKidPlayer(id,profile,date,{onLeaving:()=>activeKidDemo?.()});
  activeKidDemo=()=>{
    player.close();dialog.classList.remove('reel-dialog');activeKidDemo=null;
  };
  openModal(kidLessons[id].name,player.panel);
}

function kidFeed(root){
  const todayKey=today();
  const selected=state.profiles.find(p=>p.id===kidProfileId)??state.profiles[0];
  const profileRow=el('div',null,'feed-profiles');
  profileRow.setAttribute('role','group');profileRow.setAttribute('aria-label','Escolha seu perfil');
  if(selected){
    kidProfileId=selected.id;
    for(const profile of state.profiles){
      const name=profile.name==='Filho de '+profile.age+' anos'?'Tenho '+profile.age+' anos':profile.name;
      const b=button(name,()=>{kidProfileId=profile.id;render();$('main').querySelector('.feed-profiles [aria-pressed=true]')?.focus();});
      b.setAttribute('aria-pressed',String(profile.id===selected.id));
      profileRow.append(b);
    }
  }
  const header=add(el('div',null,'feed-top'),el('h1','Aulas de futebol'),selected?profileRow:el('p','Peça a um adulto para criar um perfil.'));
  const scheduled=selected&&weekOf(todayKey)>=1&&weekOf(todayKey)<=12?activity(selected,todayKey):null;
  const todayIndex=lessonIds.indexOf(scheduled?.type);
  if(todayIndex>=0)header.append(button('Hoje · '+kidLessons[scheduled.type].name,()=>show(todayIndex,true),'feed-today'));
  const board=el('section',null,'feed-board');
  const rail=el('div',null,'feed-pagination');
  rail.setAttribute('role','group');rail.setAttribute('aria-label','Trocar exercício');
  const count=el('p',null,'feed-count');count.setAttribute('aria-live','polite');
  const current=el('div');
  const back=button('↑ Anterior',()=>show(kidFeedIndex-1,true));
  const next=button('↓ Próximo',()=>show(kidFeedIndex+1,true));
  rail.append(back,count,next);
  board.append(current,rail);
  let player;
  function show(index,focus=false){
    if(index<0||index>=lessonIds.length)return;
    player?.close();
    kidFeedIndex=index;
    const id=lessonIds[index];
    player=createKidPlayer(id,selected,todayKey,{onDone:index<lessonIds.length-1?()=>{
      kidFeedIndex=index+1;
      if(view==='Modo infantil'){
        render();
        $('main').querySelector('.reel-action')?.focus({preventScroll:true});
      }
    }:null});
    player.panel.querySelector('.reel-status').textContent='Deslize para trocar de exercício.';
    current.replaceChildren(player.panel);
    count.textContent=(index+1)+' / '+lessonIds.length;
    count.setAttribute('aria-label',kidLessons[id].name+', '+(index+1)+' de '+lessonIds.length);
    back.disabled=index===0;next.disabled=index===lessonIds.length-1;
    if(focus)player.panel.querySelector('.reel-action')?.focus({preventScroll:true});
    let initial;
    player.surface.addEventListener('pointerdown',event=>{
      if(event.isPrimary)initial=[event.clientX,event.clientY];
    });
    player.surface.addEventListener('pointercancel',()=>{initial=null;});
    player.surface.addEventListener('pointerup',event=>{
      if(!initial)return;
      const dx=event.clientX-initial[0],dy=event.clientY-initial[1];
      initial=null;
      if(Math.abs(dy)>42&&Math.abs(dy)>Math.abs(dx)*1.3)show(index+(dy<0?1:-1));
    });
  }
  board.addEventListener('keydown',event=>{
    if(event.key==='ArrowUp'||event.key==='ArrowDown'){
      event.preventDefault();show(kidFeedIndex+(event.key==='ArrowDown'?1:-1),true);
    }
  });
  root.append(add(el('div',null,'kid-feed'),header,board));
  unmountKidFeed=()=>{player?.close();unmountKidFeed=null;};
  show(kidFeedIndex);
}

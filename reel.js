const BOLA_REEL='./media/bola-no-pe-v1.mp4';
const BOLA_POSTER='./media/bola-no-pe-v1.jpg';
const bolaCues=[
  {at:0, text:'Monte o caminho. Coloque três marcadores no chão e deixe espaço entre eles.'},
  {at:5.2, text:'Olhe os pés dos jogadores. Dê toques curtinhos e deixe a bola perto do pé.'},
  {at:12.2, text:'Pare e vire. Encoste a sola na bola. Vire e siga para o outro lado.'}
];

function kidReel(profile,date){
  activeKidDemo?.();
  activeKidTimer?.();
  const selected=profile??(view==='Modo infantil'?state.profiles.find(p=>p.id===kidProfileId):null);
  const dialog=$('dialog');
  dialog.classList.add('reel-dialog');
  const bell=kidBell();
  const speech=window.speechSynthesis;
  const video=el('video');
  video.playsInline=true;
  video.muted=true;
  video.preload='metadata';
  video.poster=BOLA_POSTER;
  video.src=BOLA_REEL;
  video.setAttribute('aria-label','Aula Bola no pé, com instruções na imagem');
  const status=el('p','Toque em Reproduzir para ver a aula.','reel-status');
  status.setAttribute('role','status');
  const progress=el('progress');
  progress.max=18.9;
  progress.value=0;
  progress.setAttribute('aria-label','Progresso da aula');
  let withVoice=Boolean(speech&&window.SpeechSynthesisUtterance);
  let activeCue=-1, utterance=null, ending=false, closed=false, finishWait=0;

  function action(icon,text,click,primary=false){
    const b=button('',click,'reel-action'+(primary?' reel-action-primary':''));
    const glyph=el('span',icon,'reel-glyph');
    glyph.setAttribute('aria-hidden','true');
    return add(b,glyph,el('span',text,'reel-action-label'));
  }
  const play=action('▶','Reproduzir',togglePlay);
  const voice=action('🔊','Voz ligada',()=>{
    withVoice=!withVoice;
    stopSpeech();
    activeCue=-1;
    updateVoiceButton();
    if(withVoice&&!video.paused)narrateCurrent();
    if(ending)training();
  });
  voice.hidden=!withVoice;
  const train=action('⏱','Treinar agora',()=>{
    bell.unlock();
    training();
  },true);
  const fallback=button('Usar só a animação',()=>{closeReel();kidDemo('conducao',selected,date,{animated:true});},'reel-fallback');
  const stage=add(el('div',null,'reel-stage'),video,progress);
  const rail=add(el('div',null,'reel-rail'),play,voice,train);

  function updateVoiceButton(){
    voice.firstChild.textContent=withVoice?'🔊':'🔇';
    voice.lastChild.textContent=withVoice?'Voz ligada':'Voz desligada';
    voice.setAttribute('aria-pressed',String(withVoice));
  }
  function updatePlayButton(){
    play.firstChild.textContent=video.paused?'▶':'Ⅱ';
    play.lastChild.textContent=video.paused?'Reproduzir':'Pausar';
    if(!ending)status.textContent=video.paused?'Aula em pausa.':'Ao terminar, o temporizador começa sozinho.';
  }
  function togglePlay(){
    if(closed||ending)return;
    if(!video.paused){video.pause();return;}
    bell.unlock();
    activeCue=-1;
    narrateCurrent();
    video.play().catch(videoFailed);
  }
  function stopSpeech(){
    const had=Boolean(utterance);
    utterance=null;
    if(had)speech.cancel();
  }
  function narrateCurrent(){
    if(!withVoice||closed)return;
    let cueIndex=0;
    for(let i=1;i<bolaCues.length;i++)if(video.currentTime>=bolaCues[i].at)cueIndex=i;
    if(cueIndex===activeCue)return;
    activeCue=cueIndex;
    stopSpeech();
    try {
      const u=kidUtterance(bolaCues[cueIndex].text);
      if(!u)return;
      utterance=u;
      u.onend=u.onerror=()=>{
        if(utterance!==u)return;
        utterance=null;
        if(ending)training();
      };
      speech.speak(u);
    }catch{utterance=null;}
  }
  function training(){
    if(closed)return;
    closeReel(true);
    kidTimer('conducao',selected,date,{auto:true,bell});
  }
  function videoFailed(){
    if(closed)return;
    stopSpeech();
    status.textContent='O vídeo não abriu. Você pode usar a animação.';
    play.hidden=true;
    fallback.focus();
  }
  function closeReel(keepBell=false){
    if(closed)return;
    closed=true;
    clearTimeout(finishWait);
    stopSpeech();
    video.pause();
    video.removeAttribute('src');
    video.load();
    dialog.classList.remove('reel-dialog');
    if(!keepBell)bell.close();
    activeKidDemo=null;
  }
  video.addEventListener('click',togglePlay);
  video.addEventListener('play',()=>{if(!closed)updatePlayButton();});
  video.addEventListener('pause',()=>{
    if(closed||video.ended)return;
    stopSpeech();
    updatePlayButton();
  });
  video.addEventListener('timeupdate',()=>{
    if(closed)return;
    progress.value=Math.min(progress.max,video.currentTime);
    if(!video.paused)narrateCurrent();
  });
  video.addEventListener('durationchange',()=>{
    if(Number.isFinite(video.duration)&&video.duration>0)progress.max=video.duration;
  });
  video.addEventListener('ended',()=>{
    if(closed)return;
    ending=true;
    play.disabled=true;
    status.textContent='Preparando o temporizador…';
    if(!utterance)training();
    else finishWait=setTimeout(training,8000);
  });
  video.addEventListener('error',videoFailed);
  activeKidDemo=closeReel;
  updateVoiceButton();
  openModal('Aula em vídeo',add(el('div',null,'reel-panel'),
    add(el('div',null,'reel-layout'),stage,rail),status,fallback));
}

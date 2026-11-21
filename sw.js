const CACHE='futebol-familia-v7';
const HOME='./?modo=infantil';
const FILES=[HOME,'./index.html','./kids.css?v=7','./kids.js?v=7','./reel.js?v=7','./reel.css?v=7','./media/bola-no-pe-v1.mp4','./media/bola-no-pe-v1.jpg','./media/passe-amigo-v1.mp4','./media/passe-amigo-v1.jpg','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith('futebol-familia-')&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function onlinePage(request,cache){
  try {
    const signal=typeof AbortSignal.timeout==='function'?AbortSignal.timeout(4000):undefined;
    const response=await fetch(request,{cache:'no-cache',signal});
    if(response.ok)return response;
  } catch {}
  return await cache.match(HOME) || await cache.match('./index.html') || Response.error();
}

async function cachedVideo(range,asset){
  const bytes=await asset.arrayBuffer();
  const n=bytes.byteLength;
  const parts=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!parts||(!parts[1]&&!parts[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+n}});
  const start=parts[1]?Number(parts[1]):Math.max(0,n-Number(parts[2]));
  const end=parts[1]&&parts[2]?Math.min(n-1,Number(parts[2])):n-1;
  if(start>=n||end<start)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+n}});
  return new Response(bytes.slice(start,end+1),{status:206,headers:{
    'Content-Type':'video/mp4','Content-Range':'bytes '+start+'-'+end+'/'+n,
    'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'
  }});
}

self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(event.request.mode==='navigate')return onlinePage(event.request,cache);
    const range=event.request.headers.get('Range');
    if(range&&/\/media\/(bola-no-pe|passe-amigo)-v1\.mp4$/.test(url.pathname)){
      const asset=await cache.match(url.href,{ignoreVary:true});
      if(asset)return cachedVideo(range,asset);
    }
    return await cache.match(event.request)||fetch(event.request);
  }));
});

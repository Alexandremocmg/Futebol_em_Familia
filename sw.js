const CACHE='futebol-familia-v4';
const HOME='./?modo=infantil';
const FILES=[HOME,'./index.html','./kids.css?v=4','./kids.js?v=4','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

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

self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(event.request.mode==='navigate')return onlinePage(event.request,cache);
    return await cache.match(event.request)||fetch(event.request);
  }));
});

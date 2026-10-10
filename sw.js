// Every release must use a new cache version.
const VERSION='jitsumu-v4-20261010-layout1';
const FILES=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('jitsumu-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url),scope=new URL(self.registration.scope);
  if(e.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  e.respondWith(caches.open(VERSION).then(async c=>{
    const cached=await c.match(e.request,{ignoreSearch:true});
    if(cached)return cached;
    try{return await fetch(e.request)}catch(err){if(e.request.mode==='navigate')return c.match('./index.html');throw err}
  }));
});

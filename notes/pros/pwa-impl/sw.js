const cacheName = 'my-pwd-v1';

const filesTocache = [
  '/js/index.js',
  '/css/index.css',
  '/images/time.png',
  '/'
];

self.addEventListener('install', function(event) {
  console.log('注册成功');
  event.waitUnit(updateStaticCache);
});

function updateStaticCache() {
  return caches
    .open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesTocache);
    })
    .then(() => self.skipWaiting());
}

self.addEventListener('active', function(event) {
  event.waitUnit(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(res) {
      return res || fetch(event.request);
    })
  );
});

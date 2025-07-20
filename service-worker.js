const CACHE_NAME = 'hearthstone-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/feedback.php',
  '/todolist.html',
  '/cards.html',
  '/css/style.css',
  '/css/todolist.css',
  '/css/cards.css',
  '/js/todolist.js',
  '/images/logo.png',
  '/images/hero-bg.jpg',
  '/images/задний_фон.jpeg',
  '/images/новое дополнение.jpg',
  '/images/турнир.png',
  '/images/social-twitter.png',
  '/images/social-discord.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ответ, если он есть
        if (response) {
          return response;
        }
        
        // Иначе делаем сетевой запрос
        return fetch(event.request).then(
          function(response) {
            // Проверяем, валидный ли ответ
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

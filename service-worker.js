const CACHE_NAME = 'hearthstone-portal-v2';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/cards.html',
  '/todolist.html',
  '/feedback.php',
  '/css/style.css',
  '/css/cards.css',
  '/js/cards.js',
  '/images/logo.png',
  '/images/новое дополнение.jpg',
  '/images/турнир.png',
  '/images/рагнарос.jpg',
  '/images/громмаш.jpg',
  '/images/social-twitter.png',
  '/images/social-discord.png',
  '/manifest.json'  // Добавлено явное кеширование манифеста
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// ЗАМЕНЯЕМ ЭТОТ БЛОК НА НОВУЮ ВЕРСИЮ:
self.addEventListener('fetch', event => {
  // 1. Особый случай для manifest.json
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/manifest.json'))
    );
    return;
  }

  // 2. Пропускаем не-GET запросы
  if (event.request.method !== 'GET') return;

  // 3. Обработка HTML-страниц
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 4. Для остальных ресурсов: сначала сеть, потом кеш
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request)
          .then(response => {
            // Кешируем только успешные ответы
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            return response;
          })
          .catch(() => {
            // Заглушка для изображений
            if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
              return caches.match('/images/logo.png');
            }
            return new Response('Нет соединения', { status: 503 });
          });
      })
  );
});

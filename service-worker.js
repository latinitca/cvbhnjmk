// Название кеша и версия
const CACHE_NAME = 'hearthstone-portal-v2';
const OFFLINE_URL = '/offline.html';

// Файлы для предварительного кеширования
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
  '/manifest.json'
];

// Установка Service Worker и кеширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеширование основных ресурсов');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кешей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Стратегия работы с запросами: сначала кеш, потом сеть
self.addEventListener('fetch', event => {
  // Пропускаем POST-запросы и запросы к API
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кешированный ответ, если есть
        if (response) {
          return response;
        }

        // Для HTML-страниц: возвращаем кешированную версию или offline.html
        if (event.request.headers.get('accept').includes('text/html')) {
          return fetch(event.request)
            .catch(() => caches.match(OFFLINE_URL));
        }

        // Для остальных ресурсов: сначала сеть, потом кеш
        return fetch(event.request)
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
            // Для изображений возвращаем заглушку
            if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
              return caches.match('/images/logo.png');
            }
            return new Response('Нет соединения', { status: 503 });
          });
      })
  );
});

const CACHE_NAME = 'my-recipes-v1';
const ASSETS_TO_CACHE = [
  '/my-recipes1/',
  '/my-recipes1/index.html',
  // Добавьте сюда пути к вашим стилям, скриптам и главным картинкам
  // Например: '/my-recipes1/style.css', '/my-recipes1/app.js'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация и удаление старого кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов (стратегия: сначала кэш, потом сеть)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // отдает из кэша мгновенно
      }
      return fetch(event.request).then((response) => {
        // Опционально: можно кэшировать новые запросы «на лету»
        return response;
      });
    })
  );
});

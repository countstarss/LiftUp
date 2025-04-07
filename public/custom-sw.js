// 默认处理离线页面和自定义缓存策略
const OFFLINE_VERSION = '1.0.0';
const CACHE_NAME = 'liftup-offline';
const OFFLINE_URL = '/offline.html';

// 安装事件 - 缓存离线页面
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // 缓存离线页面
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })()
  );
  // 立即接管页面
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 启用导航预加载
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      // 清理旧版本缓存
      const cacheKeys = await caches.keys();
      const oldCaches = cacheKeys.filter(key => key.startsWith('liftup-') && key !== CACHE_NAME);
      await Promise.all(oldCaches.map(key => caches.delete(key)));
    })()
  );

  // 立即接管已打开的页面
  self.clients.claim();
});

// 网络请求拦截 - 处理离线情况
self.addEventListener('fetch', (event) => {
  // 只处理导航请求
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // 尝试使用navigation preload响应
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // 否则，尝试从网络获取
          return await fetch(event.request);
        } catch (error) {
          // 网络请求失败，返回离线页面
          console.log('Fetch failed; returning offline page instead.', error);
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_URL);
        }
      })()
    );
  }
});

// 消息事件处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 推送通知处理
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1',
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
}); 
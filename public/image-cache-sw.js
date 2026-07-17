/* global self, caches, fetch, Response */

const IMAGE_CACHE_NAME = "dely-roses-product-images-v1";
const MAX_IMAGE_CACHE_ENTRIES = 80;
const registrationUrl = new URL(globalThis.location.href);
const configuredCdnHost = registrationUrl.searchParams.get("cdnHost") || "cdn.delyroses-ec.com";

function isCacheableImageRequest(request) {
  if (request.method !== "GET") return false;
  if (request.destination !== "image") return false;

  const url = new URL(request.url);
  return url.protocol === "https:" && url.hostname === configuredCdnHost;
}

async function trimImageCache(cache) {
  const keys = await cache.keys();
  const extraEntries = keys.length - MAX_IMAGE_CACHE_ENTRIES;

  if (extraEntries <= 0) return;

  await Promise.all(keys.slice(0, extraEntries).map((request) => cache.delete(request)));
}

async function putImageInCache(cache, imageUrl) {
  const url = new URL(imageUrl);

  if (url.protocol !== "https:" || url.hostname !== configuredCdnHost) return;

  const request = new Request(url.href, {
    mode: "no-cors",
    credentials: "omit",
  });
  const cachedResponse = await cache.match(request, { ignoreVary: true });

  if (cachedResponse) return;

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok || networkResponse.type === "opaque") {
      await cache.put(request, networkResponse.clone());
    }
  } catch {
    return;
  }
}

async function precacheImages(imageUrls) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  const cache = await caches.open(IMAGE_CACHE_NAME);
  const uniqueImageUrls = Array.from(new Set(imageUrls)).slice(0, MAX_IMAGE_CACHE_ENTRIES);

  await Promise.allSettled(uniqueImageUrls.map((imageUrl) => putImageInCache(cache, imageUrl)));
  await trimImageCache(cache);
}

async function cacheFirstImage(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  const cachedResponse = await cache.match(request, { ignoreVary: true });

  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok || networkResponse.type === "opaque") {
      await cache.put(request, networkResponse.clone());
      await trimImageCache(cache);
    }

    return networkResponse;
  } catch {
    const staleResponse = await cache.match(request, { ignoreVary: true });

    if (staleResponse) return staleResponse;
    return Response.error();
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("dely-roses-product-images-") && cacheName !== IMAGE_CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (!isCacheableImageRequest(event.request)) return;

  event.respondWith(cacheFirstImage(event.request));
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PRECACHE_PRODUCT_IMAGES") return;

  event.waitUntil(precacheImages(event.data.imageUrls));
});

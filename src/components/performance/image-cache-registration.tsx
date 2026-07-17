"use client";

import { useEffect } from "react";

type ImageCacheRegistrationProps = {
  imageCdnUrl: string;
  productImageUrls: string[];
};

export function ImageCacheRegistration({ imageCdnUrl, productImageUrls }: ImageCacheRegistrationProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const cdnHost = new URL(imageCdnUrl).hostname;
    const serviceWorkerUrl = `/image-cache-sw.js?cdnHost=${encodeURIComponent(cdnHost)}`;

    const precacheProductImages = (registration: ServiceWorkerRegistration) => {
      const activeWorker = registration.active || navigator.serviceWorker.controller;

      activeWorker?.postMessage({
        type: "PRECACHE_PRODUCT_IMAGES",
        imageUrls: productImageUrls,
      });
    };

    void navigator.serviceWorker
      .register(serviceWorkerUrl, {
        scope: "/",
        updateViaCache: "none",
      })
      .then((registration) => navigator.serviceWorker.ready.then(precacheProductImages).catch(() => precacheProductImages(registration)))
      .catch(() => undefined);
  }, [imageCdnUrl, productImageUrls]);

  return null;
}

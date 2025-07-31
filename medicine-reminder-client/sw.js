if (!self.define) {
  let registry = {};
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return (
      registry[uri] ||
      new Promise((resolve) => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          nextDefineUri = uri;
          importScripts(uri);
          resolve();
        }
      }).then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri =
      nextDefineUri ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (registry[uri]) {
      return;
    }
    let exports = {};
    const require = (depUri) => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require,
    };
    registry[uri] = Promise.all(
      depsNames.map((depName) => specialDeps[depName] || require(depName))
    ).then((deps) => {
      factory(...deps);
      return exports;
    });
  };
}
define(["./workbox-f001acab"], function (workbox) {
  "use strict";
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.precacheAndRoute(
    [
      {
        url: "index.html",
        revision: "0.887p4svlos",
      },
    ],
    {}
  );
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(
    new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
      allowlist: [/^\/$/],
    })
  );
  workbox.registerRoute(
    /^https:\/\/fonts\.googleapis\.com\/.*/i,
    new workbox.CacheFirst({
      cacheName: "google-fonts-cache",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 31536000,
        }),
      ],
    }),
    "GET"
  );
  workbox.registerRoute(
    /^https:\/\/fonts\.gstatic\.com\/.*/i,
    new workbox.CacheFirst({
      cacheName: "gstatic-fonts-cache",
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 31536000,
        }),
      ],
    }),
    "GET"
  );
  workbox.registerRoute(
    /^https:\/\/api\.*/i,
    new workbox.NetworkFirst({
      cacheName: "api-cache",
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 2592000,
        }),
      ],
    }),
    "GET"
  );
});

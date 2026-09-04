const CACHE_NAME = 'field-job-sheet-v8';

const APP_FILES = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './Logo1.png',
  './Logo2.png',
  './html2canvas.min.js',
  './jspdf.umd.min.js',
  './jspdf.plugin.autotable.min.js'
];

const OPTIONAL_FILES = [
  './icon-192.png',
  './icon-512.png'
];

/*
 * Only cache responses that look like the resource
 * we actually requested.
 */
function isValidForUrl(urlOrPath, response) {
  if (!response || !response.ok) return false;

  const contentType =
    response.headers.get('content-type') || '';

  const path =
    typeof urlOrPath === 'string'
      ? urlOrPath
      : urlOrPath.pathname;

  if (
    (path.endsWith('.js') ||
     path.endsWith('.css')) &&
    contentType.includes('text/html')
  ) {
    return false;
  }

  if (
    path.endsWith('.png') &&
    contentType.includes('text/html')
  ) {
    return false;
  }

  if (
    path.endsWith('.json') &&
    contentType.includes('text/html')
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener('install', event => {

  event.waitUntil(
    (async () => {

      const cache =
        await caches.open(CACHE_NAME);

      /*
       * Download the main application files.
       *
       * If one file fails, don't prevent the entire
       * service worker from installing.
       */
      for (const file of APP_FILES) {

        try {

          const response =
            await fetch(file, {
              cache: 'no-store'
            });

          if (
            isValidForUrl(
              file,
              response
            )
          ) {

            await cache.put(
              file,
              response
            );
          }

        } catch (error) {

          console.warn(
            'Could not cache:',
            file
          );
        }
      }


      /*
       * Optional icons.
       */
      for (const file of OPTIONAL_FILES) {

        try {

          const response =
            await fetch(file, {
              cache: 'no-store'
            });

          if (
            isValidForUrl(
              file,
              response
            )
          ) {

            await cache.put(
              file,
              response
            );
          }

        } catch (error) {

          console.warn(
            'Optional file not cached:',
            file
          );
        }
      }


      /*
       * Activate the new service worker immediately.
       */
      await self.skipWaiting();

    })()
  );
});


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener('activate', event => {

  event.waitUntil(
    (async () => {

      /*
       * Delete old application caches.
       */
      const cacheNames =
        await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            name =>
              name !== CACHE_NAME
          )
          .map(
            name =>
              caches.delete(name)
          )
      );


      /*
       * Take control of open pages immediately.
       */
      await self.clients.claim();


      /*
       * Tell open windows that a new version
       * of the application is available.
       */
      const clients =
        await self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

      clients.forEach(client => {

        client.postMessage({
          type: 'SW_UPDATED'
        });

      });

    })()
  );
});


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener('fetch', event => {

  const request =
    event.request;

  const url =
    new URL(request.url);


  /*
   * Only handle requests belonging to this
   * application.
   */
  if (
    url.origin !==
    self.location.origin
  ) {
    return;
  }


  /*
   * -------------------------------------------------------
   * PAGE NAVIGATION
   * -------------------------------------------------------
   *
   * CACHE FIRST.
   *
   * This means opening the PWA does NOT require
   * a network connection.
   */

  if (
    request.mode === 'navigate'
  ) {

    event.respondWith(
      (async () => {

        const cache =
          await caches.open(
            CACHE_NAME
          );


        const cached =
          await cache.match(
            './index.html'
          );


        /*
         * If index.html is already cached,
         * use it immediately.
         */
        if (cached) {

          /*
           * Optional background update.
           *
           * This does NOT block the application
           * from opening.
           */
          event.waitUntil(
            updateAppFile(
              './index.html'
            )
          );

          return cached;
        }


        /*
         * First ever visit:
         * network is required.
         */
        try {

          const response =
            await fetch(request);

          if (
            isValidForUrl(
              url,
              response
            )
          ) {

            await cache.put(
              './index.html',
              response.clone()
            );
          }

          return response;

        } catch (error) {

          return new Response(
            'The application has not been cached yet. Please connect to the internet once to install it.',
            {
              status: 503,
              headers: {
                'Content-Type':
                  'text/plain'
              }
            }
          );
        }

      })()
    );

    return;
  }


  /*
   * -------------------------------------------------------
   * OTHER APPLICATION FILES
   * -------------------------------------------------------
   *
   * CACHE FIRST.
   */

  event.respondWith(
    (async () => {

      const cache =
        await caches.open(
          CACHE_NAME
        );


      const cached =
        await cache.match(
          request
        );


      /*
       * Use cached resource immediately.
       */
      if (cached) {

        /*
         * Update it in the background.
         *
         * The user does not have to wait for
         * GitHub/network access.
         */
        event.waitUntil(
          updateAppFile(
            request
          )
        );

        return cached;
      }


      /*
       * Resource isn't cached.
       * Try the network.
       */
      try {

        const response =
          await fetch(request);

        if (
          isValidForUrl(
            url,
            response
          )
        ) {

          await cache.put(
            request,
            response.clone()
          );
        }

        return response;

      } catch (error) {

        return new Response(
          'Offline — resource not available.',
          {
            status: 503,
            headers: {
              'Content-Type':
                'text/plain'
            }
          }
        );
      }

    })()
  );
});


/* =========================================================
   BACKGROUND UPDATE
   ========================================================= */

async function updateAppFile(
  requestOrPath
) {

  try {

    const response =
      await fetch(
        requestOrPath,
        {
          cache: 'no-store'
        }
      );


    if (
      !isValidForUrl(
        requestOrPath,
        response
      )
    ) {
      return;
    }


    const cache =
      await caches.open(
        CACHE_NAME
      );


    await cache.put(
      requestOrPath,
      response
    );

  } catch (error) {

    /*
     * Network unavailable.
     *
     * That's fine because the cached
     * application continues working.
     */
  }
}
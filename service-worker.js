{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const CACHE_NAME = 'field-job-sheet-v1';\
\
const FILES_TO_CACHE = [\
  './',\
  './index.html',\
  './manifest.json',\
  './jspdf.umd.min.js',\
  './html2canvas.min.js'\
];\
\
// Install: cache everything once\
self.addEventListener('install', event => \{\
  event.waitUntil(\
    caches.open(CACHE_NAME).then(cache => \{\
      return cache.addAll(FILES_TO_CACHE);\
    \})\
  );\
  self.skipWaiting();\
\});\
\
// Activate: clean old caches\
self.addEventListener('activate', event => \{\
  event.waitUntil(\
    caches.keys().then(keys =>\
      Promise.all(\
        keys.map(key => \{\
          if (key !== CACHE_NAME) \{\
            return caches.delete(key);\
          \}\
        \})\
      )\
    )\
  );\
  self.clients.claim();\
\});\
\
// Fetch: always serve from cache (offline-first)\
self.addEventListener('fetch', event => \{\
  event.respondWith(\
    caches.match(event.request).then(response => \{\
      return response || fetch(event.request);\
    \})\
  );\
\});\
}
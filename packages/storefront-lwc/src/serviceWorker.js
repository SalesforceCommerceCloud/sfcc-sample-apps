/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
const CACHE = 'pwabuilder-precache';
const precacheFiles = ['/index.html'];

self.addEventListener('install', function(event) {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(precacheFiles);
        }),
    );
});

// This gives service worker control of page
self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

// If any fetch fails, will look in cache
self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fromCache(event.request).then(
            function(response) {
                // The response was found in the cache so we respond with it and update the entry

                // This is where we call the server to get the newest version of the
                // file to use the next time we show view
                event.waitUntil(
                    fetch(event.request).then(function(response) {
                        return updateCache(event.request, response);
                    }),
                );

                return response;
            },
            function() {
                // The response was not found in the cache so we look for it on the server
                return fetch(event.request)
                    .then(function(response) {
                        // If request was success, add or update it in the cache
                        event.waitUntil(
                            updateCache(event.request, response.clone()),
                        );

                        return response;
                    })
                    .catch(function(error) {
                        console.error(
                            '[PWA Builder] Network request failed and no cache.' +
                                error,
                        );
                    });
            },
        ),
    );
});

function fromCache(request) {
    // Check to see if service worker is in the cache
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request).then(function(matching) {
            if (!matching || matching.status === 404) {
                return Promise.reject('no-match');
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
    return caches.open(CACHE).then(function(cache) {
        return cache.put(request, response);
    });
}

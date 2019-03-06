export function makePostRequest(url, data) {
    return fetch(url, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

export function makeGetRequest(url) {
    return fetch(url, {
        credentials: 'include'
    }).then(response => response.json());
}
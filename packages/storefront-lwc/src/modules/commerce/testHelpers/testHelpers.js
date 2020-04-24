export function tick(time = null) {
    return new Promise(resolve => setTimeout(resolve, time));
}

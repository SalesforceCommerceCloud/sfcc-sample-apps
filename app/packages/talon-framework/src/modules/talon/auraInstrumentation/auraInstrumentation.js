import { log } from "talon/logger";

function mark(ns, name, ctx) {
    log(`[instrumentation] mark(${JSON.stringify({ ns, name, ctx })})`);
}

function markStart(ns, name, ctx) {
    log(`[instrumentation] markStart(${JSON.stringify({ ns, name, ctx })})`);
}

function markEnd(ns, name, ctx) {
    log(`[instrumentation] markEnd(${JSON.stringify({ ns, name, ctx })})`);
}

function time() {
    log(`[instrumentation] time()`);
    return Date.now.bind(Date);
}

function perfStart(name, attributes, eventSource) {
    log(`[instrumentation] perfStart(${JSON.stringify({ name, attributes, eventSource })})`);
}

function perfEnd(name, attributes, eventSource) {
    log(`[instrumentation] perfEnd(${JSON.stringify({ name, attributes, eventSource })})`);
}

function interaction(target, scope, context, eventSource, eventType) {
    log(`[instrumentation] interaction(${JSON.stringify({ target, scope, context, eventSource, eventType })})`);
}

function registerCacheStats(name) {
    return {
        logHits(count) {
            log(`[instrumentation] registerCacheStats(${name}) logHits(${count})`);
        },
        logMisses(count) {
            log(`[instrumentation] registerCacheStats(${name}) logMisses(${count})`);
        },
        unRegister() {
            log(`[instrumentation] registerCacheStats(${name}) unRegister()`);
        }
    };
}

export default { perfStart, perfEnd, mark, markStart, markEnd, time, interaction, registerCacheStats };

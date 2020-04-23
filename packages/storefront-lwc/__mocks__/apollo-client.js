import { register, ValueChangedEvent } from '@lwc/wire-service';

let mockedQueryResp = null;
let lastConnectedQueryConfig = null;

let mockedMutationResp = null;
let lastMutation = null;

export const useQuery = Symbol('apollo-use-query');
export const useMutation = Symbol('apollo-use-mutation');

export function reset() {
    mockedQueryResp = null;
    lastConnectedQueryConfig = null;

    mockedMutationResp = null;
    lastMutation = null;
}

export function mockMutation(resp) {
    mockedMutationResp = resp;
}

export function mockQuery(resp = {}) {
    mockedQueryResp = resp;
}

export function getLastMutation() {
    return lastMutation;
}

export function getLastConnectedConfig() {
    return lastConnectedQueryConfig;
}

register(useQuery, eventTarget => {
    function handleConnect() {
        if (mockedQueryResp) {
            eventTarget.dispatchEvent(
                new ValueChangedEvent({
                    client: {},
                    loading: false,
                    data: mockedQueryResp.data
                        ? mockedQueryResp.data
                        : mockedQueryResp,
                    error: mockedQueryResp.errors
                        ? mockedQueryResp.errors
                        : null,
                    initialized: true,
                    fetch: () => {},
                }),
            );
        }
    }
    function handleConfig(config) {
        lastConnectedQueryConfig = config;
    }
    function handleDisconnect() {}

    eventTarget.addEventListener('config', handleConfig);
    eventTarget.addEventListener('connect', handleConnect);
    eventTarget.addEventListener('disconnect', handleDisconnect);
});

register(useMutation, eventTarget => {
    function handleConnect() {
        if (mockedMutationResp) {
            eventTarget.dispatchEvent(
                new ValueChangedEvent({
                    client: {},
                    loading: false,
                    data: mockedMutationResp.data
                        ? mockedMutationResp.data
                        : mockedMutationResp,
                    error: mockedMutationResp.errors
                        ? mockedMutationResp.errors
                        : null,
                    initialized: true,
                    mutate: mutation => {
                        lastMutation = mutation;
                        return Promise.resolve();
                    },
                }),
            );
        }
    }
    function handleConfig(config) {}
    function handleDisconnect() {}

    eventTarget.addEventListener('config', handleConfig);
    eventTarget.addEventListener('connect', handleConnect);
    eventTarget.addEventListener('disconnect', handleDisconnect);
});

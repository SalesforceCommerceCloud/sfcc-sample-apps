let mockedQueryResp = null;
let lastConnectedQueryConfig = null;

let mockedMutationResp = null;
let lastMutation = null;

export class useQuery {
    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {}

    update(config) {
        lastConnectedQueryConfig = config;

        if (mockedQueryResp) {
            this.dataCallback({
                client: {},
                loading: false,
                data: mockedQueryResp.data
                    ? mockedQueryResp.data
                    : mockedQueryResp,
                error: mockedQueryResp.errors ? mockedQueryResp.errors : null,
                initialized: true,
                fetch: () => {},
            });
        }
    }

    disconnect() {}
}

export class useMutation {
    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {}

    update(config) {
        if (mockedMutationResp) {
            this.dataCallback({
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
            });
        }
    }

    disconnect() {}
}

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

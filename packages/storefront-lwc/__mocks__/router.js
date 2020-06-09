export class routeParams {
    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {}

    update() {
        this.dataCallback({});
    }

    disconnect() {}
}

export class history {
    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {}

    update() {
        this.dataCallback({});
    }

    disconnect() {}
}

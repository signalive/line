declare module 'line-socket/client-node' {
    import EventEmitterExtra = require('event-emitter-extra');

    type LineClientState = -1 | 0 | 1 | 2 | 3;
    type LineClientEvent = '_connecting' | '_connecting_error' | '_connected' | '_closed' | '_error';

    class LineClient extends EventEmitterExtra {
        static Events: {
            CONNECTING: LineClientEvent,
            CONNECTING_ERROR: LineClientEvent,
            CONNECTED: LineClientEvent,
            CLOSED: LineClientEvent,
            ERROR: LineClientEvent
        };

        static States: {
            READY: LineClientState,
            CONNECTING: LineClientState,
            CONNECTED: LineClientState,
            CLOSING: LineClientState,
            CLOSED: LineClientState
        };

        id: string;
        url: string;
        state: LineClientState;

        constructor(url: string, options?: {
            reconnect?: boolean,
            handshakePayload?: any
        });

        connect(): Promise<any>;

        disconnect(
            code?: number,
            reason?: any,
            retry?: boolean
        ): Promise<any>;

        ping(): Promise<any>;

        send(
            eventName: string,
            payload?: any
        ): Promise<any>;

        sendWithoutResponse(
            eventName: string,
            payload?: any
        ): Promise<any>;
    }

    export = LineClient;
}

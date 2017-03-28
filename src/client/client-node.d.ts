declare module 'line-socket/client-node' {
    import EventEmitterExtra = require('event-emitter-extra');

    type LineClientState = 'ready' | 'connecting' | 'handshaking' | 'connected' | 'disconnecting' | 'disconnected';
    type LineClientEvent = '_connecting' | '_connecting_error' | '_connected' | '_disconnecting' | '_disconnected' | '_error';
    type LineClientErrorCode = 'cInvalidOptions' |
        'cInvalidJSON' |
        'cHandshakeError' |
        'cHandshakeRejected' |
        'cMessageTimeout' |
        'cMessageRejected' |
        'cMessageNotResponded' |
        'cWebsocketError' |
        'cDisconnectError' |
        'cPingError' |
        'cDisconnected';

    class LineClient extends EventEmitterExtra {
        static Event: {
            CONNECTING: LineClientEvent,
            CONNECTING_ERROR: LineClientEvent,
            CONNECTED: LineClientEvent,
            DISCONNECTING: LineClientEvent,
            DISCONNECTED: LineClientEvent,
            ERROR: LineClientEvent
        };

        static State: {
            READY: LineClientState,
            CONNECTING: LineClientState,
            HANDSHAKING: LineClientState,
            CONNECTED: LineClientState,
            DISCONNECTING: LineClientState,
            DISCONNECTED: LineClientState
        };

        static ErrorCode: {
            INVALID_OPTIONS: LineClientErrorCode,
            INVALID_JSON: LineClientErrorCode,
            HANDSHAKE_ERROR: LineClientErrorCode,
            HANDSHAKE_REJECTED: LineClientErrorCode,
            MESSAGE_REJECTED: LineClientErrorCode,
            MESSAGE_NOT_RESPONDED: LineClientErrorCode,
            WEBSOCKET_ERROR: LineClientErrorCode,
            DISCONNECT_TIMEOUT: LineClientErrorCode,
            PING_ERROR: LineClientErrorCode,
            DISCONNECTED: LineClientErrorCode
        };

        id: string;
        url: string;
        state: LineClientState;

        constructor(url: string, options?: {
            handshake?: {
                timeout?: number,
                payload?: any
            },
            responseTimeout?: number,
            disconnectTimeout?: number,
            pingInterval?: number,
            reconnect?: boolean,
            reconnectOptions?: {
                initialDelay?: number,
                multiply?: number,
                maxDelay?: number,
                randomness?: number
            },
            uptime?: boolean,
            uptimeOptions?: {
                interval?: number,
                window?: number
            }
        });

        connect(): boolean;

        disconnect(
            code?: number,
            reason?: any,
            retry?: boolean
        ): boolean;

        ping(): Promise<any>;

        send(
            name: string,
            payload?: any
        ): Promise<any>;

        sendWithoutResponse(
            name: string,
            payload?: any
        ): Promise<any>;

        getUptime(): null|number;

        dispose(): void;
    }

    export = LineClient;
}

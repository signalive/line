declare module 'line-socket/server' {
  import EventEmitterExtra = require('event-emitter-extra');

  type LineConnectionEvent = '_disconnected' | '_error';
  type LineServerEvent = 'handshake' | 'connection' | 'headers' | 'error';
  type LineServerErrorCode = 'sInvalidOptions' | 'sInvalidAction' | 'sWebsocketError';

  class Connection extends EventEmitterExtra {
    static Event: {
      DISCONNECTED: LineConnectionEvent,
      ERROR: LineConnectionEvent
    };

    constructor(socket: any, server: Server);
    setId(id: string): void;
    joinRoom(roomName: string): void;
    leaveRoom(roomName: string): void;
    getRooms(): Room[];
    send(eventName: string, payload?: any, timeout?: number): Promise<any>;
    sendWithoutResponse(eventName: string, payload?: any): Promise<void>;
    ping(): Promise<void>;
    close(code?: number, reason?: string, delay?: number): Promise<void>;
  }

  class Room {
    constructor(name: string, connection: Connection[]);
    add(connection: Connection): void;
    remove(connection: Connection): boolean;
    getConnectionById(id: string): Connection;
    getConnections(): Connection[];
    getConnectionCount(): number;
    broadcast(eventName: string, payload?: any): void;
  }

  class Server extends EventEmitterExtra {
    static Connection: Connection;
    static Room: Room;

    static Event: {
      HANDSHAKE: LineServerEvent,
      CONNECTION: LineServerEvent,
      HEADERS: LineServerEvent,
      ERROR: LineServerEvent
    };

    static ErrorCode: {
      INVALID_OPTIONS: LineServerErrorCode,
      INVALID_ACTION: LineServerErrorCode,
      WEBSOCKET_ERROR: LineServerErrorCode
    };

    id: string;

    constructor(options?: {
      host?: string,
      port?: number,
      server?: any,
      path?: string,
      responseTimeout?: number,
      handshakeTimeout?: number,
      pingInterval?: number
    });

    start(): Promise<any>;
    stop(): Promise<any>;

    getConnections(): Connection[];
    getConnectionById(id: string): Connection;
    broadcast(eventName: string, payload?: any): void;
    getRoom(name: string): Room;
    getRoomsOf(connection: Connection): Room;
    removeFromAllRooms(connection: Connection): void;
  }

  export = Server;
}

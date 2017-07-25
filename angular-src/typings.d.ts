/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/// <reference path="node_modules/socket.io-client/socket.io.js" />
declare module 'socket.io-client' {
  var e: any;
  export = e;
}


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 3000 });
wss.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress;
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        console.log('received: %s', data, ip);
    });
    ws.on('open', function open() {
        console.log('connected');
        ws.send(Date.now());
    });
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
    ws.send('something');
});

import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import serveStatic from 'serve-static';


const app = express();

app.use(serveStatic(join(__dirname, "..", "site")));
const server = createServer(app);



const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });
let reportId = 0
const reporters = io.of("/reporters")
const dashboard = io.of("/dashboard")
reporters.on('connection', (socket) => {



    const report_room = `report_${reportId++}`
    console.log('a user connected');
    console.log("initial transport", socket.conn.transport.name)
    socket.conn.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log("upgraded transport", socket.conn.transport.name); // prints "websocket"
    });

    socket.join(report_room)

    reporters.to(report_room).emit("reportId", report_room);

    socket.onAny((e, ...args) => {
        dashboard.emit(e, ...args)
        console.log(e, args)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3005, () => {
    console.log('server running at http://localhost:3005');
});
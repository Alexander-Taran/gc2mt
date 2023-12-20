import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { Server } from 'socket.io';
import * as serveStatic from 'serve-static';
import { TestRunStore } from '../shared/test-run-store';
import { TestDetail, TestResult, TestRun } from '../shared/objects-model';


const app = express();

app.use(serveStatic(path.join(__dirname, "..", "site")));



const server = http.createServer(app);

const store = new TestRunStore()

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
    console.log('a reporter connected');

    socket.join(report_room)
    reporters.to(report_room).emit("reportId", report_room);
    socket.leave(report_room)

    socket.on("test-run-start", (run_id: string, testDetails, tests: { tests: TestDetail[] }) => {
        console.log("test run:", run_id)
        store.add(run_id, testDetails, tests.tests)
        dashboard.emit("test-run-start", run_id, testDetails, tests.tests)
    }
    )
    socket.on("test-finish", (run_id: string, test_id: string, result: TestResult) => {

        console.log("test result:", run_id, test_id, result)
        store.updateTest(run_id, test_id, result)
        dashboard.emit("test-finish", run_id, test_id, result)
    })

    socket.on("test-run-stop", (run_id: string) => {
        console.log("test run finished: ", run_id)
        const report = store.pop(run_id)
        if (report) {
            const reportDir = path.join(__dirname, 'reports')
            if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir)
            }
            const fname = path.join(reportDir, `${report.name}.json`)
            fs.writeFileSync(fname, JSON.stringify(report, null, 2))
        }
    })

    socket.on('disconnect', () => {
        console.log('reporter disconnected');
    });
});

server.listen(80, () => {
    console.log('server running at http://localhost:80');
});
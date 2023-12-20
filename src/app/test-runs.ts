import { io, Socket } from "socket.io-client";
import { TestResult } from "../shared/objects-model";
import { TestRunStore } from "../shared/test-run-store";


export class TestRuns {
  public message = 'Welcome to Aurelia 2!';
  socket: Socket;
  // testsStats = new Map<string, unknown>();

  //

  store = new TestRunStore();

  statusColor(result: TestResult) {
    switch (result?.outcome) {

      case "expected": return 'green'
      case "unexpected": return 'red'
      case 'skipped': return 'blue'
      case 'flaky': return 'yellow'
      default:
        return '#eee'
    }
  }

  statusMark(result: TestResult) {
    switch (result?.status) {
      case 'passed': return '✔'
      case 'failed': return '❌'
      case 'skipped': return '➖'
      case 'interrupted': return '🤚'
      case 'timedOut': return '⏳'
      default: return ''
    }
  }

  attached() {
    this.socket = io("/dashboard");
    this.socket.on("test-run-start", this.store.addRunHandler)
    this.socket.on("test-finish", this.store.updateTestHandler)
  }

  detached() {
    this.socket.offAny()
    this.socket.close()
  }
}

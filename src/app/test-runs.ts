import { io, Socket } from "socket.io-client";
import { TestRun, TestDetail, TestResult } from "../shared/objects-model";


export class TestRuns {
  public message = 'Welcome to Aurelia 2!';
  socket: Socket;
  testsStats = new Map<string, unknown>()
  testRuns: TestRun[] = []

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
    this.socket = io("http://10.70.2.171:3005/dashboard");
    this.socket.on("test-run-start", (reportId: string, testRunDetails: { tests: TestDetail[] }) => {
      this.testRunStarted(reportId, testRunDetails)
    })

    this.socket.on("test-finish", (reportId, testId, result: TestResult) => {
      this.testFinished(reportId, testId, result)
    })

    // this.socket.onAny((...args) => {

    //   this.message = JSON.stringify([...args])
    // })
  }
  testFinished(reportId: string, testId: string, result: TestResult) {
    const testRun = this.testRuns.find(r => r.name == reportId)
    if (testRun) {
      const test = testRun.tests.find(t => t.id === testId)
      test.result = result
    }
  }
  testRunStarted(reportId: string, testRunDetails: { tests: TestDetail[] }) {

    this.testRuns.push({ name: reportId, tests: testRunDetails.tests })
  }

  detached() {
    this.socket.close()
  }
}

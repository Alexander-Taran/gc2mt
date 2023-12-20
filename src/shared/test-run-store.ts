import { TestDetail, TestResult, TestRun } from "./objects-model";

export class TestRunStore {
    testRuns: TestRun[] = []
    add(run_id: string, testDetails, tests: TestDetail[]) {
        this.testRuns.push({ name: run_id, testDetails, tests: tests })
    }
    updateTest(run_id: string, test_id: string, result: TestResult) {
        const testRun = this.testRuns.find(r => r.name == run_id)
        if (testRun) {
            const test = testRun.tests.find(t => t.id === test_id)
            test.result = result
        }
    }
    pop(run_id: string) {
        const i = this.testRuns.findIndex(r => r.name === run_id)
        if (i > -1) {
            const run = this.testRuns[i]
            this.testRuns.splice(i, 1)
            return run
        }
    }

    updateTestHandler = (run_id: string, test_id: string, result: TestResult) => (this.updateTest(run_id, test_id, result))
    addRunHandler = (run_id: string, testDetails: unknown, tests: TestDetail[]) => { this.add(run_id, testDetails, tests) }
}
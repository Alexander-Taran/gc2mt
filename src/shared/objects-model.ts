export type TestResult = {
    status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
    duration: number;
    retry: number;
    outcome: "skipped" | "expected" | "unexpected" | "flaky";
}
export type TestDetail = {
    result?: TestResult;
    title: string
    id: string
}

export type TestRun = {
    name: string
    testDetails: unknown
    tests: TestDetail[]
}

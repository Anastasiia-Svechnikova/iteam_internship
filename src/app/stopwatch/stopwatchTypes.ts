export type StopwatchData = [number, number, number]
export interface IStopWatch {
    data: StopwatchData,
    current: number,
    previous: number
}
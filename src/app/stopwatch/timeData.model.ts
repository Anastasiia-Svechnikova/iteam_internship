export class TimeData{
    constructor(public hours: number, public minutes: number, public seconds: number) { }

    setValues(hours: number, minutes: number, seconds: number) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds
    }

    reset() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0
    }
}

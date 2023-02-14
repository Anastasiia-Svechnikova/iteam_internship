import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, Subscription } from 'rxjs';

const TIMER_INTERVAL = 1000;

@Injectable({
  providedIn: 'root',
})
export class StopWatchService {
  /** keeps the value of the interval at the moment when Wait button was pressed
   * this value is added when resuming the interval
   * 
   * default value is 1 to avoid the delay when starting the interval
   */
  pausedTime = 1;

  stopWatch$ = new BehaviorSubject(0);
  startSubscription = new Subscription();

  /** this value indicates if the stopWatch is currently running */
  activeMode = false;

  constructor() {}

  startStopWatch():void {
    this.activeMode = true;
    // start the interval which emits ascending numbers every 1 second
    this.startSubscription = interval(TIMER_INTERVAL)
    // add the pausedTime, which could be set on clicking Wait or is 1 by default
      .pipe(map((value) => value + this.pausedTime))
    // emit the new stopWatch$ value, which is expected in StopWatch component
      .subscribe((value) => {
        this.stopWatch$.next(value);
      });
  }
  // 
  stopStopWatch():void {
    this.activeMode = false;
    this.pausedTime = 1;
    // reset the stopwatch value to 0
    this.stopWatch$.next(0);
    this.startSubscription.unsubscribe();
  }

  waitStopWatch():void {
    this.activeMode = false;
    // save the time when clicked on Wait
    this.pausedTime = this.stopWatch$.value + 1;
    this.startSubscription.unsubscribe();
  }
}

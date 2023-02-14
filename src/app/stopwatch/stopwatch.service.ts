import { Injectable } from '@angular/core';
import { BehaviorSubject, interval,map, Subscription } from 'rxjs';
import { TimeData } from './timeData.model';

const TIMER_INTERVAL = 1000

@Injectable({
  providedIn: 'root'
})
export class StopWatchService {
  public timeData = new TimeData(0, 0, 0)
  public pausedTime = 1;
  public stopWatch$ = new BehaviorSubject(0)
  public startSubscription= new Subscription()

  constructor() { }

  startStopWatch() {
    this.startSubscription = interval(TIMER_INTERVAL)
    .pipe(map((value)=> value +this.pausedTime))
      .subscribe((val) => {
        this.stopWatch$.next(val)
      })
  }

  stopStopWatch() {
    this.pausedTime = 1;
    this.timeData.reset()
    this.startSubscription.unsubscribe()
  }

  waitStopWatch() {
    this.pausedTime = this.stopWatch$.value + 1;
    this.startSubscription.unsubscribe()
    
  }

}

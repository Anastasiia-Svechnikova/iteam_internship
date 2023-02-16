import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  Subscription,
  debounceTime,
  filter,
  buffer,
  fromEvent,
  take,
  BehaviorSubject,
  interval,
  map,
} from 'rxjs';
import { MatButton } from '@angular/material/button';
import { IStopWatch } from './stopwatchTypes';

const TIMER_INTERVAL = 1000;

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;

  startSubscription = new Subscription();
  stopWatch$ = new BehaviorSubject<IStopWatch>({
    current: 1,
    previous: 1,
    isActive: false,
  });

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.startSubscription.unsubscribe();
  }

  onToggleStartStop(): void {
    if (!this.stopWatch$.value.isActive) {
      this.startStopWatch();
    } else {
      this.stopStopWatch();
    }
  }

  onReset(): void {
    this.stopStopWatch();
    this.startStopWatch();
  }

  onWait(): void {
    const click$ = fromEvent(this.btn._elementRef.nativeElement, 'click');
    // check if during 300 ms the number of click is > 2
   click$
      .pipe(
        take(2),
        buffer(click$.pipe(debounceTime(300))),
        filter((clicks) => clicks.length >= 2)
      )
      .subscribe((_) => {
        // set the pausedTime in milliseconds
        const previous =  this.stopWatch$.value.current / 1000 + 1;
        this.stopWatch$.next({...this.stopWatch$.value, previous, isActive: false });
        this.startSubscription.unsubscribe();
      });
  }

  startStopWatch(): void {
    this.stopWatch$.value.isActive = true;
    this.startSubscription = interval(TIMER_INTERVAL)
      .pipe(
        map((value) => {
          // add the previous time, which could be set on clicking Wait or is 1 by default
          // and multiply by 1000 so that the value passed from the interval
          // to this.stopwatch$ equals to the number of milliseconds
          return (value + this.stopWatch$.value.previous) * 1000;
        })
      )
      .subscribe((current) => {
        this.stopWatch$.next({ ...this.stopWatch$.value, current });
      });
  }

  stopStopWatch(): void {
    // reset the stopwatch values to default
    this.stopWatch$.next({current: 1, previous: 1, isActive: false });
    this.startSubscription.unsubscribe();
  }
}

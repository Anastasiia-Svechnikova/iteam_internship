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

const TIMER_INTERVAL = 1000;

@Component({
  selector: 'app-stopwatch24',
  templateUrl: './stopwatch24.component.html',
  styleUrls: ['./stopwatch24.component.scss'],
})
export class Stopwatch24Component implements OnInit, OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;
  /** keeps the value of the interval at the moment when Wait button was pressed
   * this value is added when resuming the interval
   *
   * default value is 1 to avoid the delay when starting the interval
   */
  private pausedTime = 1;
  private doubleClickSubscription = new Subscription();
  startSubscription = new Subscription();
  stopWatch$ = new BehaviorSubject(0);

  constructor() {}

  ngOnInit(): void {
    this.startSubscription.closed = true;
  }

  ngOnDestroy(): void {
    this.startSubscription.unsubscribe();
    this.doubleClickSubscription.unsubscribe();
  }

  onToggleStartStop(): void {
    if (this.startSubscription.closed) {
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
    this.doubleClickSubscription = click$
      .pipe(
        take(2),
        buffer(click$.pipe(debounceTime(300))),
        filter((clicks) => clicks.length >= 2)
      )
      .subscribe((_) => {
        // set the pausedTime in milliseconds
        this.pausedTime = this.stopWatch$.value / 1000 + 1;
        this.startSubscription.unsubscribe();
        this.startSubscription.closed = true;
      });
  }

  startStopWatch(): void {
    this.startSubscription.closed = false;
    this.startSubscription = interval(TIMER_INTERVAL)
      .pipe(
        map((value) => {
          // add the pausedTime, which could be set on clicking Wait or is 1 by default
          // and multiply by 1000 so that the value passed from the interval
          // to this.stopwatch$ equals to the number of milliseconds
          return (value + this.pausedTime) * 1000;
        })
      )
      .subscribe((value) => {
        this.stopWatch$.next(value);
      });
  }

  stopStopWatch(): void {
    this.pausedTime = 1;
    // reset the stopwatch value to 0
    this.stopWatch$.next(0);
    this.startSubscription.unsubscribe();
    this.startSubscription.closed = true;
  }
}

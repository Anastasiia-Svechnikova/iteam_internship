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
import { IStopWatch, StopwatchData } from './stopwatchTypes';

const TIMER_INTERVAL = 1000;

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;

  private doubleClickSubscription = new Subscription();

  /** The initial stopWatch$  properties:
   * data: an array: [number, number, number] that stores hours, minutes, seconds
   * current: a numeric value that indicates the current interval value
   * previous: a numeric value that stores the previous interval value
   */
  stopWatch$ = new BehaviorSubject<IStopWatch>({
    data: [0, 0, 0],
    current: 1,
    previous: 1,
  });
  startSubscription = new Subscription();

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
        // set previous stopwatch$ value to current
        this.stopWatch$.value.previous = this.stopWatch$.value.current + 1;
        this.startSubscription.unsubscribe();
        this.startSubscription.closed = true;
      });
  }

  startStopWatch(): void {
    this.startSubscription.closed = false;
    this.startSubscription = interval(TIMER_INTERVAL)
      .pipe(
        map((value) => {
          // add previous stopwatch$ value to current
          const current = (this.stopWatch$.value.current =
            value + this.stopWatch$.value.previous);
          // transform the interval numeric value to StopwatchData type
          const data = this.transformTime(
            value + this.stopWatch$.value.previous
          );
          const previous = this.stopWatch$.value.previous;
          return { data, current, previous };
        })
      )
      .subscribe((value) => {
        this.stopWatch$.next(value);
      });
  }

  stopStopWatch(): void {
    // reset the stopwatch value to 0
    this.stopWatch$.next({
      ...this.stopWatch$.value,
      data: [0, 0, 0],
      previous: 1,
    });
    this.startSubscription.unsubscribe();
    this.startSubscription.closed = true;
  }

  /** helper method, accepts a numeric value and returns an array of numbers [hours, minutes, seconds]
   * so that we can easily iterate over it in the template
   */
  transformTime(time: number): StopwatchData {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = time - hours * 3600 - minutes * 60;

    return [hours, minutes, seconds];
  }
}

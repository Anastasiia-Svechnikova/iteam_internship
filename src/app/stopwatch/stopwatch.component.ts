import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  debounceTime,
  filter,
  buffer,
  fromEvent,
  take,
  BehaviorSubject,
  Subject,
  interval,
  map,
  takeUntil,
} from 'rxjs';
import { MatButton } from '@angular/material/button';
import { IStopWatch } from './stopwatchTypes';

const TIMER_INTERVAL = 1000;

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;

  /* main stream to emit the timer values **/
  timer$ = new BehaviorSubject<IStopWatch>({
    current: 1,
    previous: 1,
    isActive: false,
  });
  /* helper stream to emit when the timer needs to be stopped **/
  private stopInterval$ = new Subject();

  ngOnDestroy(): void {
    this.stopSubscriptions();
  }

  onToggleStartStop(): void {
    if (!this.timer$.value.isActive) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  onReset(): void {
    this.stopTimer();
    this.startTimer();
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
        const previous = this.timer$.value.current / 1000 + 1;
        this.timer$.next({ ...this.timer$.value, previous, isActive: false });
        this.stopSubscriptions();
      });
  }

  private startTimer(): void {
    interval(TIMER_INTERVAL)
      .pipe(
        takeUntil(this.stopInterval$),
        map((value) => {
          // add the previous time, which could be set on clicking Wait or is 1 by default
          // and multiply by 1000 so that the value passed from the interval
          // to this.timer$ equals to the number of milliseconds
          return (value + this.timer$.value.previous) * 1000;
        })
      )
      .subscribe((current) => {
        this.timer$.next({ ...this.timer$.value, current, isActive: true });
      });
  }

  private stopTimer(): void {
    // reset the timer values to default
    this.timer$.next({ current: 1, previous: 1, isActive: false });
    this.stopSubscriptions();
  }
  /* helper method to stop both timer$ and interval$ streams **/
  private stopSubscriptions(): void {
    this.timer$.complete();
    this.stopInterval$.next(true);
  }
}

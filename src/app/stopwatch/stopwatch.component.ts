import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  Subscription,
  map,
  debounceTime,
  filter,
  buffer,
  fromEvent,
  take,
} from 'rxjs';

import { transformTime } from '../helpers/timeTransformHelper';
import { StopWatchService } from './stopwatch.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
  @ViewChild('waitBtn', { static: true }) btn!: MatButton;

  /** string with time value from the stopWatch observable in format HH : MM : SS */
  timeData = '';
  private stopWatchSubscription = new Subscription();
  private doubleClickSubscription = new Subscription();

  constructor(public stopWatchService: StopWatchService) {}

  ngOnInit(): void {
    this.stopWatchSubscription = this.stopWatchService.stopWatch$
      // change the incoming number value from the interval observable to format HH : MM : SS
      .pipe(map((value) => transformTime(value)))
      // save the time value to the timeData variable which is used in the template
      .subscribe((time) => (this.timeData = time));
  }

  ngOnDestroy(): void {
    this.stopWatchSubscription.unsubscribe();
     this.doubleClickSubscription.unsubscribe();
  }

  onToggleStartStop(): void {
    // this.stopWatchService.activeMode shows if the start button has already been clicked before
    if (!this.stopWatchService.activeMode) {
      this.stopWatchService.startStopWatch();
    } else {
      this.stopWatchService.stopStopWatch();
    }
  }

  onReset(): void {
    this.stopWatchService.stopStopWatch();
    this.stopWatchService.startStopWatch();
  }
  
  onWaitObservable(): void {
    const click$ = fromEvent(this.btn._elementRef.nativeElement, 'click');
    
    // check if during 300 ms the number of click is > 2
    this.doubleClickSubscription = click$
    .pipe(
      take(2),
      buffer(click$.pipe(debounceTime(300))),
      filter((clicks) =>  clicks.length >= 2)
      )
      .subscribe((_) => {
        this.stopWatchService.waitStopWatch();
      });
    }
}

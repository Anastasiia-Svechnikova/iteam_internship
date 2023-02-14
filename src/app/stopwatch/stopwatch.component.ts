import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';

import { transformTime } from '../helpers/timeTransformHelper';
import { StopWatchService } from './stopwatch.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
  /** string with time value from the stopWatch observable in format HH : MM : SS */
  timeData = '';
  stopWatchSubscription = new Subscription();
  /** time of the first click on Wait btn in DoubleClick sequence, in ms */
  firstClickTime = 0;

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
  }

  onToggleStartStop():void {
    // this.stopWatchService.activeMode shows if the start button has already been clicked before
    if (!this.stopWatchService.activeMode) {
      this.stopWatchService.startStopWatch();
    } else {
      this.stopWatchService.stopStopWatch();
    }
  }

  onReset():void {
    this.stopWatchService.stopStopWatch();
    this.stopWatchService.startStopWatch();
  }

  onWait():void {
    // check if the first click on wait button was more than 300ms ago
    if (this.firstClickTime < Date.now() - 300) {
      this.firstClickTime = Date.now();
    } else {
      this.stopWatchService.waitStopWatch();
    }
  }
}

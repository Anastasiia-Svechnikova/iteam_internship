import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, map, Subscription } from 'rxjs';
import { transformTime } from '../helpers/timeTransformHelper';
import { StopWatchService } from './stopwatch.service';
import { TimeData } from './timeData.model';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {

  timeData!: TimeData
  activeMode = false;
  stopWatchSubscription = new Subscription();
  doubleClickCheck = 0;

  constructor(private stopWatchService: StopWatchService) {}

  ngOnInit(): void {
    this.timeData = this.stopWatchService.timeData

    this.stopWatchSubscription = this.stopWatchService.stopWatch$.subscribe((value: number) => {
      const {hours, minutes, seconds} = transformTime(value)
      this.timeData.setValues(hours, minutes, seconds)
    });
  }

  onToggleStartStop() {
    if (!this.activeMode) {
      this.activeMode = true;
      this.stopWatchService.startStopWatch()
    } else {
      this.activeMode = false;
      this.stopWatchService.stopStopWatch()
    }
  }

  onReset() {
    this.activeMode = false
    setTimeout(() => (this.activeMode = true), 1000);
    this.stopWatchService.stopStopWatch()
    this.stopWatchService.startStopWatch()
  }
  
  onWait() {
    if (this.doubleClickCheck < (Date.now()- 300)) {
      this.doubleClickCheck = Date.now()    
    } else {     
      this.activeMode = false;
      this.stopWatchService.waitStopWatch()
    }   
  }

  ngOnDestroy(): void {
    this.stopWatchSubscription.unsubscribe();
  }
}

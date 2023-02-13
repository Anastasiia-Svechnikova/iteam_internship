import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, interval, map, Observable, startWith, Subscription, tap } from 'rxjs';
import { transformTime } from '../helpers/timeTransformHelper';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent  implements OnInit, OnDestroy {
  hours: number = 0
  minutes: number = 0
  seconds = 0
  activeMode = false;
  waitingMode = false;
  subscriptionStart!: Subscription
  subscriptionResume!: Subscription
  stopWatch$ = new BehaviorSubject(0)
  stopWatchSubscription = new Subscription()
  interval$ = interval(1000)
  previous = 0;
  
  
  
  ngOnInit(): void {
    this.stopWatchSubscription = this.stopWatch$.subscribe((val ) => {
      this.hours = transformTime(val).hours
      this.minutes = transformTime(val).minutes
      this.seconds = transformTime(val).seconds
    })
   
  }

  onStart() {
    if (!this.activeMode) {
      this.subscriptionStart = this.interval$.subscribe(this.stopWatch$)
      this.activeMode = true;

    } else {
      
      this.activeMode = false;
      this.waitingMode = false;
      this.subscriptionStart.unsubscribe()   
    }
  }


  onReset() {
    this.previous = 0
    this.activeMode = false;
    this.waitingMode = false;
    this.subscriptionStart.unsubscribe()
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  onWait() {
    if (!this.waitingMode) {
      
      this.previous = this.stopWatch$.value;
      console.log(this.previous)
      this.subscriptionStart.unsubscribe()
      this.waitingMode = true;
    } else {
       this.waitingMode = false;
      this.subscriptionStart = this.interval$.pipe(map((val)=>val + this.previous)).subscribe(this.stopWatch$)
      console.log(this.subscriptionStart)
    }
  }


  ngOnDestroy(): void {
    this.stopWatchSubscription.unsubscribe()
  }

}

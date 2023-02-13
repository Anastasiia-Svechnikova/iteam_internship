import { Component, OnInit } from '@angular/core';
import { interval, map, Observable, Subscription } from 'rxjs';
import { transformTime } from '../helpers/timeTransformHelper';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent  implements OnInit {
  hours: number = 0
  minutes: number = 0
  seconds = 0
  activeMode = false;
  subscription!: Subscription
  obs$= interval(1000)
  
  
  ngOnInit(): void {
   
  }

  onStart() {
    // const initialTime = Date.now()
    if (!this.activeMode) {
      this.subscription = this.obs$
      //   .pipe(map((el) => el)
      // )
      .subscribe(total => {
        this.hours = transformTime(total).hours
        this.minutes = transformTime(total).minutes
        this.seconds = transformTime(total).seconds
      })
      this.activeMode = true;

    } else {
      this.subscription.unsubscribe()     
    }
  }


  onReset() {
    this.activeMode = false;
    this.subscription.unsubscribe()
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

}

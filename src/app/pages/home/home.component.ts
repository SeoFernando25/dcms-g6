import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  interval_id: any;
  days_left = 0;
  hours_left = 0;
  minutes_left = 0;
  seconds_left = 0;

  constructor() {
      this.updateTime();
   }

  ngOnInit() {
    this.interval_id = setInterval(() => {
      this.updateTime();
    }, 200);
  }
  
  ngOnDestroy() {
    if (this.interval_id) {
      clearInterval(this.interval_id);
    }
  }

  

  calculateTimeUntilDeadLine(){
    let now = new Date();
    let deadline = new Date(2022, 2, 21);
    let time = deadline.getTime() - now.getTime();
    let days = Math.floor(time / (1000 * 60 * 60 * 24));
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  }

  updateTime(){
    let  t = this.calculateTimeUntilDeadLine(); 
      this.days_left = t.days;
      this.hours_left = t.hours;
      this.minutes_left = t.minutes;
      this.seconds_left = t.seconds;
   }

}

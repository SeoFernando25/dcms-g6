import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receptionist',
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.scss'],
})
export class ReceptionistComponent implements OnInit {
  constructor(
    public router: Router
  ) {}

  ngOnInit(): void {}


  registerUser(){
    this.router.navigate(['./register']);
  }

  editUser(){
    this.router.navigate(['./search']);
  }

  createAppointment(){
    this.router.navigate(['./search']);
  }

  editAppointment(){

    this.router.navigate(['./search-appointment']);
    
  }

}



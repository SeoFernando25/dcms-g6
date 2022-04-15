import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dentist',
  templateUrl: './dentist.component.html',
  styleUrls: ['./dentist.component.scss'],
})
export class DentistComponent implements OnInit {
  constructor(
    public router: Router
  ) {}

  ngOnInit(): void {}


}



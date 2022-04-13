import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

export interface Appointment {
  id: number;
  date: string;
  location: string;
  dentist: string;
}

const ELEMENT_DATA: Appointment[] = [

  {id: 1, date: "2022-04-16", location:"Ottawa", dentist:"John Bob" },
  {id: 2, date: "2022-04-17", location:"Ottawa", dentist:"John Bob" },
  {id: 3, date: "2022-06-04", location:"Toronto", dentist:"Bob John" },
];

@Component({
  selector: 'app-faq',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');
  displayedColumns: string[] = ['id', 'date', 'location', 'dentist'];
  dataSource = ELEMENT_DATA;


  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {}
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';

export interface Appointment {
  id: number;
  date: string;
  location: string;
  dentist: string;
}

const ELEMENT_DATA: Appointment[] = [
  { id: 1, date: '2022-04-16', location: 'Ottawa', dentist: 'John Bob' },
  { id: 2, date: '2022-04-17', location: 'Ottawa', dentist: 'John Bob' },
  { id: 3, date: '2022-06-04', location: 'Toronto', dentist: 'Bob John' },
];

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  timeoutId: any;
  creds: User | null = null;
  personForm = new FormGroup({
    auth_id: new FormControl(''),
    // Sort of unused for now
    guardian_id: new FormControl(''),
    // Person data
    first_name: new FormControl('', [Validators.required]),
    middle_name: new FormControl(''),
    last_name: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    date_of_birth: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required, Validators.minLength(10)]),
    ssn: new FormControl('', [Validators.required, Validators.minLength(9)]),
    // Address
    address_city: new FormControl('', [Validators.required]),
    address_postal_code: new FormControl('', [Validators.required, Validators.minLength(6)]),
    address_region: new FormControl('', [Validators.required]),
    address_street: new FormControl('', [Validators.required]),
  });

  // Only allow days before today
  prevDayFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    var todayMinusOne = new Date();
    todayMinusOne.setDate(todayMinusOne.getDate() - 1);
    return d < todayMinusOne;
  };

  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');
  displayedColumns: string[] = ['id', 'date', 'location', 'dentist'];
  dataSource = ELEMENT_DATA;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
    fb: FormBuilder
  ) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
  }

  ngOnInit(): void {
    // Fetch user data
    this.creds = this.supabase._supabase.auth.user();
    /*// Print first name on value change
    this.personForm.valueChanges.subscribe((value) => {
      // Start a countdown to save changes in 1 seconds
      this.snackBar.open('Saving changes...', '', { duration: 1000 });
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.saveChanges(), 1000);
    });*/

    // Check if user has previously entered data on database
    var personData = this.supabase.getPersonData();
    personData.then((data) => {
      if (data.error == null) {
        var personInfo = data.body;
        console.log(personInfo); // TODO: Remove me in production (contains sensitive data)
        this.personForm.setValue(personInfo);
      }
      // If error, the user information has not been added to the database yet
    });
  }

  cancelChanges() {
    var personData = this.supabase.getPersonData();
    personData.then((data) => {
      if (data.error == null) {
        var personInfo = data.body;
        console.log(personInfo); // TODO: Remove me in production (contains sensitive data)
        this.personForm.setValue(personInfo);
      }
      // If error, the user information has not been added to the database yet
    });
  }

  // Update user data
  saveChanges() {
    console.log('Saving changes...');

    var personData = this.supabase.getPersonData();
    var eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    personData.then((data) => {
      if (!data.error) {
        // Transform personForm to personData
        var personData = this.personForm.value;
        this.supabase._supabase
          .from('person')
          .upsert(personData) // Check errors
          .then((d) => {
            if (d.error) {
              console.log(d);
              this.snackBar.open('Error saving changes', '', {
                duration: 3000,
              });
            } else {
              this.snackBar.open('Changes saved', '', {
                duration: 1000,
                panelClass: ['green-snackbar'],
              });
            }
          });
      } else {
        console.log('No data on database');
        // Create new user data on database
        var uuid = this.supabase._supabase.auth.user()?.id ?? 'err';
        var twentyYearsAgo = new Date();
        twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
        console.log(uuid);
        this.supabase._supabase
          .from('person')
          .insert({
            ...this.personForm.value,
            auth_id: uuid,
            guardian_id: uuid,
          }) // Check errors
          .then((d) => {
            console.log('Adding person');
            console.log(d);
          });
      }
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.personForm.controls[controlName].hasError(errorName);
  }
  public AboveAge() {

    var timeDiff = Math.abs(Date.now() - this.personForm.get('date_of_birth')?.value)
    var age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    return 15 <= age;
  }
}

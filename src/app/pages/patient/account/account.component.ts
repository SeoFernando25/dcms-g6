import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatTableDataSource } from '@angular/material/table';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface Appointment {
  clinic_id: number;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
  appointment_type: string;
  room_assigned: string;
  appointment_id: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  haveGuardian = true;
  displayedColumns: string[] = [
    'appointment_id',
    'clinic_id',
    'appointment_date',
    'appointment_status',
    'start_time',
    'end_time',
    'appointment_type',
    'room_assigned',
  ];
  dataSource = new MatTableDataSource<Appointment>([]);
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
    guardian_first_name: new FormControl(''),
    guardian_middle_name: new FormControl(''),
    guardian_last_name: new FormControl(''),
    guardian_phone_number: new FormControl(''),
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
        console.log('personInfo', personInfo); // TODO: Remove me in production (contains sensitive data)
        this.personForm.setValue(personInfo);
      }
      // If error, the user information has not been added to the database yet
    });
    // Fetch user appointments
    let sb = this.supabase._supabase;
    sb.from('appointment')
      .select('*, branch("*")')
      .gte('appointment_date', this.getCurrentDate())
      .eq('patient_id', sb.auth.user()?.id)
      .then((data) => {
        //console.log("Greater Data", data);
        this.updateData(data);
      });

    sb.from('person')
      .select('*')
      .eq('auth_id', sb.auth.user()?.id)
      .then((data) => {
        console.log("User Data", data.body?.at(0));
        this.personForm.patchValue({
          first_name: data.body?.at(0).first_name,
          middle_name: data.body?.at(0).middle_name,
          last_name: data.body?.at(0).last_name,
          phone_number: data.body?.at(0).phone_number,
          gender: data.body?.at(0).gender,
          date_of_birth: data.body?.at(0).date_of_birth,
          ssn: data.body?.at(0).ssn,
          address_street: data.body?.at(0).address_street,
          address_city: data.body?.at(0).address_city,
          address_region: data.body?.at(0).address_region,
          address_postal_code: data.body?.at(0).address_postal_code,
        });
        sb.from('person')
          .select('*')
          .eq('auth_id', data.body?.at(0).guardian_id)
          .then((data2) => {
            console.log("Guardian Data", data2.body?.at(0));
            if (data2.body?.at(0) != null) {
              this.haveGuardian = false;
              this.personForm.patchValue({
                guardian_first_name: data2.body?.at(0).first_name,
                guardian_middle_name: data2.body?.at(0).middle_name,
                guardian_last_name: data2.body?.at(0).last_name,
                guardian_phone_number: data2.body?.at(0).phone_number,
              });
            }
          });
      });
  }

  updateData(data: PostgrestResponse<any>) {
    if (data.error) {
      console.log('data.error: ', data.error);
      this.snackBar.open('Error: ' + data.error.details, 'Close');
    } else {
      this.dataSource.data = data.body;
    }
  }

  getCurrentDate() {
    //Get current date in YYYY-MM-DD format
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
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

  getGuardian() {
    return this.haveGuardian
  }
}

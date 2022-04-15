import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  haveGuardian = false;
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
    phone_number: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
    ]),
    ssn: new FormControl('', [Validators.required, Validators.minLength(9)]),
    // Address
    address_city: new FormControl('', [Validators.required]),
    address_postal_code: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    address_region: new FormControl('', [Validators.required]),
    address_street: new FormControl('', [Validators.required]),
  });

  guardianForm = new FormGroup({
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
      .limit(1)
      .single()
      .then((data) => {
        if (data.error != null) {
          this.snackBar.open('Hello new user!', 'Close');
          return;
        }

        console.log('User Data', data.body);
        this.personForm.setValue(data.body);
        this.onDoBChange();
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

  onGuardianFormChange() {
    this.personForm.patchValue({
      guardian_id: null,
    });

    // Search patient that matches the guardian's first name middle name and last name
    var sb = this.supabase._supabase;
    var q = sb.from('person').select('*');
    var atLeastOne = false;
    if (this.guardianForm.value.guardian_first_name != '') {
      atLeastOne = true;
      q = q.eq('first_name', this.guardianForm.value.guardian_first_name);
    }

    if (this.guardianForm.value.guardian_middle_name != '') {
      atLeastOne = true;
      q = q.eq('middle_name', this.guardianForm.value.guardian_middle_name);
    }
    if (this.guardianForm.value.guardian_last_name != '') {
      atLeastOne = true;
      q = q.eq('last_name', this.guardianForm.value.guardian_last_name);
    }
    if (this.guardianForm.value.guardian_phone_number != '') {
      atLeastOne = true;
      q = q.eq('phone_number', this.guardianForm.value.guardian_phone_number);
    }
    if (!atLeastOne) {
      this.snackBar.open(
        'Please enter at least one search criteria for the guardian',
        'Close'
      );
      return;
    }

    q.limit(1)
      .single()
      .then((data) => {
        console.log('data', data);
        // Check error
        if (data.error) {
          this.snackBar.open('Error: ' + data.error.details, 'Close');
        } else {
          var guardian_id = data.body?.auth_id;
          // Check if id is not the same as the current user
          if (guardian_id == sb.auth.user()?.id) {
            this.snackBar.open(
              'Error: You cannot be your own guardian',
              'Close'
            );
            return;
          }
          console.log('guardian id', guardian_id);
          this.personForm.patchValue({
            guardian_id: guardian_id,
          });
        }
      });
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
        var personFormData = this.personForm.value;
        this.supabase._supabase
          .from('person')
          .upsert(personFormData) // Check errors
          .then((d) => {
            if (d.error) {
              console.log(d);
              this.snackBar.open(
                'Error saving changes: ' + d.error.message,
                'Close'
              );
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
  };
  public AboveAge() {
    var timeDiff = Math.abs(
      new Date().getTime() -
        new Date(this.personForm.value.date_of_birth).getTime()
    );
    var age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    return 15 <= age;
  }

  getGuardian() {
    return this.haveGuardian;
  }

  onDoBChange() {
    console.log('DoB changed');
    if (this.AboveAge()) {
      this.haveGuardian = false;
    } else {
      this.haveGuardian = true;
    }
  }
}

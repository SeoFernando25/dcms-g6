import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';

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
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    date_of_birth: new FormControl(''),
    phone_number: new FormControl(''),
    ssn: new FormControl(''),
    // Address
    address_city: new FormControl(''),
    address_postal_code: new FormControl(''),
    address_region: new FormControl(''),
    address_street: new FormControl(''),
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

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Fetch user data
    this.creds = this.supabase._supabase.auth.user();
    // Print first name on value change
    this.personForm.valueChanges.subscribe((value) => {
      // Start a countdown to save changes in 1 seconds
      this.snackBar.open('Saving changes...', '', { duration: 1000 });
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.saveChanges(), 1000);
    });

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
              this.snackBar.open('Error saving changes', '', { duration: 3000 });
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
        var uuid = this.supabase._supabase.auth.user()?.id ?? "err";
        var twentyYearsAgo = new Date();
        twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
        console.log(uuid)
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
}

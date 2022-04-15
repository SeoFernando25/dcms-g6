import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPray } from '@fortawesome/free-solid-svg-icons';
import { User } from '@supabase/supabase-js';
import { RandomUUIDOptions } from 'crypto';
import { SupabaseService } from 'src/app/services/supabase.service';

export interface Branch {
  clinic_id: string;
  address_street: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  hide = true;
  timeoutId: any;
  haveGuardian = false;
  creds: User | null = null;
  credentialForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirm_password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  personForm = new FormGroup({
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
  roleForm = new FormGroup({
    role_type: new FormControl('', [Validators.required]),
  });
  patientForm = new FormGroup({
    insurance: new FormControl('', [Validators.required]),
  });
  employeeForm = new FormGroup({
    salary: new FormControl('', [Validators.required]),
    works_at: new FormControl('', [Validators.required]),
  });

  guardianForm = new FormGroup({
    guardian_first_name: new FormControl(''),
    guardian_middle_name: new FormControl(''),
    guardian_last_name: new FormControl(''),
    guardian_phone_number: new FormControl(''),
  });

  branches: Branch[] = [
    { clinic_id: '5', address_street: 'King Edward Avenue' },
    { clinic_id: '6', address_street: 'Rideau Street' },
    { clinic_id: '7', address_street: 'Faraway Road' },
    { clinic_id: '8', address_street: 'Circle Drive' },
    { clinic_id: '9', address_street: 'The Cooler Rideau Street' },
    { clinic_id: '10', address_street: 'Vroom Drive' },
    { clinic_id: '11', address_street: 'Overmorrow Ave' },
    { clinic_id: '12', address_street: 'Lastington Ave' },
  ];

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
  }

  ngOnInit(): void {

  }

  createUser() {
    var email = this.credentialForm.get('email')?.value;
    var password = this.credentialForm.get('password')?.value;
    console.log(email);
    console.log(password);

    this.supabase.signUp(email, password).then((postgrestRes) => {
      console.log(postgrestRes);
      if (!postgrestRes.error) {
        this.snackBar.open('Registered successfully', 'Dismiss', {
          duration: 2000,
        });
        this.saveChanges();
      } else {
        this.snackBar.open('Registration failed', 'Dismiss');
      }
    });
  }

  // Update user data
  saveChanges() {
    console.log('Saving changes...');

    console.log('Person form:', this.personForm);
    console.log('No data on database');
    // Create new user data on database
    var user_id = this.supabase._supabase.auth.user()?.id ?? 'err';
    console.log(user_id);
    var payload = {
      auth_id: user_id,
      ...this.personForm.value,
    }
    // If guardian_id is "", set it to null
    if (payload.guardian_id === '') {
      payload.guardian_id = null;
    }

    console.log(payload);
    this.supabase._supabase
      .from('person')
      .insert(payload) // Check errors
      .then((d) => {
        console.log('Adding person data');
        console.log(d);
        if (d.error) {
          console.log(d.error);
          this.snackBar.open('Error saving changes', 'Dismiss');
        } else {
          this.postRegister();
        }
      });
  }

  postRegister() {
    var roletype = this.roleForm.get('role_type')?.value;
    if (roletype == 'Patient') {
      var patientData = this.supabase.getPatientData();

      patientData.then((data) => {
        var uuid = this.supabase._supabase.auth.user()?.id ?? 'err';
        this.supabase._supabase
          .from('patient')
          .insert({
            ...this.patientForm.value,
            patient_id: uuid,
          })
          .then((d) => {
            console.log('Added Patient data');
            console.log(d);
          });
      });
    } else {
      var employeeData = this.supabase.getEmployeeData();

      employeeData.then((data) => {
        var uuid = this.supabase._supabase.auth.user()?.id ?? 'err';
        this.supabase._supabase
          .from('employee')
          .insert({
            ...this.employeeForm.value,
            employee_id: uuid,
            role_type: roletype,
          })
          .then((d) => {
            console.log('Added Employee data');
            console.log(d);
          });
      });
    }
  }

  Reset() {
    this.credentialForm.reset();
    this.personForm.reset();
    this.roleForm.reset();
    this.patientForm.reset();
    this.employeeForm.reset();
  }

  public AboveAge() {
    var timeDiff = Math.abs(
      Date.now() - this.personForm.get('date_of_birth')?.value
    );
    var age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    return 15 <= age;
  }

  public isPatient() {
    if (this.roleForm.get('role_type')?.value == 'Patient') {
      return true;
    } else {
      return false;
    }
  }

  public credentialHasError = (controlName: string, errorName: string) => {
    return this.credentialForm.controls[controlName].hasError(errorName);
  };
  public personHasError = (controlName: string, errorName: string) => {
    return this.personForm.controls[controlName].hasError(errorName);
  };
  public roleHasError = (controlName: string, errorName: string) => {
    return this.roleForm.controls[controlName].hasError(errorName);
  };
  public patientHasError = (controlName: string, errorName: string) => {
    return this.patientForm.controls[controlName].hasError(errorName);
  };
  public employeeHasError = (controlName: string, errorName: string) => {
    return this.employeeForm.controls[controlName].hasError(errorName);
  };

  onDoBChange() {
    console.log('DoB changed');
    if (this.AboveAge()) {
      this.haveGuardian = false;
    } else {
      this.haveGuardian = true;
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
}

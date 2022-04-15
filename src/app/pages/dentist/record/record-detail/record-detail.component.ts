import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrls: ['./record-detail.component.scss'],
})
export class RecordDetailComponent implements OnInit {
  peopleDetailForm = new FormGroup({
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(''),
    phone_number: new FormControl(''),
  });
  recordForm = new FormGroup({
    description: new FormControl(''),
  });

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) { }

  recordExists: boolean;
  ngOnInit(): void {
    var age : number;
    var timeDiff = Math.abs(Date.now() - new Date(this.editData.person.date_of_birth).getTime());
    age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
    console.log('editData', this.editData);
    this.peopleDetailForm.patchValue({
      first_name: this.editData.person.first_name,
      middle_name: this.editData.person.middle_name,
      last_name: this.editData.person.last_name,
      age: age,
      phone_number: this.editData.person.phone_number,
      gender: this.editData.person.gender,
    });
    let sb = this.supabase._supabase;
    sb.from('record')
      .select('description')
      .eq('patient_id', this.editData.person.auth_id)
      .then((data) => {
        console.log('Fetch record data', data.body);
        if (data.body?.length != 0) {
          this.recordForm.patchValue({
            description: data.body?.at(0).description,
          });
          this.recordExists = true;
        }
        else {
          this._snackBar.open('No existing medical record', 'Close', {
            duration: 2000,
          });
          this.recordExists = false;
        }
      });
  }

  updateInfo() {
    let sb = this.supabase._supabase;
    if (this.recordExists) {
      sb.from('record')
        .update({
          description: this.recordForm.value.description,
          patient_id: this.editData.person.auth_id,
          written_by: sb.auth.user()?.id,
        })
        .eq('patient_id', this.editData.person.auth_id)
        .then((data) => {
          if (data.error) {
            console.log('Error: ', data.error);
            this._snackBar.open('Updated Error', 'Close', {
              duration: 2000,
            });
          } else {
            this._snackBar.open('Updated Successes', 'Close', {
              duration: 2000,
            });
          }
        });
    }
    else{
      sb.from('record')
        .insert({
          description: this.recordForm.value.description,
          patient_id: this.editData.person.auth_id,
          written_by: sb.auth.user()?.id,
        })
        .eq('patient_id', this.editData.person.auth_id)
        .then((data) => {
          if (data.error) {
            console.log('Error: ', data.error);
            this._snackBar.open('Insert Error', 'Close', {
              duration: 2000,
            });
          } else {
            this._snackBar.open('Insert Successes', 'Close', {
              duration: 2000,
            });
          }
        });
    }
  }
}

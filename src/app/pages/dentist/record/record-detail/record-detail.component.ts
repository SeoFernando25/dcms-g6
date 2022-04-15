import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatTableDataSource } from '@angular/material/table';
import { SearchAppointmentDetailComponent } from '../../../search-appointment-detail/search-appointment-detail.component';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface appointment {
  clinic_id: number;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
  appointment_type: string;
  appointment_id: string;
}

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
  displayedColumns: string[] = [
    'appointment_id',
    'clinic_id',
    'appointment_date',
    'appointment_status',
    'start_time',
    'end_time',
    'appointment_type',
    'actions',
  ];
  dataSource = new MatTableDataSource<appointment>([]);

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
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
    sb.from('appointment')
      .select('*, branch("*")')
      .lte('appointment_date', this.getCurrentDate())
      .eq("patient_id", this.editData.person.auth_id)
      .then((data) => {
        //console.log("Edit Data", this.editData);
        this.updateData(data);
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
    var dd = String(today.getDate()+1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
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

  viewDetail(row: any) {
    //console.log(row);
    this.dialog.open(SearchAppointmentDetailComponent, { data: row });
  }

}

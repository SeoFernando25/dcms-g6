import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/services/supabase.service';
import { PostgrestResponse } from '@supabase/supabase-js';
import { MatTableDataSource } from '@angular/material/table';

export interface procedure {
    procedure_type_id: number;
    procedure_id: number;
    tooth: string;
    comments: string;
    quantity: number;
  }

@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss'],
})
export class TreatmentDetailComponent implements OnInit {
    AppointmentDetailForm = new FormGroup({
    first_name: new FormControl(''),
    middle_name: new FormControl(''),
    last_name: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(''),
    phone_number: new FormControl(''),
    appointment_date: new FormControl(''),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
  });
  dataSource = new MatTableDataSource<procedure>([]);


  treatmentForm = new FormGroup({
    medication: new FormControl(''),
    symptoms: new FormControl(''),
    tooth: new FormControl(''),
    comments: new FormControl(''),
  });

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) { }

  treatmentExists: boolean;

  ngOnInit(): void {
    console.log('EDIT DATA', this.editData);
    var d = new Date(this.editData.appointment_date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    this.editData.appointment_date = d;
    this.AppointmentDetailForm.patchValue({
      appointment_date: this.editData.appointment_date,
      start_time: this.editData.start_time,
      end_time: this.editData.end_time,
    });
    let sb = this.supabase._supabase;
    sb.from('person')
      .select('*')
      .eq('auth_id', this.editData.patient_id)
      .then((data) => {
        //console.log('Data', data.body);
        this.AppointmentDetailForm.patchValue({
          first_name: data.body?.at(0).first_name,
          middle_name: data.body?.at(0).middle_name,
          last_name: data.body?.at(0).last_name,
        });
      });
      sb.from('treatment')
      .select('*')
      .eq('appointment_id', this.editData.appointment_id)
      .then((data) => {
          console.log('Fetch treatment data', data.body);
          if (data.body?.length != 0) {
            this.treatmentForm.patchValue({
              medication: data.body?.at(0).medication,
              symptoms: data.body?.at(0).symptoms,
              tooth: data.body?.at(0).tooth,
              comments: data.body?.at(0).comments,
            });
            this.treatmentExists = true;
          }
          else {
            this._snackBar.open('No existing treatment', 'Close', {
              duration: 2000,
            });
            this.treatmentExists = false;
          }
      });
  }

  updateInfo() {
    let sb = this.supabase._supabase;
    if (this.treatmentExists) {
      sb.from('treatment')
        .update({
          medication: this.treatmentForm.value.medication,
          symptoms: this.treatmentForm.value.symptoms,
          tooth: this.treatmentForm.value.tooth,
          comments: this.treatmentForm.value.comments,
        })
        .eq('appointment_id', this.editData.appointment_id)
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
      sb.from('treatment')
        .insert({
            medication: this.treatmentForm.value.medication,
            symptoms: this.treatmentForm.value.symptoms,
            tooth: this.treatmentForm.value.tooth,
            comments: this.treatmentForm.value.comments,
          appointment_id: this.editData.appointment_id,
        })
        .eq('appointment_id', this.editData.appointment_id)
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
    this.dialog.closeAll();

  }
}

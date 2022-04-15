import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';

import { PostgrestResponse } from '@supabase/supabase-js';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ProcedureComponent } from '../dentist/record/procedure/procedure.component';

export interface procedure {
  procedure_type_id: number;
  procedure_id: number;
  tooth: string;
  comments: string;
  quantity: number;
}

@Component({
  selector: 'app-search-appointment-detail',
  templateUrl: './search-appointment-detail.component.html',
  styleUrls: ['./search-appointment-detail.component.scss'],
})
export class SearchAppointmentDetailComponent implements OnInit {
  isDentist = false;
  isChecked = false;
  displayedColumns: string[] = [
    'procedure_id',
    'procedure_type_id',
    'tooth',
    'comments',
    'quantity',
  ];
  dataSource = new MatTableDataSource<procedure>([]);

  AppointmentDetailForm = new FormGroup({
    appointment_date: new FormControl(''),
    start_time: new FormControl(''),
    end_time: new FormControl(''),
    appointment_status: new FormControl(''),
    patient_first_name: new FormControl(''),
    patient_middle_name: new FormControl(''),
    patient_last_name: new FormControl(''),
    patient_phone_number: new FormControl(''),
    dentist_first_name: new FormControl(''),
    dentist_middle_name: new FormControl(''),
    dentist_last_name: new FormControl(''),
    dentist_phone_number: new FormControl(''),
  });

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    console.log('EDIT DATA', this.editData);
    var d = new Date(this.editData.appointment_date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    this.editData.appointment_date = d;
    this.AppointmentDetailForm.patchValue({
      appointment_date: this.editData.appointment_date,
      start_time: this.editData.start_time,
      end_time: this.editData.end_time,
      appointment_status: this.editData.appointment_status,
    });
    let sb = this.supabase._supabase;
    sb.from('person')
      .select('*')
      .eq('auth_id', this.editData.patient_id)
      .then((data) => {
        //console.log('Data', data.body);
        this.AppointmentDetailForm.patchValue({
          patient_first_name: data.body?.at(0).first_name,
          patient_middle_name: data.body?.at(0).middle_name,
          patient_last_name: data.body?.at(0).last_name,
          patient_phone_number: data.body?.at(0).phone_number,
        });
      });
    sb.from('person')
      .select('*')
      .eq('auth_id', this.editData.dentist_id)
      .then((data) => {
        //console.log('Data', data.body);
        this.AppointmentDetailForm.patchValue({
          dentist_first_name: data.body?.at(0).first_name,
          dentist_middle_name: data.body?.at(0).middle_name,
          dentist_last_name: data.body?.at(0).last_name,
          dentist_phone_number: data.body?.at(0).phone_number,
        });
      });
    sb.from('appointment_procedure')
      .select('*')
      .eq('appointment_id', this.editData.appointment_id)
      .then((data) => {
        //console.log('Data', data.body);
        this.updateData(data);
      });


      this.checkDentist();
      
  }

  updateData(data: PostgrestResponse<any>) {
    if (data.error) {
      console.log('data.error: ', data.error);
    } else {
      console.log('data.body: ', data);
      this.dataSource.data = data.body;
    }
  }

  updateAppointment() {
    console.log('update Value', this.AppointmentDetailForm.value);
    let sb = this.supabase._supabase;
    sb.from('appointment')
      .update({
        appointment_date: this.AppointmentDetailForm.value.appointment_date,
        start_time: this.AppointmentDetailForm.value.start_time,
        end_time: this.AppointmentDetailForm.value.end_time,
        appointment_status: this.AppointmentDetailForm.value.appointment_status,
      })
      .eq('appointment_id', this.editData.appointment_id)
      .then((data) => {
        if (data.error) {
          console.log('Error: ', data.error);
          this._snackBar.open('Appointment Updated Error', 'Close', {
            duration: 2000,
          });
        } else {
          this._snackBar.open('Appointment Updated', 'Close', {
            duration: 2000,
          });
          this.dialog.closeAll();
        }
      });
  }

  checkDentist() {
    let sb = this.supabase._supabase;
    return sb
      .from('employee')
      .select('*')
      .eq('employee_id', sb.auth.user()?.id)
      .then((data) => {
        if (data.error) {
          console.log('Error: ', data.error);
        } else {
          if (data.body?.at(0).role_type == 'Dentist') {
            //console.log('Dentist Data:' , data);
            this.isDentist = true;
          }
        }
      });
  }

  addProcedure(row: any) {
    this.dialog.open(ProcedureComponent, { data: row });

  }
}

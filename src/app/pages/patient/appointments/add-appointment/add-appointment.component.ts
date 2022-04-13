import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/services/supabase.service';

export class AppointmentData {

}

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss']
})
export class AddAppointmentComponent {
  addAppointmentForm = new FormGroup({
    appointment_date: new FormControl('app_date_err'),
    start_time: new FormControl('start_time_err'),
    end_time: new FormControl('end_time_err'),
    clinic_id: new FormControl('clinic_id_err'),
    dentist_id: new FormControl('dentist_id_err'),
  });

  dentists: any[] = []
  clinics: any[] = []
  timepicker = {}

  constructor(
    public dialogRef: MatDialogRef<AddAppointmentComponent>,
    public supabase: SupabaseService,
    public snackBar: MatSnackBar,
  ) {

    this.supabase._supabase
      .from('branch')
      .select('*')
      .then((data) => {
        console.log(data);
        if (data.error) {
          this.snackBar.open(data.error.message, '', { duration: 2000 });
        } else {
          console.log(data.body);
          this.clinics = data.body;
        }
      });
  }

  onSubmit() {
    // Insert appointmentForm into database
    this.supabase._supabase.from('appointment').insert({
      ...this.addAppointmentForm.value,
      patient_id: this.supabase._supabase.auth.user()?.id || 'patient_id_err',
      appointment_status: 'Pending'
    }).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data);
        this.snackBar.open(data.error.message, '', { duration: 2000 });
      } else {
        this.snackBar.open('Appointment added', '', { duration: 2000 });
        this.dialogRef.close();
        window.location.reload();
      }
    }
    );
  }

  onClinicChange(branch_id: any) {
    console.log(branch_id);
    this.supabase._supabase
      .from('employee')
      .select(`
      *,
        person!employee_employee_id_fkey (
          first_name, last_name
        )
      `)
      .eq('role_type', 'Dentist')
      .eq('works_at', branch_id)
      .then((data) => {
        console.log(data);
        if (data.error) {
          this.snackBar.open(data.error.message, '', { duration: 2000 });
        } else {
          console.log(data.body);
          this.dentists = data.body;
        }
      });
  }

}

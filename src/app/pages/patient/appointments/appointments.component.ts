import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = [
    'appointment_id',
    'dentist_id',
    'appointment_date',
    'start_time',
    'end_time',
    'appointment_type',
    'appointment_status',
  ];
  dataSource: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Load all user appointments from database
    let userData = this.supabase._supabase.auth.user()?.id || 'err';
    this.supabase._supabase
      .from('appointment')
      .select(
        `*,
        dentist_id!appointment_dentist_id_fkey(
        person!employee_employee_id_fkey(*)
      ))
      `
      )
      .eq('patient_id', userData)
      .then((data) => {
        console.log(data);
        if (data.error) {
          this._snackBar.open(data.error.message, '', { duration: 2000 });
        } else {
          this.dataSource = data.body;
        }
      });
  }

  addAppointment() {
    const dialogRef = this.dialog.open(AddAppointmentComponent);
  }

  clickedRow(row: any) {
    console.log(row);
    this.router.navigate([row.appointment_id], { relativeTo: this.route });
  }
}

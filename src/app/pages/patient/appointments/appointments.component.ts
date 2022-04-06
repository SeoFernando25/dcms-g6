import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent implements OnInit {
  displayedColumns: string[] = ['appointment_id', 'dentist_id', 'appointment_date', 'start_time', 'end_time', 'appointment_type', 'appointment_status'];
  dataSource: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Load all user appointments from database
    let userData = this.supabase._supabase.auth.user()?.id || "err";
    this.supabase._supabase.from('appointment').select('*').eq('patient_id', userData).then((data) => {
      console.log(data);
      if (data.error) {
        this._snackBar.open(data.error.message, '', { duration: 2000 });
      } else {
        this.dataSource = data.body;
      }
    });
  }

  addAppointment() {

  }

  clickedRow(row: any) {
    console.log(row);
    this.router.navigate([row.appointment_id], { relativeTo: this.route });
  }
}
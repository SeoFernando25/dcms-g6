import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  appointment_id: number;
  appointment_data: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private snackBar: MatSnackBar
  ) {
    this.appointment_id = Number(this.route.snapshot.paramMap.get('id'));
    let sb = supabase._supabase;
    sb.from('appointment')
      .select('*')
      .eq('appointment_id', this.appointment_id)
      .limit(1)
      .single()
      .then((data) => {
        if (data.error) {
          snackBar.open(
            'An error has occurred! Check the console logs or refresh the page',
            '',
            { duration: 10000 }
          );
          console.log(data.error);
        } else {
          this.appointment_data = data.body;
          console.log(this.appointment_data);
        }
      });
  }

  changeCommentTimeout: any = null;
  onChangeComments() {
    console.log(this.appointment_data.appointment_type);
    // Cancel all other timeouts
    clearTimeout(this.changeCommentTimeout);
    // 2 seconds delay to allow the user to see the snackbar

    this.changeCommentTimeout = setTimeout(() => {
      this.supabase._supabase
        .from('appointment')
        .update({
          appointment_type: this.appointment_data.appointment_type,
        })
        .match({ appointment_id: this.appointment_id })
        .then((data) => {
          if (data.error) {
            console.log(data.error);
            this.snackBar.open(
              'Error updating your comment! Check the console logs or refresh the page',
              '',
              { duration: 500 }
            );
          } else {
            this.snackBar.open('Appointment comments updated!', '', {
              duration: 500,
            });
          }
        });
    }, 500);
  }

  ngOnInit(): void {
    // Print the id of the appointment
    console.log(this.appointment_id);
  }

  cancelAppointment() {
    // Remove the appointment from the database
    let sb = this.supabase._supabase;
    sb.from('appointment')
      .update({
        appointment_status: 'Cancelled',
      })
      .match({ appointment_id: this.appointment_id })
      .then((data) => {
        if (data.error) {
          this.snackBar.open(
            'An error has occurred! Check the console logs or refresh the page',
            '',
            { duration: 10000 }
          );
          console.log(data.error);
        } else {
          this.snackBar.open('Appointment cancelled!', '', { duration: 2000 });
          this.router.navigate(['/my/appointments']);
        }
      });
  }
}

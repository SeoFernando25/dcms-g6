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

  ngOnInit(): void {
    // Print the id of the appointment
    console.log(this.appointment_id);
  }
}

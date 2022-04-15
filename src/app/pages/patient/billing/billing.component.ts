import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  dataSource: any[] = [];
  nOutstandingCharges = 0;
  payingAnimation = false;

  constructor(public supabase: SupabaseService, public snackbar: MatSnackBar) {}

  ngOnInit(): void {
    let sb = this.supabase._supabase;
    sb.from('appointment_procedure_view')
      .select(
        `
        *
      `
      )
      .eq('patient_id', sb.auth.user()?.id)
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log('data.error: ', data.error);
        } else {
          console.log(data.body);
          this.dataSource = data.body;
          // Calculate the total outstanding charges
          this.nOutstandingCharges = 0;
          this.dataSource.forEach((row) => {
            this.nOutstandingCharges += row.paid ? 0 : 1;
          });
          console.log('nOutstandingCharges: ', this.nOutstandingCharges);
        }
      });
  }

  openPayMenu() {
    this.payingAnimation = true;
    setTimeout(() => {
      this.nOutstandingCharges = 0;
      this.snackbar.open('Outstanding charges paid!', '', {
        duration: 1000,
        panelClass: ['green-snackbar'],
      });
    }, 1000);

    setTimeout(() => {
      this.payingAnimation = false;
    }, 2500);

    // Set all unpaid charges to paid
    this.dataSource.forEach((row) => {
      this.supabase._supabase
        .from('appointment_procedure')
        .update({
          paid: true,
        })
        .eq('procedure_id', row.procedure_id)
        .then((data) => {
          console.log(data);
          if (data.error) {
            console.log('data.error: ', data.error);
          } else {
            console.log(data.body);
          }
        });
      row.paid = true;
    });
  }
}

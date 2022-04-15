import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  dataSource: any[] = [];
  nOutstandingCharges = 0;

  constructor(public supabase: SupabaseService) { }

  ngOnInit(): void {
    let sb = this.supabase._supabase;
    sb.from('appointment_procedure_view')
      .select(`
        *
      `)
      .eq(
        'patient_id',
        sb.auth.user()?.id
      )
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log('data.error: ', data.error);
        } else {
          console.log(data.body);
          this.dataSource = data.body;
        }
      });
  }

  openPayMenu() {

  }
}

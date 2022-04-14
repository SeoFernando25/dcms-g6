import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  dataSource: any[] = [];

  constructor(
    public supabase: SupabaseService,
  ) { }

  ngOnInit(): void {
    let sb = this.supabase._supabase;
    sb.from('fee_charge')
      .select(`
        *,
        appointment_procedure!fee_charge_procedure_id_fkey(
          *,
          procedure_type_id!appointment_procedure_procedure_type_id_fkey(*),
          appointment_id!appointment_procedure_appointment_id_fkey(*)
        )
      `)
      // Filter to only show the fees for the current patient
      .eq("appointment_procedure.appointment_id.patient_id", this.supabase._supabase.auth.user()?.id || "err")
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log('data.error: ', data.error);
        }
        else {
          console.log(data.body);
          this.dataSource = data.body;
        }
      }
      );
  }
}

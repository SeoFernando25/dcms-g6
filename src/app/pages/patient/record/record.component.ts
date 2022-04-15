import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RealtimeSubscription } from '@supabase/supabase-js';
import { SupabaseRealtimeClient } from '@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient';
import { BehaviorSubject, Subscription, Observable, subscribeOn } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-records',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  record: any = {};

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
    // If we wanted to get patient info
    // patient_id!record_patient_id_fkey(patient_id!patient_patient_id_fkey(*)),

    this.supabase._supabase
      .from('record')
      .select(
        `*,
          written_by!record_written_by_fkey(
          person!employee_employee_id_fkey(*)
        ))
      `
      )
      .eq('patient_id', this.supabase._supabase.auth.user()?.id)
      .limit(1)
      .single()
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log('data.error: ', data.error);
        } else {
          console.log(data.body);
          this.record = data.body;
        }
      });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { timer, Subscription, Observable, map } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostgrestResponse } from '@supabase/supabase-js';

import { MatDialog } from '@angular/material/dialog';
import { SearchAppointmentDetailComponent } from '../search-appointment-detail/search-appointment-detail.component';

export interface appointment {
  clinic_id: number;
  appointment_date: string;
  appointment_status: string;
  start_time: string;
  end_time: string;
  appointment_type: string;
  room_assigned: string;
  appointment_id: string;
}

@Component({
  selector: 'app-search-appointment',
  templateUrl: './search-appointment.component.html',
  styleUrls: ['./search-appointment.component.scss'],
})
export class SearchAppointmentComponent implements OnInit {
  isChecked = false;
  displayedColumns: string[] = [
    'appointment_id',
    'clinic_id',
    'appointment_date',
    'appointment_status',
    'start_time',
    'end_time',
    'appointment_type',
    'room_assigned',
    'actions',
  ];
  dataSource = new MatTableDataSource<appointment>([]);

  subscription: Subscription;
  everyThreeSeconds: Observable<number> = timer(0, 3000);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private supabase: SupabaseService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    console.log(this.getCurrentDate());
    // Search by all user fields
    this.dataSource.filterPredicate = (data: appointment, filter: string) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };

    this.updateFilter();
    this.subscription = this.everyThreeSeconds.subscribe(() => {
      this.updateFilter();
    });
  }

  updateFilter() {
    let sb = this.supabase._supabase;
    if (!this.isChecked) {
      sb.from('appointment')
        .select('*, branch("*")')
        .gte('appointment_date', this.getCurrentDate())
        .then((data) => {
          //console.log("Greater Data", data);
          this.updateData(data);
        });
    } else {
      sb.from('appointment')
        .select('*, branch("*")')
        .lte('appointment_date', this.getCurrentDate())
        .then((data) => {
          //console.log("Data", data.body);
          this.updateData(data);
        });
    }
  }

  updateData(data: PostgrestResponse<any>) {
    if (data.error) {
      console.log('data.error: ', data.error);
      this.snackBar.open('Error: ' + data.error.details, 'Close');
    } else {
      this.dataSource.data = data.body;
    }
  }

  getCurrentDate() {
    //Get current date in YYYY-MM-DD format
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  viewDetail(row: any) {
    //console.log(row);
    this.dialog.open(SearchAppointmentDetailComponent, { data: row });
  }
  //Unsubscribe from the timer
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}

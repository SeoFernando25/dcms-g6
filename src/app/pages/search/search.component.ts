import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { timer, Subscription, Observable, map } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostgrestResponse } from '@supabase/supabase-js';

import { MatDialog } from '@angular/material/dialog';
import { SearchDetailComponent } from '../search-detail/search-detail.component';
import { AddAppointmentComponent } from '../patient/appointments/add-appointment/add-appointment.component';

export interface Person {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  ssn: string;
  date_of_birth: string;
  phone_number: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  isChecked = false;
  displayedColumns: string[] = [
    'first_name',
    'middle_name',
    'last_name',
    'gender',
    'ssn',
    'date_of_birth',
    'phone_number',
    'actions',
  ];
  dataSource = new MatTableDataSource<Person>([]);

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
    // Search by all user fields
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
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
    if (this.isChecked) {
      sb.from('employee')
        .select('person (*)')
        .then((data) => {
          this.updateData(data);
        });
    } else {
      sb.from('patient')
        .select('person!patient_patient_id_fkey(*)')
        .then((data) => {
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

  viewDetail(row: any) {
    //console.log(row);
    this.dialog.open(SearchDetailComponent, { data: row });
  }

  addAppointment(row: any) {
    //console.log(row);
    this.dialog.open(AddAppointmentComponent, { data: row });
  }
  //Unsubscribe from the timer
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}

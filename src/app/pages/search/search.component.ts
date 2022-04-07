import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { timer, Subscription , Observable, map} from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';
import { syncBuiltinESMExports } from 'module';
import { equal } from 'assert';

export interface people {
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  ssn: string;
  date_of_birth	: string;
  phone_number: string;

}

const ELEMENT_DATA: people[] = [  
];


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  isChecked = false;
  displayedColumns: string[] = ['first_name', 'middle_name', 'last_name', 'gender', 'ssn', 'date_of_birth', 'phone_number'];
  dataSource = new MatTableDataSource<people>(ELEMENT_DATA);

  subscription: Subscription;
  everyThreeSeconds: Observable<number> = timer(0, 3000);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private supabase:SupabaseService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.subscription = this.everyThreeSeconds.subscribe(() => {
    let sb = this.supabase._supabase;
    if (this.isChecked) {
      sb.from('employee').select('person (*)').then((data) => {
        if(data.error){
          console.log("data.error: ", data.error);
        }else{
            //console.log("data: ", data.body);
            this.dataSource.data = data.body;
          }
        });
    }else{
      sb.from('patient').select('person!patient_patient_id_fkey(*)').then((data) => {
        if(data.error){
          console.log("data.error: ", data.error);
        }else{
            //console.log("data: ", data.body);
            this.dataSource.data = data.body;
            
          }
        });
    }
    });
  }

  //Unsubscribe from the timer
  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}

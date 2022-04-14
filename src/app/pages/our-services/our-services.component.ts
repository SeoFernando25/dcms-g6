import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostgrestResponse } from '@supabase/supabase-js';

export interface GenerialService {
  name: string;
  description: string;
  price: number;
}

const ELEMENT_DATA: GenerialService[] = [];

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
})
export class OurServicesComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'price'
  ];
  dataSource = new MatTableDataSource<GenerialService>([]);

  constructor(
    public router: Router,
    private snackBar: MatSnackBar,
    private supabase: SupabaseService,
  ) { }

  ngOnInit(): void {
    let sb = this.supabase._supabase;
    sb.from('procedure_type')
    .select('*')
    .then((data) => {
      console.log(data.body);
      this.updateData(data);
   });
  }

  updateData(data: PostgrestResponse<any>) {
    if (data.error) {
      console.log('data.error: ', data.error);
      this.snackBar.open('Error: ' + data.error.details, 'Close');
    } else {
      this.dataSource.data = data.body;
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMyReviewComponent } from '../../pages/update-my-review/update-my-review.component';
import { SupabaseService } from 'src/app/services/supabase.service';
@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.scss']
})
export class MyReviewComponent implements OnInit {
  displayedColumns: string[] = ['review_id', 'review_date', 'professionalism_score', 'cleanliness_score', 'communication_score', 'feedback'];
  dataSource: any[] = [];


  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) { }


  openSnackBar(message: string) {
    this._snackBar.open(message, "DISMISS", { duration: 5000 });
  }

  openDialog() {
    this.dialog.open(UpdateMyReviewComponent);
  }

  ngOnInit(): void {
    let sb = this.supabase._supabase;
    sb.from('review').select('*').then((data) => {
      if (data.error) {
        console.log("Error fetching reviews")
      } else {
        this.dataSource = data.body;
        console.log(data.body);
      }
    });
  }



}

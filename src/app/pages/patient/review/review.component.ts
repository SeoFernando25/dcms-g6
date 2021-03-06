import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { timer, Subscription, Observable } from 'rxjs';

import { SupabaseService } from 'src/app/services/supabase.service';
import { UpdateMyReviewComponent } from '../update-my-review/update-my-review.component';

export interface UserFeedbackList {
  review_id: number;
  review_date: string;
  professionalism_score: number;
  cleanliness_score: number;
  communication_score: number;
  value_score: number;
  feedback: string;
}

const ELEMENT_DATA: UserFeedbackList[] = [];

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  NewReviewForm = new FormGroup({
    review_date: new FormControl(''),
    professionalism_score: new FormControl(''),
    cleanliness_score: new FormControl(''),
    communication_score: new FormControl(''),
    value_score: new FormControl(''),
    feedback: new FormControl(''),
  });
  displayedColumns: string[] = [
    'review_id',
    'review_date',
    'professionalism_score',
    'cleanliness_score',
    'communication_score',
    'value_score',
    'feedback',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserFeedbackList>(ELEMENT_DATA);

  subscription: Subscription;
  everyThreeSeconds: Observable<number> = timer(0, 3000);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) {}

  openSnackBar(message: string) {
    this._snackBar.open(message, 'DISMISS', { duration: 5000 });
  }

  //Edit the row
  editReview(row: any) {
    //console.log(row);
    this.dialog.open(UpdateMyReviewComponent, { data: row });
  }

  //Delete the row
  deleteReview(row: any) {
    console.log(row);
    let sb = this.supabase._supabase;
    sb.from('review')
      .delete()
      .eq('review_id', row.review_id)
      .then(() => {
        this.openSnackBar('Review Deleted');
      });
  }

  //Validate Form
  validateForm() {
    if (this.NewReviewForm.value.professionalism_score == '') {
      this.openSnackBar('Please enter a professionalism score');
    } else if (this.NewReviewForm.value.cleanliness_score == '') {
      this.openSnackBar('Please enter a cleanliness score');
    } else if (this.NewReviewForm.value.communication_score == '') {
      this.openSnackBar('Please enter a communication score');
    } else if (this.NewReviewForm.value.value_score == '') {
      this.openSnackBar('Please enter a value score');
    }
  }

  //Update the table (Insert new row)
  submitNewForm() {
    let sb = this.supabase._supabase;
    console.log('LoginUser:', sb.auth.user()?.id); //b475c2fe-ca0a-4a05-8d4f-edf2ae7ed493
    // sb.from('patient').insert({
    //   patient_id: sb.auth.user()?.id,
    // }).then((data) => {
    //   console.log(data);
    // });

    sb.from('review')
      .insert({
        review_date: new Date(),
        professionalism_score: this.NewReviewForm.value.professionalism_score,
        cleanliness_score: this.NewReviewForm.value.cleanliness_score,
        communication_score: this.NewReviewForm.value.communication_score,
        value_score: this.NewReviewForm.value.value_score,
        feedback: this.NewReviewForm.value.feedback,
        written_by: this.supabase._supabase.auth.user()?.id || 'error',
      })
      .then((data) => {
        if (data.error) {
          console.log('data.error: ', data.error);
          this.validateForm();
        } else {
          this.openSnackBar('Review Submitted');
          this.NewReviewForm.reset();
        }
      });
  }

  //Refresh the table every 3 seconds
  ngOnInit(): void {
    this.subscription = this.everyThreeSeconds.subscribe(() => {
      let sb = this.supabase._supabase;
      sb.from('review')
        .select('*')
        .eq('written_by', sb.auth.user()?.id)
        .then((data) => {
          if (data.error) {
            console.log('data.error: ', data.error);
          } else {
            console.log('data: ', data);
            this.dataSource.data = data.body;
          }
        });
    });
  }

  //Unsubscribe from the timer
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

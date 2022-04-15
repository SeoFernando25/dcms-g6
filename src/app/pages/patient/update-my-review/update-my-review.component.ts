import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-update-my-review',
  templateUrl: './update-my-review.component.html',
  styleUrls: [
    './update-my-review.component.scss',
    './../review/review.component.scss',
  ],
})
export class UpdateMyReviewComponent implements OnInit {
  UpdateReviewForm = new FormGroup({
    professionalism_score: new FormControl(''),
    cleanliness_score: new FormControl(''),
    communication_score: new FormControl(''),
    value_score: new FormControl(''),
    feedback: new FormControl(''),
  });

  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialog: MatDialog,
    private supabase: SupabaseService
  ) {}

  ngOnInit(): void {
    var d = new Date(this.editData.review_date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    this.editData.review_date = d;

    this.editData.professionalism_score =
      this.editData.professionalism_score.toString();
    this.editData.cleanliness_score =
      this.editData.cleanliness_score.toString();
    this.editData.communication_score =
      this.editData.communication_score.toString();
    this.editData.value_score = this.editData.value_score.toString();

    this.UpdateReviewForm.patchValue({
      review_date: new Date(),
      professionalism_score: this.editData.professionalism_score,
      cleanliness_score: this.editData.cleanliness_score,
      communication_score: this.editData.communication_score,
      value_score: this.editData.value_score,
      feedback: this.editData.feedback,
    });

    //this.UpdateReviewForm.reset();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'DISMISS', { duration: 5000 });
  }

  //Update Review (row)
  UpdateReview() {
    console.log('Update Value,', this.UpdateReviewForm.value);
    let sb = this.supabase._supabase;
    sb.from('review')
      .update({
        review_date: this.UpdateReviewForm.value.review_date,
        professionalism_score:
          this.UpdateReviewForm.value.professionalism_score,
        cleanliness_score: this.UpdateReviewForm.value.cleanliness_score,
        communication_score: this.UpdateReviewForm.value.communication_score,
        value_score: this.UpdateReviewForm.value.value_score,
        feedback: this.UpdateReviewForm.value.feedback,
      })
      .eq('review_id', this.editData.review_id)
      .then((data) => {
        if (data.error) {
          console.log('Error: ', data.error);
          this.openSnackBar('Review Update Error');
        } else {
          this.openSnackBar('Review Updated');
          this.dialog.closeAll();
        }
      });
  }
}

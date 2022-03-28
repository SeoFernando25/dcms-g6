import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-my-review',
  templateUrl: './update-my-review.component.html',
  styleUrls: ['./update-my-review.component.scss']
})
export class UpdateMyReviewComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "DISMISS", {duration: 5000});
  }


}

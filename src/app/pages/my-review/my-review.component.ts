import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {UpdateMyReviewComponent} from '../../pages/update-my-review/update-my-review.component';


export interface UserFeedbackList {
  id: number;
  appointment_Date: string;
  professionalism_rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  overall_rating: number;
  feedback: string;

}

const ELEMENT_DATA: UserFeedbackList[] = [
  {id: 1, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,TestLongFeedback,'},
  {id: 2, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 3, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 4, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 5, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 6, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 7, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 8, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 9, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 10, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 11, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 12, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 13, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 14, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 15, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 16, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 17, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 18, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 19, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
  {id: 20, appointment_Date:'2022/03/27', professionalism_rating:4.5, cleanliness_rating:5, communication_rating:3, overall_rating:5, feedback: 'Good'},
];


@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.scss']
})
export class MyReviewComponent implements OnInit {
  displayedColumns: string[] = ['id', 'appointment_Date', 'professionalism_rating', 'cleanliness_rating', 'communication_rating', 'overall_rating', 'feedback', 'actions'];
  dataSource = new MatTableDataSource<UserFeedbackList>(ELEMENT_DATA);


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private _snackBar: MatSnackBar, public dialog:MatDialog) { }

  openSnackBar(message: string) {
    this._snackBar.open(message, "DISMISS", {duration: 5000});
  }

  openDialog() {
    this.dialog.open(UpdateMyReviewComponent);
  }

  ngOnInit(): void {

  }



}

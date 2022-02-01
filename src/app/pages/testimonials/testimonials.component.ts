import { ScrollingVisibility } from '@angular/cdk/overlay';
import { Component, OnInit, ChangeDetectionStrategy, HostListener, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faker } from '@faker-js/faker';



class Review {
  static nextId = 1;
  headline: string = "My Headline " + Review.nextId;
  content: string = "My Content";
  rating: number = 1 + Math.floor(Math.random() * 9.9);

  constructor() {
    Review.nextId++;
    this.content = faker.lorem.paragraphs(1);
    this.headline = faker.lorem.sentence();
  }
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TestimonialsComponent implements OnInit {
  // Material form with the following fields: -->
  // Review headline, review content, 4 score sliders -->
  // Submit and reset button -->
  reviewForm = new FormGroup({
    reviewHeadline: new FormControl(''),
    reviewContent: new FormControl(''),
    reviewScore: new FormControl(''),
    score2: new FormControl(''),
    score3: new FormControl(''),
    score4: new FormControl('')
  });

  reviews: Review[] = [];
  review: Review | null = new Review();
  reviewLoaded: boolean = true;

  constructor(private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    // this.nativeElement = this.elRef.nativeElement;
    // console.log(this.nativeElement);
    // this.nativeElement.addEventListener('wheel', this.onScroll);
  }

  onSubmit(): void {
    this.snackBar.open('Not implemented yet but you can click the review on the right to generate a new random one', 'Dismiss');
  }

  onReviewClick() {
    // Fetch another review
    this.reviewLoaded = false; 
    this.review = new Review();
    setTimeout(() => {
      this.reviewLoaded = true;
    }, 1000);

  
  }



}


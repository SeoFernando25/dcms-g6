import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  Injectable,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faker } from '@faker-js/faker';
import { BehaviorSubject, from, Observable, Subscription } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';

class Review {
  static nextId = 1;
  headline: string = 'My Headline ' + Review.nextId;
  content: string = 'My Content';
  value_score: number = 100;

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
    score4: new FormControl(''),
  });

  reviews: Review[] = [];
  review: Review | null = new Review();
  reviewLoaded: boolean = true;

  reviewDataSource: ReviewDataSource;

  constructor(
    private snackBar: MatSnackBar,
    public readonly supabase: SupabaseService
  ) {
    this.reviewDataSource = new ReviewDataSource(this.supabase);
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.supabase._supabase
      .from('review')
      .insert([
        {
          headline: this.reviewForm.value.reviewHeadline,
          content: this.reviewForm.value.reviewContent,
          value_score: this.reviewForm.value.reviewScore
            ? this.reviewForm.value.reviewScore
            : 0,
        },
      ])
      .then((response) => {
        window.location.reload();
        this.reviewForm.reset();
      });

    this.snackBar
      .open('Your review has been submitted!', 'Dismiss')
      .afterDismissed()
      .subscribe(() => {
        window.location.reload();
      });
  }

  onReviewClick(reviewId: number): void {
    // Delete the review
    console.log('Deleting review with id: ' + reviewId);
    this.supabase._supabase
      .from('review')
      .delete()
      .eq('id', reviewId)
      .then((response) => {
        console.log(response);
      });
    this.snackBar
      .open('Your review has been deleted!', 'Dismiss')
      .afterDismissed()
      .subscribe(() => {
        window.location.reload();
      });
  }
}

export class ReviewDataSource extends DataSource<Review | undefined> {
  private _length: number | any = null;
  private _pageSize = 10;
  private _cachedData = Array.from<Review>({ length: 10 });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(Review | undefined)[]>(
    this._cachedData
  );
  private readonly _subscription = new Subscription();

  constructor(public readonly supabase: SupabaseService) {
    super();
    // Get size of review table
    this.supabase._supabase.rpc('review_count').then((response) => {
      if (response.data != null) {
        this._length = response.data;
        this._cachedData = Array.from<Review>({ length: this._length });
        this._fetchedPages = new Set<number>();
      }
    });
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(Review | undefined)[]> {
    this._fetchPage(0);
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        const startPage = Math.floor(range.start / this._pageSize);
        const endPage = Math.floor((range.end - 1) / this._pageSize);

        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream;
  }

  disconnect(): void {}

  private getPageRange(page: number) {
    const limit = this._pageSize + 10;
    const from = page * limit;
    const to = page ? from + this._pageSize : this._pageSize;
    console.log(from, to);
    return { from, to };
  }

  private _fetchPage(page: number) {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    var { from, to } = this.getPageRange(page);
    this.supabase._supabase
      .from('review')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to)
      .then((response) => {
        if (response.error) {
          this._fetchedPages.delete(page);
        } else {
          this._cachedData.splice(from, to - from, ...response.data);
          this._dataStream.next(this._cachedData);
          console.log(this._cachedData);
        }
      });
  }
}

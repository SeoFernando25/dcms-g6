import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faker } from '@faker-js/faker';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';



@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TestimonialsComponent {
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

  review: any[] = [];
  reviewLoaded: boolean = true;

  reviewDataSource: ReviewDataSource;

  constructor(
    public readonly supabase: SupabaseService
  ) {
    this.reviewDataSource = new ReviewDataSource(this.supabase);
  }
}

export class ReviewDataSource extends DataSource<any | undefined> {
  private _length: number | any = null;
  private _pageSize = 10;
  private _cachedData = Array.from<any>({ length: 10 });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(any | undefined)[]>(
    this._cachedData
  );
  private readonly _subscription = new Subscription();

  constructor(public readonly supabase: SupabaseService) {
    super();
    // Get size of review table
    this.supabase._supabase.rpc('review_count').then((response) => {
      if (response.data != null) {
        this._length = response.data;
        this._cachedData = Array.from<any>({ length: this._length });
        this._fetchedPages = new Set<number>();
      }
    });
  }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<(any | undefined)[]> {
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

  disconnect(): void { }

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
      .select(`
      *,
      written_by (
        person!patient_patient_id_fkey (
          first_name, last_name
        )
    )
      `, { count: 'exact' })
      .order('value_score', { ascending: true })
      .range(from, to)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          this._fetchedPages.delete(page);
        } else {
          this._cachedData.splice(from, to - from, ...response.data);
          this._dataStream.next(this._cachedData);
          console.log(this._cachedData);
        }
      });
  }
}

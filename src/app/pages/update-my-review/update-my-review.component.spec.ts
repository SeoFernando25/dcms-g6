import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMyReviewComponent } from './update-my-review.component';

describe('UpdateMyReviewComponent', () => {
  let component: UpdateMyReviewComponent;
  let fixture: ComponentFixture<UpdateMyReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateMyReviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMyReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerachDetailComponent } from './serach-detail.component';

describe('SerachDetailComponent', () => {
  let component: SerachDetailComponent;
  let fixture: ComponentFixture<SerachDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerachDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerachDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

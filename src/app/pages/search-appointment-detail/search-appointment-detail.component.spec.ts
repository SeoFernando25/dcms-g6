import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAppointmentDetailComponent } from './search-appointment-detail.component';

describe('SearchAppointmentDetailComponent', () => {
  let component: SearchAppointmentDetailComponent;
  let fixture: ComponentFixture<SearchAppointmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAppointmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAppointmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

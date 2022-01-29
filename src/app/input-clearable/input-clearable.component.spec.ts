import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputClearableComponent } from './input-clearable.component';

describe('InputClearableComponent', () => {
  let component: InputClearableComponent;
  let fixture: ComponentFixture<InputClearableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputClearableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputClearableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

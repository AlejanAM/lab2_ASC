import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmationUpdateComponent} from './confirmation-update.component';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationUpdateComponent;
  let fixture: ComponentFixture<ConfirmationUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationUpdateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

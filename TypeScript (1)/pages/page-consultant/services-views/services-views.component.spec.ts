import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesViewsComponent } from './services-views.component';

describe('ServicesViewsComponent', () => {
  let component: ServicesViewsComponent;
  let fixture: ComponentFixture<ServicesViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

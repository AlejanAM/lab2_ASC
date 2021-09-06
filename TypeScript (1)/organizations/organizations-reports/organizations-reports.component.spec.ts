import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsReportsComponent } from './organizations-reports.component';

describe('OrganizationsReportsComponent', () => {
  let component: OrganizationsReportsComponent;
  let fixture: ComponentFixture<OrganizationsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

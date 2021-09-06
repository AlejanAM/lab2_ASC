import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserOrganizationsComponent } from './modal-user-organizations.component';

describe('ModalUserOrganizationsComponent', () => {
  let component: ModalUserOrganizationsComponent;
  let fixture: ComponentFixture<ModalUserOrganizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUserOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

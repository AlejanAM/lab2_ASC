import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsViewsReportsComponent } from './items-views-reports.component';

describe('ItemsViewsReportsComponent', () => {
  let component: ItemsViewsReportsComponent;
  let fixture: ComponentFixture<ItemsViewsReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsViewsReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsViewsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

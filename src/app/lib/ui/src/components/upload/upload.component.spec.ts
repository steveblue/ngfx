import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFxUploadComponent } from './upload.component';

describe('NgFxUploadComponent', () => {
  let component: NgFxUploadComponent;
  let fixture: ComponentFixture<NgFxUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgFxUploadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgFxUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

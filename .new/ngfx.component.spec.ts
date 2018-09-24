import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFxComponent } from './new.component';

describe('NgFxComponent', () => {
  let component: NgFxComponent;
  let fixture: ComponentFixture<NgFxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgFxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgFxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

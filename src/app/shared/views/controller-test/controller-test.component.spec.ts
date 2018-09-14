import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerTestComponent } from './controller-test.component';

describe('ControllerTestComponent', () => {
  let component: ControllerTestComponent;
  let fixture: ComponentFixture<ControllerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControllerTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

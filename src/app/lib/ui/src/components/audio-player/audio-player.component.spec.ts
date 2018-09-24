import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgFxAudioPlayerComponent } from './audio-player.component';

describe('NgFxAudioPlayerComponent', () => {
  let component: NgFxAudioPlayerComponent;
  let fixture: ComponentFixture<NgFxAudioPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgFxAudioPlayerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgFxAudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

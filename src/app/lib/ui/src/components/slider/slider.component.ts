import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxDraggableDirective } from './draggable.directive';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-slider, [ngfx-slider]',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css']
})
export class NgFxSliderComponent {
  @Input('control')
  control: NgFxControl;
  @ViewChild(NgFxDraggableDirective)
  draggable: NgFxDraggableDirective;

  constructor(private _sanitizer: DomSanitizer) {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }
}

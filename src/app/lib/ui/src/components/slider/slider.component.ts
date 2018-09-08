import { Component, Input, ViewChild } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxDraggableDirective } from './draggable.directive';

@Component({
  selector: 'ngfx-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css']
})
export class NgFxSliderComponent {
  @Input('control')
  control: NgFxControl;
  @ViewChild(NgFxDraggableDirective)
  draggable: NgFxDraggableDirective;

  constructor() {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }
}

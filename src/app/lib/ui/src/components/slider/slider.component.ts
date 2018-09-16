import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxDraggableDirective } from './draggable.directive';

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

  @HostBinding('style.grid-column')
  get gridColumn(): string {
    return this.control.column || '';
  }

  @HostBinding('style.grid-row')
  get gridRow(): string {
    return this.control.row || '';
  }

  constructor() {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }
}

import { Component, Input, ViewChild, HostBinding } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxDraggableDirective } from './draggable.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeStyle } from 'dist/ngfx/lib/@angular/platform-browser';

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

  @HostBinding('style.grid-area')
  get gridArea(): SafeStyle {
    return this.sanitize(this.control.gridArea) || this.sanitize('');
  }

  @HostBinding('style.place-self')
  get placeSelf(): SafeStyle {
    return this.sanitize(this.control.placeSelf) || this.sanitize('');
  }
  constructor(private _sanitizer: DomSanitizer) {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }

  sanitize(style: string) {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}

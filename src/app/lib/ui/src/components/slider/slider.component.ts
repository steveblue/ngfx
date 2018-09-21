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

  @HostBinding('style.transform')
  get transform(): SafeStyle {
    return this.sanitize(this.control.transform) || this.sanitize('');
  }

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

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}

import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-toggle, [ngfx-toggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class NgFxToggleComponent {
  @Input('control')
  control: NgFxControl;

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

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.toggleActive();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    this.toggleActive();
  }

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  toggleActive() {
    this.control.currentValue = this.control.currentValue ? false : true;
    this.control.hasUserInput = false;
    this._controller.onEvent.emit({
      type: 'change',
      control: this.control
    });
  }

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }
}

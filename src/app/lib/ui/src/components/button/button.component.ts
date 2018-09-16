import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-button, [ngfx-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class NgFxButtonComponent {
  public onHold;
  private _holdInterval: number;

  @Input('control')
  control: NgFxControl;

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
    this.onHold = false;
    this.control.currentValue = false;
    this.control.hasUserInput = false;
    window.clearInterval(this._holdInterval);
    this._controller.onEvent.emit({
      type: 'change',
      control: this.control
    });
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.onHold = true;
    this._holdInterval = window.setInterval(() => {
      this.setActive();
    }, 200);
    this.setActive();
  }

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  setActive() {
    this.control.currentValue = true;
    this.control.hasUserInput = true;
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

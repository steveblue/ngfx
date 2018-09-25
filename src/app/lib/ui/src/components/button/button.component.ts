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

  @HostListener('mouseup', ['$event'])
  onMouseup(event: MouseEvent | TouchEvent) {
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
  onMousedown(event: MouseEvent | TouchEvent) {
    this.onHold = true;
    this._holdInterval = window.setInterval(() => {
      this.setActive();
    }, 200);
    this.setActive();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    this.control.currentValue = true;
    this.control.hasUserInput = true;
    this._controller.onEvent.emit({
      type: 'change',
      control: this.control
    });
    setTimeout(() => {
      this.control.currentValue = false;
      this.control.hasUserInput = false;
      this._controller.onEvent.emit({
        type: 'change',
        control: this.control
      });
    }, 50);
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.control.currentValue = false;
    this.control.hasUserInput = false;
    this._controller.onEvent.emit({
      type: 'change',
      control: this.control
    });
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.control.currentValue = false;
    this.control.hasUserInput = false;
    this._controller.onEvent.emit({
      type: 'change',
      control: this.control
    });
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
}

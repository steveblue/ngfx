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

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent) {
    this.toggleActive();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    e.preventDefault();
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
}

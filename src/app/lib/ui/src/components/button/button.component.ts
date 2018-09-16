import { Component, Input, HostBinding, HostListener } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';

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

  @HostBinding('style.grid-column')
  get gridColumn(): string {
    return this.control.column || '';
  }

  @HostBinding('style.grid-row')
  get gridRow(): string {
    return this.control.row || '';
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

  constructor(private _controller: NgFxController) {}

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

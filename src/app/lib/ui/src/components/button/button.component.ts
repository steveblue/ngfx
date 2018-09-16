import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';

@Component({
  selector: 'ngfx-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {}
}

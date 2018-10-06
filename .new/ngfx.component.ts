import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';

@Component({
  selector: 'ngfx-new, [ngfx-new]',
  templateUrl: './ngfx.component.html',
  styleUrls: ['./ngfx.component.css']
})
export class NgFxComponent implements OnInit {
  @Input('control')
  control: NgFxControl;

  constructor(private _controller: NgFxController) {}

  ngOnInit() {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }
}

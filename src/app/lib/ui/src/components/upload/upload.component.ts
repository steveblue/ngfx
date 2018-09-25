import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-upload, [ngfx-upload]',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class NgFxUploadComponent implements OnInit {
  @Input('control')
  control: NgFxControl;

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  ngOnInit() {}

  hasName() {
    return this.control.name !== undefined && this.control.name.length > 0;
  }
}

import { NgFxSurface } from './../../interfaces/surface';
import { Component, HostBinding, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFxController } from '../../services/controller/controller.service';
import { NgFxControl } from './../../../src/interfaces/control';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-surface, [ngfx-surface]',
  templateUrl: './surface.component.html',
  styleUrls: ['./surface.component.css']
})
export class NgFxSurfaceComponent implements OnInit, OnChanges {
  @Input('controller')
  controller: string;

  @Input('surface')
  surface: NgFxSurface;

  controlMap: NgFxControl[] = new Array();

  constructor(private _controller: NgFxController, private _sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.controller) {
      this.controlMap = this.mapToControls(changes.controller.currentValue);
    }
  }

  mapToControls(key: string) {
    return Object.keys(this._controller.surfaces[key].controls).map((prop: string) => {
      return this._controller.surfaces[key].controls[prop];
    });
  }

  sanitize(style: string): SafeStyle {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }

  ngOnInit() {}
}

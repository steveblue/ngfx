import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgFxController } from '../../services/controller/controller.service';
import { NgFxControl } from './../../../src/interfaces/control';

@Component({
  selector: 'ngfx-surface',
  templateUrl: './surface.component.html',
  styleUrls: ['./surface.component.scss']
})
export class NgfxSurfaceComponent implements OnInit, OnChanges {
  @Input('controller')
  controller: string;

  controlMap: NgFxControl[] = new Array();

  constructor(private _controller: NgFxController) {}

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
  ngOnInit() {}
}

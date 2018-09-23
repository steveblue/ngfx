import { Component, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgFxControl } from './../../../lib/ui/src/interfaces/control';
import { NgFxEvent } from './../../../lib/ui/src/interfaces/event';
import { NgFxController } from '../../../lib/ui/src/services/controller/controller.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  grid: string;
  gridGap: string;
  constructor(public controller: NgFxController, private _sanitizer: DomSanitizer) {
    // TODO: test with fetching initial data, then hook up with DataChannel
    this.grid = '64px 64px 64px 64px / 32px 200px 50px 50px 50px 50px';
    this.gridGap = '20px 20px';
    // <name> | <row-start> / <column-start> / <row-end> / <column-end>
    this.controller.createSurface('testControls', {
      vertControl: {
        type: 'slider',
        name: 'slider',
        orient: 'is--vert',
        min: 0,
        max: 255,
        gridArea: '1 / 1 / span 3 / span 1'
      },
      joyControl: {
        type: 'slider',
        name: 'joystick',
        orient: 'is--joystick',
        min: [0, 0],
        max: [255, 255],
        snapToCenter: true,
        gridArea: '1 / 2 / span 4 / span 1'
      },
      horControl: {
        type: 'slider',
        name: 'h',
        orient: 'is--hor',
        min: 0,
        max: 1000,
        size: 'small',
        gridArea: '1 / 3 / span 1 / span 3'
      },
      buttonA: {
        type: 'button',
        name: 'a',
        gridArea: '2 / 3 / span 1 / span 1'
      },
      buttonB: {
        type: 'button',
        name: 'b',
        gridArea: '2 / 4 / span 1 / span 1'
      },
      buttonC: {
        type: 'button',
        name: 'c',
        gridArea: '2 / 5 / span 1 / span 1'
      },
      buttonX: {
        type: 'button',
        name: 'x',
        size: 'small',
        gridArea: '3 / 3 / span 1 / span 1'
      },
      buttonY: {
        type: 'button',
        name: 'y',
        size: 'small',
        gridArea: '3 / 4 / span 1 / span 1'
      },
      buttonZ: {
        type: 'toggle',
        name: 't',
        size: 'small',
        gridArea: '3 / 5 / span 1 / span 1'
      }
    });
  }

  sanitize(style: string) {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }

  ngOnInit() {
    // TODO: move to service or find another way to combine DataChannel
    this.controller.onEvent.subscribe((ev: NgFxEvent) => {
      console.log(ev.control.name, ev.control.currentValue);
    });
  }
}

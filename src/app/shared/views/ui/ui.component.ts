import { Component, OnInit, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgFxEvent } from './../../../lib/ui/src/interfaces/event';
import { NgFxController } from '../../../lib/ui/src/services/controller/controller.service';
import { NgFxSurface } from '../../../lib/ui/src/interfaces/surface';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  uiSurface: NgFxSurface;
  constructor(public controller: NgFxController, private _sanitizer: DomSanitizer) {
    // TODO: test with fetching initial data, then hook up with DataChannel
    this.uiSurface = {
      id: 'testControls',
      style: {
        display: 'inline-grid',
        grid: '64px 64px 64px 64px / 32px 200px 50px 50px 50px 50px',
        gridGap: '20px 20px'
      },
      controls: {
        vertControl: {
          type: 'slider',
          name: 'slider',
          orient: 'vert',
          min: 0,
          max: 255,
          size: 'small',
          style: {
            gridArea: '1 / 1 / span 3 / span 1'
          }
        },
        joyControl: {
          type: 'slider',
          name: 'joystick',
          orient: 'joy',
          min: [0, 0],
          max: [255, 255],
          snapToCenter: true,
          style: {
            gridArea: '1 / 2 / span 4 / span 1'
          }
        },
        horControl: {
          type: 'slider',
          name: 'h',
          orient: 'hor',
          min: 0,
          max: 1000,
          style: {
            gridArea: '1 / 3 / span 1 / span 3'
          }
        },
        buttonA: {
          type: 'button',
          name: 'a',
          style: {
            gridArea: '2 / 3 / span 1 / span 1'
          }
        },
        buttonB: {
          type: 'button',
          name: 'b',
          style: {
            gridArea: '2 / 4 / span 1 / span 1'
          }
        },
        buttonC: {
          type: 'button',
          name: 'c',
          style: {
            gridArea: '2 / 5 / span 1 / span 1'
          }
        },
        buttonX: {
          type: 'button',
          name: 'x',
          size: 'small',
          style: {
            gridArea: '3 / 3 / span 1 / span 1'
          }
        },
        buttonY: {
          type: 'button',
          name: 'y',
          size: 'small',
          style: {
            gridArea: '3 / 4 / span 1 / span 1'
          }
        },
        buttonZ: {
          type: 'toggle',
          name: 't',
          size: 'small',
          style: {
            gridArea: '3 / 5 / span 1 / span 1'
          }
        }
      }
    };

    this.controller.createSurface(this.uiSurface);
  }

  ngOnInit() {
    // TODO: move to service or find another way to combine DataChannel
    this.controller.onEvent.subscribe((ev: NgFxEvent) => {
      console.log(ev.control.name, ev.control.currentValue);
    });
  }
}

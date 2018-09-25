import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgFxControl } from './../../../lib/ui/src/interfaces/control';
import { NgFxEvent } from './../../../lib/ui/src/interfaces/event';
import { NgFxController } from '../../../lib/ui/src/services/controller/controller.service';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';
import { NgFxSurface } from './../../../lib/ui/src/interfaces/surface';

@Component({
  selector: 'app-ui',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {
  uiSurface: NgFxSurface;
  hasPulse = false;
  constructor(public controller: NgFxController, private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {
    // TODO: test with fetching initial data, then hook up with DataChannel
    this._client.config.key = 'AFXGD';
    this._client.emitter.subscribe(msg => {
      if (msg === 'open') {
        this.hasPulse = true;
        this._ref.detectChanges();
      }
    });
    this.uiSurface = {
      id: 'testControls',
      style: {
        grid: 'auto 240px / 240px auto 240px',
        gridGap: '0px 0px'
      },
      controls: {
        joyLeft: {
          type: 'slider',
          name: 'joystick',
          orient: 'joy',
          min: [0, 0],
          max: [1024, 1024],
          snapToCenter: true,
          style: {
            gridArea: '2 / 1 / 3 / 2',
            placeSelf: 'center center',
            transform: 'translateY(-6px)'
          }
        },
        joyRight: {
          type: 'slider',
          name: 'joystick',
          orient: 'joy',
          min: [0, 0],
          max: [1024, 1024],
          snapToCenter: true,
          style: {
            gridArea: '2 / 3 / 3 / 4',
            placeSelf: 'center center',
            transform: 'translateY(-6px)'
          }
        }
      }
    };
    this.controller.createSurface(this.uiSurface.id, this.uiSurface.controls);
  }

  ngOnInit() {
    // TODO: move to service or find another way to combine DataChannel
    this.controller.onEvent.subscribe((ev: NgFxEvent) => {
      this._client.send({
        type: 'control',
        payload: {
          id: ev.control.name,
          currentValue: ev.control.currentValue
        }
      });
    });
  }
}

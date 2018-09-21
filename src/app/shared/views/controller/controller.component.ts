import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgFxControl } from './../../../lib/ui/src/interfaces/control';
import { NgFxEvent } from './../../../lib/ui/src/interfaces/event';
import { NgFxController } from '../../../lib/ui/src/services/controller/controller.service';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';

@Component({
  selector: 'app-ui',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {
  grid: string;
  gridGap: string;
  hasPulse = false;
  constructor(public controller: NgFxController, private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {
    // TODO: test with fetching initial data, then hook up with DataChannel
    this.grid = 'auto 240px / 240px auto 240px';
    this.gridGap = '0px 0px';
    this._client.config.key = 'AFXGD';
    this._client.emitter.subscribe(msg => {
      if (msg === 'open') {
        this.hasPulse = true;
        this._ref.detectChanges();
      }
    });
    this.controller.createSurface('testControls', {
      joyLeft: {
        type: 'slider',
        name: 'joystick',
        orient: 'is--joystick',
        min: [0, 0],
        max: [1024, 1024],
        snapToCenter: true,
        gridArea: '2 / 1 / 3 / 2',
        placeSelf: 'center center',
        transform: 'translateY(-6px)'
      },
      joyRight: {
        type: 'slider',
        name: 'joystick',
        orient: 'is--joystick',
        min: [0, 0],
        max: [1024, 1024],
        snapToCenter: true,
        gridArea: '2 / 3 / 3 / 4',
        placeSelf: 'center center',
        transform: 'translateY(-6px)'
      }
    });
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

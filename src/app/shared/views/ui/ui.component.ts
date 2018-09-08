import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgFxControl } from './../../../lib/ui/src/interfaces/control';
import { NgFxEvent } from './../../../lib/ui/src/interfaces/event';
import { NgFxController } from '../../../lib/ui/src/services/controller/controller.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  constructor(public controller: NgFxController) {
    // TODO: test with fetching initial data, then hook up with DataChannel
    this.controller.createSurface('testControls', {
      vertControl: {
        type: 'slider',
        name: 'slider',
        orient: 'is--vert',
        min: 0,
        max: 255
      },
      joyControl: {
        type: 'slider',
        name: 'joystick',
        orient: 'is--joystick',
        min: [0, 0],
        max: [255, 255],
        snapToCenter: true
      },
      joyControl2: {
        type: 'slider',
        name: 'h',
        orient: 'is--hor',
        min: 0,
        max: 1000
      }
    });
  }

  ngOnInit() {
    // TODO: move to service or find another way to combine DataChannel
    this.controller.onEvent.subscribe((ev: NgFxEvent) => {
      console.log(ev.control.name, ev.control.currentValue);
    });
  }
}

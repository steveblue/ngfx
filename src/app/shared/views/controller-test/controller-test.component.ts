import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';

@Component({
  selector: 'ngfx-controller-test',
  templateUrl: './controller-test.component.html',
  styleUrls: ['./controller-test.component.css']
})
export class ControllerTestComponent implements OnInit {
  hasPulse = false;
  messages: string[] = new Array();
  x: string;
  y: string;
  constructor(private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {
    this._client.config.key = 'AFXGD';
    this._client.emitter.subscribe(msg => {
      if (msg === 'open') {
        this.hasPulse = true;
        this._ref.detectChanges();
      }
    });
    this._client.messages.subscribe(msg => {
      this.messages.push(msg.data.payload.currentValue);
      this.x = parseInt(msg.data.payload.currentValue[0], 10).toString();
      this.y = parseInt(msg.data.payload.currentValue[1], 10).toString();
      this._ref.detectChanges();
    });
  }

  ngOnInit() {}
}

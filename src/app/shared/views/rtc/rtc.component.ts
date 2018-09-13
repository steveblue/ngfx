import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';

@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.css']
})
export class RtcComponent implements OnInit {
  public messages: string[] = new Array();
  public connections: any = {};

  constructor(private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {}

  ngOnInit() {
    this._client.config.key = 'newRoom';
    this._client.emitter.subscribe(msg => {
      if (msg === 'open') {
        this.messages.push(msg);
        this._client.send({ message: 'ping' });
        this._ref.detectChanges();
      }
    });
    this.messages.push('key: ' + this._client.config.key);
    this.messages.push('id: ' + this._client.config.id);
    this._client.messages.subscribe(msg => {
      if (!this.connections[msg.id]) {
        this.connections[msg.id] = {
          id: msg.id,
          messages: [msg]
        };
      }

      this.connections[msg.id].messages.push(msg);
      this.messages.push(msg.data.message);

      if (this.connections[msg.id].messages.length < 6) {
        if (msg.data.message.includes('ping')) {
          this._client.send({ message: 'pong' });
        }
        if (msg.data.message.includes('pong')) {
          this._client.send({ message: 'ping' });
        }
      }

      this._ref.detectChanges();
    });
    this._client.announce.onopen = () => {
      // this.messages.push('sending announce...');
      // this._client.sendAnnounce();
    };
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';

@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.css']
})
export class RtcComponent implements OnInit {
  public messages: string[] = new Array();

  constructor(private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {}

  isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this._client.key = 'newerRoom';
    this._client.emitter.subscribe(msg => {
      if (msg === 'open') {
        this.messages.push(msg);
        this._client.send({ message: 'ping' });
        this._ref.detectChanges();
      }
    });
    this.messages.push('key: ' + this._client.key);
    this.messages.push('id: ' + this._client.id);
    this._client.messages.subscribe(msg => {
      if (msg && msg.data) {
        this.messages.push(msg.data.message);
        this._ref.detectChanges();
        if (msg.data.message.includes('ping')) {
          this._client.send({ message: 'pong ' + this._client.id });
        }
        if (msg.data.message.includes('pong')) {
          this._client.send({ message: 'ping ' + this._client.id });
        }
      }
    });
    this._client.announce.onopen = () => {
      this.messages.push('sending announce...');
      this._client.sendAnnounce();
    };
  }
}

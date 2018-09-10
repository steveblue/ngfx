import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';

@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.css']
})
export class RtcComponent implements OnInit {
  public messages: string[] = new Array();
  public senders: any = {};

  constructor(private _client: NgFxDataChannel, private _ref: ChangeDetectorRef) {}

  ngOnInit() {
    this._client.key = 'newRoom';
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
      if (!this.senders[msg.sender]) {
        this.senders[msg.sender] = 1;
      } else {
        this.senders[msg.sender]++;
      }

      if (msg && msg.data && this.senders[msg.sender] < 5) {
        this.messages.push(msg.sender + ': ' + msg.data.message);
        this._ref.detectChanges();
        if (msg.data.message.includes('ping')) {
          this._client.send({ message: 'pong' });
        }
        if (msg.data.message.includes('pong')) {
          this._client.send({ message: 'ping' });
        }
      } else if (this.senders[msg.sender] === 5) {
        setTimeout(() => {
          this._client.send({ message: 'hello' });
        }, 5000);
      }
    });
    this._client.announce.onopen = () => {
      this.messages.push('sending announce...');
      this._client.sendAnnounce();
    };
  }
}

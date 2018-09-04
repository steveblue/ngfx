import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFxDataChannel } from './../../../lib/rtc/src/services/data-channel/data-channel.service';


@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.css']
})
export class RtcComponent implements OnInit {

  public messages : string[] = new Array();

  constructor(private _client: NgFxDataChannel,
              private _ref: ChangeDetectorRef ) { }

  ngOnInit() {

      this._client.emitter.subscribe((msg) => {

        if (msg === 'open') {

          this.messages.push(msg);
          this._ref.detectChanges();

          this._client.observer.subscribe((res) => {

            this.messages.push(res[res.length - 1].data);
            this._ref.detectChanges();

          });

        }

    });
    this.messages.push('key: '+ this._client.key);
    this.messages.push('id: '+ this._client.id);
    this.messages.push('sending announce...');
    //this._client.sendAnnounce();
  }

}

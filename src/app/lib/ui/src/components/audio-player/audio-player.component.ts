import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxEvent } from './../../interfaces/event';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngfx-audio-player, [ngfx-audio-player]',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class NgFxAudioPlayerComponent implements OnInit {
  grid: string;
  gridGap: string;
  display: string;
  controlMap: NgFxControl[] = new Array();

  constructor(public controller: NgFxController, private _sanitizer: DomSanitizer) {
    this.grid = '18px 18px 18px / 18px 18px 18px 18px 18px 18px 18px 18px 18px';
    this.gridGap = '18px 18px';
    this.display = 'inline-grid';

    this.controller.createSurface('audioControls', {
      playhead: {
        type: 'slider',
        name: 'a',
        orient: 'hor',
        min: 0,
        max: 1000,
        size: 'small',
        gridArea: '1 / 2 / span 1 / span 7'
      },
      rw: {
        type: 'button',
        name: '<<',
        size: 'small',
        gridArea: '2 / 4 / span 1 / span 1'
      },
      play: {
        type: 'button',
        name: '>',
        size: 'small',
        gridArea: '2 / 5 / span 1 / span 1'
      },
      ff: {
        type: 'button',
        name: '>>',
        size: 'small',
        gridArea: '2 / 6 / span 1 / span 1'
      }
    });

    this.controlMap = this.mapToControls('audioControls');
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

  mapToControls(key: string) {
    return Object.keys(this.controller.surfaces[key].controls).map((prop: string) => {
      return this.controller.surfaces[key].controls[prop];
    });
  }
}

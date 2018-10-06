import { Component, HostBinding, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxEvent } from './../../interfaces/event';
import { NgFxController } from './../../services/controller/controller.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgFxSurface } from './../../interfaces/surface';

@Component({
  selector: 'ngfx-audio-player, [ngfx-audio-player]',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class NgFxAudioPlayerComponent implements OnInit, OnChanges {
  @Input('surfaceId')
  surfaceId: string;
  surface: NgFxSurface;
  controlMap: NgFxControl[] = new Array();

  constructor(public controller: NgFxController, private _sanitizer: DomSanitizer) {}

  sanitize(style: string) {
    return this._sanitizer.bypassSecurityTrustStyle(style);
  }

  ngOnInit() {
    // TODO: move to service or find another way to combine DataChannel
    this.controller.onEvent.subscribe((ev: NgFxEvent) => {
      console.log(ev.control.name, ev.control.currentValue);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.surfaceId) {
      this.surface = {
        id: changes.surfaceId.currentValue,
        style: {
          display: 'inline-grid',
          grid: '18px 18px 18px / 18px 18px 18px 18px 18px 18px 18px 18px 18px',
          gridGap: '18px 18px'
        },
        controls: {
          playhead: {
            type: 'slider',
            name: 'play',
            orient: 'hor',
            min: 0,
            max: 1000,
            size: 'small',
            style: {
              gridArea: '1 / 2 / span 1 / span 7',
              borderRadius: 'initial'
            }
          },
          rw: {
            type: 'button',
            id: 'rw',
            size: 'small',
            currentValue: false,
            style: {
              gridArea: '2 / 4 / span 1 / span 1',
              borderRadius: 'initial',
              background: 'transparent'
            }
          },
          play: {
            type: 'toggle',
            id: 'play',
            size: 'small',
            currentValue: true,
            style: {
              gridArea: '2 / 5 / span 1 / span 1',
              borderRadius: 'initial',
              background: 'transparent'
            }
          },
          ff: {
            type: 'button',
            id: 'ff',
            size: 'small',
            currentValue: false,
            style: {
              gridArea: '2 / 6 / span 1 / span 1',
              borderRadius: 'initial',
              background: 'transparent'
            }
          }
        }
      };
      this.controller.createSurface(this.surface);
      this.controlMap = this.mapToControls(changes.surfaceId.currentValue);
    }
  }

  getSurface() {
    return this.controller.surfaces[this.surface.id];
  }

  mapToControls(key: string) {
    return Object.keys(this.controller.surfaces[key].controls).map((prop: string) => {
      return this.controller.surfaces[key].controls[prop];
    });
  }
}

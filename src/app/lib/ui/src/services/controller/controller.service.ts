import { Injectable, EventEmitter } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxEvent } from './../../interfaces/event';
import { NgFxSurface } from './../../interfaces/surface';

@Injectable()
export class NgFxController {
  surfaces: { [prop: string]: NgFxSurface } = {};
  onEvent: EventEmitter<NgFxEvent> = new EventEmitter();
  constructor() {}

  createSurface(id: string, controls: { [prop: string]: NgFxControl }) {
    this.surfaces[id] = {
      id: id,
      controls: controls
    };
  }

  getSurface(id: string) {
    return this.surfaces[id];
  }

  destroySurface(id: string) {
    delete this.surfaces[id];
  }
}

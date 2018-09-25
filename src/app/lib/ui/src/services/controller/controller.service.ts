import { Injectable, EventEmitter } from '@angular/core';
import { NgFxControl } from './../../interfaces/control';
import { NgFxEvent } from './../../interfaces/event';
import { NgFxSurface } from './../../interfaces/surface';

@Injectable()
export class NgFxController {
  surfaces: { [prop: string]: NgFxSurface } = {};
  onEvent: EventEmitter<NgFxEvent> = new EventEmitter();
  constructor() {}

  createSurface(surface: NgFxSurface) {
    this.surfaces[surface.id] = surface;
  }

  getSurface(id: string) {
    return this.surfaces[id];
  }

  destroySurface(id: string) {
    delete this.surfaces[id];
  }
}

import { NgFxControl } from './control';

export interface NgFxSurface {
  id: string;
  controls: { [prop: string]: NgFxControl };
  presets?: { [prop: string]: { [prop: string]: NgFxControl }[] };
}

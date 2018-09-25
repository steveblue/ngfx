import { NgFxControl } from './control';

export interface NgFxSurface {
  id: string;
  controls: { [prop: string]: NgFxControl };
  presets?: { [prop: string]: { [prop: string]: NgFxControl }[] };
  style?: {
    display?: string;
    grid?: string;
    gridGap?: string;
  };
}

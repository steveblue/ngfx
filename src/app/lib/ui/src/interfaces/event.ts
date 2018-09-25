import { NgFxControl } from './control';
import { NgFxSurface } from './surface';

export interface NgFxEvent {
  type: string;
  endFrame?: boolean;
  control?: NgFxControl;
  surface?: NgFxSurface;
}

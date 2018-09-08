import { NgFxControl } from './control';

export interface NgFxEvent {
  type: string;
  endFrame?: boolean;
  control: NgFxControl;
}

import { SafeStyle } from '@angular/platform-browser/src/security/dom_sanitization_service';

export interface NgFxControl {
  type: string;
  name: string;
  orient?: string;
  min?: number | number[];
  max?: number | number[];
  isActive?: boolean;
  hasUserInput?: boolean;
  hasRemoteInput?: boolean;
  currentValue?: number | number[] | boolean | string;
  position?: string;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  timeStamp?: Date | number;
  snapToCenter?: boolean;
  gridArea?: string;
  placeSelf?: string;
}

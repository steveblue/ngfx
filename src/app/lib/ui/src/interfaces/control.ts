import { SafeStyle } from '@angular/platform-browser';

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
  size?: string;
  timeStamp?: Date | number;
  snapToCenter?: boolean;
  style?: {
    display?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    textAlign?: string;
    background?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    backgroundSize?: string;
    gridArea?: string;
    placeSelf?: string;
    transform?: string;
  };
}

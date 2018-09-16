export interface NgFxControl {
  type: string;
  name: string;
  orient?: string;
  min?: number | number[];
  max?: number | number[];
  isActive?: boolean;
  hasUserInput?: boolean;
  currentValue?: number | number[] | boolean | string;
  position?: string;
  x?: number;
  y?: number;
  height?: number;
  width?: number;
  timeStamp?: Date | number;
  snapToCenter?: boolean;
  column?: string;
  row?: string;
}

import { Directive, ElementRef, Input, OnInit, HostListener, EventEmitter } from '@angular/core';

export interface NgFxEvent {
  type: string;
  endFrame?: boolean;
  control: NgFxControl;
}

export interface NgFxControl {
  name: string;
  orient: string;
  min: number | number[];
  max: number | number[];
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
}

@Directive({
  selector: '[ngfxDraggable]'
})
export class NgFxDraggableDirective implements OnInit {
  private _rect: ClientRect | DOMRect;
  private _joystickPos: number[];
  private _touchItem: number | null;
  private _elem: HTMLElement;
  private _handle: HTMLElement;
  private _timeout: number;
  private _animation: Animation;
  private _lastPos: AnimationKeyFrame;
  public cancelMaster: boolean;
  public onUpdate: EventEmitter<NgFxEvent>;

  @Input('control')
  control: NgFxControl;

  constructor(private _el: ElementRef) {
    this._elem = _el.nativeElement;
    this.onUpdate = new EventEmitter();
  }

  ngOnInit() {
    const nodeList: HTMLElement[] = <HTMLElement[]>(<any>this._elem.getElementsByClassName('ngfx__handle'));

    this._touchItem = null;
    this._handle = nodeList[0];
    this.control.height = this._elem.clientHeight;
    this.control.width = this._elem.clientWidth;

    if (this.control.orient === 'is--hor') {
      this.control.currentValue = 0;
      this.control.position = 'translate(' + 0 + 'px' + ',' + 0 + 'px' + ')';
    } else if (this.control.orient === 'is--vert') {
      this.control.currentValue = 0;
      this.control.position = 'translate(' + 0 + 'px' + ',' + 0 + 'px' + ')';
    } else if (this.control.orient === 'is--joystick') {
      this.control.currentValue = [0, 0];
      this.control.x = this.control.y = 76;
      this.control.position = 'translate(' + 76 + 'px' + ',' + 76 + 'px' + ')';
    }
    this._lastPos = { transform: this.control.position };
    this.setActualPosition(this.control.position);
    // TODO init based on this.control.currentValue
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(e: MouseEvent) {
    // this.control.hasUserInput = false;
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(e: MouseEvent) {
    if (this.control.isActive) {
      this.control.hasUserInput = true;
      this.cancelMaster = true;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.cancelMaster = true;
    this.onTouchDown(e);
  }

  onTouchDown(e: TouchEvent) {
    e.preventDefault();

    this.control.isActive = true;
    this.control.hasUserInput = true;

    this._rect = this._elem.getBoundingClientRect();
    this.control.height = this._elem.clientHeight;
    this.control.width = this._elem.clientWidth;

    this._elem.addEventListener('touchmove', this.onTouchMove.bind(this));
    this._elem.addEventListener('touchend', this.onMouseUp.bind(this));

    if (this._touchItem === null) {
      // make this touch = the latest touch in the touches list instead of using event
      this._touchItem = e.touches.length - 1;
    }

    this.control.x = e.touches[this._touchItem].pageX - this._rect.left - this._handle.clientWidth / 2;
    this.control.y = e.touches[this._touchItem].pageY - this._rect.top - this._handle.clientWidth / 2;

    this.setPosition(this.control.x, this.control.y);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(e: MouseEvent) {
    e.preventDefault();

    this.control.isActive = true;
    this.control.hasUserInput = true;

    this._rect = this._elem.getBoundingClientRect();
    this.control.height = this._elem.clientHeight;
    this.control.width = this._elem.clientWidth;
    this.control.x = e.offsetX;
    this.control.y = e.offsetY;

    this._elem.addEventListener('mousemove', this.onMouseMove.bind(this));
    this._elem.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.setPosition(this.control.x, this.control.y);
  }

  // Handle drag event
  onTouchMove(e: TouchEvent) {
    e.preventDefault();

    this._handle.style.opacity = '0.5';

    if (this._touchItem === null) {
      this._touchItem = e.touches.length - 1; // make this touch = the latest touch in the touches list instead of using event
    }

    this.control.x = e.touches[this._touchItem].pageX - this._rect.left - 22;
    this.control.y = e.touches[this._touchItem].pageY - this._rect.top - 66;

    this.setPosition(this.control.x, this.control.y);

    if (this.control.orient === 'is--hor') {
      this.control.currentValue = this.scale(
        this.control.x,
        0,
        this.control.width - 44,
        <number>this.control.min,
        <number>this.control.max
      );
    } else if (this.control.orient === 'is--vert') {
      this.control.currentValue = this.scale(
        this.control.y,
        0,
        this.control.height - 44,
        <number>this.control.min,
        <number>this.control.max
      );
    } else if (this.control.orient === 'is--joystick') {
      this.control.currentValue = [
        this.scale(this.control.x, 0, this.control.width - 44, this.control.min[0], this.control.max[0]),
        this.scale(this.control.y, 0, this.control.height - 44, this.control.min[1], this.control.max[1])
      ];
    }

    this.control.timeStamp = e.timeStamp;

    this.repeatEvent();
  }

  onMouseMove(e: MouseEvent) {
    const parent = <HTMLElement>(<HTMLElement>e.target).parentNode;

    if (this.control.isActive && parent === this._elem) {
      this._handle.style.opacity = '0.5';
      this.control.x = e.offsetX;
      this.control.y = e.offsetY;
    } else {
      this._handle.style.opacity = '0.5';
      this.control.x = (this._elem.getBoundingClientRect().left - e.offsetX) * -1;
      this.control.y = (this._elem.getBoundingClientRect().top - e.offsetY) * -1;
    }

    if (this.control.hasUserInput && this.control.isActive) {
      this.setPosition(this.control.x, this.control.y);

      if (this.control.orient === 'is--hor') {
        this.control.currentValue = this.scale(
          this.control.x,
          0,
          this.control.width - 44,
          <number>this.control.min,
          <number>this.control.max
        );
      }
      if (this.control.orient === 'is--vert') {
        this.control.currentValue = this.scale(
          this.control.y,
          0,
          this.control.height - 44,
          <number>this.control.min,
          <number>this.control.max
        );
      }
      if (this.control.orient === 'is--joystick') {
        this.control.currentValue = [
          this.scale(this.control.x, 0, this.control.width - 44, this.control.min[0], this.control.max[0]),
          this.scale(this.control.y, 0, this.control.height - 44, this.control.min[1], this.control.max[1])
        ];
      }

      this.control.timeStamp = e.timeStamp;

      this.repeatEvent();
    }
  }

  // Unbind drag events
  @HostListener('mouseup', ['$event'])
  onMouseUp(e: MouseEvent | TouchEvent) {
    this.control.isActive = false;
    this.control.hasUserInput = false;
    this._handle.style.opacity = '';

    if ('ontouchstart' in document.documentElement) {
      this._touchItem = null;
    } else {
      this._elem.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this._elem.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }

    if (this.control.orient === 'is--joystick' && this.control.snapToCenter === true) {
      const center = this.getCenter(
        [0, this.control.width - this._handle.offsetWidth],
        [0, this.control.height - this._handle.offsetHeight]
      );
      this.control.x = center[0];
      this.control.y = center[1];
      this.setPosition(center[0], center[1]);
    }

    this.onUpdate.emit({
      type: 'change',
      control: this.control
    });

    this.cancelMaster = false;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    this.onMouseUp(e);
  }

  repeatEvent() {
    clearTimeout(this._timeout);
    this.onUpdate.emit({
      type: 'change',
      control: this.control
    });

    if (this.control.isActive === false) {
      this._timeout = window.setTimeout(() => {
        this.onUpdate.emit({
          type: 'change',
          endFrame: true,
          control: this.control
        });
      }, 300);
    }
  }

  // Get Center of Circle

  getCenter(xRange: number[], yRange: number[]) {
    const cX = xRange[1] - (xRange[1] - xRange[0]) / 2;
    const cY = yRange[1] - (yRange[1] - yRange[0]) / 2;
    return [cX, cY];
  }

  // Distance Between Two Points

  distance(dot1: number[], dot2: number[]) {
    const x1 = dot1[0],
      y1 = dot1[1],
      x2 = dot2[0],
      y2 = dot2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  // Convert between two ranges, for outputting user value

  scale(v: number, min: number, max: number, gmin: number, gmax: number) {
    return ((v - min) / (max - min)) * (gmax - gmin) + gmin;
  }

  // Find if cursor is within radius of elem

  circularBounds(x: number, y: number, xRange: number[], yRange: number[]) {
    const center = this.getCenter(xRange, yRange);
    const dist = this.distance([x, y], center);
    const radius = xRange[1] - center[0];

    if (dist <= radius) {
      return [x, y];
    } else {
      x = x - center[0];
      y = y - center[1];
      const radians = Math.atan2(y, x);
      return [Math.cos(radians) * radius + center[0], Math.sin(radians) * radius + center[1]];
    }
  }

  clamp(value, range) {
    return Math.max(Math.min(value, range[1]), range[0]);
  }

  setActualPosition(pos: string) {
    const transformRegex = new RegExp(/(\d+(\.\d+)?)/g);
    const positions = pos.match(transformRegex);
    this._handle.style.transform = 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + positions[0] + ',' + positions[1] + ',0,1)';
  }

  // Move handle, within elem

  setPosition(x: number, y: number) {
    if (this.control.orient === 'is--joystick') {
      this._joystickPos = this.circularBounds(
        this.control.x,
        this.control.y,
        [0, this.control.width - this._handle.offsetWidth],
        [0, this.control.height - this._handle.offsetHeight]
      );
      this.control.x = this.clamp(this._joystickPos[0], [0, this.control.width - this._handle.offsetWidth]);
      this.control.y = this.clamp(this._joystickPos[1], [0, this.control.height - this._handle.offsetHeight]);

      this.control.position = 'translate(' + this.control.x + 'px' + ',' + this.control.y + 'px' + ')';
      this.setActualPosition(this.control.position);
    } else {
      if (x <= 0) {
        this.control.x = 0;
      } else if (x > this._elem.clientWidth - this._handle.offsetWidth) {
        this.control.x = this._elem.clientWidth - this._handle.offsetWidth;
      } else {
        this.control.x = x;
      }

      if (y <= 0) {
        this.control.y = 0;
      } else if (y > this._elem.clientHeight - this._handle.offsetHeight) {
        this.control.y = this._elem.clientHeight - this._handle.offsetHeight;
      } else {
        this.control.y = y;
      }

      this.control.position = 'translate(' + this.control.x + 'px' + ',' + this.control.y + 'px' + ')';
      this.setActualPosition(this.control.position);
    }
  }
}

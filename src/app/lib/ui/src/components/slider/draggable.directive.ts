import { Directive, ElementRef, Input, OnInit, HostListener, EventEmitter } from '@angular/core';

export interface NgFxUI {
    position: string
}

export interface NgFxEvent {
  type: string,
  currentValue: number | number[],
  timeStamp: Date,
  endFrame?: boolean,
  control?: string,
  ui: NgFxUI
}

export interface NgFxDraggableOptions {
  name: string,
  orient: string,
  min: number | number[],
  max: number | number[],
  isActive?: boolean,
  currentValue?: number | number[],
  position?: string,
  x?: number,
  y?: number,
  float?: string,
  isControlled?: boolean,
  height?: number,
  width?: number,
  timeStamp?: Date,
  onUpdate?: EventEmitter<NgFxEvent>,
  onSlave?: EventEmitter<NgFxEvent>,
  slave?: EventEmitter<NgFxEvent>
}

@Directive({
  selector: '[draggable]'
})

export class NgFxDraggableDirective implements OnInit {

  public elem: any;
  public handle: any;
  public startX: number;
  public startY: number;
  public newX: number;
  public newY: number;
  public joystickPos: number[];
  public target: any;
  public touchItem: any;
  public height: number;
  public width: number;
  public isActive: boolean;
  public isPositionable: boolean;
  public hasMasterController: boolean;
  public cancelMaster: boolean;
  public rect: any;
  public position: string;
  private timeout: any;

  @Input('draggable') draggable: NgFxDraggableOptions;

  constructor(private el: ElementRef) {

    this.elem = el.nativeElement;
    this.hasMasterController = false;

  }

  ngOnInit() {

    this.handle = this.elem.getElementsByClassName('ngfx__slider__handle')[0];
    this.height = this.elem.clientHeight;
    this.width = this.elem.clientWidth;
    this.draggable.height = this.height;
    this.draggable.width = this.width;

    if (this.draggable.orient === 'is--hor') {
      this.draggable.currentValue = 0;
      this.position = 'translate3d(' + 0 + 'px' + ',' + 0 + 'px' + ',' + 1 + 'px' + ')';
    } else if (this.draggable.orient === 'is--vert') {
      this.draggable.currentValue = 0;
      this.position = 'translate3d(' + 0 + 'px' + ',' + 0 + 'px' + ',' + 1 + 'px' + ')';
    } else if (this.draggable.orient === 'is--joystick') {
      this.draggable.currentValue = [0,0];
      this.newX = this.newY = 76;
      this.position = 'translate3d(' + 76 + 'px' + ',' + 76 + 'px' + ',' + 1 + 'px' + ')';
    }

    //this.slaveListener();

    // TODO init based on this.draggable.currentValue

  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(e) {
    this.isPositionable = false;
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(e) {
    if (this.isActive) {
      this.isPositionable = true;
      this.cancelMaster = true;
    }
  }

  @HostListener('touchstart', ['$event']) onTouchStart(e) {
      this.cancelMaster = true;
      this.draggable.isControlled = false;
      this.onMouseDown(e);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(e) {

    e.preventDefault();

    this.isActive = true;
    this.isPositionable = true;
    this.draggable.isControlled = false;

    this.startX = e.clientX - this.elem.offsetLeft;
    this.startY = e.clientY - this.elem.offsetTop;

    this.rect = this.elem.getBoundingClientRect();
    this.height = this.elem.clientHeight;
    this.width = this.elem.clientWidth;
    this.draggable.height = this.height;
    this.draggable.width = this.width;


    if ('ontouchstart' in document.documentElement) {
      this.elem.addEventListener('touchmove', this.onTouchMove.bind(this));
      this.elem.addEventListener('touchend', this.onMouseUp.bind(this));
    } else {
      this.elem.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.elem.addEventListener('mouseup', this.onMouseUp.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    if ('ontouchstart' in document.documentElement) {
      e.preventDefault();

      if (this.touchItem === undefined) {
        this.touchItem = e.touches.length - 1; // make this touch = the latest touch in the touches list instead of using event
      }

      this.newX = e.touches[this.touchItem].pageX - this.rect.left - (this.handle.clientWidth / 2);
      this.newY = e.touches[this.touchItem].pageY - this.rect.top - (this.handle.clientWidth / 2);

    } else {

      this.newX = e.offsetX;
      this.newY = e.offsetY;

    }

    this.setPosition(this.newX, this.newY);

  }


  // Handle drag event
  onTouchMove(e) {

    e.preventDefault();

    this.handle.style.opacity = '0.5';

    if (this.touchItem === undefined) {
      this.touchItem = e.touches.length - 1; // make this touch = the latest touch in the touches list instead of using event
    }

    this.newX = e.touches[this.touchItem].pageX - this.rect.left - 22;
    this.newY = e.touches[this.touchItem].pageY - this.rect.top - 66;

    this.setPosition(this.newX, this.newY);

    if (this.draggable.orient === 'is--hor') {
      this.draggable.currentValue = this.scale(this.newX, 0, this.width - 44, this.draggable.min, this.draggable.max);
    } else if (this.draggable.orient === 'is--vert') {
      this.draggable.currentValue = this.scale(this.newY, 0, this.height - 44, this.draggable.min, this.draggable.max);
    } else if (this.draggable.orient === 'is--joystick') {
      this.draggable.currentValue = [this.scale(this.newX, 0, this.width - 44, this.draggable.min[0], this.draggable.max[0]),
        this.scale(this.newY, 0, this.height - 44, this.draggable.min[1], this.draggable.max[1])
      ];
    }

    this.draggable.timeStamp = e.timeStamp;

    if (this.draggable.onUpdate) {
      this.repeatEvent();
    }

  }

  onMouseMove(e) {

    if (this.isActive) {
      this.handle.style.opacity = '0.5';
      this.newX = e.offsetX;
      this.newY = e.offsetY;
    }

    if (this.isPositionable && this.isActive) {

      this.setPosition(this.newX, this.newY);

      if (this.draggable.orient === 'is--hor') {
        this.draggable.currentValue = this.scale(this.newX, 0, this.width - 44, this.draggable.min, this.draggable.max);
      }
      if (this.draggable.orient === 'is--vert') {
        this.draggable.currentValue = this.scale(this.newY, 0, this.height - 44, this.draggable.min, this.draggable.max);
      }
      if (this.draggable.orient === 'is--joystick') {
        this.draggable.currentValue = [this.scale(this.newX, 0, this.width - 44, this.draggable.min[0], this.draggable.max[0]),
          this.scale(this.newY, 0, this.height - 44, this.draggable.min[1], this.draggable.max[1])
        ];
      }

      this.draggable.timeStamp = e.timeStamp;

      if (this.draggable.onUpdate) {
        this.repeatEvent();
      }

    }

  }

  // Unbind drag events
  @HostListener('mouseup', ['$event']) onMouseUp(e) {

    this.isActive = false;
    this.handle.style.opacity = '';

    // TODO: set cancel flag? these value just happen to work b/c of current min and max

    if ('ontouchstart' in document.documentElement) {
      this.touchItem = undefined;
    } else {
      this.elem.removeEventListener('mousemove', this.onMouseMove.bind(this));
      this.elem.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }


    //if (this.draggable.onUpdate) {
      this.draggable.onUpdate.emit({
                                    type: 'change',
                                    currentValue: this.draggable.currentValue,
                                    timeStamp: e.timeStamp,
                                    ui: {
                                      position: this.position
                                    }
                                  });
    //}

    this.cancelMaster = false;

  }

  @HostListener('touchend', ['$event']) onTouchEnd(e) {
      this.onMouseUp(e);
  }

  repeatEvent() {
    if (this.draggable.isControlled === false) {
      clearTimeout(this.timeout);
    }
    this.draggable.onUpdate.emit({
                                    type: 'change',
                                    currentValue: this.draggable.currentValue,
                                    timeStamp: this.draggable.timeStamp,
                                    ui: {
                                        position: this.position
                                    }
                                  });
    if (this.draggable.isControlled === false && this.draggable.isActive === false) {
      this.timeout = setTimeout(() => {
        this.draggable.onUpdate.emit({
                                        type: 'change',
                                        endFrame: true,
                                        control: this.draggable.name,
                                        currentValue: this.draggable.currentValue,
                                        timeStamp: this.draggable.timeStamp,
                                        ui: {
                                          position: this.position
                                        }
                                      });
      }, 300);
    }

  }


  // Get Center of Circle
  getCenter(xRange, yRange) {

    let cX = xRange[1] - ((xRange[1] - xRange[0]) / 2);
    let cY = yRange[1] - ((yRange[1] - yRange[0]) / 2);
    return [cX, cY];

  }

  // Distance Between Two Points
  distance(dot1, dot2) {
    let x1 = dot1[0],
      y1 = dot1[1],
      x2 = dot2[0],
      y2 = dot2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  // convert between two ranges, for outputting user value

  scale(v, min, max, gmin, gmax) {

    return ((v - min) / (max - min)) * (gmax - gmin) + gmin;

  }

  // Find if cursor is within radius of elem

  circularBounds(x, y, xRange, yRange) {

    let center = this.getCenter(xRange, yRange);
    let dist = this.distance([x, y], center);
    let radius = xRange[1] - center[0];

    if (dist <= radius) {
      return [x, y];
    } else {
      x = x - center[0];
      y = y - center[1];
      let radians = Math.atan2(y, x);
      return [Math.cos(radians) * radius + center[0], Math.sin(radians) * radius + center[1]];

    }

  }

  clamp(value, range) {
    return Math.max(Math.min(value, range[1]), range[0]);
  }

  // Move handle, within elem
  setPosition(x, y) {

    if (this.draggable.orient === 'is--joystick') {

      if (x <= 0) {
        this.newX = 0;
      } else if (x > this.width) {
        this.newX = this.width;
      } else {
        this.newX = x;
      }

      if (y <= 0) {
        this.newY = 0;
      } else if (y > this.height) {
        this.newY = this.height;
      } else {
        this.newY = y;
      }


      this.joystickPos = this.circularBounds(this.newX,
                                             this.newY,
                                             [0, this.width - this.handle.offsetWidth],
                                             [0, this.height - this.handle.offsetHeight]);
      this.newX = this.clamp(this.joystickPos[0], [0, this.width - this.handle.offsetWidth]);
      this.newY = this.clamp(this.joystickPos[1], [0, this.height - this.handle.offsetHeight]);

      // this.draggable.node.translate = [this.newX, this.newY, 1];
      this.position = 'translate3d(' + this.newX + 'px' + ',' + this.newY + 'px' + ',' + 1 + 'px' + ')';
      // this.draggable.onUpdate.emit({type: 'sliderPosition', position: [this.newX + 'px', this.newY + 'px', 1 + 'px']});
      // TODO: figure out why width and height need to be hardcoded.

    } else {

      if (x <= 0) {
        this.newX = 0;
      } else if (x > this.elem.clientWidth - this.handle.offsetWidth) {
        this.newX = this.elem.clientWidth - this.handle.offsetWidth;
      } else {
        this.newX = x;
      }

      if (y <= 0) {
        this.newY = 0;
      } else if (y > this.elem.clientHeight - this.handle.offsetHeight) {
        this.newY = this.elem.clientHeight - this.handle.offsetHeight;
      } else {
        this.newY = y;
      }

      this.position = 'translate3d(' + this.newX + 'px' + ',' + this.newY + 'px' + ',' + 1 + 'px' + ')';

    }


  }

  slaveListener() {

    this.draggable.slave.subscribe((control)=>{

      if (control.endFrame === true) {
        this.draggable.isControlled = false;
        this.draggable.onSlave.emit({
                                      type: 'change',
                                      currentValue: this.draggable.currentValue,
                                      timeStamp: this.draggable.timeStamp,
                                      ui: {
                                        position: this.position
                                      }
                                    });
      } else {
        if (this.draggable.isControlled === false) {
          clearTimeout(this.timeout);
        }
        this.isActive = true;
        this.draggable.isControlled = true;
        this.position = control.ui.position;
        this.draggable.currentValue = control.currentValue;
        this.draggable.timeStamp = new Date();
        this.draggable.onSlave.emit({
                                      type: 'change',
                                      currentValue: this.draggable.currentValue,
                                      timeStamp: this.draggable.timeStamp,
                                      ui: {
                                            position: this.position
                                          }
                                    });
        if (!this.draggable.isControlled && !this.draggable.isActive) {
          this.timeout = setTimeout(() => {
          this.draggable.onUpdate.emit({
                                          type: 'change',
                                          endFrame: true,
                                          control: this.draggable.name,
                                          currentValue: this.draggable.currentValue,
                                          timeStamp: this.draggable.timeStamp,
                                          ui: {
                                            position: this.position
                                          }
                                        });
          }, 300);
        }
      }

    });

  }



}

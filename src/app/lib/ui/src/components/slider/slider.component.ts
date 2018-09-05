import { Component, EventEmitter, ElementRef, ChangeDetectorRef, Input, OnInit, HostBinding } from '@angular/core';
import { NgFxDraggableOptions } from './draggable.directive';

@Component({
  selector: 'ngfx-slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.css']
})

export class NgFxSliderComponent implements OnInit {

  public transform: string;

  @Input('options') options: NgFxDraggableOptions;
  @HostBinding('style.float') float: string;

  constructor(private _ref: ChangeDetectorRef,
              private _elem: ElementRef) {

    this.transform = 'translate3d(0px, 0px, 1px)';

  }

  ngOnInit() {

    if (this.options.float) {
      this.float = this.options.float;
    }

    if (this.options.orient === 'is--joystick') {
      this.transform = 'translate3d(' + 76 + 'px,' + 76 + 'px,' + 1 + 'px)';
    }

    this.options.onUpdate.subscribe((data) => {

      if (data['ui'] && data['ui']['position']) {
        this.transform = data['ui']['position'];
      }

    });

    // TODO: Position with matrix3D transform or use web animations api?

  }

  hasName() {
    return this.options.name !== undefined && this.options.name.length > 0;
  }

}

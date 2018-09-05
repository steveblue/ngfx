import { NgFxDraggableOptions } from './../../../lib/ui/src/components/slider/draggable.directive';
import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {

  public vertControl: NgFxDraggableOptions = {
    name: 'slider',
    orient: 'is--vert',
    min: 0,
    max: 255,
    onUpdate: new EventEmitter()
  };

  public joyControl: NgFxDraggableOptions = {
    name: 'joystick',
    orient: 'is--joystick',
    min: [0, 0],
    max: [255, 255],
    onUpdate: new EventEmitter()
  };

  constructor() { }

  ngOnInit() {
  }

}
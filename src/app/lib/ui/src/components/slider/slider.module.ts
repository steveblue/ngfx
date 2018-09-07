import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgFxSliderComponent } from './slider.component';
import { NgFxDraggableDirective } from './draggable.directive';

export * from './draggable.directive';
export * from './slider.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgFxDraggableDirective, NgFxSliderComponent],
  exports: [NgFxDraggableDirective, NgFxSliderComponent]
})
export class NgFxSliderModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxSurfaceComponent } from './surface.component';
import { NgFxSliderModule } from './../slider/slider.module';
import { NgFxButtonModule } from './../button/button.module';

export * from './surface.component';

@NgModule({
  imports: [CommonModule, NgFxSliderModule, NgFxButtonModule],
  declarations: [NgFxSurfaceComponent],
  exports: [NgFxSurfaceComponent]
})
export class NgFxSurfaceModule {}

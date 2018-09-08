import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgfxSurfaceComponent } from './surface.component';
import { NgFxSliderModule } from './../slider/slider.module';

@NgModule({
  imports: [CommonModule, NgFxSliderModule],
  declarations: [NgfxSurfaceComponent],
  exports: [NgfxSurfaceComponent]
})
export class NgfxSurfaceModule {}

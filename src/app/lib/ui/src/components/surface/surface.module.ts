import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxSurfaceComponent } from './surface.component';
import { NgFxControlModule } from './../../directives/control/control.module';
import { NgFxSliderModule } from './../slider/slider.module';
import { NgFxButtonModule } from './../button/button.module';
import { NgFxToggleModule } from './../toggle/toggle.module';

export * from './surface.component';

@NgModule({
  imports: [CommonModule, NgFxSliderModule, NgFxButtonModule, NgFxToggleModule, NgFxControlModule],
  declarations: [NgFxSurfaceComponent],
  exports: [NgFxSurfaceComponent]
})
export class NgFxSurfaceModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { NgFxController } from './../../../lib/ui/src/services/controller/controller.service';
import { NgFxSliderModule } from './../../../lib/ui/src/components/slider/slider.module';
import { NgfxSurfaceModule } from './../../../lib/ui/src/components/surface/surface.module';

@NgModule({
  imports: [CommonModule, NgFxSliderModule, NgfxSurfaceModule],
  declarations: [UiComponent],
  providers: [NgFxController]
})
export class UiModule {}

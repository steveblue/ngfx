import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { NgFxController } from './../../../lib/ui/src/services/controller/controller.service';
import { NgFxSliderModule } from './../../../lib/ui/src/components/slider/slider.module';
import { NgFxSurfaceModule } from './../../../lib/ui/src/components/surface/surface.module';
import { NgFxButtonModule } from './../../../lib/ui/src/components/button/button.module';

@NgModule({
  imports: [CommonModule, NgFxSurfaceModule, NgFxSliderModule, NgFxButtonModule],
  declarations: [UiComponent],
  providers: [NgFxController]
})
export class UiModule {}

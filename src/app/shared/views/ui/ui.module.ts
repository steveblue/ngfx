import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { NgFxController } from './../../../lib/ui/src/services/controller/controller.service';
import { NgFxSliderModule } from './../../../lib/ui/src/components/slider/slider.module';
import { NgFxSurfaceModule } from './../../../lib/ui/src/components/surface/surface.module';
import { NgFxButtonModule } from './../../../lib/ui/src/components/button/button.module';
import { NgFxToggleModule } from './../../../lib/ui/src/components/toggle/toggle.module';
import { NgFxAudioPlayerModule } from './../../../lib/ui/src/components/audio-player/audio-player.module';

@NgModule({
  imports: [CommonModule, NgFxAudioPlayerModule, NgFxSurfaceModule, NgFxSliderModule, NgFxButtonModule, NgFxToggleModule],
  declarations: [UiComponent],
  providers: [NgFxController]
})
export class UiModule {}

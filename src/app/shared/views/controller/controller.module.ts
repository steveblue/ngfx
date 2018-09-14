import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerComponent } from './controller.component';
import { NgFxController } from './../../../lib/ui/src/services/controller/controller.service';
import { NgFxSliderModule } from './../../../lib/ui/src/components/slider/slider.module';
import { NgfxSurfaceModule } from './../../../lib/ui/src/components/surface/surface.module';
import { uuid, DataChannelModule } from './../../../lib/rtc/src/services/data-channel/data-channel.module';

const DataChannelConfig = {
  key: 'XXXXX',
  id: uuid(),
  signalServer: `wss://localhost:4444/signal`,
  announceServer: `wss://localhost:4444/announce`,
  messageServer: `wss://localhost:4444/message`,
  debug: false
};

@NgModule({
  imports: [CommonModule, NgFxSliderModule, NgfxSurfaceModule, DataChannelModule.forChild(DataChannelConfig)],
  declarations: [ControllerComponent],
  providers: [NgFxController]
})
export class ControllerModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerTestComponent } from './controller-test.component';
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
  imports: [CommonModule, DataChannelModule.forChild(DataChannelConfig)],
  declarations: [ControllerTestComponent]
})
export class ControllerTestModule {}

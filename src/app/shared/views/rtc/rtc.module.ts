import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtcComponent } from './rtc.component';
import { uuid, DataChannelModule } from './../../../lib/rtc/src/services/data-channel/data-channel.module';

const DataChannelConfig = {
  key: 'openSeasame',
  id: uuid(),
  signalServer: `wss://localhost:4444/signal`,
  announceServer: `wss://localhost:4444/announce`,
  messageServer: `wss://localhost:4444/message`,
  debug: true
};

@NgModule({
  imports: [CommonModule, DataChannelModule.forChild(DataChannelConfig)],
  declarations: [RtcComponent]
})
export class RtcModule {}

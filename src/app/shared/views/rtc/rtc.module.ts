import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtcComponent } from './rtc.component';
import { uuid, DataChannelModule } from './../../../lib/rtc/src/services/data-channel/data-channel.module';

const DataChannelConfig = {
  key: 'openSeasame',
  id: uuid(),
  signalServer: `ws://localhost:5555`,
  announceServer: `ws://localhost:5556`,
  messageServer: `ws://localhost:5557`,
  debug: true
};

@NgModule({
  imports: [CommonModule, DataChannelModule.forChild(DataChannelConfig)],
  declarations: [RtcComponent]
})
export class RtcModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { routing } from './app.routes';

import { RtcModule } from './shared/views/rtc/rtc.module';
import { UiModule } from './shared/views/ui/ui.module';

import { DataChannelModule } from './lib/rtc/src/services/data-channel/data-channel.module';

const uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DataChannelConfig = {
  key: 'openSeasame',
  id: uuid(),
  signalServer: `ws://localhost:5555`,
  announceServer: `ws://localhost:5556`,
  messageServer: `ws://localhost:5557`,
  debug: true
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RtcModule,
    UiModule,
    DataChannelModule.forRoot(DataChannelConfig),
    routing
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxAudioPlayerComponent } from './audio-player.component';
import { NgFxToggleModule } from './../toggle/toggle.module';
import { NgFxButtonModule } from './../button/button.module';
import { NgFxSliderModule } from './../slider/slider.module';
import { NgFxControlModule } from './../../directives/control/control.module';

@NgModule({
  imports: [CommonModule, NgFxSliderModule, NgFxButtonModule, NgFxToggleModule, NgFxControlModule],
  declarations: [NgFxAudioPlayerComponent],
  exports: [NgFxAudioPlayerComponent]
})
export class NgFxAudioPlayerModule {}

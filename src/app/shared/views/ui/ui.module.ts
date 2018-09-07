import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponent } from './ui.component';
import { NgFxSliderModule } from './../../../lib/ui/src/components/slider/slider.module';

@NgModule({
  imports: [CommonModule, NgFxSliderModule],
  declarations: [UiComponent]
})
export class UiModule {}

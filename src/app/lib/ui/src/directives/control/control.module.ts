import { NgFxSurfaceDirective } from './surface.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxControlDirective } from './control.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [NgFxControlDirective, NgFxSurfaceDirective],
  exports: [NgFxControlDirective, NgFxSurfaceDirective]
})
export class NgFxControlModule {}

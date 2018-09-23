import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxToggleComponent } from './toggle.component';

export * from './toggle.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgFxToggleComponent],
  exports: [NgFxToggleComponent]
})
export class NgFxToggleModule {}

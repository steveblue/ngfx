import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFxButtonComponent } from './button.component';

export * from './button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgFxButtonComponent],
  exports: [NgFxButtonComponent]
})
export class NgFxButtonModule {}

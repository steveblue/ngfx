import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControllerTestComponent } from './shared/views/controller-test/controller-test.component';
import { ControllerComponent } from './shared/views/controller/controller.component';
import { RtcComponent } from './shared/views/rtc/rtc.component';
import { UiComponent } from './shared/views/ui/ui.component';

const routes: Routes = [
  { path: '', component: RtcComponent },
  { path: 'ui', component: UiComponent },
  {
    path: 'controls',
    children: [
      {
        path: '',
        component: ControllerComponent
      },
      {
        path: 'test',
        component: ControllerTestComponent
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

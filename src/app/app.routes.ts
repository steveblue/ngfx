import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RtcComponent } from './shared/views/rtc/rtc.component';
import { UiComponent } from './shared/views/ui/ui.component';

const routes: Routes = [{ path: '', component: RtcComponent }, { path: 'ui', component: UiComponent }];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

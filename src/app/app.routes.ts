import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/views/home/home.component';
import { LazyComponent } from './shared/views/lazy/lazy.component';
import { RtcComponent } from './shared/views/rtc/rtc.component';
import { UiComponent } from './shared/views/ui/ui.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lazy', component: LazyComponent },
  { path: 'rtc', component: RtcComponent },
  { path: 'ui', component: UiComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
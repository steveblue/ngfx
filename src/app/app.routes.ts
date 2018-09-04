import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/views/home/home.component';
import { LazyComponent } from './shared/views/lazy/lazy.component';
import { RtcComponent } from './shared/views/rtc/rtc.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lazy', component: LazyComponent },
  { path: 'rtc', component: RtcComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
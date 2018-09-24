import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgFxAudioContextService } from './audio.service';

export * from './audio.service';

@NgModule()
export class NgFxAudioModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgFxAudioModule,
      providers: [NgFxAudioContextService]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: NgFxAudioModule,
      providers: [NgFxAudioContextService]
    };
  }
}

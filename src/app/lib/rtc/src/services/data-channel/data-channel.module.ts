import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgFxDataChannel, NgFxDataChannelConfig, NgFxDataChannelConfigService } from './data-channel.service';

export * from './data-channel.service';

@NgModule()
export class DataChannelModule {
  static forRoot(config: NgFxDataChannelConfig): ModuleWithProviders {
    return {
      ngModule: DataChannelModule,
      providers: [
        NgFxDataChannel,
        {
          provide: NgFxDataChannelConfigService,
          useValue: config
        }
      ]
    };
  }

  static forChild(config: NgFxDataChannelConfig): ModuleWithProviders {
    return {
      ngModule: DataChannelModule,
      providers: [
        NgFxDataChannel,
        {
          provide: NgFxDataChannelConfigService,
          useValue: config
        }
      ]
    };
  }
}

import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgToolsDataChannel, NgToolsDataChannelConfig, NgToolsDataChannelConfigService } from './data-channel.service';

export * from './data-channel.service';

@NgModule()
export class DataChannelModule {

  static forRoot(config:NgToolsDataChannelConfig): ModuleWithProviders {
    return {
      ngModule: DataChannelModule,
      providers: [
        NgToolsDataChannel,
        {
          provide: NgToolsDataChannelConfigService,
          useValue: config
        }
      ]
    }
  }

  static forChild(config:NgToolsDataChannelConfig): ModuleWithProviders {
    return {
      ngModule: DataChannelModule,
      providers: [
        NgToolsDataChannel,
        {
          provide: NgToolsDataChannelConfigService,
          useValue: config
        }
      ]
    }
  }

}

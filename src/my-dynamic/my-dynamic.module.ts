import { DynamicModule, Module } from '@nestjs/common';

export type MyDynamicMdduleConfigs = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_CONFIG = 'MY_DYNAMIC_CONFIG';

@Module({})
export class MyDynamicMddule {
  static register(config: MyDynamicMdduleConfigs): DynamicModule {
    return {
      module: MyDynamicMddule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_CONFIG,
          useValue: config,
        },
      ],
      controllers: [],
      exports: [],
    };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from './global.config';

@Module({
  imports: [ConfigModule.forFeature(globalConfig)],
  providers: [
    {
      provide: 'globalConfig',
      useFactory: (configService: ConfigType<typeof globalConfig>) =>
        configService,
      inject: [globalConfig.KEY || 'globalConfig'],
    },
  ],
  exports: ['globalConfig'],
})
export class GlobalConfigModule {}

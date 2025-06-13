import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigType } from '@nestjs/config';
import globalConfig from 'src/global-config/global.config';
//import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    @Inject('globalConfig')
    private readonly appConfiguration: ConfigType<typeof globalConfig>,
  ) {}

  @Get()
  getHello(): string {
    return 'Qualquer coisa';
  }
}

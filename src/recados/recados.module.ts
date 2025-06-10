import { Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';

@Module({
  providers: [RecadosService],
  controllers: [RecadosController],
})
export class RecadosModule {}

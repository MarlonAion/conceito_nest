import { forwardRef, Module } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadosController } from './recados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from 'src/recados/entities/recado.entity';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadoUtils } from './recados.utils';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Recado]),
    forwardRef(() => PessoasModule),
  ],
  controllers: [RecadosController],
  providers: [RecadosService, RecadoUtils],

  exports: [RecadoUtils],
})
export class RecadosModule {}

import { PartialType } from '@nestjs/swagger';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @IsBoolean()
  @IsNotEmpty()
  readonly lido?: boolean;
}

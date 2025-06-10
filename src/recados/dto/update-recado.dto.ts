import { PartialType } from '@nestjs/swagger';
import { CreateRecadoDto } from './create-recado.dto';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  // O PartialType cria uma classe que herda de CreateRecadoDto,
  // tornando todos os campos opcionais.
  // Assim, você pode atualizar apenas os campos que deseja modificar.
}

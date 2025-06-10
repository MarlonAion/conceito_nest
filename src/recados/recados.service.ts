import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from 'src/entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: RecadoEntity[] = [
    {
      id: 1,
      texto: 'recado teste',
      de: 'João',
      para: 'Maria',
      lido: false,
      date: new Date(),
    },
  ];

  throwNotFoundError() {
    throw new NotFoundException('Method not implemented.');
  }

  findAll() {
    return this.recados;
  }

  findOne(id: number) {
    return this.recados.find((recado) => recado.id === id);
  }

  cretate(createRecadoDto: CreateRecadoDto) {
    this.lastId++;
    const id = this.lastId;
    const newRecado = {
      id,
      ...createRecadoDto,
      lido: false,
      date: new Date(),
    };

    this.recados.push(newRecado);
    return newRecado;
  }

  update(id: string, UpdateRecadoDto: UpdateRecadoDto) {
    const recadoExistenteIndex = this.recados.findIndex(
      (item) => item.id === +id,
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundError();
    }

    const recadoExistente = this.recados[recadoExistenteIndex];

    this.recados[recadoExistenteIndex] = {
      ...recadoExistente,
      ...UpdateRecadoDto,
    };

    return this.recados[recadoExistenteIndex];
  }

  remove(id: number) {
    const recadoExistenteIndex = this.recados.findIndex(
      (item) => item.id === id,
    );

    if (recadoExistenteIndex < 0) {
      this.throwNotFoundError();
    }
    const recado = this.recados[recadoExistenteIndex];

    this.recados.splice(recadoExistenteIndex, 1);

    return recado;
  }
}

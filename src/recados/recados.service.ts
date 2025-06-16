import {
  Body,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { Recado } from 'src/recados/entities/recado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoasService: PessoasService,
    private readonly configSerive: ConfigService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Method not implemented.');
  }

  ///retornando promise e implementando o async/await diretamente no controller(Get)
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const recado = await this.recadoRepository.find({
      take: limit, //quantos registros serão exibido por pagina
      skip: offset, //quantos registros devem ser pulados
      relations: ['de', 'para'],
      order: {
        id: 'DESC',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recado;
  }

  async findOne(id: number): Promise<Recado> {
    // return this.recados.find((recado) => recado.id === id);
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      order: {
        id: 'desc',
      },
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (!recado) {
      throw new NotFoundException(`Recado com id ${id} não encontrado`);
    }
    return recado;
  }

  async cretate(
    createRecadoDto: CreateRecadoDto,
    tokenPayLoad: TokenPayloadDto,
  ) {
    const { paraId } = createRecadoDto;
    // encontrar a pessoa que esta criando o recado
    const de = await this.pessoasService.findOne(tokenPayLoad.sub);

    const para = await this.pessoasService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      date: new Date(),
    };

    const recado = this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);
    return {
      ...recado,
      de: {
        id: recado.de.id,
        nome: recado.de.nome,
      },
      para: {
        id: recado.para.id,
        nome: recado.para.nome,
      },
    };
  }

  async update(
    id: number,
    updateRecadoDto: UpdateRecadoDto,
    tokenPayLoad: TokenPayloadDto,
  ) {
    const recado = await this.findOne(id);

    if (recado.de.id !== tokenPayLoad.sub) {
      throw new ForbiddenException('esse Recado não é seu');
    }

    recado.texto = updateRecadoDto?.texto ?? recado.texto;
    recado.lido = updateRecadoDto?.lido ?? recado.lido;

    await this.recadoRepository.save(recado);

    return recado;
  }

  async remove(id: number, tokenPayLoad: TokenPayloadDto) {
    const recado = await this.findOne(id);

    if (recado.de.id !== tokenPayLoad.sub) {
      throw new ForbiddenException('esse Recado não é seu');
    }

    if (!recado) return this.throwNotFoundError();

    return await this.recadoRepository.remove(recado);
  }
}

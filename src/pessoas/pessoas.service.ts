import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable({ scope: Scope.DEFAULT })
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password,
      );

      const dadosPessoa = {
        nome: createPessoaDto.nome,
        passwordHash,
        email: createPessoaDto.email,
        routePolicies: createPessoaDto.routePolicies,
      };

      const novaPessoa = this.pessoaRepository.create(dadosPessoa);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23502') {
        throw new ConflictException('Email já cadastrado');
      }

      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        nome: 'desc',
      },
    });
    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return pessoa;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
    tokenPayLoad: TokenPayloadDto,
  ) {
    const partialUpdateRecadoDto = {
      nome: updatePessoaDto?.nome,
      //passwordHash: updatePessoaDto?.password,
    };

    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );

      partialUpdateRecadoDto['passwordHash'] = passwordHash;
    }

    //pre-seleciona a pessoa na base de dados caso exista
    const pessoa = await this.pessoaRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    //se a pessoa não existir lança um erro
    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    //compara pessoa id com pessoa token id
    if (pessoa.id !== tokenPayLoad.sub) {
      throw new ForbiddenException('Você não é uma pessoa.');
    }
    //caso exista salva a pessoa no banco de dados
    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number, tokenPayLoad: TokenPayloadDto) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }

    //compara pessoa id com pessoa token id
    if (pessoa.id !== tokenPayLoad.sub) {
      throw new ForbiddenException('Você não é uma pessoa.');
    }

    return this.pessoaRepository.remove(pessoa);
  }
}

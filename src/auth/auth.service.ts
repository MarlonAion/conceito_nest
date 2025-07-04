import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const pessoa = await this.pessoaRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

    if (!pessoa) {
      throw new UnauthorizedException('Pessoa não autorizada');
    }

    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      pessoa.passwordHash,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha  Invalida');
    }

    return this.createToken(pessoa);
  }

  private async createToken(pessoa: Pessoa) {
    const accessTokenPromise = await this.signJwtAsync<Partial<Pessoa>>(
      pessoa.id,
      this.jwtConfiguration.jwtTtl,
      { email: pessoa.email },
    );

    const refreshTokenPromise = await this.signJwtAsync<Partial<Pessoa>>(
      pessoa.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [refreshToken, accessToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );
      const pessoa = await this.pessoaRepository.findOneBy({
        id: sub,
        active: true,
      });

      if (!pessoa) {
        throw new Error('Pessoa Não Autorizada .');
      }
      return this.createToken(pessoa);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Unauthorized',
      );
    }
  }
}

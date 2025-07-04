import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { RoutePolicyGuard } from './guards/route-policy.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],

  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
    JwtService,
    AuthTokenGuard,
    RoutePolicyGuard,
  ],
  exports: [
    HashingService,
    JwtService,
    ConfigModule,
    TypeOrmModule,
    AuthTokenGuard,
    RoutePolicyGuard,
  ],
})
export class AuthModule {}

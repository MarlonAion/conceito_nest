import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoutePolicies } from 'src/auth/enums/route-policies.enum';

export class CreatePessoaDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  nome: string;

  @IsEnum(RoutePolicies, { each: true })
  routePolicies: RoutePolicies[];
}

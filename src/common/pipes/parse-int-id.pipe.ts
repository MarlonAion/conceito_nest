import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //capturo o valor antes de tgrasnforma-lo
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    //transformo o valor
    const parsedValue = Number(value);

    //validadndo se o valor é um numero
    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParseIntPipe espera uma string numerica ');
    }

    //validadndo se o valor é maior que zero
    if (parsedValue < 0) {
      throw new BadRequestException('ParseIntPipe espera um numero positivo');
    }
    return parsedValue;
  }
}

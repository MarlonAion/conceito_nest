import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegexProtocol } from './regex.protocol';
import { OnlyLowercaseLettersRegex } from './only-lowercase-letters.regex';
import { RemoveSpaceRegex } from './remove-spaces.regex';

export type ClassNames = 'OnlyLowercaseLetter' | 'RemoveSpaceRegex';

@Injectable()
export class RegexFactory {
  create(className: ClassNames): RegexProtocol {
    switch (className) {
      case 'OnlyLowercaseLetter':
        return new OnlyLowercaseLettersRegex();
      case 'RemoveSpaceRegex':
        return new RemoveSpaceRegex();
      default:
        throw new InternalServerErrorException(
          `NO class found for ${className}`,
        );
    }
  }
}

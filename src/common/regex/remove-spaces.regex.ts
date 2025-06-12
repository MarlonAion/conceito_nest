import { RegexProtocol } from './regex.protocol';

export class RemoveSpaceRegex extends RegexProtocol {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}

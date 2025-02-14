import string from './string';
import { createHash } from 'crypto';

export class VariableLibrary {
  static clearAllScriptTags<T>(data: T, expectKeys?: string[]): T {
    const anyData = data as any;
    const keys = Object.keys(anyData);
    for (const key in keys) {
      if (expectKeys && expectKeys.includes(key)) continue;

      let value = anyData[key];
      if (typeof value === 'object' || Array.isArray(value)) {
        value = this.clearAllScriptTags(value);
      } else if (typeof value === 'string') {
        value = value.removeScriptTags();
      }

      anyData[key] = value;
    }
    return anyData;
  }
  static isSet(...variable: any[]): boolean {
    let result;
    try {
      for (let i = 0; i < variable.length; i++) {
        result = variable[i]();
      }
    } catch (e) {
      result = undefined;
    } finally {
      return result !== undefined;
    }
  }
  static isEmpty(...variable: any[]): boolean {
    for (let i = 0; i < variable.length; i++) {
      if (
        typeof variable[i] == 'undefined' ||
        variable[i] === null ||
        variable[i].length === 0 ||
        (typeof variable[i] === string && !variable[i].toString().trim())
      )
        return true;
    }
    return false;
  }
  static isNull(...variable: any[]) {
    for (let i = 0; i < variable.length; i++) {
      if (variable[i] !== null) return false;
    }
    return true;
  }
  static isNotNull(...variable: any[]) {
    return !VariableLibrary.isNull(variable);
  }
  static setDefault(variable: any, default_value: any): any {
    return this.isSet(variable) ? variable() : default_value;
  }
  static hash(string: string, hashType: string): string {
    return createHash(hashType).update(string).digest('hex');
  }
}

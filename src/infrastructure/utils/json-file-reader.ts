import * as fs from 'node:fs';
import * as path from 'node:path';

export class JsonFileReader {
  static read<T>(relativePathFromRoot: string): T {
    const filePath = path.resolve(process.cwd(), relativePathFromRoot);

    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Ficheiro não encontrado em: ${filePath}`);
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(fileContent) as T;

      if (!parsedData) {
        throw new Error('❌ O ficheiro JSON está vazio ou inválido.');
      }

      return parsedData;
    } catch (error) {
      throw new Error(`❌ Erro ao ler/parsear o JSON em ${filePath}: ${(error as Error).message}`, {
        cause: error,
      });
    }
  }
}

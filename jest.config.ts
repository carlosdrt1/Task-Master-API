import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import { CompilerOptions } from 'typescript';

const typedCompilerOptions = compilerOptions as unknown as CompilerOptions & {
  paths: Record<string, string[]>;
};
const paths = typedCompilerOptions.paths;

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.interface.ts',
    '!src/**/*.types.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.module.ts',
    '!src/**/*.strategy.ts',
    '!src/**/*.config.ts',
    '!src/main.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(paths, {
    prefix: '<rootDir>',
  }),
};

export default config;

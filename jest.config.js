const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/** @type {import('jest').Config} */
module.exports = {
  moduleNameMapper,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.js'],
  reporters: process.env.CI && [
    [
      'github-actions',
      {
        silent: false,
      },
    ],
    'summary',
  ],
};

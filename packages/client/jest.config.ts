import "reflect-metadata"
//
/* eslint-disable */
export default {
  displayName: 'client',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx', 'html'],
  coverageDirectory: '../../coverage/packages/client',
};

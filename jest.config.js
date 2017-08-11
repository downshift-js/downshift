module.exports = {
  roots: ['./src'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/fixtures/'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
}

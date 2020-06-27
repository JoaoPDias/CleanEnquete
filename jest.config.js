// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: "coverage",
    roots:['<rootDir>/src'],
    testEnvironment: "node",
    transform: {'.+\\.ts$': 'ts-jest'}
};

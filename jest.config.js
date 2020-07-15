// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**'
    ],
    coverageDirectory: "coverage",
    modulePathIgnorePatterns: ["env"],
    roots: ['<rootDir>/src'],
    preset: '@shelf/jest-mongodb',
    testEnvironment: "node",
    transform: {'.+\\.ts$': 'ts-jest'}
};

export default {
    preset: "ts-jest",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        '^@/solidity/(.*)$': '<rootDir>/onlyswaps-solidity/out/$1'
    },
    transform: {
        "^.+\\.(ts|tsx)$": ["ts-jest", {
            useESM: true,
        }],
    },
    testTimeout: 50000,
};

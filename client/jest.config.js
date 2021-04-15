module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest"
    },
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
        "setupFilesAfterEnv": [
        "jest-enzyme"
    ],
        "testEnvironment": "enzyme",
        "testEnvironmentOptions": {
        "enzymeAdapter": "react16"
    },
    "snapshotSerializers": [
        "enzyme-to-json/serializer"
    ]
};
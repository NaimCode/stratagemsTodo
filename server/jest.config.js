// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["js", "ts", "json", "node"],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
};

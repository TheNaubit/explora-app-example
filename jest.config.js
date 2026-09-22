/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup-after-env.js"],
  moduleNameMapper: {
    "\\.po$": "<rootDir>/src/test/__mocks__/messages-po.ts",
    "^@/assets/(.*)$": "<rootDir>/assets/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react-native-mmkv$": "<rootDir>/src/state/__mocks__/react-native-mmkv.ts",
    "\\.(png|jpg|jpeg|gif|webp)$": "<rootDir>/src/test/__mocks__/file-mock.ts",
  },
  // Lingui ships ESM `.mjs` only. Transform those files for Jest.
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.mjs$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|standard-navigation|@lingui|@legendapp|@faker-js|@messageformat|react-error-boundary|react-native-a11y))",
    "/node_modules/react-native-reanimated/plugin/",
    "/node_modules/@react-native/babel-preset/",
  ],
  clearMocks: true,
};

/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = [
  ...require("eslint-config-next"),
  ...require("@typescript-eslint/eslint-plugin").configs["flat/recommended"],
  {
    ignores: ["node_modules", ".next", "out"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "dev-dist",
    "public/firebase-messaging-sw.js",
    "scripts/generate-icons.js",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "off", // Disable for TypeScript files
      "no-undef": "off", // Disable for TypeScript files
      "no-unused-expressions": "off",
      "no-constant-condition": "off",
      "no-cond-assign": "off",
      "no-func-assign": "off",
      "no-empty": "off",
    },
  },
]);

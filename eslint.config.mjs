// .eslint.config.js
import js from "@eslint/js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },


  js.configs.recommended,


  ...compat.extends("next/core-web-vitals", "next/typescript"),


  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
      parserOptions: {


        projectService: true,
        jsxPragma: "React",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "unused-imports": await import("eslint-plugin-unused-imports").then(m => m.default ?? m),
      "simple-import-sort": await import("eslint-plugin-simple-import-sort").then(m => m.default ?? m),
    },
    rules: {

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",


      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  {
    files: ["*.config.{js,cjs,mjs,ts}", "scripts/**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {

        describe: "readonly",
        it: "readonly",
        expect: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },
];

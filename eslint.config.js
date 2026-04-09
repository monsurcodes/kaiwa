// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const unusedImports = require("eslint-plugin-unused-imports");

module.exports = defineConfig([
   expoConfig,
   prettierConfig,
   {
      plugins: {
         "simple-import-sort": simpleImportSort,
         "unused-imports": unusedImports,
      },
      rules: {
         "simple-import-sort/imports": "warn",
         "simple-import-sort/exports": "warn",
         "unused-imports/no-unused-imports": "error",
         "unused-imports/no-unused-vars": [
            "warn",
            {
               argsIgnorePattern: "^",
               varsIgnorePattern: "^",
            },
         ],
      },
      ignores: ["dist/*"],
   },
]);

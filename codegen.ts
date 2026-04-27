import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
   schema: "https://graphql.anilist.co",
   documents: [
      "app/**/*.tsx",
      "components/**/*.tsx",
      "lib/graphql/queries/**/*.ts",
      "lib/graphql/mutations/**/*.ts",
   ],
   ignoreNoDocuments: true,
   generates: {
      "./lib/graphql/generated/": {
         preset: "client",
         config: {
            scalars: {
               Json: "Record<string, unknown>",
               CountryCode: "string",
               FuzzyDateInt: "number",
            },
         },
         presetConfig: {
            gqlTagName: "gql",
            fragmentMasking: false,
         },
      },
   },
};

export default config;

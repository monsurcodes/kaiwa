import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
   schema: "https://graphql.anilist.co",
   documents: ["src/**/*.tsx", "src/**/*.ts"],
   ignoreNoDocuments: true,
   generates: {
      "./src/shared/lib/graphql/generated/": {
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

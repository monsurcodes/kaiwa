import type { CodegenConfig } from "@graphql-codegen/cli";

import { ANILIST_API_URL } from "./constants";

const config: CodegenConfig = {
   schema: ANILIST_API_URL,
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

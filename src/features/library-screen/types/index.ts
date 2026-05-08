import type { GetUserLibraryQuery } from "@/shared/lib/graphql/generated/graphql";

export type UserLibraryLists = NonNullable<
   NonNullable<GetUserLibraryQuery["MediaListCollection"]>["lists"]
>;

type LibraryEntry = NonNullable<
   NonNullable<
      NonNullable<NonNullable<GetUserLibraryQuery["MediaListCollection"]>["lists"]>[number]
   >["entries"]
>[number];

export type LibraryListItem =
   | { type: "header"; name: string }
   | { type: "card"; entry: NonNullable<LibraryEntry> };

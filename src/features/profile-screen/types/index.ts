import type { GetAuthUserDataQuery } from "@/shared/lib/graphql/generated/graphql";

export type UserProfile = NonNullable<GetAuthUserDataQuery["Viewer"]>;

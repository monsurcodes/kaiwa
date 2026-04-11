import { cacheExchange, Client, fetchExchange } from "urql";

import { ANILIST_API_URL } from "@/constants";

const client = new Client({
   url: ANILIST_API_URL,
   exchanges: [cacheExchange, fetchExchange],
});

export default client;

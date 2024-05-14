import { environment } from "@api/environment";
import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: environment.graphApiUrl,
  cache: new InMemoryCache()
});

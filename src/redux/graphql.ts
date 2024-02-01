import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/63763/aut-mumbai/v0.0.6",
  cache: new InMemoryCache()
});

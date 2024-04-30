import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/63763/aut-amoy/version/latest",
  cache: new InMemoryCache()
});

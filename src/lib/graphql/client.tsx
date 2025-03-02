import { ApolloClient, InMemoryCache, ApolloProvider, split } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';

import { WebSocketLink } from "@apollo/client/link/ws";
import { createHttpLink } from "@apollo/client/link/http";

const baseUrl = 'nfs-demo.mygrantgenie.com';

const httpLink = createHttpLink({
  uri: `https://${baseUrl}/graphql`
});

const wsLink = new WebSocketLink({
  uri : `wss://${baseUrl}/graphql`,
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink, // Replace with your actual GraphQL endpoint
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export const GraphQLProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

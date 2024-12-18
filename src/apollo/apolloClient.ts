import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client/core'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { provideApolloClient } from '@vue/apollo-composable'
import useEnv from '@/core/composables/useEnv'

const env = useEnv()

console.log('env', env)

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
})


const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: { reconnect: true },
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

// Proporcionar Apollo globalmente
provideApolloClient(apolloClient)

export default apolloClient

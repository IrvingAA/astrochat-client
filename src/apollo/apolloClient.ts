import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client/core'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { provideApolloClient } from '@vue/apollo-composable'
import useEnv from '@/core/composables/useEnv'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const isDockerRunning = process.env.RUNNING_IN_DOCKER === 'true'
const mongoUri = isDockerRunning
  ? process.env.MONGO_URI_DOCKER
  : process.env.MONGO_URI_LOCAL
const graphqlUrl = process.env.GRAPHQL_WS_URL



const httpLink = new HttpLink({
  uri: mongoUri
})


const wsLink = new WebSocketLink({
  uri: graphqlUrl || 'ws://localhost:3000/graphql',
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

provideApolloClient(apolloClient)

export default apolloClient

import { boot } from 'quasar/wrappers'
import apolloClient from '@/apollo/apolloClient'

export default boot(({ app }) => {
  app.provide('$apollo', apolloClient)
})

import { createServer } from '@graphql-yoga/node'
import { NextApiRequest, NextApiResponse } from 'next'

import { ApolloServer } from "apollo-server-micro";

import {

  ApolloServerPluginLandingPageGraphQLPlayground

} from "apollo-server-core";




const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
  }
  type User {
    name: String,
    test: String
  }
`

const resolvers = {
  Query: {
    users() {
      return [{ name: 'Nextjs', test: 'test' }]
    },
  },
}
const apolloServer = new ApolloServer({ 
  typeDefs,
   resolvers,
   csrfPrevention: true,
   cache: "bounded",
   plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ]
   })
// const server = createServer({
//     schema: {
//         typeDefs,
//         resolvers,
//     },
//     endpoint: '/api/v1/graphql',
//     graphiql: true // uncomment to disable GraphiQL
// })


// const handler = graphqlHTTP({
//     schema,
//     graphiql: true,
//     rootValue: resolvers
// })

// export default handler


const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await startServer;
  await apolloServer.createHandler({
    path: "/api/v1/graphql",
  })(req, res);
}
const express = require('express')
const expressGraphQL = require('express-graphql')

const schema = require('./schema.js')

const app = express()

const port = 4000

app.use('/api', expressGraphQL({
  schema,
  graphiql: true
}))

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
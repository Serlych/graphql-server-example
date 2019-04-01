const axios = require('axios')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

/*
const customers = [
  {id: '1', name: 'John Doe', age: 30, email: 'john@doe.com'},
  {id: '2', name: 'Jane Smith', age: 34, email: 'jane@smith.com'},
  {id: '3', name: 'George Roberts', age: 26, email: 'george@roberts.com'},
  {id: '4', name: 'Louis Appleseed', age: 43, email: 'louis@appleseed.com'},
  {id: '5', name: 'Peter Johnson', age: 20, email: 'peter@johnson.com'}
]
*/

const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    email: { type: GraphQLString }
  }
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: {type: GraphQLString}
      },
      resolve (parentValue, args) {
        /*
        for (let i = 0; i < customers.length; i++) {
          if (customers[i].id === args.id) {
            return customers[i]
          }
        }
        */
        return axios.get(`http://localhost:3000/customers/${args.id}`)
               .then(res => res.data)
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve (parentValue, args) {
        /*
        return customers
        */
        return axios.get(`http://localhost:3000/customers/`)
               .then(res => res.data)
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        email: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parentValue, args) {
        return axios.post(`http://localhost:3000/customers/`, {
          name: args.name,
          age: args.age,
          email: args.email
        }).then(res => res.data)
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        email: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return axios.patch(`http://localhost:3000/customers/${args.id}`, args)
               .then(res => res.data)
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (parentValue, args) {
        return axios.delete(`http://localhost:3000/customers/${args.id}`)
               .then(res => res.data)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})
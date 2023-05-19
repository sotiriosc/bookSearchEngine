const { gql } = require('apollo-server-express');

// create type definitions
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user(username: String, id: ID): User
  }

  type Mutation {
    login(username: String, email: String, password: String): Auth
    addUser(username: String, email: String, password: String): Auth
    saveBook(userId: ID, bookId: ID): User
    removeBook(userId: ID, bookId: ID): User
  }
`;

module.exports = typeDefs;
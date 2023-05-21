const { gql } = require('apollo-server-express');

// create type definitions
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [SavedBook]
  }

  type Book {
    bookId: ID!
    title: String!
    authors: [String]!
    description: String!
    image: String
  }

  type SavedBook {
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
    me: User
    user(username: String, id: ID): User
    searchBooks(query: String!): [Book]
    searchSavedBooks(query: String!): [SavedBook]
  }

  type Mutation {
    login(username: String, email: String, password: String): Auth
    addUser(username: String, email: String, password: String): Auth
    saveBook(userId: ID, bookId: ID): User
    removeBook(userId: ID, bookId: ID): User
  }
`;

module.exports = typeDefs;

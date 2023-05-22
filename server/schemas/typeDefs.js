const { gql } = require('apollo-server-express');

// create type definitions
// typeDefs is a template literal tag, so it will be parsed into an abstract syntax tree
const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]
}

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
  }  

  type SavedBook {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: ID
    image: String
    title: String
  }

  type Auth {
    token: String!
    user: User
  }

  type Query {
    me: User
    user(username: String, id: ID): User
    searchBooks(query: String!): [Book]
    searchSavedBooks(query: String!): [SavedBook]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(userId: ID, bookId: ID): User
  }
`;

module.exports = typeDefs;

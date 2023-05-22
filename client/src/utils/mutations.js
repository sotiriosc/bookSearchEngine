import { gql } from '@apollo/client';

// Here we define the mutations we will be sending to the GraphQL server
// The login mutation accepts an email and password as parameters
// The mutation returns an Auth type, which includes a token and a user object
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// THE SAVE_BOOK mutation is responsible for allowing logged in users to save a book to their account
export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
      }
    }
  }
`;

// DELETE_BOOK mutation is responsible for allowing logged in users to remove a book from their account
export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image

      }
    }
  }
`;
// REMOVE_BOOK mutation is responsible for allowing logged in users to remove a book from their account
export const REMOVE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
      }
    }
  }
`;
// ADD_USER mutation is responsible for allowing users to create an account
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;



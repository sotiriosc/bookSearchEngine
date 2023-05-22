import { gql } from '@apollo/client';
// Here we define the queries we will be sending to the GraphQL server
export const GET_ME = gql`
  query me {
    me {
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

export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!) {
    searchBooks(query: $query) {
      bookId
      authors
      description
      title
      image
    }
  }
`;

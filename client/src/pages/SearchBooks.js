import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { SAVE_BOOK } from '../utils/mutations';
import { SEARCH_BOOKS } from '../utils/queries';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  const [saveBook] = useMutation(SAVE_BOOK);
  const [searchBooks, { data: searchBooksData }] = useLazyQuery(SEARCH_BOOKS);

  useEffect(() => {
    if (searchBooksData) {
      setSearchedBooks(searchBooksData.searchBooks);
    }
  }, [searchBooksData]);

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { book: bookToSave },
        update: (cache) => {
          cache.writeQuery({
            query: SEARCH_BOOKS,
            data: { searchBooks: searchedBooks },
          });
        },
      });

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Call the searchBooks query with the searchInput variable
    searchBooks({ variables: { query: searchInput } });
  };

  return (
    <>
      <div className='text-light bg-dark pt-5'>
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg' disabled={!searchInput}>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col xs={12} md={4} key={book.bookId}>
                <Card className='my-3 p-3 rounded'>
                  {book.image ? (
                    <Card.Img src={book.image} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title as='div'>
                      <strong>{book.title}</strong>
                    </Card.Title>
                    <Card.Text as='div'>
                      <strong>Authors:</strong> {book.authors.join(', ')}
                    </Card.Text>
                    <Card.Text as='div'>
                      <strong>Description:</strong> {book.description}
                    </Card.Text>
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          }
          )};
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;

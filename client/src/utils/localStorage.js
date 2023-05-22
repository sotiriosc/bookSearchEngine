
// This file is used to create the functions that will be used to interact with the browser's localStorage object.
// The localStorage object stores data for the user's session.
// The data is stored as key-value pairs, and the data is persisted even when the browser window is closed.

// The getSavedBookIds() function retrieves the bookIds from localStorage.
export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};
// saveBookIds() function saves the bookIds to localStorage.
export const saveBookIds = (bookIdArr) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};
// removeBookId() function removes a bookId from localStorage.
export const removeBookId = (bookId) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  if (!savedBookIds) {
    return false;
  }
// updatedSavedBookIds is a new array that will have all of the bookIds that don't match the bookId that was passed in.
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};

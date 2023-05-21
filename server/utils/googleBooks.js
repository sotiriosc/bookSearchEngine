const fetch = require('node-fetch');

const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const data = await response.json();
    return data.items;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch book data from the external API.');
  }
};

module.exports = { searchGoogleBooks };

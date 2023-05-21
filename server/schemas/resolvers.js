const { AuthenticationError } = require('apollo-server');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { searchGoogleBooks } = require('../utils/googleBooks'); // Import the searchGoogleBooks function
const { typeDefs } = require('./typeDefs');

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      if (!context.user) throw new AuthenticationError('You need to be logged in!');
      return await User.findOne({ $or: [{ _id: args.id }, { username: args.username }] });
    },
    searchBooks: async (_, { query }) => {
      console.log(query);
      try {
        const endpoint = 'https://www.googleapis.com/books/v1/volumes'; // Specify the API endpoint URL
        const url = `${endpoint}?q=${query}`; // Construct the complete URL with the query parameter
    
        const response = await searchGoogleBooks(url);
        const data = await response.json();
        console.log(data);
        console.log(response.status);
        console.log(response.headers);
        console.log(response.text());

        const books = data.items.map((item) => {
          // Extract relevant book information from the response
          const book = {
            bookId: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || [],
            description: item.volumeInfo.description || '',
            image: item.volumeInfo.imageLinks?.thumbnail || '',
          };
          return book;
        });
        return books;
      } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch book data from the external API.');
      }
    },
  },
  Mutation: {
    login: async (parent, args, context, info) => {
      const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
      if (!user) {
        throw new Error("Can't find this user");
      }
      const correctPw = await user.isCorrectPassword(args.password);
      if (!correctPw) {
        throw new Error('Wrong password!');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args, context, info) => {
      const user = await User.create(args);
      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context, info) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: args.userId },
        { $addToSet: { savedBooks: args.bookId } },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        throw new Error("Couldn't update the user");
      }
      return updatedUser;
    },
    removeBook: async (parent, args, context, info) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: args.userId },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;

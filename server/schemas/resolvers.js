const { AuthenticationError } = require('apollo-server');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { searchGoogleBooks } = require('../utils/googleBooks'); // Import the searchGoogleBooks function
const { typeDefs } = require('./typeDefs');
const fetch = require('node-fetch'); // Import the fetch library

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      if (!context.user) throw new AuthenticationError('You need to be logged in!');
      return await User.findOne({ $or: [{ _id: args.id }, { username: args.username }] });
    },
   
    searchBooks: async (_, { query }) => {
      try {
        const endpoint = 'https://www.googleapis.com/books/v1/volumes';
        const url = `${endpoint}?q=${query}`;
    
        const response = await fetch(url);
        const data = await response.json();
    
        const books = data.items.map((item) => {
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
        console.error('Error:', err);
        throw new Error('Failed to fetch book data from the external API.');
      }
    },

    me: async (parent, args, context, info) => {
      if (!context.user) throw new AuthenticationError('You need to be logged in!');
      
      // This line fetches the user who is currently logged in
      const currentUser = await User.findOne({ _id: context.user._id });
      
      return currentUser;
    },
  },

  

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
          throw new Error("Couldn't update the user");
        }
        
        return updatedUser;
      }
    
      throw new Error('You need to be logged in!');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
    
        if (updatedUser) {
          return updatedUser;
        } else {
          throw new Error("Couldn't find user with this id!");
        }
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    
  },
};

module.exports = resolvers;

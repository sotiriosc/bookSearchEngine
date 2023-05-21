const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const { User, Profile } = require('../models');
const { signToken } = require('../utils/auth');

    const resolvers = {
        Query: {
          user: async (parent, args, context, info) => {
            if (!context.user) throw new AuthenticationError('You need to be logged in!');
            return await User.findOne({ $or: [{ _id: args.id }, { username: args.username }] });
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
  
  // create Apollo server
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // start server
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
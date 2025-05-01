import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import User from '@/models/User';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    }
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

// Add MongoDB connection logging
console.log('MongoDB URI:', MONGODB_URI);

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          // Connect to MongoDB if not connected
          if (mongoose.connection.readyState !== 1) {
            console.log('Attempting to connect to MongoDB...');
            await mongoose.connect(MONGODB_URI);
            console.log('MongoDB connected successfully');
          }

          const user = await User.findOne({ email: credentials.email });
          console.log('User found:', user ? 'yes' : 'no');

          if (!user) {
            throw new Error('Email does not exist');
          }

          const isPasswordValid = await user.comparePassword(credentials.password);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error details:', error);
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
}; 
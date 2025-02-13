import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import { compare } from 'bcrypt';

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "abhishek@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        } 
        const existinguser = await db.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if(!existinguser){
          throw new Error('No user found with this email');
        }
        const passwordMatch = await compare(credentials.password, existinguser.password);
      if (!passwordMatch) {
        throw new Error('Password is incorrect');
      }
      return{
        id: `${existinguser.id}`,
        username: existinguser.username,
        email: existinguser.email
      }
    }
    }),
  ],
  callbacks: {
    async jwt ({token, user}) {
      if (user) {
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    async session({session, token}){
      if (session.user) {
        session.user.id = token.id as string; // Ensure user ID is included
      }
      return{
        ...session,
        user:{
          ...session.user,
          username : token.username,
        }
      }
      return session
    },
  }
  }
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
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
      async authorize(credentials, req) {

        if (!credentials?.email || !credentials?.password) {
          return null
        } 
        const existinguser = await db.user.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if(!existinguser){
          return null
        }
        const passwordMatch = await compare(credentials.password, existinguser.password);
      if (!passwordMatch) {
        return null;
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
      }
      return token;
    },
    async session({session, token}){
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
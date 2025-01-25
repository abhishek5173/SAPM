import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH_CONFIG = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            username: { label: 'email', type: 'text', placeholder: '' },
            password: { label: 'password', type: 'password', placeholder: '' },
          },
          async authorize(credentials: any) {
  
              return {
                  id: "1",
                  name: "Abhishek",
                  userId: "1",
                  email: "ramdomEmail"
              };
          },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as const,  // Correct type usage

      },
      callbacks: {
        async session({ session, token, user } : {
            session:any, token:any ,user:any
        }) {
          // Check if the session has a user object
          if (session.user) {
            // Use the token's sub (which is the user ID) if available
            session.user.id = token.sub || user.id;
          }
          return session;
        },
        async jwt({ token, user } : {
            token:any , user:any
        }) {
          // Persist the user ID to the token
          if (user) {
            token.sub = user.id;
          }
          return token;
        },
      },
    pages: {
        signIn: '/signin',
    }
  }